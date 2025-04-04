import { storage } from "./storage";
import { Achievement, InsertAchievement } from "../shared/schema";

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
    description: "Score 1000 points in a single game",
    icon: "trophy",
  },
  [AchievementType.GAME_EXPLORER]: {
    title: "Game Explorer",
    description: "Play 5 different games",
    icon: "star",
  },
  [AchievementType.ACHIEVEMENT_HUNTER]: {
    title: "Achievement Hunter",
    description: "Unlock 3 achievements",
    icon: "award",
  },
  [AchievementType.SOCIAL_BUTTERFLY]: {
    title: "Social Butterfly",
    description: "Invite 3 friends to play",
    icon: "users",
  },
  [AchievementType.HIGH_SCORER]: {
    title: "High Scorer",
    description: "Achieve a total score of 5000 points",
    icon: "medal",
  },
  [AchievementType.GAME_CREATOR]: {
    title: "Game Creator",
    description: "Create your first game",
    icon: "code",
  },
  [AchievementType.CREDIT_MASTER]: {
    title: "Credit Master",
    description: "Accumulate 10 credits",
    icon: "coins",
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
    const userCredits = await storage.getUserCredits(userId);
    
    // Check each achievement type
    const updatedAchievements: Achievement[] = [];
    
    // First Game achievement
    if (userScores.length > 0 && !existingAchievementTypes.has(AchievementType.FIRST_GAME)) {
      const achievement = await this.createAchievement(userId, AchievementType.FIRST_GAME, 100, userScores[0].createdAt?.toISOString());
      updatedAchievements.push(achievement);
    }
    
    // Score Master achievement
    const highestScore = userScores.reduce((max, score) => Math.max(max, score.score), 0);
    const scoreMasterProgress = Math.min(100, (highestScore / 1000) * 100);
    const scoreMasterCompleted = scoreMasterProgress >= 100;
    
    if (existingAchievementTypes.has(AchievementType.SCORE_MASTER)) {
      const existingAchievement = existingAchievements.find(a => this.getAchievementType(a) === AchievementType.SCORE_MASTER);
      if (existingAchievement && existingAchievement.progress < scoreMasterProgress) {
        const updatedAchievement = await this.updateAchievementProgress(
          existingAchievement.id!,
          scoreMasterProgress,
          scoreMasterCompleted,
          scoreMasterCompleted ? userScores.find(s => s.score >= 1000)?.createdAt?.toISOString() : undefined
        );
        if (updatedAchievement) {
          updatedAchievements.push(updatedAchievement);
        }
      }
    } else if (scoreMasterProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.SCORE_MASTER,
        scoreMasterProgress,
        scoreMasterCompleted ? userScores.find(s => s.score >= 1000)?.createdAt?.toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    // Game Explorer achievement
    const uniqueGames = new Set(userScores.map(score => score.gameId)).size;
    const explorerProgress = Math.min(100, (uniqueGames / 5) * 100);
    const explorerCompleted = explorerProgress >= 100;
    
    if (existingAchievementTypes.has(AchievementType.GAME_EXPLORER)) {
      const existingAchievement = existingAchievements.find(a => this.getAchievementType(a) === AchievementType.GAME_EXPLORER);
      if (existingAchievement && existingAchievement.progress < explorerProgress) {
        const updatedAchievement = await this.updateAchievementProgress(
          existingAchievement.id!,
          explorerProgress,
          explorerCompleted,
          explorerCompleted ? new Date().toISOString() : undefined
        );
        if (updatedAchievement) {
          updatedAchievements.push(updatedAchievement);
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
    
    // Game Creator achievement
    if (userGames.length > 0 && !existingAchievementTypes.has(AchievementType.GAME_CREATOR)) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.GAME_CREATOR,
        100,
        userGames[0].createdAt
      );
      updatedAchievements.push(achievement);
    }
    
    // Credit Master achievement
    const creditProgress = Math.min(100, (userCredits / 10) * 100);
    const creditCompleted = creditProgress >= 100;
    
    if (existingAchievementTypes.has(AchievementType.CREDIT_MASTER)) {
      const existingAchievement = existingAchievements.find(a => this.getAchievementType(a) === AchievementType.CREDIT_MASTER);
      if (existingAchievement && existingAchievement.progress < creditProgress) {
        const updatedAchievement = await this.updateAchievementProgress(
          existingAchievement.id!,
          creditProgress,
          creditCompleted,
          creditCompleted ? new Date().toISOString() : undefined
        );
        if (updatedAchievement) {
          updatedAchievements.push(updatedAchievement);
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
    
    // High Scorer achievement
    const totalScore = userScores.reduce((sum, score) => sum + score.score, 0);
    const highScorerProgress = Math.min(100, (totalScore / 5000) * 100);
    const highScorerCompleted = highScorerProgress >= 100;
    
    if (existingAchievementTypes.has(AchievementType.HIGH_SCORER)) {
      const existingAchievement = existingAchievements.find(a => this.getAchievementType(a) === AchievementType.HIGH_SCORER);
      if (existingAchievement && existingAchievement.progress < highScorerProgress) {
        const updatedAchievement = await this.updateAchievementProgress(
          existingAchievement.id!,
          highScorerProgress,
          highScorerCompleted,
          highScorerCompleted ? new Date().toISOString() : undefined
        );
        if (updatedAchievement) {
          updatedAchievements.push(updatedAchievement);
        }
      }
    } else if (highScorerProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.HIGH_SCORER,
        highScorerProgress,
        highScorerCompleted ? new Date().toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    // Achievement Hunter achievement (after all other achievements are checked)
    const completedAchievements = existingAchievements.filter(a => a.completed).length + 
      updatedAchievements.filter(a => a.completed).length;
    const hunterProgress = Math.min(100, (completedAchievements / 3) * 100);
    const hunterCompleted = hunterProgress >= 100;
    
    if (existingAchievementTypes.has(AchievementType.ACHIEVEMENT_HUNTER)) {
      const existingAchievement = existingAchievements.find(a => this.getAchievementType(a) === AchievementType.ACHIEVEMENT_HUNTER);
      if (existingAchievement && existingAchievement.progress < hunterProgress) {
        const updatedAchievement = await this.updateAchievementProgress(
          existingAchievement.id!,
          hunterProgress,
          hunterCompleted,
          hunterCompleted ? new Date().toISOString() : undefined
        );
        if (updatedAchievement) {
          updatedAchievements.push(updatedAchievement);
        }
      }
    } else if (hunterProgress > 0) {
      const achievement = await this.createAchievement(
        userId,
        AchievementType.ACHIEVEMENT_HUNTER,
        hunterProgress,
        hunterCompleted ? new Date().toISOString() : undefined
      );
      updatedAchievements.push(achievement);
    }
    
    return updatedAchievements;
  }
  
  // Helper method to create an achievement
  private async createAchievement(
    userId: number,
    type: AchievementType,
    progress: number,
    completedAt?: string
  ): Promise<Achievement> {
    const definition = achievementDefinitions[type];
    
    const achievementData: InsertAchievement = {
      userId,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      progress,
      completed: progress >= 100,
      completedAt: progress >= 100 ? completedAt : undefined,
    };
    
    return await storage.createAchievement(achievementData);
  }
  
  // Helper method to update an achievement's progress
  private async updateAchievementProgress(
    id: number,
    progress: number,
    completed: boolean,
    completedAt?: string
  ): Promise<Achievement | undefined> {
    return await storage.updateAchievement(id, {
      progress,
      completed,
      completedAt: completed ? completedAt : undefined,
    });
  }
  
  // Helper method to get the achievement type from an achievement
  private getAchievementType(achievement: Achievement): AchievementType {
    // This is a simple mapping based on the title
    // In a real app, you might want to store the type directly in the achievement
    switch (achievement.title) {
      case "First Game":
        return AchievementType.FIRST_GAME;
      case "Score Master":
        return AchievementType.SCORE_MASTER;
      case "Game Explorer":
        return AchievementType.GAME_EXPLORER;
      case "Achievement Hunter":
        return AchievementType.ACHIEVEMENT_HUNTER;
      case "Social Butterfly":
        return AchievementType.SOCIAL_BUTTERFLY;
      case "High Scorer":
        return AchievementType.HIGH_SCORER;
      case "Game Creator":
        return AchievementType.GAME_CREATOR;
      case "Credit Master":
        return AchievementType.CREDIT_MASTER;
      default:
        return AchievementType.FIRST_GAME; // Default fallback
    }
  }
}

// Export a singleton instance
export const achievementService = new AchievementService(); 