import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Model
export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  version: text("version").notNull(),
  description: text("description").notNull(),
  capabilities: text("capabilities"),
  imageUrl: text("image_url"),
});

// Game
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  genre: text("genre").notNull(),
  imageUrl: text("image_url"),
  embedUrl: text("embed_url"),
  aiModelId: integer("ai_model_id").references(() => aiModels.id),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Login = z.infer<typeof loginSchema>;

export type AiModel = typeof aiModels.$inferSelect;
export type InsertAiModel = z.infer<typeof insertAiModelSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>;
