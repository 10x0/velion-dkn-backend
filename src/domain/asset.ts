import { ProjectMetadata } from './projectMetadata';

export type AssetType = 'Document' | 'Template';
export type AssetStatus = 'Draft' | 'Published' | 'PendingReview' | 'Archived';
export type AssetCategory = 'Standard' | 'ClientSensitive';

export interface IAsset {
  id: string;
  title: string;
  type: AssetType;
  tags: string[];
  region: string;
  category: AssetCategory;
  metadata: ProjectMetadata;
  contentSummary: string;
  createdAt: Date;
  createdByUserId: string;
  status: AssetStatus;
}
