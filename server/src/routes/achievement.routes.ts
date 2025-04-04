import { Router } from 'express';
import { storage } from '../services/storage.service';
import { achievementService } from '../services/achievement.service';

const router = Router();

// Get all achievements for the current user
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const achievements = await storage.getAchievementsByUserId(req.user!.id);
  res.json(achievements);
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid achievement ID' });
  }
  
  const achievement = await storage.getAchievement(id);
  if (!achievement) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  
  // Only allow users to view their own achievements or admins to view any
  if (achievement.userId !== req.user!.id && !req.user!.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  res.json(achievement);
});

// Check for new achievements
router.post('/check', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const achievements = await achievementService.checkAndUpdateAchievements(req.user!.id);
  res.json(achievements);
});

export default router;
