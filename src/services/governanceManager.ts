import { audits, assets } from '../data/db';
import { GovernanceAuditItem } from '../domain/governance';
import { IGovernanceManager } from './IGovernanceManager';

export class GovernanceManager implements IGovernanceManager {
  queueForReview(assetId: string, reason?: string): GovernanceAuditItem {
    const item: GovernanceAuditItem = {
      id: `audit_${Date.now()}`,
      assetId,
      createdAt: new Date(),
      decision: 'Pending',
    };
    audits.push(item);
    return item;
  }

  listPending(): GovernanceAuditItem[] {
    return audits.filter((a) => a.decision === 'Pending');
  }

  decide(
    id: string,
    decision: 'Approved' | 'Rejected',
    decisionByUserId: string,
    notes?: string
  ): GovernanceAuditItem | undefined {
    const item = audits.find((a) => a.id === id);
    if (!item) return undefined;
    item.decision = decision;
    item.decisionByUserId = decisionByUserId;
    item.decisionDate = new Date();
    item.notes = notes;

    const asset = assets.find((a) => a.id === item.assetId);
    if (asset) {
      asset.status = decision === 'Approved' ? 'Published' : 'Archived';
    }
    return item;
  }
}
