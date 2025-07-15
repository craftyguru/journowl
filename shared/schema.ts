import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"), // Optional for OAuth users
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  role: text("role").default("user"), // "admin", "user", "kid"
  avatar: text("avatar"),
  theme: text("theme").default("purple"),
  bio: text("bio"),
  favoriteQuote: text("favorite_quote"),
  preferences: json("preferences"), // Journal customization preferences
  aiPersonality: text("ai_personality").default("friendly"), // AI sidekick personality
  provider: text("provider").default("local"), // local, google, facebook, linkedin
  providerId: text("provider_id"),
  profileImageUrl: text("profile_image_url"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood").notNull(),
  wordCount: integer("word_count").default(0),
  fontFamily: text("font_family").default("Inter"),
  fontSize: integer("font_size").default(16),
  textColor: text("text_color").default("#ffffff"),
  backgroundColor: text("background_color").default("#1e293b"),
  drawings: json("drawings"), // JSON array of drawing data
  photos: json("photos"), // JSON array of photo data with AI analysis
  tags: json("tags"), // JSON array of extracted tags
  aiInsights: json("ai_insights"), // JSON object with AI analysis
  isPrivate: boolean("is_private").default(false),
  location: text("location"),
  weather: text("weather"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'streak', 'wordcount', 'level', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalEntries: integer("total_entries").default(0),
  totalWords: integer("total_words").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastEntryDate: timestamp("last_entry_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const moodTrends = pgTable("mood_trends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  mood: text("mood").notNull(),
  value: integer("value").notNull(), // 1-5 scale
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  type: text("type").notNull(), // "streak", "entries", "words"
  isCompleted: boolean("is_completed").default(false),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const journalPrompts = pgTable("journal_prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // "reflection", "gratitude", "creativity", "mindfulness"
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  tags: json("tags").$type<string[]>().default([]),
  isKidFriendly: boolean("is_kid_friendly").default(false),
});

export const adminAnalytics = pgTable("admin_analytics", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").default(0),
  totalEntries: integer("total_entries").default(0),
  activeUsers: integer("active_users").default(0),
  newUsersToday: integer("new_users_today").default(0),
  averageWordsPerEntry: integer("average_words_per_entry").default(0),
  date: timestamp("date").defaultNow().notNull(),
});

// Email blast system
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  htmlContent: text("html_content"),
  targetAudience: text("target_audience").default("all"), // all, active, inactive, role-based
  status: text("status").default("draft"), // draft, scheduled, sending, sent, failed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openRate: integer("open_rate").default(0),
  clickRate: integer("click_rate").default(0),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site configuration management
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").default("string"), // string, number, boolean, json
  description: text("description"),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activity logs for admin monitoring
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // login, logout, entry_created, entry_updated, etc.
  details: json("details"), // Additional context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content moderation queue
export const moderationQueue = pgTable("moderation_queue", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // journal_entry, user_profile, etc.
  contentId: integer("content_id").notNull(),
  reportedBy: integer("reported_by").references(() => users.id),
  reason: text("reason").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("info"), // info, warning, success, error
  targetAudience: text("target_audience").default("all"), // all, users, admins
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  title: true,
  content: true,
  mood: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  type: true,
  title: true,
  description: true,
  icon: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  title: true,
  description: true,
  targetValue: true,
  type: true,
  deadline: true,
});

export const insertJournalPromptSchema = createInsertSchema(journalPrompts).pick({
  title: true,
  content: true,
  category: true,
  difficulty: true,
  tags: true,
  isKidFriendly: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type JournalPrompt = typeof journalPrompts.$inferSelect;
export type InsertJournalPrompt = z.infer<typeof insertJournalPromptSchema>;
export type MoodTrend = typeof moodTrends.$inferSelect;
export type AdminAnalytics = typeof adminAnalytics.$inferSelect;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type ModerationQueue = typeof moderationQueue.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
