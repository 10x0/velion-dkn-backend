// src/routes/governanceRoutes.ts
import { Router } from 'express';
import { GovernanceManager } from '../services/governanceManager';
import { audits, assets } from '../data/db';

const router = Router();
const gm = new GovernanceManager();

router.get('/pending', (_req, res) => {
  const pending = audits
    .filter((a) => a.decision === 'Pending')
    .map((a) => {
      const asset = assets.find((x) => x.id === a.assetId);
      return {
        id: a.id,
        assetId: a.assetId,
        createdAt: a.createdAt,
        decision: a.decision,
        // extra fields for UI
        assetTitle: asset?.title ?? 'Untitled asset',
        sector: asset?.metadata.sector ?? '',
        region: asset?.region ?? '',
        reason: 'Flagged by redundancy or governance rules', // you can refine later
      };
    });

  res.json(pending);
});

router.post('/:id/decide', (req, res) => {
  const { id } = req.params;
  const { decision, decisionByUserId, notes } = req.body;
  if (decision !== 'Approved' && decision !== 'Rejected') {
    return res.status(400).json({ error: 'Invalid decision' });
  }
  const item = gm.decide(id, decision, decisionByUserId, notes);
  if (!item) return res.status(404).json({ error: 'Audit item not found' });
  res.json(item);
});

export default router;
