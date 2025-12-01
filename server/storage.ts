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
  weeklyChallenges,
  userChallengeProgress,
  organizations,
  organizationMembers,
  pendingInvitations,
  complianceExports,
  complianceDeletions,
  auditLogs,
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
import { eq, desc, sql, and, gte, lt } from "drizzle-orm";
import crypto from 'crypto';

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
  calculateActualStorageUsage(userId: number): Promise<number>;
  refreshUserStorageUsage(userId: number): Promise<number>;

  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  addUserPrompts(userId: number, promptsToAdd: number): Promise<void>;

  // Weekly Challenges
  getActiveWeeklyChallenges(): Promise<any[]>;
  getUserChallengeProgress(userId: number, challengeId: number): Promise<any | undefined>;
  updateChallengeProgress(userId: number, challengeId: number, progress: number, isCompleted: boolean): Promise<void>;

  // Email Reminders
  getEmailReminderPreferences(userId: number): Promise<any[]>;
  updateEmailReminder(userId: number, type: string, updates: Partial<any>): Promise<void>;

  // Organization Management
  getOrganization(id: number): Promise<any | undefined>;
  getOrganizationMembers(organizationId: number): Promise<any[]>;
  getOrganizationMember(organizationId: number, userId: number): Promise<any | undefined>;
  updateOrganization(id: number, updates: Partial<any>): Promise<void>;
  createOrganizationMember(organizationId: number, userId: number, role: string): Promise<void>;
  updateOrganizationMemberRole(organizationId: number, userId: number, role: string): Promise<void>;
  removeOrganizationMember(organizationId: number, userId: number): Promise<void>;

  // Pending Invitations
  createPendingInvitation(organizationId: number, email: string, role: string, invitedBy: number, expiresAt: Date): Promise<any>;
  getPendingInvitation(token: string): Promise<any | undefined>;
  getPendingInvitationsByOrg(organizationId: number): Promise<any[]>;
  acceptInvitation(invitationId: number, userId: number): Promise<void>;
  expireInvitations(): Promise<void>;

  // Compliance
  createComplianceExport(organizationId: number, userId: number, requestedBy: number, format: string): Promise<any>;
  getComplianceExports(organizationId: number): Promise<any[]>;
  updateComplianceExportStatus(id: number, status: string, downloadUrl?: string): Promise<void>;
  
  createComplianceDeletion(organizationId: number, userId: number, requestedBy: number, reason?: string): Promise<any>;
  getComplianceDeletions(organizationId: number): Promise<any[]>;
  updateComplianceDeletionStatus(id: number, status: string): Promise<void>;
  approveDeletion(id: number): Promise<void>;

  // Audit Logging
  createAuditLog(organizationId: number, actorId: number | null, actorType: string, action: string, resourceType?: string, resourceId?: number, details?: any, ipAddress?: string, userAgent?: string): Promise<void>;
  getAuditLogs(organizationId: number, limit?: number): Promise<any[]>;

  // Analytics
  getTeamAnalytics(organizationId: number): Promise<any>;
  getManagerDashboardData(organizationId: number): Promise<any>;

  // Notification Preferences
  getUserNotificationPreferences(userId: number, organizationId: number): Promise<any | undefined>;
  updateNotificationPreferences(userId: number, organizationId: number, preferences: any): Promise<void>;
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
    // Cap XP addition at reasonable values to prevent overflow
    const safeXP = Math.min(Math.max(xp, 0), 1000); // Limit XP gain to max 1000 per operation
    const newXP = Math.min(currentXP + safeXP, 999999); // Cap total XP at 999,999
    const newLevel = Math.floor(newXP / 1000) + 1;

    await db.update(users).set({ xp: newXP, level: newLevel } as any).where(eq(users.id, userId));
  }

  async createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry> {
    console.log("createJournalEntry called with:", JSON.stringify(entry, null, 2));
    
    const wordCount = (entry as any).content ? (entry as any).content.trim().split(/\s+/).filter((word: string) => word.length > 0).length : 0;
    console.log("Calculated word count:", wordCount);

    // Prepare entry data with all fields properly mapped
    const entryData = {
      userId: entry.userId,
      title: (entry as any).title,
      content: (entry as any).content,
      mood: (entry as any).mood,
      wordCount,
      fontFamily: (entry as any).fontFamily || "Inter",
      fontSize: (entry as any).fontSize || 16,
      textColor: (entry as any).textColor || "#1f2937",
      backgroundColor: (entry as any).backgroundColor || "#ffffff",
      isPrivate: (entry as any).isPrivate || false,
      tags: (entry as any).tags || [],
      photos: (entry as any).photos || [],
      drawings: (entry as any).drawings || [],
      location: (entry as any).location || null,
      weather: (entry as any).weather || null,
      aiInsights: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("About to insert entry data:", JSON.stringify(entryData, null, 2));
    
    try {
      const result = await db.insert(journalEntries).values(entryData as any).returning();
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
    const updateData: any = { ...entry, updatedAt: new Date() };

    if ((entry as any).content) {
      updateData.wordCount = ((entry as any).content as string).trim().split(/\s+/).filter((word: string) => word.length > 0).length;
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
      title: (achievement as any).title,
      description: (achievement as any).description,
      icon: (achievement as any).icon || "🏆",
      rarity: (achievement as any).rarity || "common",
      type: (achievement as any).type,
      targetValue: (achievement as any).requirement || 0,
      currentValue: (achievement as any).currentValue || 0,
      unlockedAt: (achievement as any).unlockedAt || null
    };
    
    const result = await db.insert(achievements).values(achievementData as any).returning();
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
      .where(eq(announcements.isActive, true))
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
      title: (goal as any).title,
      description: (goal as any).description || null,
      type: (goal as any).type,
      difficulty: (goal as any).difficulty || 'beginner',
      targetValue: (goal as any).targetValue,
      currentValue: (goal as any).currentValue || 0,
      isCompleted: (goal as any).isCompleted || false,
      deadline: (goal as any).deadline || null,
      completedAt: (goal as any).completedAt || null
    };
    
    const result = await db.insert(goals).values(goalData as any).returning();
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
      subject: message.subject || "Support",
      priority: message.priority || "normal",
      status: message.status || "open"
    };
    
    const [newMessage] = await db.insert(supportMessages).values(messageData as any).returning();
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

  async calculateActualStorageUsage(userId: number): Promise<number> {
    try {
      // Get user data
      const user = await this.getUser(userId);
      if (!user) return 0;
      
      // Calculate storage usage from journal entries
      const entries = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId));
      
      let totalBytes = 0;
      
      for (const entry of entries) {
        // Count text content
        totalBytes += Buffer.byteLength(entry.content || '', 'utf8');
        totalBytes += Buffer.byteLength(entry.title || '', 'utf8');
        
        // Count photo data (if stored as base64 or binary)
        if (entry.photos) {
          const photos = Array.isArray(entry.photos) ? entry.photos : [];
          photos.forEach((photo: any) => {
            if (photo.data) {
              // Estimate photo size from base64 data
              totalBytes += Math.floor(photo.data.length * 0.75); // base64 is ~33% larger
            }
            if (photo.analysis) {
              totalBytes += Buffer.byteLength(JSON.stringify(photo.analysis), 'utf8');
            }
          });
        }
        
        // Count drawing data
        if (entry.drawings) {
          const drawings = Array.isArray(entry.drawings) ? entry.drawings : [];
          drawings.forEach((drawing: any) => {
            totalBytes += Buffer.byteLength(JSON.stringify(drawing), 'utf8');
          });
        }
        
        // Count AI insights
        if (entry.aiInsights) {
          totalBytes += Buffer.byteLength(JSON.stringify(entry.aiInsights), 'utf8');
        }
        
        // Count tags
        if (entry.tags) {
          totalBytes += Buffer.byteLength(JSON.stringify(entry.tags), 'utf8');
        }
      }
      
      // Calculate user profile storage (using avatar field instead of profilePicture)
      if (user.avatar && user.avatar.startsWith('data:image/')) {
        totalBytes += Math.floor(user.avatar.length * 0.75); // Estimate if base64
      }
      
      // Convert bytes to KB (since storageUsedMB field is integer, we'll store KB and convert to MB for display)
      const totalKB = Math.ceil(totalBytes / 1024);
      
      return totalKB;
    } catch (error) {
      console.error(`Error calculating storage for user ${userId}:`, error);
      return 0;
    }
  }

  async refreshUserStorageUsage(userId: number): Promise<number> {
    const actualUsageKB = await this.calculateActualStorageUsage(userId);
    const actualUsageMB = Math.ceil(actualUsageKB / 1024); // Convert to whole MB and round up
    await db.update(users).set({ storageUsedMB: actualUsageMB } as any).where(eq(users.id, userId));
    // Return MB for display purposes
    return actualUsageMB;
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

  async getActiveWeeklyChallenges(): Promise<any[]> {
    try {
      return await db.select().from(weeklyChallenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }
  }

  async getUserChallengeProgress(userId: number, challengeId: number): Promise<any | undefined> {
    try {
      const result = await db.select().from(userChallengeProgress).where(
        and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.challengeId, challengeId))
      ).limit(1);
      return result[0];
    } catch (error) {
      return undefined;
    }
  }

  async updateChallengeProgress(userId: number, challengeId: number, progress: number, isCompleted: boolean): Promise<void> {
    try {
      const existing = await this.getUserChallengeProgress(userId, challengeId);
      if (existing) {
        await db.update(userChallengeProgress).set({ progress, isCompleted, completedAt: isCompleted ? new Date() : null } as any)
          .where(and(eq(userChallengeProgress.userId, userId), eq(userChallengeProgress.challengeId, challengeId)));
      } else {
        await db.insert(userChallengeProgress).values({ userId, challengeId, progress, isCompleted, completedAt: isCompleted ? new Date() : null } as any);
      }
    } catch (error) {
      console.error("Error updating challenge progress:", error);
    }
  }

  async getEmailReminderPreferences(userId: number): Promise<any[]> {
    return [];
  }

  async updateEmailReminder(userId: number, type: string, updates: Partial<any>): Promise<void> {
    // Stubbed - email reminders table not in current schema
  }

  // Shared Journals Methods - Stubbed for now
  async createSharedJournal(data: any): Promise<any> {
    return { id: Math.random(), ...data };
  }

  async getUserSharedJournals(userId: number): Promise<any[]> {
    return [];
  }

  async getSharedJournal(id: number): Promise<any | undefined> {
    return undefined;
  }

  async inviteToSharedJournal(journalId: number, inviterId: number, email: string): Promise<void> {
    // Stubbed
  }

  async addJournalEntryToShared(sharedJournalId: number, journalEntryId: number, userId: number): Promise<void> {
    // Stubbed
  }

  // ============ ENTERPRISE METHODS ============

  // Organization Management
  async getOrganization(id: number): Promise<any | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return result[0];
  }

  async getOrganizationMembers(organizationId: number): Promise<any[]> {
    return db.select({
      id: organizationMembers.id,
      userId: organizationMembers.userId,
      organizationId: organizationMembers.organizationId,
      role: organizationMembers.role,
      invitedBy: organizationMembers.invitedBy,
      joinedAt: organizationMembers.joinedAt,
      createdAt: organizationMembers.createdAt,
      userName: users.username,
      userEmail: users.email
    })
    .from(organizationMembers)
    .leftJoin(users, eq(organizationMembers.userId, users.id))
    .where(eq(organizationMembers.organizationId, organizationId));
  }

  async getOrganizationMember(organizationId: number, userId: number): Promise<any | undefined> {
    const result = await db.select().from(organizationMembers)
      .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId)))
      .limit(1);
    return result[0];
  }

  async updateOrganization(id: number, updates: Partial<any>): Promise<void> {
    await db.update(organizations).set({ ...updates, updatedAt: new Date() } as any).where(eq(organizations.id, id));
  }

  async createOrganizationMember(organizationId: number, userId: number, role: string): Promise<void> {
    await db.insert(organizationMembers).values({ organizationId, userId, role } as any);
  }

  async updateOrganizationMemberRole(organizationId: number, userId: number, role: string): Promise<void> {
    await db.update(organizationMembers).set({ role } as any)
      .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId)));
  }

  async removeOrganizationMember(organizationId: number, userId: number): Promise<void> {
    await db.delete(organizationMembers)
      .where(and(eq(organizationMembers.organizationId, organizationId), eq(organizationMembers.userId, userId)));
  }

  // Pending Invitations
  async createPendingInvitation(organizationId: number, email: string, role: string, invitedBy: number, expiresAt: Date): Promise<any> {
    const magicToken = crypto.randomBytes(32).toString('hex');
    const result = await db.insert(pendingInvitations).values({
      organizationId,
      email,
      role,
      magicToken,
      invitedBy,
      expiresAt
    } as any).returning();
    return result[0];
  }

  async getPendingInvitation(token: string): Promise<any | undefined> {
    const result = await db.select().from(pendingInvitations)
      .where(eq(pendingInvitations.magicToken, token))
      .limit(1);
    return result[0];
  }

  async getPendingInvitationsByOrg(organizationId: number): Promise<any[]> {
    return db.select().from(pendingInvitations)
      .where(eq(pendingInvitations.organizationId, organizationId));
  }

  async acceptInvitation(invitationId: number, userId: number): Promise<void> {
    const invitation = await db.select().from(pendingInvitations).where(eq(pendingInvitations.id, invitationId)).limit(1);
    if (invitation.length > 0) {
      const inv = invitation[0];
      // Mark invitation as accepted
      await db.update(pendingInvitations).set({ status: 'accepted', acceptedAt: new Date() } as any)
        .where(eq(pendingInvitations.id, invitationId));
      // Add user to organization
      await this.createOrganizationMember(inv.organizationId, userId, inv.role);
    }
  }

  async expireInvitations(): Promise<void> {
    const now = new Date();
    await db.update(pendingInvitations)
      .set({ status: 'expired' } as any)
      .where(and(lt(pendingInvitations.expiresAt, now), eq(pendingInvitations.status, 'pending')));
  }

  // Compliance
  async createComplianceExport(organizationId: number, userId: number, requestedBy: number, format: string): Promise<any> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const result = await db.insert(complianceExports).values({
      organizationId,
      userId,
      requestedBy,
      exportFormat: format,
      expiresAt
    } as any).returning();
    return result[0];
  }

  async getComplianceExports(organizationId: number): Promise<any[]> {
    return db.select().from(complianceExports)
      .where(eq(complianceExports.organizationId, organizationId));
  }

  async updateComplianceExportStatus(id: number, status: string, downloadUrl?: string): Promise<void> {
    const updates: any = { status };
    if (downloadUrl) updates.downloadUrl = downloadUrl;
    if (status === 'completed') updates.completedAt = new Date();
    await db.update(complianceExports).set(updates).where(eq(complianceExports.id, id));
  }

  async createComplianceDeletion(organizationId: number, userId: number, requestedBy: number, reason?: string): Promise<any> {
    const result = await db.insert(complianceDeletions).values({
      organizationId,
      userId,
      requestedBy,
      reason
    } as any).returning();
    return result[0];
  }

  async getComplianceDeletions(organizationId: number): Promise<any[]> {
    return db.select().from(complianceDeletions)
      .where(eq(complianceDeletions.organizationId, organizationId));
  }

  async updateComplianceDeletionStatus(id: number, status: string): Promise<void> {
    const updates: any = { status };
    if (status === 'completed') updates.completedAt = new Date();
    await db.update(complianceDeletions).set(updates).where(eq(complianceDeletions.id, id));
  }

  async approveDeletion(id: number): Promise<void> {
    await db.update(complianceDeletions).set({ status: 'approved', approvedAt: new Date() } as any)
      .where(eq(complianceDeletions.id, id));
  }

  // Audit Logging
  async createAuditLog(organizationId: number, actorId: number | null, actorType: string, action: string, resourceType?: string, resourceId?: number, details?: any, ipAddress?: string, userAgent?: string): Promise<void> {
    await db.insert(auditLogs).values({
      organizationId,
      actorId,
      actorType,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    } as any);
  }

  async getAuditLogs(organizationId: number, limit?: number): Promise<any[]> {
    let query = db.select().from(auditLogs)
      .where(eq(auditLogs.organizationId, organizationId))
      .orderBy(desc(auditLogs.createdAt));
    if (limit) query = query.limit(limit);
    return query;
  }

  // Analytics
  async getTeamAnalytics(organizationId: number): Promise<any> {
    const members = await this.getOrganizationMembers(organizationId);
    const totalMembers = members.length;
    
    const entries = await db.select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(eq(journalEntries.organizationId, organizationId));
    
    const activities = await db.select({ count: sql<number>`count(*)` })
      .from(userActivityLogs)
      .where(eq(userActivityLogs.organizationId, organizationId));
    
    const recentEntries = await db.select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(and(
        eq(journalEntries.organizationId, organizationId),
        gte(journalEntries.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      ));

    return {
      totalMembers,
      totalEntries: entries[0]?.count || 0,
      totalActivities: activities[0]?.count || 0,
      entriesThisWeek: recentEntries[0]?.count || 0,
      participationRate: totalMembers > 0 ? Math.round(((recentEntries[0]?.count || 0) / totalMembers) * 100) : 0
    };
  }

  async getManagerDashboardData(organizationId: number): Promise<any> {
    const analytics = await this.getTeamAnalytics(organizationId);
    
    const moodCounts = await db.select({ mood: journalEntries.mood, count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(eq(journalEntries.organizationId, organizationId))
      .groupBy(journalEntries.mood);
    
    const avgWordsPerEntry = await db.select({ avg: sql<number>`avg(word_count)` })
      .from(journalEntries)
      .where(eq(journalEntries.organizationId, organizationId));

    return {
      ...analytics,
      moodDistribution: moodCounts,
      avgWordsPerEntry: avgWordsPerEntry[0]?.avg || 0
    };
  }

  // Notification Preferences
  async getUserNotificationPreferences(userId: number, organizationId: number): Promise<any | undefined> {
    // For now, store preferences in a simple in-memory cache
    // In production, this would be stored in a database table like `userNotificationPreferences`
    const key = `${organizationId}:${userId}:digest_prefs`;
    const stored = (global as any).__notificationPrefs?.[key];
    return stored;
  }

  async updateNotificationPreferences(userId: number, organizationId: number, preferences: any): Promise<void> {
    // Store preferences in memory cache
    if (!(global as any).__notificationPrefs) {
      (global as any).__notificationPrefs = {};
    }
    const key = `${organizationId}:${userId}:digest_prefs`;
    (global as any).__notificationPrefs[key] = {
      ...preferences,
      updatedAt: new Date()
    };
  }
}

export const storage = new DatabaseStorage();
