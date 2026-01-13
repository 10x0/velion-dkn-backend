import { IAsset } from '../domain/asset';
import { UserProfile } from '../domain/user';

export interface RankedAsset {
  asset: IAsset;
  score: number;
  reasons: string[];
}

export interface IAIService {
  rankSearchResults(
    assets: IAsset[],
    userProfile: UserProfile,
    query: string,
    projectContext?: { sector?: string; projectId?: string }
  ): RankedAsset[];

  calculateSimilarity(a: IAsset, b: IAsset): number;
}
