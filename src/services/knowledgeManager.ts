import { assets, uploadEvents } from '../data/db';
import { IAsset } from '../domain/asset';
import { SimpleAIService } from './aiService';
import { UserManager } from './userManager';
import { GovernanceManager } from './governanceManager';
import { UserProfile } from '../domain/user';
import {
  IKnowledgeManager,
  UploadPayload,
  UploadResult,
} from './IKnowledgeManager';
import { RankedAsset } from './IAiService';

export class KnowledgeManager implements IKnowledgeManager {
  private ai = new SimpleAIService();
  private userManager = new UserManager();
  private governanceManager = new GovernanceManager();

  // ---------- helper methods for gamification cap ----------

  private recordUpload(userId: string) {
    uploadEvents.push({ userId, timestamp: new Date() });
  }

  private uploadsInLast24h(userId: string): number {
    const now = new Date().getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    return uploadEvents.filter(
      (e) => e.userId === userId && now - e.timestamp.getTime() <= dayMs
    ).length;
  }

  // ---------- search (UC1 + UC7) with governance expiry ----------

  public searchAssets(
    query: string,
    userProfile: UserProfile,
    projectContext?: { sector?: string; projectId?: string }
  ): (IAsset & { reasons?: string[] })[] {
    const now = new Date();
    const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;

    // Governance Expiry rule: auto-flag assets older than 2 years
    assets.forEach((a) => {
      if (
        now.getTime() - a.createdAt.getTime() > twoYearsMs &&
        a.status === 'Published'
      ) {
        a.status = 'PendingReview';
        this.governanceManager.queueForReview(a.id);
      }
    });

    const lowered = query.toLowerCase();

    // basic text filtering before AI ranking
    const filtered = assets.filter((a) => {
      if (a.status !== 'Published') return false;

      const titleMatch = a.title.toLowerCase().includes(lowered);
      const summaryMatch = a.contentSummary.toLowerCase().includes(lowered);
      const sectorMatch = a.metadata.sector.toLowerCase().includes(lowered);
      const tagMatch = a.tags.some((t) => t.toLowerCase().includes(lowered));

      return titleMatch || summaryMatch || sectorMatch || tagMatch;
    });

    // Personalisation (UC7): AI re-ranks and adds reasons
    const ranked: RankedAsset[] = this.ai.rankSearchResults(
      filtered,
      userProfile,
      query,
      projectContext
    );

    // merge reasons back into asset objects
    return ranked.map((r) => ({
      ...r.asset,
      reasons: r.reasons,
    }));
  }

  // ---------- upload (UC2 + UC8 + UC4 + business rules) ----------

  public uploadAsset(payload: UploadPayload): UploadResult {
    const userProfile = this.userManager.getProfile(payload.createdByUserId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Access Control: only Senior Consultant can upload ClientSensitive
    if (
      payload.category === 'ClientSensitive' &&
      userProfile.role !== 'Senior Consultant'
    ) {
      throw new Error(
        'Insufficient permissions to upload Client Sensitive assets'
      );
    }

    const newAsset: IAsset = {
      id: `asset_${Date.now()}`,
      title: payload.title,
      type: payload.type,
      tags: payload.tags,
      region: payload.region,
      category: payload.category,
      metadata: payload.metadata,
      contentSummary: payload.contentSummary,
      createdAt: new Date(),
      createdByUserId: payload.createdByUserId,
      status: 'Draft',
    };

    // Redundancy Threshold (UC8): > 85% similarity triggers block/flag
    let maxSimilarity = 0;
    for (const existing of assets) {
      const sim = this.ai.calculateSimilarity(newAsset, existing);
      if (sim > maxSimilarity) maxSimilarity = sim;
    }

    let blocked = false;

    if (maxSimilarity > 85) {
      blocked = true;
      newAsset.status = 'PendingReview';
      assets.push(newAsset);
      // UC8 + UC4: queue for Governance review
      this.governanceManager.queueForReview(newAsset.id);
    } else {
      newAsset.status = 'Published';
      assets.push(newAsset);
    }

    // Data Sovereignty: if region === "EU", in a real deployment this
    // would be routed to EU-hosted storage; here it is documented behaviour.

    // Gamification Cap: max 5 rewarded uploads per 24h
    const countBefore = this.uploadsInLast24h(payload.createdByUserId);
    this.recordUpload(payload.createdByUserId);

    let pointsAwarded = 0;
    if (!blocked && countBefore < 5) {
      pointsAwarded = 10;
      this.userManager.addPoints(payload.createdByUserId, pointsAwarded);
    }

    return {
      asset: newAsset,
      similarity: maxSimilarity,
      blocked,
      pointsAwarded,
      uploadsInLast24h: countBefore + 1,
    };
  }
}
