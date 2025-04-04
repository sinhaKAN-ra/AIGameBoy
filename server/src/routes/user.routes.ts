import { Router } from 'express';
import { storage } from '../services/storage.service';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';

const router = Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const users = await storage.getUsers();
  // Remove passwords before sending
  const sanitizedUsers = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(sanitizedUsers);
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Remove password before sending
  const { password, ...userWithoutPassword } = req.user!;
  res.json(userWithoutPassword);
});

// Get user by ID
router.get('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  // Only allow users to view their own profile or admins to view any profile
  if (req.user!.id !== id && !req.user!.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const user = await storage.getUser(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Remove password before sending
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Get user's games
router.get('/:id/games', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  // Only allow users to view their own games or admins to view any user's games
  if (req.user!.id !== id && !req.user!.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const games = await storage.getGamesByUserId(id);
  res.json(games);
});

// Get user's scores
router.get('/:id/scores', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  
  // Only allow users to view their own scores or admins to view any user's scores
  if (req.user!.id !== id && !req.user!.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const scores = await storage.getScoresByUserId(id);
  res.json(scores);
});

export default router;
