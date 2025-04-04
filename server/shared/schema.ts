import { pgTable, text, serial, integer, boolean, timestamp, json, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  credits: integer("credits").default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Model (base model info)
export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Model Versions
export const modelVersions = pgTable("model_versions", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => aiModels.id).notNull(),
  version: text("version").notNull(),
  releaseDate: timestamp("release_date").defaultNow(),
  description: text("description").notNull(),
  capabilities: text("capabilities").array(),
  imageUrl: text("image_url"),
  isLatest: boolean("is_latest").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameCategories = [
  "Text Adventure",
  "Strategy",
  "Puzzle",
  "RPG",
  "Educational",
  "Simulation",
  "Other",
] as const;

export type GameCategory = typeof gameCategories[number];

// Game
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  modelVersionId: integer("model_version_id").references(() => modelVersions.id).notNull(),
  imageUrl: text("image_url"),
  previewImages: text("preview_images").array(),
  gameUrl: text("game_url"),
  githubUrl: text("github_url"),
  documentationUrl: text("documentation_url"),
  categories: text("categories").array(),
  aiIntegrationDetails: text("ai_integration_details").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Score
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameId: integer("game_id").references(() => games.id),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertAiModelSchema = createInsertSchema(aiModels);

export const insertModelVersionSchema = createInsertSchema(modelVersions);

export const insertGameSchema = createInsertSchema(games);

export const insertScoreSchema = createInsertSchema(scores).pick({
  userId: true,
  gameId: true,
  score: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Score submission schema with validation
export const scoreSubmissionSchema = z.object({
  gameId: z.number(),
  score: z.number().positive("Score must be positive"),
  apiKey: z.string().optional(),
});

// Achievement schema
export const insertAchievementSchema = z.object({
  userId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  progress: z.number().min(0).max(100),
  completed: z.boolean(),
  completedAt: z.string().optional(),
});

// Achievement type
export type Achievement = {
  id?: number;
  userId: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Login = z.infer<typeof loginSchema>;

export type AiModel = typeof aiModels.$inferSelect & {
  versions?: ModelVersion[];
};

export type ModelVersion = typeof modelVersions.$inferSelect;
export type InsertModelVersion = z.infer<typeof insertModelVersionSchema>;

export type Game = {
  id?: number;
  name: string;
  description: string;
  modelVersionId: number;
  imageUrl?: string | null;
  previewImages?: string[];
  gameUrl?: string | null;
  githubUrl?: string | null;
  documentationUrl?: string | null;
  categories: string[];
  aiIntegrationDetails: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type InsertGame = z.infer<typeof insertGameSchema>;

export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>;
