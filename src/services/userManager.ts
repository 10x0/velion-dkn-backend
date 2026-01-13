import { profiles } from '../data/db';

export class UserManager {
  getProfile(userId: string) {
    return profiles.find((p) => p.userId === userId);
  }

  addPoints(userId: string, points: number) {
    const profile = this.getProfile(userId);
    if (profile) {
      profile.points += points;
    }
  }

  getLeaderboard() {
    return [...profiles].sort((a, b) => b.points - a.points);
  }
}
