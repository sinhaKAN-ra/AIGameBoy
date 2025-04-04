import { Router } from 'express';
import { storage } from '../services/storage.service';
import { insertGameSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Get all games
router.get('/', async (_req, res) => {
  const games = await storage.getGames();
  res.json(games);
});

// Get game by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid game ID' });
  }
  
  const game = await storage.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  
  res.json(game);
});

// Create a new game (authenticated users only)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const validatedData = insertGameSchema.parse({
      ...req.body,
      createdBy: req.user!.id
    });
    
    const game = await storage.createGame(validatedData);
    res.status(201).json(game);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid game data', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating game' });
  }
});

// Get scores for a specific game
router.get('/:id/scores', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid game ID' });
  }
  
  const game = await storage.getGame(id);
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }
  
  const scores = await storage.getScoresByGameId(id);
  res.json(scores);
});

export default router;
