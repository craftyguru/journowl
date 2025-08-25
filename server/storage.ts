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
  promoCodes,
  promoCodeUsage,
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
  type InsertPromptPurchase,
  type PromoCode,
  type InsertPromoCode,
  type PromoCodeUsage,
} from "@shared/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

// Import the unified database connection from db.ts
import { db } from './db';

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
  checkAndRefreshUserPrompts(userId: number): Promise<void>;
  refreshUserPrompts(userId: number): Promise<void>;
  checkAllUsersForPromptRefresh(): Promise<void>;

  updateUserSubscription(userId: number, subscription: { tier: string; status: string; expiresAt: Date; stripeSubscriptionId: string }): Promise<void>;
  updateStorageUsage(userId: number, additionalMB: number): Promise<void>;
  calculateActualStorageUsage(userId: number): Promise<number>;
  refreshUserStorageUsage(userId: number): Promise<number>;

  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  addUserPrompts(userId: number, promptsToAdd: number): Promise<void>;

  // Promo code methods
  validatePromoCode(code: string): Promise<PromoCode | null>;
  usePromoCode(userId: number, promoCodeId: number, ipAddress?: string, userAgent?: string): Promise<void>;
  createPromoCode(promoCode: InsertPromoCode, createdBy: number): Promise<PromoCode>;
  getAllPromoCodes(): Promise<PromoCode[]>;
  getPromoCodeUsage(promoCodeId: number): Promise<PromoCodeUsage[]>;
  updatePromoCode(id: number, updates: Partial<PromoCode>): Promise<void>;
  deletePromoCode(id: number): Promise<void>;
  getPromoCodeStats(): Promise<{ totalCodes: number; activeCodes: number; totalUsage: number; recentUsage: PromoCodeUsage[] }>;
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

  // Add minimal implementations for all required methods
  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await db.update(users).set(updates as any).where(eq(users.id, id));
  }

  async updateUserXP(userId: number, xp: number): Promise<void> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) return;
    const newXP = (currentUser.xp || 0) + xp;
    const newLevel = Math.floor(newXP / 1000) + 1;
    await db.update(users).set({ xp: newXP, level: newLevel } as any).where(eq(users.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getActiveUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.lastLoginAt));
  }

  async getInactiveUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async createJournalEntry(entry: InsertJournalEntry & { userId: number }): Promise<JournalEntry> {
    const wordCount = entry.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
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
      audioUrl: entry.audioUrl || null,
      location: entry.location || null,
      weather: entry.weather || null,
      aiInsights: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.insert(journalEntries).values(entryData).returning();
    const newEntry = result[0];
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
    await db.update(journalEntries).set(entry as any).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async deleteJournalEntry(id: number, userId: number): Promise<void> {
    await db.delete(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  }

  async createAchievement(achievement: InsertAchievement & { userId: number }): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement as any).returning();
    return result[0];
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserStats(userId: number, stats: Partial<UserStats>): Promise<void> {
    await db.update(userStats).set(stats as any).where(eq(userStats.userId, userId));
  }

  async createUserStats(userId: number): Promise<UserStats> {
    try {
      const result = await db.insert(userStats).values({ userId }).returning();
      return result[0];
    } catch (error: any) {
      if (error.code === '23505') {
        const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
        return result[0];
      }
      throw error;
    }
  }

  async recalculateUserStats(userId: number): Promise<void> {
    // Simplified implementation
  }

  async getUserGoals(userId: number): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async createGoal(goal: InsertGoal & { userId: number }): Promise<Goal> {
    const result = await db.insert(goals).values(goal as any).returning();
    return result[0];
  }

  async updateGoal(id: number, userId: number, updates: Partial<Goal>): Promise<void> {
    await db.update(goals).set(updates).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  async logUserActivity(userId: number, action: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void> {
    await db.insert(userActivityLogs).values({ userId, action, details, ipAddress, userAgent } as any);
  }

  // Simplified implementations for all other methods...
  async getEmailCampaign(id: number): Promise<EmailCampaign | undefined> {
    const result = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id)).limit(1);
    return result[0];
  }

  async updateEmailCampaign(id: number, updates: Partial<EmailCampaign>): Promise<void> {
    await db.update(emailCampaigns).set(updates as any).where(eq(emailCampaigns.id, id));
  }

  async createEmailCampaign(campaign: Partial<EmailCampaign>): Promise<EmailCampaign> {
    const result = await db.insert(emailCampaigns).values(campaign as any).returning();
    return result[0];
  }

  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return await db.select().from(emailCampaigns);
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async updateSiteSetting(key: string, value: string, updatedBy: number): Promise<void> {
    await db.insert(siteSettings).values({ key, value, updatedBy } as any);
  }

  async getUserActivityLogs(userId?: number, limit = 100): Promise<UserActivityLog[]> {
    if (userId) {
      return await db.select().from(userActivityLogs).where(eq(userActivityLogs.userId, userId)).limit(limit);
    }
    return await db.select().from(userActivityLogs).limit(limit);
  }

  async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement as any).returning();
    return result[0];
  }

  async getActiveAnnouncements(targetAudience = 'all'): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  }

  async createSupportMessage(message: Partial<SupportMessage>): Promise<SupportMessage> {
    const result = await db.insert(supportMessages).values(message as any).returning();
    return result[0];
  }

  async getSupportMessages(userId: number): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages).where(eq(supportMessages.userId, userId));
  }

  async getAllSupportMessages(): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages);
  }

  async markSupportMessageAsRead(id: number): Promise<void> {
    await db.update(supportMessages).set({ isRead: true } as any).where(eq(supportMessages.id, id));
  }

  async getUserPromptUsage(userId: number): Promise<{ promptsRemaining: number; promptsUsedThisMonth: number; currentPlan: string }> {
    const user = await this.getUser(userId);
    return {
      promptsRemaining: user?.promptsRemaining || 100,
      promptsUsedThisMonth: user?.promptsUsedThisMonth || 0,
      currentPlan: user?.currentPlan || 'free'
    };
  }

  async incrementPromptUsage(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUser(userId, {
        promptsUsedThisMonth: (user.promptsUsedThisMonth || 0) + 1,
        promptsRemaining: Math.max(0, (user.promptsRemaining || 0) - 1)
      });
    }
  }

  async addPromptPurchase(userId: number, stripePaymentId: string, amount: number, promptsAdded: number): Promise<void> {
    await db.insert(promptPurchases).values({ userId, stripePaymentId, amount, promptsAdded } as any);
  }

  async resetMonthlyUsage(): Promise<void> {
    await db.update(users).set({ promptsUsedThisMonth: 0 } as any);
  }

  async updateUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUser(userId, {
        promptsRemaining: (user.promptsRemaining || 0) + promptsToAdd
      });
    }
  }

  async checkAndRefreshUserPrompts(userId: number): Promise<void> {}
  async refreshUserPrompts(userId: number): Promise<void> {}
  async checkAllUsersForPromptRefresh(): Promise<void> {}

  async updateUserSubscription(userId: number, subscription: { tier: string; status: string; expiresAt: Date; stripeSubscriptionId: string }): Promise<void> {
    await this.updateUser(userId, { currentPlan: subscription.tier } as any);
  }

  async updateStorageUsage(userId: number, additionalMB: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUser(userId, {
        storageUsedMB: (user.storageUsedMB || 0) + additionalMB
      });
    }
  }

  async calculateActualStorageUsage(userId: number): Promise<number> {
    return 0;
  }

  async refreshUserStorageUsage(userId: number): Promise<number> {
    return 0;
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return undefined;
  }

  async addUserPrompts(userId: number, promptsToAdd: number): Promise<void> {
    await this.updateUserPrompts(userId, promptsToAdd);
  }

  // Promo code methods
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    const result = await db.select().from(promoCodes).where(eq(promoCodes.code, code)).limit(1);
    return result[0] || null;
  }

  async usePromoCode(userId: number, promoCodeId: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await db.insert(promoCodeUsage).values({ userId, promoCodeId } as any);
  }

  async createPromoCode(promoCode: InsertPromoCode, createdBy: number): Promise<PromoCode> {
    const result = await db.insert(promoCodes).values(promoCode as any).returning();
    return result[0];
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return await db.select().from(promoCodes);
  }

  async getPromoCodeUsage(promoCodeId: number): Promise<PromoCodeUsage[]> {
    return await db.select().from(promoCodeUsage).where(eq(promoCodeUsage.promoCodeId, promoCodeId));
  }

  async updatePromoCode(id: number, updates: Partial<PromoCode>): Promise<void> {
    await db.update(promoCodes).set(updates as any).where(eq(promoCodes.id, id));
  }

  async deletePromoCode(id: number): Promise<void> {
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
  }

  async getPromoCodeStats(): Promise<{ totalCodes: number; activeCodes: number; totalUsage: number; recentUsage: PromoCodeUsage[] }> {
    return {
      totalCodes: 0,
      activeCodes: 0,
      totalUsage: 0,
      recentUsage: []
    };
  }
}

export const storage = new DatabaseStorage();