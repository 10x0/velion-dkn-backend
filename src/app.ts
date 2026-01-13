import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes';
import assetRoutes from './routes/assetRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import governanceRoutes from './routes/governanceRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/search', searchRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/users', userRoutes);

export default app;
