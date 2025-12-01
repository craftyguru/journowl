import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============ ENTERPRISE: ORGANIZATIONS & MULTI-TENANCY ============

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan").default("free"), // free|pro|power|enterprise
  dataRegion: text("data_region").default("us"), // us|eu
  logoUrl: text("logo_url"),
  website: text("website"),
  industry: text("industry"), // healthcare|fitness|corporate|education|other
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationMembers = pgTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // owner|admin|coach|therapist|member|viewer
  invitedBy: integer("invited_by").references(() => users.id),
  inviteEmail: text("invite_email"),
  joinedAt: timestamp("joined_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserUnique: unique().on(table.organizationId, table.userId),
}));

export const organizationAiSettings = pgTable("organization_ai_settings", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull().unique(),
  allowCoachingChat: boolean("allow_coaching_chat").default(true),
  allowPersonalDataToAi: boolean("allow_personal_data_to_ai").default(false),
  maxTokensPerMonth: integer("max_tokens_per_month").default(100000),
  allowedModels: json("allowed_models").default(["gpt-4o-mini"]),
  storeAiResponses: boolean("store_ai_responses").default(false),
  redactPii: boolean("redact_pii").default(true),
  kidsModeEnabled: boolean("kids_mode_enabled").default(false),
  traderModeEnabled: boolean("trader_mode_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const identityProviders = pgTable("identity_providers", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  type: text("type").notNull(), // saml|oidc
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  ssoUrl: text("sso_url").notNull(),
  entityId: text("entity_id"),
  certificate: text("certificate"),
  clientId: text("client_id"),
  clientSecret: text("client_secret"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiRequests = pgTable("ai_requests", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  feature: text("feature").notNull(), // coaching_chat|dream_analysis|mood_forecast|summary|story_mode
  model: text("model").notNull(),
  promptHash: text("prompt_hash").notNull(),
  tokensIn: integer("tokens_in").default(0),
  tokensOut: integer("tokens_out").default(0),
  costUsd: integer("cost_usd").default(0),
  status: text("status").default("success"), // success|error|blocked|redacted
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
  orgFeatureIdx: index().on(table.organizationId, table.feature),
}));

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  actorId: integer("actor_id").references(() => users.id),
  actorType: text("actor_type").notNull(), // user|system|admin
  action: text("action").notNull(), // view_data|export_data|delete_data|update_settings|create_campaign
  resourceType: text("resource_type"), // user|journal_entry|settings|ai_policy
  resourceId: integer("resource_id"),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgActionIdx: index().on(table.organizationId, table.action),
  orgActorIdx: index().on(table.organizationId, table.actorId),
}));

// ============ CORE TABLES (with org_id added) ============

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  role: text("role").default("user"),
  avatar: text("avatar"),
  theme: text("theme").default("purple"),
  bio: text("bio"),
  favoriteQuote: text("favorite_quote"),
  preferences: json("preferences"),
  aiPersonality: text("ai_personality").default("friendly"),
  interfaceMode: text("interface_mode").default("wellness"), // wellness|productivity|trader|team|therapy
  provider: text("provider").default("local"),
  providerId: text("provider_id"),
  profileImageUrl: text("profile_image_url"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true),
  isBanned: boolean("is_banned").default(false),
  banReason: text("ban_reason"),
  bannedAt: timestamp("banned_at"),
  bannedBy: integer("banned_by"),
  isFlagged: boolean("is_flagged").default(false),
  flagReason: text("flag_reason"),
  flaggedAt: timestamp("flagged_at"),
  flaggedBy: integer("flagged_by"),
  suspiciousActivityCount: integer("suspicious_activity_count").default(0),
  lastSuspiciousActivity: timestamp("last_suspicious_activity"),
  lastLoginAt: timestamp("last_login_at"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  requiresEmailVerification: boolean("requires_email_verification").default(true),
  currentPlan: text("current_plan").default("free"),
  promptsUsedThisMonth: integer("prompts_used_this_month").default(0),
  promptsRemaining: integer("prompts_remaining").default(100),
  storageUsedMB: integer("storage_used_mb").default(0),
  lastUsageReset: timestamp("last_usage_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood").notNull(),
  wordCount: integer("word_count").default(0),
  fontFamily: text("font_family").default("Inter"),
  fontSize: integer("font_size").default(16),
  textColor: text("text_color").default("#ffffff"),
  backgroundColor: text("background_color").default("#1e293b"),
  drawings: json("drawings"),
  photos: json("photos"),
  tags: json("tags"),
  aiInsights: json("ai_insights"),
  isPrivate: boolean("is_private").default(false),
  location: text("location"),
  weather: text("weather"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: text("achievement_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").notNull(),
  type: text("type").notNull(),
  targetValue: integer("target_value"),
  currentValue: integer("current_value").default(0),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalEntries: integer("total_entries").default(0),
  totalWords: integer("total_words").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastEntryDate: timestamp("last_entry_date"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orgUserUnique: unique().on(table.organizationId, table.userId),
}));

