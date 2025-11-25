import { storage } from "./storage";

export class WritingStatsService {
  static async getDetailedStats(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 365);
      const stats = await storage.getUserStats(userId);

      const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
      const avgLength = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
      const longestEntry = Math.max(...entries.map(e => e.wordCount || 0), 0);

      // Calculate trends
      const last7Days = entries.filter(e => {
        const date = new Date(e.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return date > sevenDaysAgo;
      });

      const last30Days = entries.filter(e => {
        const date = new Date(e.createdAt);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return date > thirtyDaysAgo;
      });

      return {
        totalEntries: entries.length,
        totalWords,
        averageLength: avgLength,
        longestEntry,
        entriesLast7Days: last7Days.length,
        wordsLast7Days: last7Days.reduce((sum, e) => sum + (e.wordCount || 0), 0),
        entriesLast30Days: last30Days.length,
        wordsLast30Days: last30Days.reduce((sum, e) => sum + (e.wordCount || 0), 0),
        currentStreak: stats?.currentStreak || 0,
        longestStreak: stats?.longestStreak || 0
      };
    } catch (e) {
      return {};
    }
  }

  static async getWritingTimeTrend(userId: number): Promise<any[]> {
    try {
      const entries = await storage.getJournalEntries(userId, 90);
      const hourlyData: any = {};

      for (let hour = 0; hour < 24; hour++) {
        hourlyData[hour] = { hour: `${hour}:00`, entries: 0, words: 0 };
      }

      entries.forEach(entry => {
        const hour = new Date(entry.createdAt).getHours();
        if (hourlyData[hour]) {
          hourlyData[hour].entries++;
          hourlyData[hour].words += entry.wordCount || 0;
        }
      });

      return Object.values(hourlyData);
    } catch (e) {
      return [];
    }
  }
}
