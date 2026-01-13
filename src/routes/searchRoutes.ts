import { Router } from 'express';
import { KnowledgeManager } from '../services/knowledgeManager';
import { UserManager } from '../services/userManager';

const router = Router();
const km = new KnowledgeManager();
const um = new UserManager();

router.get('/', (req, res) => {
  const q = (req.query.q as string) || '';
  const userId = req.query.userId as string;
  const profile = um.getProfile(userId);

  if (!profile) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const results = km.searchAssets(q, profile);
  res.json(results);
});

export default router;
