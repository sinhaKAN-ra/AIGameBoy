import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertScoreSchema, 
  scoreSubmissionSchema, 
  insertAiModelSchema,
  insertModelVersionSchema,
  insertGameSchema,
  User, 
  Game 
} from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // AI Models API
  app.get("/api/models", async (_req, res) => {
    const models = await storage.getAiModels();
    res.json(models);
  });

  app.get("/api/models/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }
    
    const model = await storage.getAiModel(id);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    
    res.json(model);
  });
  
  app.post("/api/models", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Validate the model data
      const modelData = insertAiModelSchema.parse(req.body);
      
      // Create the model
      const model = await storage.createAiModel(modelData);
      
      res.status(201).json(model);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid model data", errors: error.errors });
      }
      
      console.error("Error creating model:", error);
      res.status(500).json({ message: "Failed to create model" });
    }
  });
  
  // Model Versions API
  app.get("/api/model-versions", async (_req, res) => {
    const versions = await storage.getModelVersions();
    res.json(versions);
  });
  
  app.get("/api/model-versions/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid version ID" });
    }
    
    const version = await storage.getModelVersion(id);
    if (!version) {
      return res.status(404).json({ message: "Model version not found" });
    }
    
    res.json(version);
  });
  
  app.get("/api/models/:id/versions", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }
    
    const versions = await storage.getModelVersionsByModelId(id);
    res.json(versions);
  });
  
  app.get("/api/models/:id/latest-version", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }
    
    const version = await storage.getLatestModelVersion(id);
    if (!version) {
      return res.status(404).json({ message: "No latest version found for this model" });
    }
    
    res.json(version);
  });
  
  app.post("/api/model-versions", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Validate the model version data
      const versionData = insertModelVersionSchema.parse(req.body);
      
      // Check if the model exists
      const model = await storage.getAiModel(versionData.modelId);
      if (!model) {
        return res.status(404).json({ message: "AI Model not found" });
      }
      
      // Create the model version
      const version = await storage.createModelVersion(versionData);
      
      // If this is set as the latest version, update other versions
      if (versionData.isLatest) {
        await storage.setLatestModelVersion(version.id);
      }
      
      res.status(201).json(version);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid model version data", errors: error.errors });
      }
      
      console.error("Error creating model version:", error);
      res.status(500).json({ message: "Failed to create model version" });
    }
  });

  // Games API
  app.get("/api/games", async (_req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.get("/api/games/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }
    
    const game = await storage.getGame(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.json(game);
  });

  app.get("/api/models/:id/games", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }
    
    const games = await storage.getGamesByModelId(id);
    res.json(games);
  });
  
  app.get("/api/model-versions/:id/games", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid model version ID" });
    }
    
    const games = await storage.getGamesByModelVersionId(id);
    res.json(games);
  });
  
  app.post("/api/games", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Validate the game data
      const gameData = insertGameSchema.parse(req.body);
      
      // Check if the model version exists
      if (gameData.modelVersionId) {
        const modelVersion = await storage.getModelVersion(gameData.modelVersionId);
        if (!modelVersion) {
          return res.status(404).json({ message: "Model version not found" });
        }
      }
      
      // Credit check - user needs credits to create a game
      const userId = req.user!.id;
      const userCredits = await storage.getUserCredits(userId);
      
      if (userCredits < 1) {
        return res.status(403).json({ 
          message: "Insufficient credits. You need at least 1 credit to create a game.",
          credits: userCredits 
        });
      }
      
      // Create the game
      const game = await storage.createGame(gameData);
      
      // Deduct one credit from the user
      const newCredits = Math.max(0, userCredits - 1); // Ensure we don't go below 0
      await storage.updateUserCredits(userId, newCredits);
      
      res.status(201).json({
        game,
        credits: newCredits
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      
      console.error("Error creating game:", error);
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Scores API
  app.get("/api/scores", async (_req, res) => {
    const scores = await storage.getScores();
    res.json(scores);
  });

  app.get("/api/games/:id/scores", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }
    
    const scores = await storage.getScoresByGameId(id);
    
    // Join with user information
    const scoresWithUserInfo = await Promise.all(
      scores.map(async (score) => {
        const user = score.userId ? await storage.getUser(score.userId) : null;
        return {
          ...score,
          username: user?.username || "Unknown",
        };
      })
    );
    
    // Sort by score descending
    scoresWithUserInfo.sort((a, b) => b.score - a.score);
    
    res.json(scoresWithUserInfo);
  });

  app.get("/api/games/:id/top-scores", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }
    
    const limit = Number(req.query.limit) || 10;
    const scores = await storage.getTopScoresByGameId(id, limit);
    
    // Join with user information
    const scoresWithUserInfo = await Promise.all(
      scores.map(async (score) => {
        const user = score.userId ? await storage.getUser(score.userId) : null;
        return {
          ...score,
          username: user?.username || "Unknown",
        };
      })
    );
    
    res.json(scoresWithUserInfo);
  });

  app.get("/api/users/:id/scores", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    if (!req.isAuthenticated() && req.user?.id !== id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const scores = await storage.getScoresByUserId(id);
    
    // Join with game information
    const scoresWithGameInfo = await Promise.all(
      scores.map(async (score) => {
        const game = score.gameId ? await storage.getGame(score.gameId) : null;
        return {
          ...score,
          game: game || { 
            title: "Unknown Game",
            id: 0,
            description: "",
            genre: "",
            imageUrl: null,
            embedUrl: null,
            modelVersionId: null,
            active: false,
            difficulty: null,
            tags: null,
            createdAt: null
          } as Game,
        };
      })
    );
    
    // Sort by date, most recent first
    scoresWithGameInfo.sort((a, b) => {
      // Handle null dates by treating them as older than any actual date
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    res.json(scoresWithGameInfo);
  });

  // Score submission API
  app.post("/api/scores", async (req: Request, res: Response) => {
    try {
      // Validate the score submission
      const validatedData = scoreSubmissionSchema.parse(req.body);
      
      // Get user ID from session or find by API key
      let userId = null;
      
      if (req.isAuthenticated() && req.user) {
        // If the user is logged in, use their ID
        userId = req.user.id;
      } else if (validatedData.apiKey) {
        // If an API key is provided, validate it and get the associated user ID
        userId = await storage.validateApiKey(validatedData.apiKey);
        
        if (!userId) {
          return res.status(401).json({ message: "Invalid API key" });
        }
      } else {
        return res.status(401).json({ message: "Authentication required. Provide an API key or login" });
      }
      
      // Verify the game exists
      const game = await storage.getGame(validatedData.gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      // Create the score entry
      const scoreData = insertScoreSchema.parse({
        userId,
        gameId: validatedData.gameId,
        score: validatedData.score
      });
      
      const score = await storage.createScore(scoreData);
      
      // Reward the user with a small credit for playing the game (1 in 5 chance)
      if (Math.random() < 0.2) { // 20% chance to get a credit
        const user = await storage.getUser(userId);
        if (user) {
          const newCredits = (user.credits || 0) + 1;
          await storage.updateUserCredits(userId, newCredits);
        }
      }
      
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid score data", errors: error.errors });
      }
      
      console.error("Error submitting score:", error);
      res.status(500).json({ message: "Failed to submit score" });
    }
  });

  // User API key management
  app.get("/api/user/api-key", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user!.id;
    let apiKey = await storage.getUserApiKey(userId);
    
    if (!apiKey) {
      // Create a new API key if one doesn't exist
      apiKey = await storage.createUserApiKey(userId);
    }
    
    res.json({ apiKey });
  });
  
  app.post("/api/user/api-key/regenerate", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user!.id;
    const apiKey = await storage.createUserApiKey(userId);
    
    res.json({ apiKey });
  });
  
  // User credits management
  app.get("/api/user/credits", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user!.id;
    const credits = await storage.getUserCredits(userId);
    
    res.json({ credits });
  });
  
  // This would be connected to a payment system in a real implementation
  app.post("/api/user/credits/purchase", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user!.id;
    const amount = Number(req.body.amount);
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }
    
    const currentCredits = await storage.getUserCredits(userId);
    const newCredits = currentCredits + amount;
    
    await storage.updateUserCredits(userId, newCredits);
    
    res.json({ 
      message: `Successfully purchased ${amount} credits`,
      credits: newCredits
    });
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