export const moodTrends = pgTable("mood_trends", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  mood: text("mood").notNull(),
  value: integer("value").notNull(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  goalId: text("goal_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  difficulty: text("difficulty").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  isCompleted: boolean("is_completed").default(false),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const journalPrompts = pgTable("journal_prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  tags: json("tags").default([]),
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

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  htmlContent: text("html_content"),
  targetAudience: text("target_audience").default("all"),
  status: text("status").default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openRate: integer("open_rate").default(0),
  clickRate: integer("click_rate").default(0),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgIdx: index().on(table.organizationId),
}));

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgActionIdx: index().on(table.organizationId, table.action),
}));

export const moderationQueue = pgTable("moderation_queue", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  contentId: integer("content_id"),
  contentType: text("content_type").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  action: text("action"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
}, (table) => ({
  orgStatusIdx: index().on(table.organizationId, table.status),
}));

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon"),
  type: text("type").default("info"),
  priority: integer("priority").default(0),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orgIdx: index().on(table.organizationId),
}));

export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"),
  priority: text("priority").default("normal"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orgStatusIdx: index().on(table.organizationId, table.status),
}));

export const promptPurchases = pgTable("prompt_purchases", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  quantity: integer("quantity").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("USD"),
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const weeklyChallenges = pgTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  week: integer("week").notNull(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goal: text("goal").notNull(),
  reward: integer("reward").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgWeekIdx: index().on(table.organizationId, table.week, table.year),
}));

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  challengeId: integer("challenge_id").references(() => weeklyChallenges.id).notNull(),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  refereeId: integer("referee_id").references(() => users.id),
  referralCode: text("referral_code").notNull().unique(),
  status: text("status").default("pending"),
  rewardGiven: boolean("reward_given").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  orgReferrerIdx: index().on(table.organizationId, table.referrerId),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  icon: text("icon"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
}));

// Shared Journals Tables
export const sharedJournals = pgTable("shared_journals", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  icon: text("icon").default("📔"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  orgIdx: index().on(table.organizationId),
}));

export const sharedJournalMembers = pgTable("shared_journal_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  sharedJournalId: integer("shared_journal_id").references(() => sharedJournals.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  orgJournalIdx: index().on(table.organizationId, table.sharedJournalId),
}));

export const sharedJournalEntries = pgTable("shared_journal_entries", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  sharedJournalId: integer("shared_journal_id").references(() => sharedJournals.id).notNull(),
  journalEntryId: integer("journal_entry_id").references(() => journalEntries.id).notNull(),
  sharedBy: integer("shared_by").references(() => users.id).notNull(),
  sharedAt: timestamp("shared_at").defaultNow(),
}, (table) => ({
  orgJournalIdx: index().on(table.organizationId, table.sharedJournalId),
}));

// ============ ENTERPRISE: INVITATIONS & COMPLIANCE ============

export const pendingInvitations = pgTable("pending_invitations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // owner|admin|coach|therapist|member|viewer
  magicToken: text("magic_token").notNull().unique(),
  invitedBy: integer("invited_by").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  status: text("status").default("pending"), // pending|accepted|expired|rejected
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgEmailIdx: index().on(table.organizationId, table.email),
  tokenIdx: index().on(table.magicToken),
}));

