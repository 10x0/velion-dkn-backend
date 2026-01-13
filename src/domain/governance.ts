export type AuditDecision = 'Pending' | 'Approved' | 'Rejected';

export interface GovernanceAuditItem {
  id: string;
  assetId: string;
  createdAt: Date;
  decision: AuditDecision;
  decisionByUserId?: string;
  decisionDate?: Date;
  notes?: string;
}
