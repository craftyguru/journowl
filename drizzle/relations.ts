import { relations } from "drizzle-orm/relations";
import { users, userStats, achievements, journalEntries, moodTrends, siteSettings, userActivityLogs, announcements, promptPurchases, goals, subscriptions } from "./schema";

export const userStatsRelations = relations(userStats, ({one}) => ({
	user: one(users, {
		fields: [userStats.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userStats: many(userStats),
	achievements: many(achievements),
	journalEntries: many(journalEntries),
	moodTrends: many(moodTrends),
	siteSettings: many(siteSettings),
	userActivityLogs: many(userActivityLogs),
	announcements: many(announcements),
	promptPurchases: many(promptPurchases),
	goals: many(goals),
	subscriptions: many(subscriptions),
}));

export const achievementsRelations = relations(achievements, ({one}) => ({
	user: one(users, {
		fields: [achievements.userId],
		references: [users.id]
	}),
}));

export const journalEntriesRelations = relations(journalEntries, ({one}) => ({
	user: one(users, {
		fields: [journalEntries.userId],
		references: [users.id]
	}),
}));

export const moodTrendsRelations = relations(moodTrends, ({one}) => ({
	user: one(users, {
		fields: [moodTrends.userId],
		references: [users.id]
	}),
}));

export const siteSettingsRelations = relations(siteSettings, ({one}) => ({
	user: one(users, {
		fields: [siteSettings.updatedBy],
		references: [users.id]
	}),
}));

export const userActivityLogsRelations = relations(userActivityLogs, ({one}) => ({
	user: one(users, {
		fields: [userActivityLogs.userId],
		references: [users.id]
	}),
}));

export const announcementsRelations = relations(announcements, ({one}) => ({
	user: one(users, {
		fields: [announcements.createdBy],
		references: [users.id]
	}),
}));

export const promptPurchasesRelations = relations(promptPurchases, ({one}) => ({
	user: one(users, {
		fields: [promptPurchases.userId],
		references: [users.id]
	}),
}));

export const goalsRelations = relations(goals, ({one}) => ({
	user: one(users, {
		fields: [goals.userId],
		references: [users.id]
	}),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
}));