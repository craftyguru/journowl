import { storage } from "./storage";

export class InsightsService {
  static async getWritingInsights(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 30);
      
      // Analyze emotional patterns
      const moods = entries.map(e => e.mood || "neutral");
      const moodCounts: any = {};
      moods.forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });
      
      const dominantMood = Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "neutral";
      
      // Writing style analysis
      const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
      const avgWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
      const writingStyle = avgWordsPerEntry > 500 ? "Reflective" : avgWordsPerEntry > 200 ? "Balanced" : "Concise";
      
      return {
        dominantMood,
        moodTrend: moods.slice(-7),
        writingStyle,
        avgWordsPerEntry,
        totalEntriesAnalyzed: entries.length,
        insights: [
          `Your writing is ${writingStyle} - ${avgWordsPerEntry} words per entry on average`,
          `Dominant mood: ${dominantMood}`,
          entries.length >= 5 ? "You've built a consistent habit!" : "Keep writing daily to build momentum"
        ]
      };
    } catch (e) {
      return { insights: [] };
    }
  }
}
