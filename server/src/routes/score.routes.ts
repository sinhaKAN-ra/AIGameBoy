import { Router } from 'express';
import { storage } from '../services/storage.service';
import { insertScoreSchema } from '@shared/schema';
import { z } from 'zod';
import { achievementService } from '../services/achievement.service';

const router = Router();

// Get all scores
router.get('/', async (_req, res) => {
  const scores = await storage.getScores();
  res.json(scores);
});

// Get score by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid score ID' });
  }
  
  const score = await storage.getScore(id);
  if (!score) {
    return res.status(404).json({ message: 'Score not found' });
  }
  
  res.json(score);
});

// Submit a new score (authenticated users only)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const validatedData = insertScoreSchema.parse({
      ...req.body,
      userId: req.user!.id
    });
    
    // Check if game exists
    const game = await storage.getGame(validatedData.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    const score = await storage.createScore(validatedData);
    
    // Check for achievements
    const achievements = await achievementService.checkAndUpdateAchievements(req.user!.id);
    
    res.status(201).json({ 
      score,
      achievements: achievements.length > 0 ? achievements : undefined
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid score data', errors: error.errors });
    }
    res.status(500).json({ message: 'Error submitting score' });
  }
});

export default router;
