export type UserRole =
  | 'Consultant'
  | 'Senior Consultant'
  | 'Knowledge Champion'
  | 'Governance Council'
  | 'HR';

export interface IUser {
  id: string;
  email: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  role: UserRole;
  region: 'EU' | 'APAC' | 'NA' | 'LATAM';
  expertise: string[];
  points: number;
}
