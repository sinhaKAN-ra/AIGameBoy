import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  users, 
  aiModels, 
  games, 
  scores, 
  type User, 
  type InsertUser, 
  type AiModel, 
  type InsertAiModel,
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
  
  // AI Model methods
  getAiModels(): Promise<AiModel[]>;
  getAiModel(id: number): Promise<AiModel | undefined>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  
  // Game methods
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGamesByModelId(modelId: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Score methods
  getScores(): Promise<Score[]>;
  getScoresByGameId(gameId: number): Promise<Score[]>;
  getScoresByUserId(userId: number): Promise<Score[]>;
  getTopScoresByGameId(gameId: number, limit: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiModels: Map<number, AiModel>;
  private games: Map<number, Game>;
  private scores: Map<number, Score>;
  
  currentUserId: number;
  currentModelId: number;
  currentGameId: number;
  currentScoreId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.aiModels = new Map();
    this.games = new Map();
    this.scores = new Map();
    
    this.currentUserId = 1;
    this.currentModelId = 1;
    this.currentGameId = 1;
    this.currentScoreId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some AI models
    this.initializeData();
  }

  private initializeData() {
    // Add initial AI models
    const aiModels = [
      {
        id: this.currentModelId++,
        name: "GPT-4",
        company: "OpenAI",
        version: "v4.0",
        description: "Advanced language model capable of creating narrative-driven games and complex text adventures.",
        capabilities: "Text generation, storytelling, dialogue, puzzle creation",
        imageUrl: "https://via.placeholder.com/150"
      },
      {
        id: this.currentModelId++,
        name: "Claude",
        company: "Anthropic",
        version: "v2.1",
        description: "Known for creative storytelling and nuanced game narratives with ethical considerations.",
        capabilities: "Contextual awareness, narrative design, character development",
        imageUrl: "https://via.placeholder.com/150"
      },
      {
        id: this.currentModelId++,
        name: "Gemini",
        company: "Google",
        version: "Pro",
        description: "Multimodal AI with unique capabilities for creating visual puzzle games and logic challenges.",
        capabilities: "Visual reasoning, multimodal integration, puzzle design",
        imageUrl: "https://via.placeholder.com/150"
      },
      {
        id: this.currentModelId++,
        name: "Llama",
        company: "Meta",
        version: "v3",
        description: "Open-source model that excels at community-driven game development and collaborative experiences.",
        capabilities: "Text generation, accessible customization, community-focused development",
        imageUrl: "https://via.placeholder.com/150"
      }
    ];
    
    for (const model of aiModels) {
      this.aiModels.set(model.id, model);
    }
    
    // Add initial games
    const games = [
      {
        id: this.currentGameId++,
        title: "Pixel Adventure",
        description: "A retro-style adventure game with an adaptive storyline that changes based on your decisions.",
        genre: "Adventure",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "",
        aiModelId: 1,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "AI Chess Master",
        description: "Play chess against an AI that adapts to your skill level and teaches you new strategies.",
        genre: "Strategy",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "",
        aiModelId: 2,
        active: true,
        createdAt: new Date()
      },
      {
        id: this.currentGameId++,
        title: "Space Explorer",
        description: "Explore procedurally generated galaxies with unique alien species and interactive storylines.",
        genre: "Simulation",
        imageUrl: "https://via.placeholder.com/150",
        embedUrl: "",
        aiModelId: 3,
        active: true,
        createdAt: new Date()
      }
    ];
    
    for (const game of games) {
      this.games.set(game.id, game);
    }
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
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
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
    const aiModel: AiModel = { ...model, id };
    this.aiModels.set(id, aiModel);
    return aiModel;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getGamesByModelId(modelId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.aiModelId === modelId
    );
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const createdAt = new Date();
    const newGame: Game = { ...game, id, createdAt };
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
    const newScore: Score = { ...score, id, createdAt };
    this.scores.set(id, newScore);
    return newScore;
  }
}

export const storage = new MemStorage();
