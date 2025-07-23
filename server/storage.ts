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
    // Ensure required fields are present
    const userData = {
      email: user.email!,
      username: user.username!,
      password: user.password || null,
      role: user.role || 'user',
      level: user.level || 1,
      xp: user.xp || 0,
      avatar: user.avatar || null,
      theme: user.theme || 'dark',
      bio: user.bio || null,
      favoriteQuote: user.favoriteQuote || null,
      currentPlan: user.currentPlan || 'free',
      promptsUsedThisMonth: user.promptsUsedThisMonth || 0,
      promptsRemaining: user.promptsRemaining || 100,
      storageUsedMB: user.storageUsedMB || 0,
      lastUsageReset: user.lastUsageReset || new Date(),
      emailVerified: user.emailVerified || false,
      requiresEmailVerification: user.requiresEmailVerification !== false,
      emailVerificationToken: (user as any).emailVerificationToken || null,
      emailVerificationExpires: (user as any).emailVerificationExpires || null
    };
    
    const result = await db.insert(users).values(userData).returning();
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

    await db.update(users).set({ xp: newXP, level: newLevel } as any).where(eq(users.id, userId));
  }

  async createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry> {
    console.log("createJournalEntry called with:", JSON.stringify(entry, null, 2));
    
    const wordCount = entry.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    console.log("Calculated word count:", wordCount);

    // Prepare entry data with all fields properly mapped
    const entryData = {
      userId: entry.userId,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      wordCount,
      fontFamily: entry.fontFamily || "Inter",
      fontSize: entry.fontSize || 16,
      textColor: entry.textColor || "#1f2937",
      backgroundColor: entry.backgroundColor || "#ffffff",
      isPrivate: entry.isPrivate || false,
      tags: entry.tags || [],
      photos: entry.photos || [],
      drawings: entry.drawings || [],
      location: entry.location || null,
      weather: entry.weather || null,
      aiInsights: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("About to insert entry data:", JSON.stringify(entryData, null, 2));
    
    try {
      const result = await db.insert(journalEntries).values(entryData).returning();
      console.log("Database insert successful, result:", JSON.stringify(result, null, 2));
      const newEntry = result[0];
      console.log("Returning new entry:", JSON.stringify(newEntry, null, 2));

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
    } catch (error) {
      console.error("Database insert failed:", error);
      throw error;
    }
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
    // Ensure required fields are present for achievement schema
    const achievementData = {
      userId: achievement.userId,
      achievementId: (achievement as any).achievementId || `achievement_${Date.now()}`,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon || "🏆",
      rarity: (achievement as any).rarity || "common",
      type: achievement.type,
      targetValue: (achievement as any).requirement || 0,
      currentValue: (achievement as any).currentValue || 0,
      unlockedAt: (achievement as any).unlockedAt || null
    };
    
    const result = await db.insert(achievements).values(achievementData).returning();
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
    await db.update(userStats).set({ ...stats as any, updatedAt: new Date() as any }).where(eq(userStats.userId, userId));
  }

  async createUserStats(userId: number): Promise<UserStats> {
    try {
      const result = await db.insert(userStats).values({ userId }).returning();
      return result[0];
    } catch (error: any) {
      // If user stats already exist, just return them
      if (error.code === '23505') {
        const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
        return result[0];
      }
      throw error;
    }
  }

  async recalculateUserStats(userId: number): Promise<void> {
    const entries = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.createdAt));

    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);

    let currentStreak = 0;
    let longestStreak = 0;

    if (entries.length > 0) {
      const today = new Date();
      const entryDates = entries.map(entry => {
        const date = entry.createdAt ? new Date(entry.createdAt) : new Date();
        return date.toDateString();
      });

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
      lastEntryDate: entries.length > 0 && entries[0].createdAt ? new Date(entries[0].createdAt) : null,
    });
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users).set({ ...updates as any, updatedAt: new Date() as any }).where(eq(users.id, id));
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
    await db.insert(userActivityLogs).values({ userId, action, details, ipAddress, userAgent } as any);
  }

  async getEmailCampaign(id: number): Promise<EmailCampaign | undefined> {
    const result = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id)).limit(1);
    return result[0];
  }

  async updateEmailCampaign(id: number, updates: Partial<EmailCampaign>): Promise<void> {
    await db.update(emailCampaigns).set({ ...updates as any, updatedAt: new Date() as any }).where(eq(emailCampaigns.id, id));
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
    await db.insert(siteSettings).values({ key, value, updatedBy } as any).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedBy, updatedAt: new Date() } as any
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
    // Ensure required fields are present for goal schema
    const goalData = {
      userId: goal.userId,
      goalId: (goal as any).goalId || `goal_${Date.now()}`,
      title: goal.title,
      description: goal.description || null,
      type: goal.type,
      difficulty: (goal as any).difficulty || 'beginner',
      targetValue: goal.targetValue,
      currentValue: (goal as any).currentValue || 0,
      isCompleted: (goal as any).isCompleted || false,
      deadline: goal.deadline || null,
      completedAt: (goal as any).completedAt || null
    };
    
    const result = await db.insert(goals).values(goalData).returning();
    return result[0];
  }

  async updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void> {
    await db.update(goals).set(updates).where(and(eq(goals.id, id), eq(goals.userId, userId)));
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
    const defaultGoals: Array<{
      title: string;
      description: string;
      type: string;
      targetValue: number;
      difficulty: string;
    }> = [
      // Beginner Goals (Easy)
      { title: "First Steps", description: "Write your very first journal entry", type: "entries", targetValue: 1, difficulty: "beginner" },
      { title: "Early Bird", description: "Complete 3 journal entries", type: "entries", targetValue: 3, difficulty: "beginner" },
      { title: "Getting Started", description: "Write 100 words total", type: "words", targetValue: 100, difficulty: "beginner" },
      { title: "Consistency", description: "Write for 2 days in a row", type: "streak", targetValue: 2, difficulty: "beginner" },
      { title: "Week Warrior", description: "Complete 7 journal entries", type: "entries", targetValue: 7, difficulty: "beginner" },
      { title: "Word Explorer", description: "Write 500 words total", type: "words", targetValue: 500, difficulty: "beginner" },
      
      // Intermediate Goals (Medium)
      { title: "Monthly Milestone", description: "Complete 30 journal entries", type: "entries", targetValue: 30, difficulty: "intermediate" },
      { title: "Wordsmith", description: "Write 5,000 words total", type: "words", targetValue: 5000, difficulty: "intermediate" },
      { title: "Streak Master", description: "Write for 30 days in a row", type: "streak", targetValue: 30, difficulty: "intermediate" },
      { title: "Reflection Champion", description: "Write in 5 different moods", type: "moods", targetValue: 5, difficulty: "intermediate" },
      { title: "Memory Keeper", description: "Upload 20 photos to your entries", type: "photos", targetValue: 20, difficulty: "intermediate" },
      { title: "Creative Writer", description: "Use 3 different writing styles", type: "styles", targetValue: 3, difficulty: "intermediate" },
      
      // Advanced Goals (Hard)
      { title: "Century Club", description: "Complete 100 journal entries", type: "entries", targetValue: 100, difficulty: "advanced" },
      { title: "Novelist", description: "Write 50,000 words total", type: "words", targetValue: 50000, difficulty: "advanced" },
      { title: "Dedication Master", description: "Write for 100 days in a row", type: "streak", targetValue: 100, difficulty: "advanced" },
      { title: "Mood Explorer", description: "Experience all available moods", type: "moods", targetValue: 12, difficulty: "advanced" },
      { title: "Visual Storyteller", description: "Upload 100 photos to your entries", type: "photos", targetValue: 100, difficulty: "advanced" },
      { title: "Mindfulness Guru", description: "Complete 50 reflection prompts", type: "prompts", targetValue: 50, difficulty: "advanced" },
      
      // Expert Goals (Very Hard)
      { title: "Grand Storyteller", description: "Complete 365 journal entries", type: "entries", targetValue: 365, difficulty: "expert" },
      { title: "Epic Novelist", description: "Write 100,000 words total", type: "words", targetValue: 100000, difficulty: "expert" },
      { title: "Year-Long Journey", description: "Write for 365 days in a row", type: "streak", targetValue: 365, difficulty: "expert" },
      { title: "Master Chronicler", description: "Upload 500 photos to your entries", type: "photos", targetValue: 500, difficulty: "expert" },
      
      // Legendary Goals (Extreme)
      { title: "Legendary Keeper", description: "Complete 1,000 journal entries", type: "entries", targetValue: 1000, difficulty: "legendary" },
      { title: "Master Wordsmith", description: "Write 500,000 words total", type: "words", targetValue: 500000, difficulty: "legendary" },
      { title: "Eternal Chronicler", description: "Write for 1,000 days in a row", type: "streak", targetValue: 1000, difficulty: "legendary" },
      { title: "Visual Master", description: "Upload 1,000 photos to your entries", type: "photos", targetValue: 1000, difficulty: "legendary" }
    ];

    const goalsToInsert = defaultGoals.map(goal => ({
      userId,
      goalId: `${goal.type}_${goal.targetValue}_${userId}`,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      difficulty: goal.difficulty,
      targetValue: goal.targetValue,
      currentValue: 0,
      isCompleted: false,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }));

    await db.insert(goals).values(goalsToInsert);
  }

  private async createDefaultAchievements(userId: number): Promise<void> {
    const defaultAchievements: Array<{
      achievementId: string;
      title: string;
      description: string;
      type: string;
      requirement: number;
      rarity: string;
      icon: string;
    }> = [
      // Getting Started (Common)
      { achievementId: "welcome", title: "Welcome to JournOwl! 🦉", description: "You've taken your first step into the world of journaling", type: "getting_started", requirement: 1, rarity: "common", icon: "🌟" },
      { achievementId: "first_entry", title: "First Entry", description: "Write your very first journal entry", type: "entries", requirement: 1, rarity: "common", icon: "✍️" },
      { achievementId: "early_bird", title: "Early Bird", description: "Complete 3 journal entries", type: "entries", requirement: 3, rarity: "common", icon: "🐦" },
      { achievementId: "word_starter", title: "Word Starter", description: "Write 100 words total", type: "words", requirement: 100, rarity: "common", icon: "📝" },
      
      // Consistency (Rare)
      { achievementId: "two_day_streak", title: "Consistency", description: "Write for 2 days in a row", type: "streak", requirement: 2, rarity: "rare", icon: "🔥" },
      { achievementId: "week_warrior", title: "Week Warrior", description: "Complete 7 journal entries", type: "entries", requirement: 7, rarity: "rare", icon: "⚔️" },
      { achievementId: "word_explorer", title: "Word Explorer", description: "Write 500 words total", type: "words", requirement: 500, rarity: "rare", icon: "🗺️" },
      { achievementId: "seven_day_streak", title: "Week Streak", description: "Write for 7 days in a row", type: "streak", requirement: 7, rarity: "rare", icon: "📅" },
      
      // Intermediate (Epic)
      { achievementId: "month_milestone", title: "Monthly Milestone", description: "Complete 30 journal entries", type: "entries", requirement: 30, rarity: "epic", icon: "🏆" },
      { achievementId: "wordsmith", title: "Wordsmith", description: "Write 5,000 words total", type: "words", requirement: 5000, rarity: "epic", icon: "✒️" },
      { achievementId: "streak_master", title: "Streak Master", description: "Write for 30 days in a row", type: "streak", requirement: 30, rarity: "epic", icon: "🔥" },
      { achievementId: "photo_memories", title: "Memory Keeper", description: "Upload 20 photos to your entries", type: "photos", requirement: 20, rarity: "epic", icon: "📸" },
      
      // Advanced (Legendary)
      { achievementId: "century_club", title: "Century Club", description: "Complete 100 journal entries", type: "entries", requirement: 100, rarity: "legendary", icon: "💯" },
      { achievementId: "novelist", title: "Novelist", description: "Write 50,000 words total", type: "words", requirement: 50000, rarity: "legendary", icon: "📚" },
      { achievementId: "dedication_master", title: "Dedication Master", description: "Write for 100 days in a row", type: "streak", requirement: 100, rarity: "legendary", icon: "👑" },
      { achievementId: "visual_storyteller", title: "Visual Storyteller", description: "Upload 100 photos to your entries", type: "photos", requirement: 100, rarity: "legendary", icon: "🎨" },
      
      // Expert (Mythical)
      { achievementId: "grand_storyteller", title: "Grand Storyteller", description: "Complete 365 journal entries", type: "entries", requirement: 365, rarity: "mythical", icon: "📖" },
      { achievementId: "epic_novelist", title: "Epic Novelist", description: "Write 100,000 words total", type: "words", requirement: 100000, rarity: "mythical", icon: "🏛️" },
      { achievementId: "year_journey", title: "Year-Long Journey", description: "Write for 365 days in a row", type: "streak", requirement: 365, rarity: "mythical", icon: "🌟" },
      { achievementId: "master_chronicler", title: "Master Chronicler", description: "Upload 500 photos to your entries", type: "photos", requirement: 500, rarity: "mythical", icon: "📜" },
      
      // Ultimate (Divine)
      { achievementId: "legendary_keeper", title: "Legendary Keeper", description: "Complete 1,000 journal entries", type: "entries", requirement: 1000, rarity: "divine", icon: "👑" },
      { achievementId: "master_wordsmith", title: "Master Wordsmith", description: "Write 500,000 words total", type: "words", requirement: 500000, rarity: "divine", icon: "⚡" },
      { achievementId: "eternal_chronicler", title: "Eternal Chronicler", description: "Write for 1,000 days in a row", type: "streak", requirement: 1000, rarity: "divine", icon: "🌌" },
      { achievementId: "visual_master", title: "Visual Master", description: "Upload 1,000 photos to your entries", type: "photos", requirement: 1000, rarity: "divine", icon: "🎭" }
    ];

    const achievementsToInsert = defaultAchievements.map(achievement => ({
      userId,
      achievementId: achievement.achievementId,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      rarity: achievement.rarity,
      type: achievement.type,
      targetValue: achievement.requirement,
      currentValue: 0,
      unlockedAt: null
    }));

    await db.insert(achievements).values(achievementsToInsert);
  }

  async createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage> {
    // Ensure required fields are present
    const messageData = {
      userId: message.userId!,
      message: message.message!,
      sender: message.sender!,
      attachmentUrl: message.attachmentUrl || null,
      attachmentType: message.attachmentType || null,
      adminName: message.adminName || null,
      isRead: message.isRead || false
    };
    
    const [newMessage] = await db.insert(supportMessages).values(messageData).returning();
    return newMessage;
  }

  async getSupportMessages(userId: number): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages).where(eq(supportMessages.userId, userId)).orderBy(desc(supportMessages.createdAt));
  }

  async getAllSupportMessages(): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));
  }

  async markSupportMessageAsRead(id: number): Promise<void> {
    await db.update(supportMessages).set({ isRead: true } as any).where(eq(supportMessages.id, id));
  }

  async getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    if (user.promptsRemaining == null) {
      await db.update(users).set({ promptsRemaining: 100, promptsUsedThisMonth: 0 } as any).where(eq(users.id, userId));
      return { promptsRemaining: 100, promptsUsedThisMonth: 0, currentPlan: user.currentPlan || "free" };
    }

    return { promptsRemaining: user.promptsRemaining || 0, promptsUsedThisMonth: user.promptsUsedThisMonth || 0, currentPlan: user.currentPlan || "free" };
  }

  async incrementPromptUsage(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    if ((user.promptsRemaining || 0) <= 0) throw new Error("No prompts remaining");

    await db.update(users)
      .set({ promptsUsedThisMonth: (user.promptsUsedThisMonth || 0) + 1, promptsRemaining: (user.promptsRemaining || 0) - 1 } as any)
      .where(eq(users.id, userId));
  }

  async addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void> {
    await db.insert(promptPurchases).values({ userId, stripePaymentId, amount, promptsAdded, status: "completed" } as any);
    await this.updateUserPrompts(userId, promptsAdded);
  }

  async updateUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    await db.update(users).set({ promptsRemaining: (user.promptsRemaining || 0) + promptsToAdd } as any).where(eq(users.id, userId));
  }

  async resetMonthlyUsage(): Promise<void> {
    await db.update(users).set({ promptsUsedThisMonth: 0, lastUsageReset: new Date() } as any);
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
      currentPlan: tier,
      promptsRemaining: promptsRemaining,
      storageUsedMB: 0, // Reset storage when changing plans
      updatedAt: new Date()
    } as any).where(eq(users.id, userId));
  }

  async updateStorageUsage(userId: number, additionalMB: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newUsage = (user.storageUsedMB || 0) + additionalMB;
    await db.update(users).set({ storageUsedMB: newUsage } as any).where(eq(users.id, userId));
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    // Note: referralCode column doesn't exist in current schema, using username as fallback
    const result = await db.select().from(users).where(eq(users.username, referralCode)).limit(1);
    return result[0];
  }

  async addUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newPrompts = (user.promptsRemaining || 0) + promptsToAdd;
    await db.update(users).set({ promptsRemaining: newPrompts } as any).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
