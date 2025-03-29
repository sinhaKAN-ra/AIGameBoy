import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertScoreSchema, scoreSubmissionSchema, User, Game } from "@shared/schema";
import { z } from "zod";

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
      
      // Check if user is authenticated or has a valid API key
      if (!req.isAuthenticated() && !validatedData.apiKey) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Get user ID from session or find by API key
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not found" });
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
      
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid score data", errors: error.errors });
      }
      
      console.error("Error submitting score:", error);
      res.status(500).json({ message: "Failed to submit score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
