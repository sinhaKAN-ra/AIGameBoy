import { Router } from 'express';
import userRoutes from './user.routes';
import modelRoutes from './model.routes';
import gameRoutes from './game.routes';
import scoreRoutes from './score.routes';
import achievementRoutes from './achievement.routes';

const router = Router();

// Mount all routes
router.use('/api/users', userRoutes);
router.use('/api/models', modelRoutes);
router.use('/api/games', gameRoutes);
router.use('/api/scores', scoreRoutes);
router.use('/api/achievements', achievementRoutes);

export default router;
