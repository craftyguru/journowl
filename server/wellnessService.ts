import { storage } from "./storage";

export class WellnessService {
  static async calculateWellnessScore(userId: number): Promise<number> {
    try {
      const stats = await storage.getUserStats(userId);
      if (!stats) return 0;

      let score = 50; // Base score
      
      // Streak contribution (0-25 points)
      const streakScore = Math.min((stats.currentStreak || 0) / 10, 25);
      
      // Entry frequency (0-25 points)
      const entryScore = Math.min((stats.totalEntries || 0) / 30, 25);
      
      // Consistency (0-25 points)
      const consistencyScore = (stats.longestStreak || 0) > 0 ? 25 : 0;
      
      // Engagement (0-25 points)
      const totalWords = stats.totalWords || 0;
      const engagementScore = Math.min(totalWords / 5000, 25);
      
      score += streakScore + entryScore + consistencyScore + engagementScore;
      return Math.min(Math.floor(score), 100);
    } catch (e) {
      return 0;
    }
  }

  static async getDailyWellness(userId: number): Promise<any[]> {
    try {
      const entries = await storage.getJournalEntries(userId, 30);
      const dailyData: any = {};

      entries.forEach(entry => {
        const date = new Date(entry.createdAt).toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = { date, wellness: 0 };
        
        // Simple calculation based on entry properties
        let dayScore = 60;
        if (entry.wordCount && entry.wordCount > 100) dayScore += 15;
        if (entry.mood) dayScore += 25;
        
        dailyData[date].wellness = Math.min(dayScore, 100);
      });

      return Object.values(dailyData);
    } catch (e) {
      return [];
    }
  }
}
