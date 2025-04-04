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
  type InsertScore,
  type Achievement,
  type InsertAchievement
} from "@shared/schema";

// Memory store for session
const MemoryStore = createMemoryStore(session);

// Storage interface
interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AI Model methods
  getAiModels(): Promise<AiModel[]>;
  getAiModel(id: number): Promise<AiModel | undefined>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  
  // Model Version methods
  getModelVersions(): Promise<ModelVersion[]>;
  getModelVersionsByModelId(modelId: number): Promise<ModelVersion[]>;
  getModelVersion(id: number): Promise<ModelVersion | undefined>;
  getLatestModelVersion(modelId: number): Promise<ModelVersion | undefined>;
  createModelVersion(version: InsertModelVersion): Promise<ModelVersion>;
  
  // Game methods
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGamesByModelVersionId(modelVersionId: number): Promise<Game[]>;
  getGamesByUserId(userId: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Score methods
  getScores(): Promise<Score[]>;
  getScore(id: number): Promise<Score | undefined>;
  getScoresByGameId(gameId: number): Promise<Score[]>;
  getScoresByUserId(userId: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
  
  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, progress: number, completed: boolean, completedAt?: string): Promise<Achievement | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiModels: Map<number, AiModel>;
  private modelVersions: Map<number, ModelVersion>;
  private games: Map<number, Game>;
  private scores: Map<number, Score>;
  private apiKeys: Map<number, string>; // Map userId to API key
  private achievements: Map<number, Achievement>; // Map achievement ID to achievement
  
  currentUserId: number;
  currentModelId: number;
  currentVersionId: number;
  currentGameId: number;
  currentScoreId: number;
  currentAchievementId: number;
  
  sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.aiModels = new Map();
    this.modelVersions = new Map();
    this.games = new Map();
    this.scores = new Map();
    this.apiKeys = new Map();
    this.achievements = new Map();
    
    this.currentUserId = 1;
    this.currentModelId = 1;
    this.currentVersionId = 1;
    this.currentGameId = 1;
    this.currentScoreId = 1;
    this.currentAchievementId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.initializeData();
  }
  
  // Initialize with sample data
  private initializeData() {
    // Add sample data here (truncated for brevity)
    console.log("Initializing storage with sample data");
  }
  
  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      ...user,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  // AI Model methods
  async getAiModels(): Promise<AiModel[]> {
    return Array.from(this.aiModels.values());
  }
  
  async getAiModel(id: number): Promise<AiModel | undefined> {
    return this.aiModels.get(id);
  }
  
  async createAiModel(model: InsertAiModel): Promise<AiModel> {
    const newModel: AiModel = {
      id: this.currentModelId++,
      ...model,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.aiModels.set(newModel.id, newModel);
    return newModel;
  }
  
  // Model Version methods
  async getModelVersions(): Promise<ModelVersion[]> {
    return Array.from(this.modelVersions.values());
  }
  
  async getModelVersionsByModelId(modelId: number): Promise<ModelVersion[]> {
    return Array.from(this.modelVersions.values()).filter(
      (version) => version.modelId === modelId
    );
  }
  
  async getModelVersion(id: number): Promise<ModelVersion | undefined> {
    return this.modelVersions.get(id);
  }
  
  async getLatestModelVersion(modelId: number): Promise<ModelVersion | undefined> {
    return Array.from(this.modelVersions.values()).find(
      (version) => version.modelId === modelId && version.isLatest
    );
  }
  
  async createModelVersion(version: InsertModelVersion): Promise<ModelVersion> {
    // If this is marked as latest, update other versions
    if (version.isLatest) {
      const existingVersions = await this.getModelVersionsByModelId(version.modelId);
      for (const existingVersion of existingVersions) {
        if (existingVersion.isLatest) {
          existingVersion.isLatest = false;
          this.modelVersions.set(existingVersion.id, existingVersion);
        }
      }
    }
    
    const newVersion: ModelVersion = {
      id: this.currentVersionId++,
      ...version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.modelVersions.set(newVersion.id, newVersion);
    return newVersion;
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
  
  async getGamesByUserId(userId: number): Promise<Game[]> {
    // In a real implementation, we'd filter by createdBy field
    // For now, return all games
    return Array.from(this.games.values());
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const newGame: Game = {
      id: this.currentGameId++,
      ...game,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.games.set(newGame.id, newGame);
    return newGame;
  }
  
  // Score methods
  async getScores(): Promise<Score[]> {
    return Array.from(this.scores.values());
  }
  
  async getScore(id: number): Promise<Score | undefined> {
    return this.scores.get(id);
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
  
  async createScore(score: InsertScore): Promise<Score> {
    const newScore: Score = {
      id: this.currentScoreId++,
      ...score,
      createdAt: new Date().toISOString()
    };
    
    this.scores.set(newScore.id, newScore);
    return newScore;
  }
  
  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const newAchievement: Achievement = {
      id: this.currentAchievementId++,
      ...achievement,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.achievements.set(newAchievement.id, newAchievement);
    return newAchievement;
  }
  
  async updateAchievement(
    id: number,
    progress: number,
    completed: boolean,
    completedAt?: string
  ): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    
    if (!achievement) {
      return undefined;
    }
    
    const updatedAchievement: Achievement = {
      ...achievement,
      progress,
      completed,
      completedAt: completedAt || achievement.completedAt,
      updatedAt: new Date().toISOString()
    };
    
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }
}

// Export a singleton instance
export const storage = new MemStorage();
