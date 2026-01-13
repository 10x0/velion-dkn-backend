import { Router } from 'express';
import { KnowledgeManager } from '../services/knowledgeManager';

const router = Router();
const km = new KnowledgeManager();

router.post('/upload', (req, res) => {
  try {
    const result = km.uploadAsset(req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
