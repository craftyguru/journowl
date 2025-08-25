import { pgTable, foreignKey, serial, integer, timestamp, text, unique, json, boolean, index, varchar, date, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userStats = pgTable("user_stats", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	totalEntries: integer("total_entries").default(0),
	totalWords: integer("total_words").default(0),
	currentStreak: integer("current_streak").default(0),
	longestStreak: integer("longest_streak").default(0),
	lastEntryDate: timestamp("last_entry_date", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_stats_user_id_users_id_fk"
		}),
]);

export const achievements = pgTable("achievements", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	icon: text().notNull(),
	unlockedAt: timestamp("unlocked_at", { mode: 'string' }).defaultNow(),
	achievementId: text("achievement_id"),
	rarity: text().default('common'),
	targetValue: integer("target_value").default(1),
	currentValue: integer("current_value").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "achievements_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	level: integer().default(1),
	xp: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	role: text().default('user'),
	avatar: text(),
	bio: text(),
	quote: text(),
	theme: text().default('dark'),
	preferences: json().default({}),
	aiPersonality: text("ai_personality").default('friendly'),
	favoriteQuote: text("favorite_quote"),
	provider: text().default('local'),
	providerId: text("provider_id"),
	profileImageUrl: text("profile_image_url"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	isActive: boolean("is_active").default(true),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	emailVerified: boolean("email_verified").default(false),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	currentPlan: text("current_plan").default('free'),
	promptsUsedThisMonth: integer("prompts_used_this_month").default(0),
	promptsRemaining: integer("prompts_remaining").default(100),
	storageUsedMb: integer("storage_used_mb").default(0),
	lastUsageReset: timestamp("last_usage_reset", { mode: 'string' }).defaultNow(),
	subscriptionTier: text("subscription_tier").default('free'),
	subscriptionStatus: text("subscription_status").default('active'),
	subscriptionExpiresAt: timestamp("subscription_expires_at", { mode: 'string' }),
	storageLimitMb: integer("storage_limit_mb").default(100),
	stripeSubscriptionId: text("stripe_subscription_id"),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
]);

export const journalEntries = pgTable("journal_entries", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: text().notNull(),
	content: text().notNull(),
	mood: text().notNull(),
	wordCount: integer("word_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	fontFamily: text("font_family").default('Inter'),
	fontSize: integer("font_size").default(16),
	textColor: text("text_color").default('#ffffff'),
	backgroundColor: text("background_color").default('#1e293b'),
	drawings: json(),
	photos: json(),
	tags: json(),
	aiInsights: json("ai_insights"),
	isPrivate: boolean("is_private").default(false),
	location: text(),
	weather: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "journal_entries_user_id_users_id_fk"
		}),
]);

export const session = pgTable("session", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const moodTrends = pgTable("mood_trends", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	date: date().notNull(),
	mood: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mood_trends_user_id_fkey"
		}),
]);

export const journalPrompts = pgTable("journal_prompts", {
	id: serial().primaryKey().notNull(),
	category: text().notNull(),
	text: text().notNull(),
	difficulty: text().default('medium'),
	isKidFriendly: boolean("is_kid_friendly").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const adminAnalytics = pgTable("admin_analytics", {
	id: serial().primaryKey().notNull(),
	metricName: text("metric_name").notNull(),
	metricValue: numeric("metric_value").notNull(),
	recordedAt: timestamp("recorded_at", { mode: 'string' }).defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	value: text().notNull(),
	updatedBy: integer("updated_by"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [users.id],
			name: "site_settings_updated_by_fkey"
		}),
	unique("site_settings_key_key").on(table.key),
]);

export const userActivityLogs = pgTable("user_activity_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	action: text().notNull(),
	details: json(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_activity_logs_user_id_fkey"
		}),
]);

export const announcements = pgTable("announcements", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	targetAudience: text("target_audience").default('all'),
	isActive: boolean("is_active").default(true),
	createdBy: integer("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "announcements_created_by_fkey"
		}),
]);

export const promptPurchases = pgTable("prompt_purchases", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	stripePaymentId: text("stripe_payment_id").notNull(),
	amount: integer().notNull(),
	promptsAdded: integer("prompts_added").notNull(),
	status: text().default('completed'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "prompt_purchases_user_id_fkey"
		}),
	unique("prompt_purchases_stripe_payment_id_key").on(table.stripePaymentId),
]);

export const goals = pgTable("goals", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: text().notNull(),
	description: text(),
	targetValue: integer("target_value"),
	currentValue: integer("current_value").default(0),
	status: text().default('active'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	goalId: text("goal_id"),
	difficulty: text().default('beginner'),
	type: text().default('writing'),
	isCompleted: boolean("is_completed").default(false),
	deadline: timestamp({ mode: 'string' }),
	completedAt: timestamp("completed_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "goals_user_id_fkey"
		}),
]);

export const emailCampaigns = pgTable("email_campaigns", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	subject: text().notNull(),
	content: text().notNull(),
	targetAudience: text("target_audience").default('all'),
	status: text().default('draft'),
	recipientCount: integer("recipient_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	htmlContent: text("html_content"),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	openRate: numeric("open_rate", { precision: 5, scale:  2 }).default('0.0'),
	clickRate: numeric("click_rate", { precision: 5, scale:  2 }).default('0.0'),
});

export const subscriptions = pgTable("subscriptions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	tier: text().notNull(),
	status: text().default('active'),
	stripeSubscriptionId: text("stripe_subscription_id"),
	amount: integer(),
	billingCycle: text("billing_cycle").default('monthly'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "subscriptions_user_id_fkey"
		}),
]);
