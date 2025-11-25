import { DatabaseStorage } from "./storage";

export class LeaderboardService {
  static async getWeeklyLeaderboard(storage: DatabaseStorage): Promise<any[]> {
    try {
      const allUsers = await storage.getAllUsers?.() || [];
      
      const leaderboard = await Promise.all(
        allUsers.map(async (user: any) => {
          const stats = await storage.getUserStats(user.id);
          const entries = await storage.getJournalEntries(user.id, 100);
          
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          
          const weeklyEntries = entries.filter((e: any) => 
            new Date(e.createdAt) >= weekAgo
          );
          
          return {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            score: weeklyEntries.length * 10 + (stats?.totalWords || 0) / 100,
            badge: weeklyEntries.length > 5 ? "🌟 Active Week" : undefined
          };
        })
      );
      
      return leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      return [];
    }
  }

  static async getAllTimeLeaderboard(storage: DatabaseStorage): Promise<any[]> {
    try {
      const allUsers = await storage.getAllUsers?.() || [];
      
      const leaderboard = await Promise.all(
        allUsers.map(async (user: any) => {
          const stats = await storage.getUserStats(user.id);
          
          return {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            score: (stats?.totalWords || 0) + (stats?.totalEntries || 0) * 50,
            badge: stats && stats.totalEntries > 100 ? "🏆 Legend" : undefined
          };
        })
      );
      
      return leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
    } catch (error) {
      console.error("Error fetching all-time leaderboard:", error);
      return [];
    }
  }

  static async getStreakLeaderboard(storage: DatabaseStorage): Promise<any[]> {
    try {
      const allUsers = await storage.getAllUsers?.() || [];
      
      const leaderboard = await Promise.all(
        allUsers.map(async (user: any) => {
          const stats = await storage.getUserStats(user.id);
          
          return {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            score: stats?.currentStreak || 0,
            badge: stats && stats.currentStreak >= 30 ? "🔥 On Fire" : undefined
          };
        })
      );
      
      return leaderboard
        .filter((entry: any) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
    } catch (error) {
      console.error("Error fetching streak leaderboard:", error);
      return [];
    }
  }

  static async getWordsLeaderboard(storage: DatabaseStorage): Promise<any[]> {
    try {
      const allUsers = await storage.getAllUsers?.() || [];
      
      const leaderboard = await Promise.all(
        allUsers.map(async (user: any) => {
          const stats = await storage.getUserStats(user.id);
          
          return {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            score: stats?.totalWords || 0,
            badge: stats && stats.totalWords > 50000 ? "📖 Prolific" : undefined
          };
        })
      );
      
      return leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
    } catch (error) {
      console.error("Error fetching words leaderboard:", error);
      return [];
    }
  }
}
