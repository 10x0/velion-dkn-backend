import { IAsset } from '../domain/asset';
import { UserProfile } from '../domain/user';
import { ProjectMetadata } from '../domain/projectMetadata';

export interface UploadPayload {
  title: string;
  type: 'Document' | 'Template';
  tags: string[];
  region: string;
  category: 'Standard' | 'ClientSensitive';
  metadata: ProjectMetadata;
  contentSummary: string;
  createdByUserId: string;
}

export interface UploadResult {
  asset: IAsset;
  similarity?: number;
  blocked: boolean;
  pointsAwarded: number;
  uploadsInLast24h: number;
}

export interface IKnowledgeManager {
  searchAssets(
    query: string,
    userProfile: UserProfile,
    projectContext?: { sector?: string; projectId?: string }
  ): (IAsset & { reasons?: string[] })[];

  uploadAsset(payload: UploadPayload): UploadResult;
}
