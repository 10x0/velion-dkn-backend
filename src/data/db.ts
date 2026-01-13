import { IUser, UserProfile } from '../domain/user';
import { IAsset } from '../domain/asset';
import { GovernanceAuditItem } from '../domain/governance';

export interface UploadEvent {
  userId: string;
  timestamp: Date;
}

// --- Users and profiles (IUser + UserProfile) ---

export const users: IUser[] = [
  { id: 'u1', email: 'alice.consultant@velion.com' },
  { id: 'u2', email: 'bob.governance@velion.com' },
  { id: 'u3', email: 'carol.hr@velion.com' },
];

export const profiles: UserProfile[] = [
  {
    userId: 'u1',
    name: 'Alice Consultant',
    role: 'Senior Consultant', // can upload ClientSensitive
    region: 'EU',
    expertise: ['Smart Manufacturing', 'Logistics'],
    points: 0,
  },
  {
    userId: 'u2',
    name: 'Bob Governance',
    role: 'Governance Council',
    region: 'EU',
    expertise: ['GDPR', 'Compliance'],
    points: 0,
  },
  {
    userId: 'u3',
    name: 'Carol HR',
    role: 'HR',
    region: 'EU',
    expertise: ['Talent Management'],
    points: 0,
  },
];

// --- Seed assets (IAsset) for search and governance expiry ---

const now = new Date();

// src/data/db.ts (assets)
export const assets: IAsset[] = [
  {
    id: 'asset_seed_1',
    title: 'Smart Manufacturing Playbook',
    type: 'Document',
    tags: ['Smart Manufacturing', 'Template', 'Best Practice'],
    region: 'EU',
    category: 'Standard',
    metadata: {
      projectId: 'P-SM-001',
      clientName: 'Nordic Logistics',
      sector: 'Smart Manufacturing',
      region: 'EU',
    },
    contentSummary:
      'Step-by-step guidance for designing smart manufacturing solutions for European logistics clients.',
    createdAt: daysAgo(30),
    createdByUserId: 'u1',
    status: 'Published',
  },
  {
    id: 'asset_seed_2',
    title: 'Renewable Energy Logistics Case Study - APAC',
    type: 'Document',
    tags: ['Renewable Energy', 'Logistics', 'Case Study'],
    region: 'APAC',
    category: 'Standard',
    metadata: {
      projectId: 'P-RE-201',
      clientName: 'SunWave Energy',
      sector: 'Renewable Energy',
      region: 'APAC',
    },
    contentSummary:
      'Cross-border logistics case study for offshore wind projects in Southeast Asia.',
    createdAt: daysAgo(120),
    createdByUserId: 'u1',
    status: 'Published',
  },
  {
    id: 'asset_seed_3',
    title: 'Legacy ERP Integration Blueprint',
    type: 'Document',
    tags: ['Integration', 'Legacy Systems', 'Template'],
    region: 'NA',
    category: 'Standard',
    metadata: {
      projectId: 'P-INT-045',
      clientName: 'TransNorth Freight',
      sector: 'Logistics',
      region: 'NA',
    },
    contentSummary:
      'Technical blueprint for integrating legacy ERP platforms with modern cloud services.',
    createdAt: daysAgo(400),
    createdByUserId: 'u1',
    status: 'Published',
  },
  {
    id: 'asset_seed_4',
    title: 'GDPR Compliance Checklist for DKN',
    type: 'Template',
    tags: ['GDPR', 'Compliance', 'Governance'],
    region: 'EU',
    category: 'Standard',
    metadata: {
      projectId: 'P-GOV-010',
      clientName: 'Internal',
      sector: 'Governance',
      region: 'EU',
    },
    contentSummary:
      'Checklist for auditing knowledge assets in the DKN against GDPR requirements.',
    createdAt: daysAgo(800), // > 2 years, will trigger Governance Expiry
    createdByUserId: 'u2',
    status: 'Published',
  },
  {
    id: 'asset_seed_5',
    title: 'Client Sensitive: M&A Integration Strategy',
    type: 'Document',
    tags: ['Client Sensitive', 'Strategy'],
    region: 'EU',
    category: 'ClientSensitive',
    metadata: {
      projectId: 'P-MA-777',
      clientName: 'Confidential Logistics Group',
      sector: 'Logistics',
      region: 'EU',
    },
    contentSummary:
      'Highly confidential integration playbook for a major logistics M&A programme.',
    createdAt: daysAgo(10),
    createdByUserId: 'u1',
    status: 'Published',
  },
];

function daysAgo(n: number): Date {
  const now = new Date();
  return new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
}

// --- Governance queue and upload events ---

export const audits: GovernanceAuditItem[] = [];

export const uploadEvents: UploadEvent[] = [];
