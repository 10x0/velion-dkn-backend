import { Router } from 'express';
import { users, profiles } from '../data/db';

const router = Router();

router.get('/', (_req, res) => {
  const merged = users.map((u) => {
    const profile = profiles.find((p) => p.userId === u.id);
    return { ...u, profile };
  });
  res.json(merged);
});

export default router;
