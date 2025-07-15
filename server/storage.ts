import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, 
  journalEntries, 
  achievements, 
  userStats,
  type User, 
  type InsertUser, 
  type JournalEntry, 
  type InsertJournalEntry,
  type Achievement,
  type InsertAchievement,
  type UserStats
} from "@shared/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXP(userId: number, xp: number): Promise<void>;

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
}

export const storage = new DatabaseStorage();
