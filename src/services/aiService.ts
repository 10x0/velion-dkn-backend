// src/services/aiService.ts
import { IAsset } from '../domain/asset';
import { UserProfile } from '../domain/user';
import { IAIService, RankedAsset } from './IAiService';

export class SimpleAIService implements IAIService {
  rankSearchResults(
    assets: IAsset[],
    userProfile: UserProfile,
    query: string,
    projectContext?: { sector?: string; projectId?: string }
  ): RankedAsset[] {
    const qTokens = this.tokenize(query);

    return assets
      .map((asset) => {
        const { score, reasons } = this.score(
          asset,
          userProfile,
          qTokens,
          projectContext
        );
        return { asset, score, reasons };
      })
      .sort((a, b) => b.score - a.score);
  }

  // used by uploadAsset for redundancy (UC8)
  calculateSimilarity(a: IAsset, b: IAsset): number {
    const aTokens = this.tokenize(
      a.title + ' ' + a.contentSummary + ' ' + a.metadata.sector
    );
    const bTokens = this.tokenize(
      b.title + ' ' + b.contentSummary + ' ' + b.metadata.sector
    );

    const union = new Set([...aTokens, ...bTokens]);
    const common = aTokens.filter((t) => bTokens.includes(t));
    if (union.size === 0) return 0;
    return (common.length / union.size) * 100;
  }

  // ---------- internal helpers ----------

  private tokenize(s: string): string[] {
    return s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }

  private score(
    asset: IAsset,
    user: UserProfile,
    qTokens: string[],
    projectContext?: { sector?: string; projectId?: string }
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1) keyword match (title + tags)
    qTokens.forEach((t) => {
      const inTitle = asset.title.toLowerCase().includes(t);
      const inTags = asset.tags.map((x) => x.toLowerCase()).includes(t);

      if (inTitle) {
        score += 8;
        reasons.push(`Matches keyword "${t}" in title`);
      }
      if (inTags) {
        score += 5;
        reasons.push(`Matches keyword "${t}" in tags`);
      }
    });

    // 2) region preference (personalisation)
    if (asset.region === user.region) {
      score += 6;
      reasons.push(`Matches your region (${user.region})`);
    }

    // 3) expertise vs sector/tags
    user.expertise.forEach((exp) => {
      const e = exp.toLowerCase();
      if (asset.metadata.sector.toLowerCase().includes(e)) {
        score += 7;
        reasons.push(`Matches your expertise in ${exp}`);
      }
      if (asset.tags.some((t) => t.toLowerCase().includes(e))) {
        score += 4;
        reasons.push(`Tagged with your expertise area (${exp})`);
      }
    });

    // 4) project context from caller (optional)
    if (
      projectContext?.sector &&
      asset.metadata.sector === projectContext.sector
    ) {
      score += 5;
      reasons.push(
        `Relevant to current project sector (${projectContext.sector})`
      );
    }
    if (
      projectContext?.projectId &&
      asset.metadata.projectId === projectContext.projectId
    ) {
      score += 10;
      reasons.push('Directly related to your current project');
    }

    return { score, reasons };
  }
}
