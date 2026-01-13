import { GovernanceAuditItem } from '../domain/governance';

export interface IGovernanceManager {
  queueForReview(assetId: string, reason?: string): GovernanceAuditItem;
  listPending(): GovernanceAuditItem[];
  decide(
    id: string,
    decision: 'Approved' | 'Rejected',
    decisionByUserId: string,
    notes?: string
  ): GovernanceAuditItem | undefined;
}
