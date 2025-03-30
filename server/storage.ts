import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  users, 
  aiModels, 
  modelVersions,
  games, 
  scores, 
  type User, 
  type InsertUser, 
  type AiModel, 
  type InsertAiModel,
  type ModelVersion,
  type InsertModelVersion,
  type Game,
  type InsertGame,
  type Score,
  type InsertScore
} from "@shared/schema";

// Memory store for session
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAdmin(userId: number, isAdmin: boolean): Promise<User | undefined>;
  getUserCredits(userId: number): Promise<number>;
  updateUserCredits(userId: number, credits: number): Promise<User | undefined>;
  
  // AI Model methods
  getAiModels(): Promise<AiModel[]>;
  getAiModel(id: number): Promise<AiModel | undefined>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  
  // Model Version methods
  getModelVersions(): Promise<ModelVersion[]>;
  getModelVersion(id: number): Promise<ModelVersion | undefined>;
  getModelVersionsByModelId(modelId: number): Promise<ModelVersion[]>;
  getLatestModelVersion(modelId: number): Promise<ModelVersion | undefined>;
  createModelVersion(modelVersion: InsertModelVersion): Promise<ModelVersion>;
  setLatestModelVersion(versionId: number): Promise<ModelVersion | undefined>;
  
  // Game methods
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGamesByModelVersionId(modelVersionId: number): Promise<Game[]>;
  getGamesByUserId(userId: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Score methods
  getScores(): Promise<Score[]>;
  getScoresByGameId(gameId: number): Promise<Score[]>;
  getScoresByUserId(userId: number): Promise<Score[]>;
  getTopScoresByGameId(gameId: number, limit: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
  
  // API Key methods
  getUserApiKey(userId: number): Promise<string | undefined>;
  createUserApiKey(userId: number): Promise<string>;
  validateApiKey(apiKey: string): Promise<number | undefined>; // Returns userId if valid
  
  // Session store
  sessionStore: any; // Using any to avoid session type errors
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiModels: Map<number, AiModel>;
  private modelVersions: Map<number, ModelVersion>;
  private games: Map<number, Game>;
  private scores: Map<number, Score>;
  private apiKeys: Map<number, string>; // Map userId to API key
  
  currentUserId: number;
  currentModelId: number;
  currentVersionId: number;
  currentGameId: number;
  currentScoreId: number;
  sessionStore: any; // Using any to avoid session type errors

  constructor() {
    this.users = new Map();
    this.aiModels = new Map();
    this.modelVersions = new Map();
    this.games = new Map();
    this.scores = new Map();
    this.apiKeys = new Map();
    
    this.currentUserId = 1;
    this.currentModelId = 1;
    this.currentVersionId = 1;
    this.currentGameId = 1;
    this.currentScoreId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Add initial AI models
    const baseModels = [
      {
        id: this.currentModelId++,
        name: "GPT-4",
        company: "OpenAI",
        description: "Advanced language model capable of creating narrative-driven games and complex text adventures.",
        logoUrl: "https://via.placeholder.com/150",
        websiteUrl: "https://openai.com"
      },
      {
        id: this.currentModelId++,
        name: "Claude",
        company: "Anthropic",
        description: "Known for creative storytelling and nuanced game narratives with ethical considerations.",
        logoUrl: "https://via.placeholder.com/150",
        websiteUrl: "https://anthropic.com"
      },
      {
        id: this.currentModelId++,
        name: "Gemini",
        company: "Google",
        description: "Multimodal AI with unique capabilities for creating visual puzzle games and logic challenges.",
        logoUrl: "https://via.placeholder.com/150",
        websiteUrl: "https://deepmind.google/technologies/gemini/"
      },
      {
        id: this.currentModelId++,
        name: "Llama",
        company: "Meta",
        description: "Open-source model that excels at community-driven game development and collaborative experiences.",
        logoUrl: "https://via.placeholder.com/150",
        websiteUrl: "https://ai.meta.com/llama/"
      }
    ];
    
    // Add models and their versions
    for (const model of baseModels) {
      this.aiModels.set(model.id, model);
      
      // Create versions for each model
      // GPT-4 versions
      if (model.id === 1) {
        const versions = [
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v4.0",
            description: "The latest generation of GPT, optimized for game development and interactive storytelling.",
            capabilities: "Text generation, storytelling, dialogue, puzzle creation",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-12-01"),
            isLatest: true
          },
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v3.5",
            description: "A reliable model for game creation with proven track record.",
            capabilities: "Text generation, basic gameplay logic, conversation",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2022-11-01"),
            isLatest: false
          }
        ];
        
        for (const version of versions) {
          this.modelVersions.set(version.id, version);
        }
      }
      
      // Claude versions
      if (model.id === 2) {
        const versions = [
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v2.1",
            description: "Claude's latest version with enhanced creativity and game design capabilities.",
            capabilities: "Contextual awareness, narrative design, character development",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-11-01"),
            isLatest: true
          },
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v2.0",
            description: "Previous Claude version with solid game development abilities.",
            capabilities: "Narrative composition, ethical gameplay considerations",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-07-01"),
            isLatest: false
          }
        ];
        
        for (const version of versions) {
          this.modelVersions.set(version.id, version);
        }
      }
      
      // Gemini versions
      if (model.id === 3) {
        const versions = [
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "Pro",
            description: "Gemini's flagship model with multimodal capabilities for advanced game development.",
            capabilities: "Visual reasoning, multimodal integration, puzzle design",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-12-15"),
            isLatest: true
          },
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "Standard",
            description: "The standard Gemini model for everyday game development.",
            capabilities: "Basic visual processing, game logic implementation",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-09-01"),
            isLatest: false
          }
        ];
        
        for (const version of versions) {
          this.modelVersions.set(version.id, version);
        }
      }
      
      // Llama versions
      if (model.id === 4) {
        const versions = [
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v3",
            description: "Latest version of Llama with enhanced capabilities for open-source game development.",
            capabilities: "Text generation, accessible customization, community-focused development",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-10-01"),
            isLatest: true
          },
          {
            id: this.currentVersionId++,
            modelId: model.id,
            version: "v2",
            description: "Previous generation of Llama, still powerful for game creation.",
            capabilities: "Text generation, basic customization",
            imageUrl: "https://via.placeholder.com/150",
            releaseDate: new Date("2023-02-01"),
            isLatest: false
          }
        ];
        
        for (const version of versions) {
          this.modelVersions.set(version.id, version);
        }
      }
    }
    
    // Add initial games (now linked to model versions)
    const games = [
      {
        id: this.currentGameId++,
        title: "Pixel Adventure",
        description: "A retro-style adventure game with an adaptive storyline that changes based on your decisions.",
        genre: "Adventure",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "https://example.com/games/pixel-adventure",
        modelVersionId: 1, // GPT-4 v4.0
        active: true,
        difficulty: "medium",
        tags: ["retro", "adventure", "adaptive", "story-rich"],
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "AI Chess Master",
        description: "Play chess against an AI that adapts to your skill level and teaches you new strategies.",
        genre: "Strategy",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "https://example.com/games/ai-chess",
        modelVersionId: 3, // Claude v2.1
        active: true,
        difficulty: "hard",
        tags: ["chess", "strategy", "educational"],
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "Space Explorer",
        description: "Explore procedurally generated galaxies with unique alien species and interactive storylines.",
        genre: "Simulation",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "https://example.com/games/space-explorer",
        modelVersionId: 5, // Gemini Pro
        active: true,
        difficulty: "medium",
        tags: ["space", "simulation", "exploration", "procedural"],
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "Word Wizard",
        description: "A word puzzle game that challenges your vocabulary and creativity with AI-generated themes.",
        genre: "Puzzle",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "https://example.com/games/word-wizard",
        modelVersionId: 7, // Llama v3
        active: true,
        difficulty: "easy",
        tags: ["word", "puzzle", "casual", "educational"],
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "Retro RPG",
        description: "An old-school RPG with turn-based combat and a branching narrative that adapts to your choices.",
        genre: "RPG",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "https://example.com/games/retro-rpg",
        modelVersionId: 2, // GPT-4 v3.5
        active: true,
        difficulty: "medium",
        tags: ["rpg", "turn-based", "retro", "narrative"],
        createdAt: new Date()
      }
    ];
    
    for (const game of games) {
      this.games.set(game.id, game);
    }
    
    // Create an admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123", // In production, this would be hashed
      email: "admin@aigames.com",
      isAdmin: true,
      credits: 100, // Admin gets lots of credits
      createdAt: new Date()
    };
    
    this.users.set(adminUser.id, adminUser);
    
    // Create API key for admin user
    this.apiKeys.set(adminUser.id, "admin-api-key-" + Math.random().toString(36).substring(2, 15));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      isAdmin: false,
      credits: 5, // New users get 5 credits
      email: insertUser.email || null
    };
    this.users.set(id, user);
    
    // Create an API key for the new user
    this.createUserApiKey(id);
    
    return user;
  }
  
  async getUserCredits(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user?.credits || 0;
  }
  
  async updateUserCredits(userId: number, credits: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      credits
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async getGamesByUserId(userId: number): Promise<Game[]> {
    // Get all games created by this user (for now, there's no userId in Game)
    // In a real implementation, we'd add a createdBy field to Game
    const userScores = await this.getScoresByUserId(userId);
    const gameIds = [...new Set(userScores.map(score => score.gameId).filter(id => id !== null) as number[])];
    
    return Promise.all(gameIds.map(id => this.getGame(id as number)))
      .then(games => games.filter(game => game !== undefined) as Game[]);
  }
  
  async getUserApiKey(userId: number): Promise<string | undefined> {
    return this.apiKeys.get(userId);
  }
  
  async createUserApiKey(userId: number): Promise<string> {
    // Generate a random API key
    const apiKey = "user-" + userId + "-key-" + Math.random().toString(36).substring(2, 15);
    this.apiKeys.set(userId, apiKey);
    return apiKey;
  }
  
  async validateApiKey(apiKey: string): Promise<number | undefined> {
    // Find the user ID associated with this API key
    for (const [userId, key] of this.apiKeys.entries()) {
      if (key === apiKey) {
        return userId;
      }
    }
    return undefined;
  }
  
  async updateUserAdmin(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      isAdmin 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // AI Model methods
  async getAiModels(): Promise<AiModel[]> {
    return Array.from(this.aiModels.values());
  }
  
  async getAiModel(id: number): Promise<AiModel | undefined> {
    return this.aiModels.get(id);
  }
  
  async createAiModel(model: InsertAiModel): Promise<AiModel> {
    const id = this.currentModelId++;
    const aiModel: AiModel = { 
      ...model, 
      id,
      logoUrl: model.logoUrl || null,
      websiteUrl: model.websiteUrl || null 
    };
    this.aiModels.set(id, aiModel);
    return aiModel;
  }
  
  // Model Version methods
  async getModelVersions(): Promise<ModelVersion[]> {
    return Array.from(this.modelVersions.values());
  }
  
  async getModelVersion(id: number): Promise<ModelVersion | undefined> {
    return this.modelVersions.get(id);
  }
  
  async getModelVersionsByModelId(modelId: number): Promise<ModelVersion[]> {
    return Array.from(this.modelVersions.values()).filter(
      (version) => version.modelId === modelId
    );
  }
  
  async getLatestModelVersion(modelId: number): Promise<ModelVersion | undefined> {
    return Array.from(this.modelVersions.values()).find(
      (version) => version.modelId === modelId && version.isLatest
    );
  }
  
  async createModelVersion(modelVersion: InsertModelVersion): Promise<ModelVersion> {
    const id = this.currentVersionId++;
    const releaseDate = modelVersion.releaseDate || new Date();
    const newVersion: ModelVersion = { 
      ...modelVersion, 
      id,
      releaseDate,
      capabilities: modelVersion.capabilities || null,
      imageUrl: modelVersion.imageUrl || null,
      isLatest: false // By default a new version is not latest
    };
    this.modelVersions.set(id, newVersion);
    return newVersion;
  }
  
  async setLatestModelVersion(versionId: number): Promise<ModelVersion | undefined> {
    const version = await this.getModelVersion(versionId);
    if (!version) return undefined;
    
    // Reset all versions of this model to not be latest
    const modelVersions = await this.getModelVersionsByModelId(version.modelId);
    for (const v of modelVersions) {
      this.modelVersions.set(v.id, { ...v, isLatest: false });
    }
    
    // Set the specified version to be latest
    const updatedVersion: ModelVersion = { ...version, isLatest: true };
    this.modelVersions.set(versionId, updatedVersion);
    return updatedVersion;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGamesByModelVersionId(modelVersionId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.modelVersionId === modelVersionId
    );
  }
  
  // For backward compatibility
  async getGamesByModelId(modelId: number): Promise<Game[]> {
    // Get all versions for this model
    const versions = await this.getModelVersionsByModelId(modelId);
    const versionIds = versions.map(v => v.id);
    
    // Get all games for any version of this model
    return Array.from(this.games.values()).filter(
      (game) => game.modelVersionId && versionIds.includes(game.modelVersionId)
    );
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const createdAt = new Date();
    
    // For safe conversion to the new schema
    const newGame: Game = { 
      ...game, 
      id, 
      createdAt,
      imageUrl: game.imageUrl || null,
      embedUrl: game.embedUrl || null,
      modelVersionId: game.modelVersionId || null,
      active: game.active !== undefined ? game.active : true,
      difficulty: game.difficulty || "medium",
      tags: game.tags || []
    };
    
    this.games.set(id, newGame);
    return newGame;
  }
  
  // Score methods
  async getScores(): Promise<Score[]> {
    return Array.from(this.scores.values());
  }
  
  async getScoresByGameId(gameId: number): Promise<Score[]> {
    return Array.from(this.scores.values()).filter(
      (score) => score.gameId === gameId
    );
  }
  
  async getScoresByUserId(userId: number): Promise<Score[]> {
    return Array.from(this.scores.values()).filter(
      (score) => score.userId === userId
    );
  }
  
  async getTopScoresByGameId(gameId: number, limit: number): Promise<Score[]> {
    return Array.from(this.scores.values())
      .filter((score) => score.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  async createScore(score: InsertScore): Promise<Score> {
    const id = this.currentScoreId++;
    const createdAt = new Date();
    
    // Safe conversion with null handling
    const newScore: Score = { 
      ...score, 
      id, 
      createdAt,
      userId: score.userId || null,
      gameId: score.gameId || null,
      score: score.score
    };
    
    this.scores.set(id, newScore);
    return newScore;
  }
}

export const storage = new MemStorage();
