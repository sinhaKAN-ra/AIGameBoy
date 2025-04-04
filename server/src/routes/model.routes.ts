import { Router } from 'express';
import { storage } from '../services/storage.service';
import { insertAiModelSchema, insertModelVersionSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Get all AI models
router.get('/', async (_req, res) => {
  const models = await storage.getAiModels();
  res.json(models);
});

// Get AI model by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid model ID' });
  }
  
  const model = await storage.getAiModel(id);
  if (!model) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  res.json(model);
});

// Get model versions for a specific model
router.get('/:id/versions', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid model ID' });
  }
  
  const versions = await storage.getModelVersionsByModelId(id);
  res.json(versions);
});

// Create a new AI model (admin only)
router.post('/', async (req, res) => {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  try {
    const validatedData = insertAiModelSchema.parse(req.body);
    const model = await storage.createAiModel(validatedData);
    res.status(201).json(model);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid model data', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating model' });
  }
});

// Create a new model version (admin only)
router.post('/:id/versions', async (req, res) => {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const modelId = Number(req.params.id);
  if (isNaN(modelId)) {
    return res.status(400).json({ message: 'Invalid model ID' });
  }
  
  // Check if model exists
  const model = await storage.getAiModel(modelId);
  if (!model) {
    return res.status(404).json({ message: 'Model not found' });
  }
  
  try {
    const validatedData = insertModelVersionSchema.parse({
      ...req.body,
      modelId
    });
    
    const version = await storage.createModelVersion(validatedData);
    res.status(201).json(version);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid version data', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating model version' });
  }
});

export default router;
