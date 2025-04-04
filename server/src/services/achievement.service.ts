import { storage } from "./storage.service";
import { Achievement, InsertAchievement } from "@shared/schema";

// Achievement types
export enum AchievementType {
  FIRST_GAME = "first_game",
  SCORE_MASTER = "score_master",
  GAME_EXPLORER = "game_explorer",
  ACHIEVEMENT_HUNTER = "achievement_hunter",
  SOCIAL_BUTTERFLY = "social_butterfly",
  HIGH_SCORER = "high_scorer",
  GAME_CREATOR = "game_creator",
  CREDIT_MASTER = "credit_master",
}

// Achievement definitions
const achievementDefinitions = {
  [AchievementType.FIRST_GAME]: {
    title: "First Game",
    description: "Play your first game",
    icon: "gamepad",
  },
  [AchievementType.SCORE_MASTER]: {
    title: "Score Master",
    description: "Submit 10 scores across any games",
    icon: "trophy",
  },
  [AchievementType.GAME_EXPLORER]: {
    title: "Game Explorer",
    description: "Play 5 different games",
    icon: "compass",
  },
  [AchievementType.ACHIEVEMENT_HUNTER]: {
    title: "Achievement Hunter",
    description: "Earn 3 achievements",
    icon: "award",
  },
  [AchievementType.SOCIAL_BUTTERFLY]: {
    title: "Social Butterfly",
    description: "Share 5 games on social media",
    icon: "share",
  },
  [AchievementType.HIGH_SCORER]: {
    title: "High Scorer",
    description: "Get a top 3 score in any game",
    icon: "star",
  },
  [AchievementType.GAME_CREATOR]: {
    title: "Game Creator",
    description: "Create your first game",
    icon: "code",
  },
  [AchievementType.CREDIT_MASTER]: {
    title: "Credit Master",
    description: "Earn 1000 credits",
    icon: "dollar-sign",
  },
};

export class AchievementService {
  // Check and update achievements for a user
  async checkAndUpdateAchievements(userId: number): Promise<Achievement[]> {
    // Get user's existing achievements
    const existingAchievements = await storage.getAchievementsByUserId(userId);
    const existingAchievementTypes = new Set(
      existingAchievements.map(a => this.getAchievementType(a))
    );
    
    // Get user's scores
    const userScores = await storage.getScoresByUserId(userId);
    
    // Get user's games
    const userGames = await storage.getGamesByUserId(userId);
    
    // Get user's credits
    // This would come from a user service in a real implementation
    const userCredits = 0;
    
    // Track updated achievements
    const updatedAchievements: Achievement[] = [];
    
    // First game achievement
    if (userScores.length > 0) {
      if (existingAchievementTypes.has(AchievementType.FIRST_GAME)) {
        // Already has this achievement, check if it needs updating
        const existingAchievement = existingAchievements.find(
          a => this.getAchievementType(a) === AchievementType.FIRST_GAME
        );
        
        if (existingAchievement && !existingAchievement.completed) {
          const updatedAchievement = await storage.updateAchievement(
            existingAchievement.id!,
            100,
            true,
            new Date().toISOString()
          );
          if (updatedAchievement) {
            updatedAchievements.push(updatedAchievement);
          }
        }
      } else {
        // Create new achievement
        const achievement = await this.createAchievement(
          userId,
          AchievementType.FIRST_GAME,
          100,
          new Date().toISOString()
        );
        updatedAchievements.push(achievement);
      }
    }
    
    // Score master achievement
    const scoreProgress = Math.min(100, (userScores.length / 10) * 100);
    const scoreCompleted = userScores.length >= 10;
    
    if (existingAchievementTypes.has(AchievementType.SCORE_MASTER)) {
      const existingAchievement = existingAchievements.find(
        a => this.getAchievementType(a) === AchievementType.SCORE_MASTER
      );
      
      if (existingAchievement) {
        if (existingAchievement.progress !== scoreProgress || existingAchievement.completed !== scoreCompleted) {
          const updatedAchievement = await storage.updateAchievement(
            existingAchievement.id!,
            scoreProgress,
            scoreCompleted,
            scoreCompleted ? new Date().toISOString() : undefined
          );
          if (updatedAchievement) {
            updatedAchievements.push(updatedAchievement);
          }
        }
      }
    } else if (scoreProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.SCORE_MASTER,
        scoreProgress,
        scoreCompleted ? new Date().toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    // Game explorer achievement
    // Count unique games played
    const uniqueGameIds = new Set(userScores.map(score => score.gameId));
    const explorerProgress = Math.min(100, (uniqueGameIds.size / 5) * 100);
    const explorerCompleted = uniqueGameIds.size >= 5;
    
    if (existingAchievementTypes.has(AchievementType.GAME_EXPLORER)) {
      const existingAchievement = existingAchievements.find(
        a => this.getAchievementType(a) === AchievementType.GAME_EXPLORER
      );
      
      if (existingAchievement) {
        if (existingAchievement.progress !== explorerProgress || existingAchievement.completed !== explorerCompleted) {
          const updatedAchievement = await storage.updateAchievement(
            existingAchievement.id!,
            explorerProgress,
            explorerCompleted,
            explorerCompleted ? new Date().toISOString() : undefined
          );
          if (updatedAchievement) {
            updatedAchievements.push(updatedAchievement);
          }
        }
      }
    } else if (explorerProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.GAME_EXPLORER,
        explorerProgress,
        explorerCompleted ? new Date().toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    // Credit master achievement
    const creditProgress = Math.min(100, (userCredits / 1000) * 100);
    const creditCompleted = userCredits >= 1000;
    
    if (existingAchievementTypes.has(AchievementType.CREDIT_MASTER)) {
      const existingAchievement = existingAchievements.find(
        a => this.getAchievementType(a) === AchievementType.CREDIT_MASTER
      );
      
      if (existingAchievement) {
        if (existingAchievement.progress !== creditProgress || existingAchievement.completed !== creditCompleted) {
          const updatedAchievement = await storage.updateAchievement(
            existingAchievement.id!,
            creditProgress,
            creditCompleted,
            creditCompleted ? new Date().toISOString() : undefined
          );
          if (updatedAchievement) {
            updatedAchievements.push(updatedAchievement);
          }
        }
      }
    } else if (creditProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.CREDIT_MASTER,
        creditProgress,
        creditCompleted ? new Date().toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    // Return all updated achievements
    return updatedAchievements;
  }
  
  // Helper to create a new achievement
  private async createAchievement(
    userId: number,
    type: AchievementType,
    progress: number,
    completedAt?: string
  ): Promise<Achievement> {
    const definition = achievementDefinitions[type];
    
    const achievement: InsertAchievement = {
      userId,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      type: type,
      progress,
      completed: progress >= 100,
      completedAt: progress >= 100 ? completedAt : undefined,
    };
    
    return await storage.createAchievement(achievement);
  }
  
  // Helper to get achievement type from achievement
  private getAchievementType(achievement: Achievement): AchievementType {
    return achievement.type as AchievementType;
  }
}

// Export a singleton instance
export const achievementService = new AchievementService();