export const complianceExports = pgTable("compliance_exports", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  requestedBy: integer("requested_by").references(() => users.id).notNull(),
  exportFormat: text("export_format").default("json"), // json|csv|pdf
  dataIncluded: json("data_included").default(["journalEntries", "userStats", "activities"]),
  status: text("status").default("pending"), // pending|processing|completed|failed
  downloadUrl: text("download_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
  statusIdx: index().on(table.status),
}));

export const complianceDeletions = pgTable("compliance_deletions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  requestedBy: integer("requested_by").references(() => users.id).notNull(),
  reason: text("reason"),
  status: text("status").default("pending"), // pending|approved|processing|completed|cancelled
  approvedAt: timestamp("approved_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orgUserIdx: index().on(table.organizationId, table.userId),
  statusIdx: index().on(table.status),
}));

// Enterprise Types
export type Organization = typeof organizations.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type OrganizationAiSettings = typeof organizationAiSettings.$inferSelect;
export type IdentityProvider = typeof identityProviders.$inferSelect;
export type AiRequest = typeof aiRequests.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type PendingInvitation = typeof pendingInvitations.$inferSelect;
export type ComplianceExport = typeof complianceExports.$inferSelect;
export type ComplianceDeletion = typeof complianceDeletions.$inferSelect;

// Core Types
export type User = typeof users.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type JournalPrompt = typeof journalPrompts.$inferSelect;
export type MoodTrend = typeof moodTrends.$inferSelect;
export type AdminAnalytics = typeof adminAnalytics.$inferSelect;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type ModerationQueue = typeof moderationQueue.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type PromptPurchase = typeof promptPurchases.$inferSelect;
export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type SharedJournal = typeof sharedJournals.$inferSelect;
export type SharedJournalMember = typeof sharedJournalMembers.$inferSelect;
export type SharedJournalEntry = typeof sharedJournalEntries.$inferSelect;

// Enterprise Insert Schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).omit({ id: true, createdAt: true });
export const insertOrganizationAiSettingsSchema = createInsertSchema(organizationAiSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIdentityProviderSchema = createInsertSchema(identityProviders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAiRequestSchema = createInsertSchema(aiRequests).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertPendingInvitationSchema = createInsertSchema(pendingInvitations).omit({ id: true, createdAt: true });
export const insertComplianceExportSchema = createInsertSchema(complianceExports).omit({ id: true, createdAt: true, completedAt: true });
export const insertComplianceDeletionSchema = createInsertSchema(complianceDeletions).omit({ id: true, createdAt: true });

// Core Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true });
export const insertJournalPromptSchema = createInsertSchema(journalPrompts).omit({ id: true });
export const insertPromptPurchaseSchema = createInsertSchema(promptPurchases).omit({ id: true, createdAt: true });
export const insertWeeklyChallengeSchema = createInsertSchema(weeklyChallenges).omit({ id: true, createdAt: true });
export const insertEmailReminderSchema = z.object({
  userId: z.number(),
  type: z.string(),
  isEnabled: z.boolean().optional(),
  frequency: z.string().optional(),
  preferredTime: z.string().optional(),
});

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type InsertOrganizationAiSettings = z.infer<typeof insertOrganizationAiSettingsSchema>;
export type InsertIdentityProvider = z.infer<typeof insertIdentityProviderSchema>;
export type InsertAiRequest = z.infer<typeof insertAiRequestSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertPendingInvitation = z.infer<typeof insertPendingInvitationSchema>;
export type InsertComplianceExport = z.infer<typeof insertComplianceExportSchema>;
export type InsertComplianceDeletion = z.infer<typeof insertComplianceDeletionSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertJournalPrompt = z.infer<typeof insertJournalPromptSchema>;
export type InsertPromptPurchase = z.infer<typeof insertPromptPurchaseSchema>;
export type InsertWeeklyChallenge = z.infer<typeof insertWeeklyChallengeSchema>;
