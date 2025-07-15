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

// Use Replit PostgreSQL database with SSL
const dbUrl = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
const client = postgres(dbUrl);
const db = drizzle(client);

export interface IStorage {
  // User operations
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

  // Journal operations
  createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry>;
  getJournalEntries(userId: number, limit?: number): Promise<JournalEntry[]>;
  getJournalEntry(id: number, userId: number): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: number, userId: number, entry: Partial<InsertJournalEntry>): Promise<void>;
  deleteJournalEntry(id: number, userId: number): Promise<void>;

  // Achievement operations
  createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;

  // Stats operations
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<void>;
  createUserStats(userId: number): Promise<UserStats>;
  recalculateUserStats(userId: number): Promise<void>;

  // Goal operations
  getUserGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal & { userId: number }): Promise<Goal>;
  updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void>;

  // Admin operations
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
  
  // Support operations
  createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage>;
  getSupportMessages(userId: number): Promise<SupportMessage[]>;
  getAllSupportMessages(): Promise<SupportMessage[]>;
  markSupportMessageAsRead(id: number): Promise<void>;
  
  // Prompt usage and purchasing operations
  getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }>;
  incrementPromptUsage(userId: number): Promise<void>;
  addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void>;
  resetMonthlyUsage(): Promise<void>;
  updateUserPrompts(userId: number, promptsToAdd: number): Promise<void>;
  
  // Subscription operations
  updateUserSubscription(userId: number, subscription: { tier: string; status: string; expiresAt: Date; stripeSubscriptionId: string }): Promise<void>;
  updateStorageUsage(userId: number, additionalMB: number): Promise<void>;
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

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    const newUser = result[0];
    
    // Create initial user stats
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
    
    const result = await db.insert(journalEntries).values({
      ...entry,
      wordCount,
    }).returning();

    const newEntry = result[0];

    // Update user stats
    const stats = await this.getUserStats(entry.userId);
    if (stats) {
      const today = new Date();
      const lastEntry = stats.lastEntryDate ? new Date(stats.lastEntryDate) : null;
      
      let currentStreak = stats.currentStreak || 0;
      if (lastEntry) {
        const daysDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak += 1;
        } else if (daysDiff > 1) {
          currentStreak = 1;
        }
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

    // Award XP
    await this.updateUserXP(entry.userId, 50 + Math.floor(wordCount / 10));

    return newEntry;
  }

  async getJournalEntries(userId: number, limit = 10): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async getJournalEntry(id: number, userId: number): Promise<JournalEntry | undefined> {
    const result = await db.select().from(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
      .limit(1);
    return result[0];
  }

  async updateJournalEntry(id: number, userId: number, entry: Partial<InsertJournalEntry>): Promise<void> {
    const updateData: any = { ...entry, updatedAt: new Date() };
    
    if (entry.content) {
      updateData.wordCount = entry.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    await db.update(journalEntries)
      .set(updateData)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async deleteJournalEntry(id: number, userId: number): Promise<void> {
    await db.delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async updateAchievement(id: number, updates: Partial<Achievement>): Promise<void> {
    await db.update(achievements)
      .set(updates)
      .where(eq(achievements.id, id));
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const result = await db.select().from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
    
    // If user has no achievements except welcome, create default achievements  
    const nonWelcomeAchievements = result.filter(a => a.category !== 'getting_started');
    if (nonWelcomeAchievements.length === 0) {
      await this.createDefaultAchievements(userId);
      return await db.select().from(achievements)
        .where(eq(achievements.userId, userId))
        .orderBy(desc(achievements.unlockedAt));
    }
    
    return result;
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserStats(userId: number, stats: Partial<UserStats>): Promise<void> {
    await db.update(userStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(userStats.userId, userId));
  }

  async createUserStats(userId: number): Promise<UserStats> {
    const result = await db.insert(userStats).values({ userId }).returning();
    return result[0];
  }

  async recalculateUserStats(userId: number): Promise<void> {
    // Get all journal entries for this user
    const entries = await db.select().from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
    
    // Calculate total entries and words
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let consecutiveDays = 0;
    
    if (entries.length > 0) {
      const today = new Date();
      const entryDates = entries.map(entry => {
        const date = new Date(entry.createdAt);
        return date.toDateString();
      });
      
      // Remove duplicates and sort
      const uniqueDates = [...new Set(entryDates)].sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      // Calculate current streak from today backwards
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
      
      // Calculate longest streak
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
    
    // Update user stats
    await this.updateUserStats(userId, {
      totalEntries,
      totalWords,
      currentStreak,
      longestStreak,
      lastEntryDate: entries.length > 0 ? new Date(entries[0].createdAt) : null,
    });
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getActiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return await db.select().from(users)
      .where(gte(users.lastLoginAt, thirtyDaysAgo))
      .orderBy(desc(users.lastLoginAt));
  }

  async getInactiveUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return await db.select().from(users)
      .where(sql`${users.lastLoginAt} IS NULL OR ${users.lastLoginAt} < ${thirtyDaysAgo}`)
      .orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users)
      .where(eq(users.role, role))
      .orderBy(desc(users.createdAt));
  }

  async logUserActivity(userId: number, action: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void> {
    await db.insert(userActivityLogs).values({
      userId,
      action,
      details,
      ipAddress,
      userAgent
    });
  }

  async getEmailCampaign(id: number): Promise<EmailCampaign | undefined> {
    const result = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id)).limit(1);
    return result[0];
  }

  async updateEmailCampaign(id: number, updates: Partial<EmailCampaign>): Promise<void> {
    await db.update(emailCampaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailCampaigns.id, id));
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
    await db.insert(siteSettings)
      .values({ key, value, updatedBy })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedBy, updatedAt: new Date() }
      });
  }

  async getUserActivityLogs(userId?: number, limit = 100): Promise<UserActivityLog[]> {
    if (userId) {
      return await db.select().from(userActivityLogs)
        .where(eq(userActivityLogs.userId, userId))
        .orderBy(desc(userActivityLogs.createdAt))
        .limit(limit);
    }
    
    return await db.select().from(userActivityLogs)
      .orderBy(desc(userActivityLogs.createdAt))
      .limit(limit);
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

  // Goal operations
  async getUserGoals(userId: number): Promise<Goal[]> {
    const result = await db.select().from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(goals.createdAt);
    
    // If user has no goals, create default goals
    if (result.length === 0) {
      await this.createDefaultGoals(userId);
      return await db.select().from(goals)
        .where(eq(goals.userId, userId))
        .orderBy(goals.createdAt);
    }
    
    return result;
  }

  async createGoal(goal: InsertGoal & { userId: number }): Promise<Goal> {
    const result = await db.insert(goals).values(goal).returning();
    return result[0];
  }

  async updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void> {
    await db.update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  async getGoalByGoalId(userId: number, goalId: string): Promise<Goal | undefined> {
    const result = await db.select().from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.goalId, goalId)))
      .limit(1);
    return result[0];
  }

  async getAchievementByAchievementId(userId: number, achievementId: string): Promise<Achievement | undefined> {
    const result = await db.select().from(achievements)
      .where(and(eq(achievements.userId, userId), eq(achievements.achievementId, achievementId)))
      .limit(1);
    return result[0];
  }

  private async createDefaultGoals(userId: number): Promise<void> {
    const defaultGoals = [
      // Beginner Goals (Easy)
      { title: "First Steps", description: "Write your very first journal entry", type: "entries", targetValue: 1, difficulty: "beginner" },
      { title: "Early Bird", description: "Complete 3 journal entries", type: "entries", targetValue: 3, difficulty: "beginner" },
      { title: "Getting Started", description: "Write 100 words total", type: "words", targetValue: 100, difficulty: "beginner" },
      { title: "Consistency", description: "Write for 2 days in a row", type: "streak", targetValue: 2, difficulty: "beginner" },
      { title: "Week Warrior", description: "Complete 7 journal entries", type: "entries", targetValue: 7, difficulty: "beginner" },
      { title: "Word Explorer", description: "Write 500 words total", type: "words", targetValue: 500, difficulty: "beginner" },
      { title: "Streak Starter", description: "Maintain a 3-day writing streak", type: "streak", targetValue: 3, difficulty: "beginner" },
      { title: "Dedicated Writer", description: "Write for 7 consecutive days", type: "streak", targetValue: 7, difficulty: "beginner" },
      { title: "Momentum Builder", description: "Complete 14 journal entries", type: "entries", targetValue: 14, difficulty: "beginner" },
      { title: "Word Collector", description: "Write 1,000 words total", type: "words", targetValue: 1000, difficulty: "beginner" },

      // Intermediate Goals (Medium)
      { title: "Monthly Habit", description: "Write for 14 consecutive days", type: "streak", targetValue: 14, difficulty: "intermediate" },
      { title: "Prolific Writer", description: "Complete 30 journal entries", type: "entries", targetValue: 30, difficulty: "intermediate" },
      { title: "Word Smith", description: "Write 2,500 words total", type: "words", targetValue: 2500, difficulty: "intermediate" },
      { title: "Three Week Wonder", description: "Maintain a 21-day writing streak", type: "streak", targetValue: 21, difficulty: "intermediate" },
      { title: "Story Teller", description: "Write 5,000 words total", type: "words", targetValue: 5000, difficulty: "intermediate" },
      { title: "Dedicated Journaler", description: "Complete 50 journal entries", type: "entries", targetValue: 50, difficulty: "intermediate" },
      { title: "Monthly Master", description: "Write for 30 consecutive days", type: "streak", targetValue: 30, difficulty: "intermediate" },
      { title: "Word Warrior", description: "Write 7,500 words total", type: "words", targetValue: 7500, difficulty: "intermediate" },
      { title: "Reflection Expert", description: "Complete 75 journal entries", type: "entries", targetValue: 75, difficulty: "intermediate" },
      { title: "Novelist Dreams", description: "Write 10,000 words total", type: "words", targetValue: 10000, difficulty: "intermediate" },

      // Advanced Goals (Hard)
      { title: "Quarter Master", description: "Write for 90 consecutive days", type: "streak", targetValue: 90, difficulty: "advanced" },
      { title: "Century Club", description: "Complete 100 journal entries", type: "entries", targetValue: 100, difficulty: "advanced" },
      { title: "Epic Novelist", description: "Write 25,000 words total", type: "words", targetValue: 25000, difficulty: "advanced" },
      { title: "Habit Master", description: "Maintain a 60-day writing streak", type: "streak", targetValue: 60, difficulty: "advanced" },
      { title: "Journal Veteran", description: "Complete 150 journal entries", type: "entries", targetValue: 150, difficulty: "advanced" },
      { title: "Word Marathon", description: "Write 50,000 words total", type: "words", targetValue: 50000, difficulty: "advanced" },
      { title: "Seasonal Dedication", description: "Write for 120 consecutive days", type: "streak", targetValue: 120, difficulty: "advanced" },
      { title: "Reflection Master", description: "Complete 200 journal entries", type: "entries", targetValue: 200, difficulty: "advanced" },
      { title: "Bestseller Potential", description: "Write 75,000 words total", type: "words", targetValue: 75000, difficulty: "advanced" },
      { title: "Annual Commitment", description: "Write for 180 consecutive days", type: "streak", targetValue: 180, difficulty: "advanced" },

      // Expert Goals (Very Hard)
      { title: "Year-Long Journey", description: "Write for 365 consecutive days", type: "streak", targetValue: 365, difficulty: "expert" },
      { title: "Publishing Ready", description: "Write 100,000 words total", type: "words", targetValue: 100000, difficulty: "expert" },
      { title: "Journal Legend", description: "Complete 365 journal entries", type: "entries", targetValue: 365, difficulty: "expert" },
      { title: "Unwavering Dedication", description: "Maintain a 200-day writing streak", type: "streak", targetValue: 200, difficulty: "expert" },
      { title: "Literary Giant", description: "Write 150,000 words total", type: "words", targetValue: 150000, difficulty: "expert" },
      { title: "Master Journaler", description: "Complete 500 journal entries", type: "entries", targetValue: 500, difficulty: "expert" },
      { title: "Consistency Champion", description: "Write for 300 consecutive days", type: "streak", targetValue: 300, difficulty: "expert" },
      { title: "Word Virtuoso", description: "Write 200,000 words total", type: "words", targetValue: 200000, difficulty: "expert" },
      { title: "Reflection Sage", description: "Complete 750 journal entries", type: "entries", targetValue: 750, difficulty: "expert" },
      { title: "Eternal Writer", description: "Write for 500 consecutive days", type: "streak", targetValue: 500, difficulty: "expert" },

      // Legendary Goals (Extreme)
      { title: "Millennium Marker", description: "Complete 1,000 journal entries", type: "entries", targetValue: 1000, difficulty: "legendary" },
      { title: "Novel Collection", description: "Write 250,000 words total", type: "words", targetValue: 250000, difficulty: "legendary" },
      { title: "Two Year Journey", description: "Write for 730 consecutive days", type: "streak", targetValue: 730, difficulty: "legendary" },
      { title: "Epic Chronicler", description: "Complete 1,500 journal entries", type: "entries", targetValue: 1500, difficulty: "legendary" },
      { title: "Master Wordsmith", description: "Write 500,000 words total", type: "words", targetValue: 500000, difficulty: "legendary" },
      { title: "Three Year Dedication", description: "Write for 1,095 consecutive days", type: "streak", targetValue: 1095, difficulty: "legendary" },
      { title: "Journal Immortal", description: "Complete 2,000 journal entries", type: "entries", targetValue: 2000, difficulty: "legendary" },
      { title: "Literary Legend", description: "Write 750,000 words total", type: "words", targetValue: 750000, difficulty: "legendary" },
      { title: "Lifetime Commitment", description: "Write for 1,500 consecutive days", type: "streak", targetValue: 1500, difficulty: "legendary" },
      { title: "Word God", description: "Write 1,000,000 words total", type: "words", targetValue: 1000000, difficulty: "legendary" }
    ];

    const goalsToInsert = defaultGoals.map(goal => ({
      ...goal,
      userId,
      currentValue: 0,
      isCompleted: false,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    }));

    await db.insert(goals).values(goalsToInsert);
  }

  private async createDefaultAchievements(userId: number): Promise<void> {
    const defaultAchievements = [
      // Beginner Achievements (Common)
      { title: "First Words", description: "Write your very first journal entry", icon: "✍️", category: "writing", rarity: "common", xpReward: 50, condition: "entries:1" },
      { title: "Early Bird", description: "Write 3 journal entries", icon: "🐦", category: "writing", rarity: "common", xpReward: 100, condition: "entries:3" },
      { title: "Word Explorer", description: "Write 100 words total", icon: "🔍", category: "words", rarity: "common", xpReward: 75, condition: "words:100" },
      { title: "Consistency Starter", description: "Write for 2 days in a row", icon: "🔥", category: "streaks", rarity: "common", xpReward: 100, condition: "streak:2" },
      { title: "Week Warrior", description: "Write 7 journal entries", icon: "⚔️", category: "writing", rarity: "common", xpReward: 150, condition: "entries:7" },
      { title: "Mood Tracker", description: "Record your mood in 5 entries", icon: "😊", category: "mood", rarity: "common", xpReward: 75, condition: "mood_entries:5" },
      { title: "Reflection Rookie", description: "Write for 3 consecutive days", icon: "🤔", category: "streaks", rarity: "common", xpReward: 125, condition: "streak:3" },
      { title: "Wordsmith Apprentice", description: "Write 500 words total", icon: "📝", category: "words", rarity: "common", xpReward: 100, condition: "words:500" },
      { title: "Dedication Beginner", description: "Write for a full week", icon: "💪", category: "streaks", rarity: "common", xpReward: 200, condition: "streak:7" },
      { title: "Story Starter", description: "Complete 10 journal entries", icon: "📖", category: "writing", rarity: "common", xpReward: 175, condition: "entries:10" },

      // Intermediate Achievements (Rare)
      { title: "Monthly Habit", description: "Write for 14 consecutive days", icon: "📅", category: "streaks", rarity: "rare", xpReward: 300, condition: "streak:14" },
      { title: "Prolific Writer", description: "Complete 25 journal entries", icon: "✏️", category: "writing", rarity: "rare", xpReward: 250, condition: "entries:25" },
      { title: "Word Collector", description: "Write 1,000 words total", icon: "💎", category: "words", rarity: "rare", xpReward: 200, condition: "words:1000" },
      { title: "Mood Master", description: "Track mood in 20 entries", icon: "🎭", category: "mood", rarity: "rare", xpReward: 175, condition: "mood_entries:20" },
      { title: "Three Week Wonder", description: "Write for 21 consecutive days", icon: "🌟", category: "streaks", rarity: "rare", xpReward: 400, condition: "streak:21" },
      { title: "Chronicle Keeper", description: "Complete 50 journal entries", icon: "📚", category: "writing", rarity: "rare", xpReward: 350, condition: "entries:50" },
      { title: "Word Warrior", description: "Write 2,500 words total", icon: "⚡", category: "words", rarity: "rare", xpReward: 300, condition: "words:2500" },
      { title: "Emotional Intelligence", description: "Track mood in 35 entries", icon: "🧠", category: "mood", rarity: "rare", xpReward: 250, condition: "mood_entries:35" },
      { title: "Monthly Master", description: "Write for 30 consecutive days", icon: "👑", category: "streaks", rarity: "rare", xpReward: 500, condition: "streak:30" },
      { title: "Storyteller", description: "Write 5,000 words total", icon: "📜", category: "words", rarity: "rare", xpReward: 400, condition: "words:5000" },

      // Advanced Achievements (Epic)
      { title: "Dedication Expert", description: "Write for 60 consecutive days", icon: "🏆", category: "streaks", rarity: "epic", xpReward: 750, condition: "streak:60" },
      { title: "Century Club", description: "Complete 100 journal entries", icon: "💯", category: "writing", rarity: "epic", xpReward: 600, condition: "entries:100" },
      { title: "Novel Dreamer", description: "Write 10,000 words total", icon: "📕", category: "words", rarity: "epic", xpReward: 500, condition: "words:10000" },
      { title: "Mood Scientist", description: "Track mood in 75 entries", icon: "🔬", category: "mood", rarity: "epic", xpReward: 400, condition: "mood_entries:75" },
      { title: "Quarter Master", description: "Write for 90 consecutive days", icon: "🎯", category: "streaks", rarity: "epic", xpReward: 1000, condition: "streak:90" },
      { title: "Journal Veteran", description: "Complete 150 journal entries", icon: "🎖️", category: "writing", rarity: "epic", xpReward: 750, condition: "entries:150" },
      { title: "Word Architect", description: "Write 25,000 words total", icon: "🏗️", category: "words", rarity: "epic", xpReward: 750, condition: "words:25000" },
      { title: "Emotion Explorer", description: "Track mood in 100 entries", icon: "🗺️", category: "mood", rarity: "epic", xpReward: 500, condition: "mood_entries:100" },
      { title: "Seasonal Dedication", description: "Write for 120 consecutive days", icon: "🌺", category: "streaks", rarity: "epic", xpReward: 1250, condition: "streak:120" },
      { title: "Epic Chronicler", description: "Complete 200 journal entries", icon: "📔", category: "writing", rarity: "epic", xpReward: 900, condition: "entries:200" },

      // Expert Achievements (Legendary)
      { title: "Half Year Hero", description: "Write for 180 consecutive days", icon: "🦸", category: "streaks", rarity: "legendary", xpReward: 2000, condition: "streak:180" },
      { title: "Master Journaler", description: "Complete 365 journal entries", icon: "🎓", category: "writing", rarity: "legendary", xpReward: 1500, condition: "entries:365" },
      { title: "Novelist", description: "Write 50,000 words total", icon: "📗", category: "words", rarity: "legendary", xpReward: 1200, condition: "words:50000" },
      { title: "Mood Oracle", description: "Track mood in 200 entries", icon: "🔮", category: "mood", rarity: "legendary", xpReward: 800, condition: "mood_entries:200" },
      { title: "Annual Commitment", description: "Write for 270 consecutive days", icon: "📆", category: "streaks", rarity: "legendary", xpReward: 2500, condition: "streak:270" },
      { title: "Reflection Master", description: "Complete 500 journal entries", icon: "🏅", category: "writing", rarity: "legendary", xpReward: 2000, condition: "entries:500" },
      { title: "Epic Novelist", description: "Write 100,000 words total", icon: "📘", category: "words", rarity: "legendary", xpReward: 2000, condition: "words:100000" },
      { title: "Emotional Sage", description: "Track mood in 300 entries", icon: "🧙", category: "mood", rarity: "legendary", xpReward: 1200, condition: "mood_entries:300" },
      { title: "Year-Long Journey", description: "Write for 365 consecutive days", icon: "🌟", category: "streaks", rarity: "legendary", xpReward: 3000, condition: "streak:365" },
      { title: "Diary Dynasty", description: "Complete 750 journal entries", icon: "👑", category: "writing", rarity: "legendary", xpReward: 2500, condition: "entries:750" },

      // Mythical Achievements (Mythical)
      { title: "Eternal Writer", description: "Write for 500 consecutive days", icon: "♾️", category: "streaks", rarity: "mythical", xpReward: 5000, condition: "streak:500" },
      { title: "Millennium Marker", description: "Complete 1,000 journal entries", icon: "🌌", category: "writing", rarity: "mythical", xpReward: 4000, condition: "entries:1000" },
      { title: "Literary Legend", description: "Write 250,000 words total", icon: "🏛️", category: "words", rarity: "mythical", xpReward: 3500, condition: "words:250000" },
      { title: "Mood Mystic", description: "Track mood in 500 entries", icon: "🌙", category: "mood", rarity: "mythical", xpReward: 2000, condition: "mood_entries:500" },
      { title: "Two Year Trek", description: "Write for 730 consecutive days", icon: "🗻", category: "streaks", rarity: "mythical", xpReward: 6000, condition: "streak:730" },
      { title: "Chronicle Champion", description: "Complete 1,500 journal entries", icon: "🏆", category: "writing", rarity: "mythical", xpReward: 5000, condition: "entries:1500" },
      { title: "Word Deity", description: "Write 500,000 words total", icon: "⚡", category: "words", rarity: "mythical", xpReward: 5000, condition: "words:500000" },
      { title: "Emotion Enlightened", description: "Track mood in 750 entries", icon: "✨", category: "mood", rarity: "mythical", xpReward: 3000, condition: "mood_entries:750" },
      { title: "Three Year Triumph", description: "Write for 1,095 consecutive days", icon: "🌈", category: "streaks", rarity: "mythical", xpReward: 7500, condition: "streak:1095" },
      { title: "Immortal Chronicler", description: "Complete 2,000 journal entries", icon: "👼", category: "writing", rarity: "mythical", xpReward: 6000, condition: "entries:2000" },
      { title: "Master Wordsmith", description: "Write 1,000,000 words total", icon: "🔱", category: "words", rarity: "mythical", xpReward: 10000, condition: "words:1000000" },
      { title: "Mood Transcendent", description: "Track mood in 1,000 entries", icon: "🌟", category: "mood", rarity: "mythical", xpReward: 4000, condition: "mood_entries:1000" }
    ];

    const achievementsToInsert = defaultAchievements.map(achievement => ({
      ...achievement,
      userId,
      unlockedAt: null // Not unlocked yet
    }));

    await db.insert(achievements).values(achievementsToInsert);
  }

  // Support operations
  async createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage> {
    const [newMessage] = await db
      .insert(supportMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getSupportMessages(userId: number): Promise<SupportMessage[]> {
    return await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.userId, userId))
      .orderBy(desc(supportMessages.createdAt));
  }

  async getAllSupportMessages(): Promise<SupportMessage[]> {
    return await db
      .select()
      .from(supportMessages)
      .orderBy(desc(supportMessages.createdAt));
  }

  async markSupportMessageAsRead(id: number): Promise<void> {
    await db
      .update(supportMessages)
      .set({ isRead: true })
      .where(eq(supportMessages.id, id));
  }

  // Prompt usage and purchasing operations
  async getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // For users that were created before prompt tracking was implemented, reset them to 100
    if (user.promptsRemaining === null || user.promptsRemaining === undefined) {
      await db.update(users).set({ 
        promptsRemaining: 100,
        promptsUsedThisMonth: 0 
      }).where(eq(users.id, userId));
      
      return {
        promptsRemaining: 100,
        promptsUsedThisMonth: 0,
        currentPlan: user.currentPlan || 'free'
      };
    }
    
    return {
      promptsRemaining: user.promptsRemaining || 0,
      promptsUsedThisMonth: user.promptsUsedThisMonth || 0,
      currentPlan: user.currentPlan || 'free'
    };
  }

  async incrementPromptUsage(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    // Check if user has prompts remaining
    if ((user.promptsRemaining || 0) <= 0) {
      throw new Error('No prompts remaining');
    }

    await db.update(users)
      .set({ 
        promptsUsedThisMonth: (user.promptsUsedThisMonth || 0) + 1,
        promptsRemaining: (user.promptsRemaining || 0) - 1
      })
      .where(eq(users.id, userId));
  }

  async addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void> {
    // Record the purchase
    await db.insert(promptPurchases).values({
      userId,
      stripePaymentId,
      amount,
      promptsAdded,
      status: 'completed'
    });

    // Add prompts to user's account
    await this.updateUserPrompts(userId, promptsAdded);
  }

  async updateUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    await db.update(users)
      .set({ 
        promptsRemaining: (user.promptsRemaining || 0) + promptsToAdd
      })
      .where(eq(users.id, userId));
  }

  async resetMonthlyUsage(): Promise<void> {
    // Reset monthly usage for all users on the 1st of each month
    await db.update(users)
      .set({ 
        promptsUsedThisMonth: 0,
        lastUsageReset: new Date()
      });
  }

  async updateUserSubscription(userId: number, subscription: { 
    tier: string; 
    status: string; 
    expiresAt: Date; 
    stripeSubscriptionId: string 
  }): Promise<void> {
    const { tier, status, expiresAt, stripeSubscriptionId } = subscription;
    
    // Set storage and prompt limits based on tier
    let storageLimit = 100; // Default free tier
    let promptsRemaining = 100;
    
    if (tier === 'premium') {
      storageLimit = 1024; // 1GB
      promptsRemaining = 1000;
    } else if (tier === 'pro') {
      storageLimit = 10240; // 10GB
      promptsRemaining = 999999; // Unlimited (very high number)
    }
    
    await db.update(users)
      .set({
        subscription_tier: tier,
        subscription_status: status,
        subscription_expires_at: expiresAt,
        storage_limit_mb: storageLimit,
        prompts_remaining: promptsRemaining,
        stripe_subscription_id: stripeSubscriptionId
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
