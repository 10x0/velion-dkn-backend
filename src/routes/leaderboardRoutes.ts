import { Router } from 'express';
import { UserManager } from '../services/userManager';

const router = Router();
const um = new UserManager();

router.get('/', (_req, res) => {
  res.json(um.getLeaderboard());
});

export default router;
