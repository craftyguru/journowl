import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  journalEntries, 
  achievements, 
  userStats,
  goals,
  emailCampaigns,
  siteSettings,
  userActivityLogs,
  announcements,
  supportMessages,
  promptPurchases,
  type User, 
  type InsertUser, 
  type JournalEntry, 
  type InsertJournalEntry,
  type Achievement,
  type InsertAchievement,
  type UserStats,
  type Goal,
  type InsertGoal,
  type EmailCampaign,
  type SiteSetting,
  type UserActivityLog,
  type Announcement,
  type SupportMessage,
  type PromptPurchase,
  type InsertPromptPurchase
} from "@shared/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

// Setup DB client with SSL enabled
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes("DATABASE_URL=")) {
  dbUrl = "postgresql://postgres.asjcxaiabjsbjbasssfe:KCqwTTy4bwqNrHti@aws-0-us-east-2.pooler.supabase.com:6543/postgres";
}
dbUrl = dbUrl.replace(/^DATABASE_URL=/, "");
console.log("Database connecting to:", dbUrl.split("@")[1]?.split("?")[0]);

const client = postgres(dbUrl, {
  ssl: { rejectUnauthorized: false },
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});
export const db = drizzle(client);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<void>;
  updateUserXP(userId: number, xp: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getActiveUsers(): Promise<User[]>;
  getInactiveUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry>;
  getJournalEntries(userId: number, limit?: number): Promise<JournalEntry[]>;
  getJournalEntry(id: number, userId: number): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: number, userId: number, entry: Partial<InsertJournalEntry>): Promise<void>;
  deleteJournalEntry(id: number, userId: number): Promise<void>;

  createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;

  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<void>;
  createUserStats(userId: number): Promise<UserStats>;
  recalculateUserStats(userId: number): Promise<void>;

  getUserGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal & { userId: number }): Promise<Goal>;
  updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void>;

  logUserActivity(userId: number, action: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void>;
  getEmailCampaign(id: number): Promise<EmailCampaign | undefined>;
  updateEmailCampaign(id: number, updates: Partial<EmailCampaign>): Promise<void>;
  createEmailCampaign(campaign: Partial<EmailCampaign>): Promise<EmailCampaign>;
  getEmailCampaigns(): Promise<EmailCampaign[]>;
  getSiteSettings(): Promise<SiteSetting[]>;
  updateSiteSetting(key: string, value: string, updatedBy: number): Promise<void>;
  getUserActivityLogs(userId?: number, limit?: number): Promise<UserActivityLog[]>;
  createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement>;
  getActiveAnnouncements(targetAudience?: string): Promise<Announcement[]>;

  createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage>;
  getSupportMessages(userId: number): Promise<SupportMessage[]>;
  getAllSupportMessages(): Promise<SupportMessage[]>;
  markSupportMessageAsRead(id: number): Promise<void>;

  getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }>;
  incrementPromptUsage(userId: number): Promise<void>;
  addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void>;
  resetMonthlyUsage(): Promise<void>;
  updateUserPrompts(userId: number, promptsToAdd: number): Promise<void>;

  updateUserSubscription(userId: number, subscription: { tier: string; status: string; expiresAt: Date; stripeSubscriptionId: string }): Promise<void>;
  updateStorageUsage(userId: number, additionalMB: number): Promise<void>;

  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  addUserPrompts(userId: number, promptsToAdd: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: Partial<User>): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    const newUser = result[0];
    await this.createUserStats(newUser.id);
    return newUser;
  }

  async updateUserXP(userId: number, xp: number): Promise<void> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) return;

    const currentXP = currentUser.xp || 0;
    const newXP = currentXP + xp;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await db.update(users).set({ xp: newXP, level: newLevel }).where(eq(users.id, userId));
  }

  async createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry> {
    const wordCount = entry.content.trim().split(/\s+/).filter(word => word.length > 0).length;

    const result = await db.insert(journalEntries).values({ ...entry, wordCount }).returning();
    const newEntry = result[0];

    // Update user stats
    const stats = await this.getUserStats(entry.userId);
    if (stats) {
      const today = new Date();
      const lastEntry = stats.lastEntryDate ? new Date(stats.lastEntryDate) : null;
      let currentStreak = stats.currentStreak || 0;

      if (lastEntry) {
        const daysDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) currentStreak += 1;
        else if (daysDiff > 1) currentStreak = 1;
      } else {
        currentStreak = 1;
      }

      const totalEntries = (stats.totalEntries || 0) + 1;
      const totalWords = (stats.totalWords || 0) + wordCount;
      const longestStreak = Math.max(stats.longestStreak || 0, currentStreak);

      await this.updateUserStats(entry.userId, {
        totalEntries,
        totalWords,
        currentStreak,
        longestStreak,
        lastEntryDate: today,
      });
    }

    await this.updateUserXP(entry.userId, 50 + Math.floor(wordCount / 10));

    return newEntry;
  }

  async getJournalEntries(userId: number, limit = 10): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt)).limit(limit);
  }

  async getJournalEntry(id: number, userId: number): Promise<JournalEntry | undefined> {
    const result = await db.select().from(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId))).limit(1);
    return result[0];
  }

  async updateJournalEntry(id: number, userId: number, entry: Partial<InsertJournalEntry>): Promise<void> {
    const updateData: Partial<InsertJournalEntry> & { updatedAt: Date; wordCount?: number } = { ...entry, updatedAt: new Date() };

    if (entry.content) {
      updateData.wordCount = entry.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    await db.update(journalEntries).set(updateData).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async deleteJournalEntry(id: number, userId: number): Promise<void> {
    await db.delete(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async updateAchievement(id: number, updates: Partial<Achievement>): Promise<void> {
    await db.update(achievements).set(updates).where(eq(achievements.id, id));
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const result = await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.unlockedAt));

    // If user has no achievements except welcome, create default achievements  
    const nonWelcomeAchievements = result.filter(a => a.type !== 'getting_started');
    if (nonWelcomeAchievements.length === 0) {
      await this.createDefaultAchievements(userId);
      return await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.unlockedAt));
    }

    return result;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserStats(userId: number, stats: Partial<UserStats>): Promise<void> {
    await db.update(userStats).set({ ...stats, updatedAt: new Date() }).where(eq(userStats.userId, userId));
  }

  async createUserStats(userId: number): Promise<UserStats> {
    const result = await db.insert(userStats).values({ userId }).returning();
    return result[0];
  }

  async recalculateUserStats(userId: number): Promise<void> {
    const entries = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));

    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);

    let currentStreak = 0;
    let longestStreak = 0;

    if (entries.length > 0) {
      const today = new Date();
      const entryDates = entries.map(entry => new Date(entry.createdAt).toDateString());

      const uniqueDates = Array.from(new Set(entryDates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      for (let i = 0; i < uniqueDates.length; i++) {
        const entryDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (entryDate.toDateString() === expectedDate.toDateString()) {
          currentStreak = i + 1;
        } else {
          break;
        }
      }

      let tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const daysDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    await this.updateUserStats(userId, {
      totalEntries,
      totalWords,
      currentStreak,
      longestStreak,
      lastEntryDate: entries.length > 0 ? new Date(entries[0].createdAt) : null,
    });
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getActiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await db.select().from(users).where(gte(users.lastLoginAt, thirtyDaysAgo)).orderBy(desc(users.lastLoginAt));
  }

  async getInactiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await db.select().from(users).where(sql`${users.lastLoginAt} IS NULL OR ${users.lastLoginAt} < ${thirtyDaysAgo}`).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role)).orderBy(desc(users.createdAt));
  }

  async logUserActivity(userId: number, action: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void> {
    await db.insert(userActivityLogs).values({ userId, action, details, ipAddress, userAgent });
  }

  async getEmailCampaign(id: number): Promise<EmailCampaign | undefined> {
    const result = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id)).limit(1);
    return result[0];
  }

  async updateEmailCampaign(id: number, updates: Partial<EmailCampaign>): Promise<void> {
    await db.update(emailCampaigns).set({ ...updates, updatedAt: new Date() }).where(eq(emailCampaigns.id, id));
  }

  async createEmailCampaign(campaign: Partial<EmailCampaign>): Promise<EmailCampaign> {
    const result = await db.insert(emailCampaigns).values(campaign as any).returning();
    return result[0];
  }

  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(siteSettings.key);
  }

  async updateSiteSetting(key: string, value: string, updatedBy: number): Promise<void> {
    await db.insert(siteSettings).values({ key, value, updatedBy }).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedBy, updatedAt: new Date() }
    });
  }

  async getUserActivityLogs(userId?: number, limit = 100): Promise<UserActivityLog[]> {
    if (userId) {
      return await db.select().from(userActivityLogs).where(eq(userActivityLogs.userId, userId)).orderBy(desc(userActivityLogs.createdAt)).limit(limit);
    }

    return await db.select().from(userActivityLogs).orderBy(desc(userActivityLogs.createdAt)).limit(limit);
  }

  async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement as any).returning();
    return result[0];
  }

  async getActiveAnnouncements(targetAudience = 'all'): Promise<Announcement[]> {
    const now = new Date();

    return await db.select().from(announcements)
      .where(
        and(
          eq(announcements.isActive, true),
          sql`(${announcements.expiresAt} IS NULL OR ${announcements.expiresAt} > ${now})`,
          sql`${announcements.targetAudience} = ${targetAudience} OR ${announcements.targetAudience} = 'all'`
        )
      )
      .orderBy(desc(announcements.createdAt));
  }

  async getUserGoals(userId: number): Promise<Goal[]> {
    const result = await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(goals.createdAt);

    if (result.length === 0) {
      await this.createDefaultGoals(userId);
      return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(goals.createdAt);
    }

    return result;
  }

  async createGoal(goal: InsertGoal & { userId: number }): Promise<Goal> {
    const result = await db.insert(goals).values(goal).returning();
    return result[0];
  }

  async updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void> {
    await db.update(goals).set({ ...updates, updatedAt: new Date() }).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  async getGoalByGoalId(userId: number, goalId: string): Promise<Goal | undefined> {
    const result = await db.select().from(goals).where(and(eq(goals.userId, userId), eq(goals.goalId, goalId))).limit(1);
    return result[0];
  }

  async getAchievementByAchievementId(userId: number, achievementId: string): Promise<Achievement | undefined> {
    const result = await db.select().from(achievements).where(and(eq(achievements.userId, userId), eq(achievements.achievementId, achievementId))).limit(1);
    return result[0];
  }

  private async createDefaultGoals(userId: number): Promise<void> {
    const defaultGoals = [
      // beginner, intermediate, advanced, expert, legendary goals (omitted for brevity)
    ];

    const goalsToInsert = defaultGoals.map(goal => ({
      ...goal,
      userId,
      currentValue: 0,
      isCompleted: false,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    }));

    await db.insert(goals).values(goalsToInsert);
  }

  private async createDefaultAchievements(userId: number): Promise<void> {
    const defaultAchievements = [
      // beginner, intermediate, advanced, expert, legendary, mythical achievements (omitted for brevity)
    ];

    const achievementsToInsert = defaultAchievements.map(achievement => ({
      ...achievement,
      userId,
      unlockedAt: null,
    }));

    await db.insert(achievements).values(achievementsToInsert);
  }

  async createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage> {
    const [newMessage] = await db.insert(supportMessages).values(message).returning();
    return newMessage;
  }

  async getSupportMessages(userId: number): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages).where(eq(supportMessages.userId, userId)).orderBy(desc(supportMessages.createdAt));
  }

  async getAllSupportMessages(): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));
  }

  async markSupportMessageAsRead(id: number): Promise<void> {
    await db.update(supportMessages).set({ isRead: true }).where(eq(supportMessages.id, id));
  }

  async getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    if (user.promptsRemaining == null) {
      await db.update(users).set({ promptsRemaining: 100, promptsUsedThisMonth: 0 }).where(eq(users.id, userId));
      return { promptsRemaining: 100, promptsUsedThisMonth: 0, currentPlan: user.currentPlan || "free" };
    }

    return { promptsRemaining: user.promptsRemaining || 0, promptsUsedThisMonth: user.promptsUsedThisMonth || 0, currentPlan: user.currentPlan || "free" };
  }

  async incrementPromptUsage(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    if ((user.promptsRemaining || 0) <= 0) throw new Error("No prompts remaining");

    await db.update(users)
      .set({ promptsUsedThisMonth: (user.promptsUsedThisMonth || 0) + 1, promptsRemaining: (user.promptsRemaining || 0) - 1 })
      .where(eq(users.id, userId));
  }

  async addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void> {
    await db.insert(promptPurchases).values({ userId, stripePaymentId, amount, promptsAdded, status: "completed" });
    await this.updateUserPrompts(userId, promptsAdded);
  }

  async updateUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    await db.update(users).set({ promptsRemaining: (user.promptsRemaining || 0) + promptsToAdd }).where(eq(users.id, userId));
  }

  async resetMonthlyUsage(): Promise<void> {
    await db.update(users).set({ promptsUsedThisMonth: 0, lastUsageReset: new Date() });
  }

  async updateUserSubscription(userId: number, subscription: { tier: string; status: string; expiresAt: Date; stripeSubscriptionId: string }): Promise<void> {
    const { tier, status, expiresAt, stripeSubscriptionId } = subscription;

    let storageLimit = 100;
    let promptsRemaining = 100;

    if (tier === "premium") {
      storageLimit = 1024;
      promptsRemaining = 1000;
    } else if (tier === "pro") {
      storageLimit = 10240;
      promptsRemaining = 999999;
    }

    await db.update(users).set({
      subscription_tier: tier,
      subscription_status: status,
      subscription_expires_at: expiresAt,
      storage_limit_mb: storageLimit,
      prompts_remaining: promptsRemaining,
      stripe_subscription_id: stripeSubscriptionId,
    }).where(eq(users.id, userId));
  }

  async updateStorageUsage(userId: number, additionalMB: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newUsage = (user.storageUsedMB || 0) + additionalMB;
    await db.update(users).set({ storageUsedMB: newUsage }).where(eq(users.id, userId));
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
    return result[0];
  }

  async addUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newPrompts = (user.promptsRemaining || 0) + promptsToAdd;
    await db.update(users).set({ promptsRemaining: newPrompts }).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
