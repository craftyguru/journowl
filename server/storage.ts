import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  journalEntries, 
  achievements, 
  userStats,
  emailCampaigns,
  siteSettings,
  userActivityLogs,
  announcements,
  type User, 
  type InsertUser, 
  type JournalEntry, 
  type InsertJournalEntry,
  type Achievement,
  type InsertAchievement,
  type UserStats,
  type EmailCampaign,
  type SiteSetting,
  type UserActivityLog,
  type Announcement
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

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
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
}

export const storage = new DatabaseStorage();
