import { storage } from "./storage";

export class InsightsService {
  static async getWritingInsights(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 100);
      const stats = await storage.getUserStats(userId);

      // Analyze writing patterns
      const moods = entries.map(e => e.mood || "neutral");
      const moodCounts: any = {};
      moods.forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });

      const wordCounts = entries.map(e => e.wordCount || 0);
      const avgWords = wordCounts.length > 0 ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length) : 0;

      // Detect writing style
      let style = "Balanced";
      if (avgWords < 150) style = "Concise";
      else if (avgWords > 500) style = "Reflective";

      return {
        totalEntries: entries.length,
        averageWordCount: avgWords,
        dominantMood: Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "neutral",
        writingStyle: style,
        emotionalPatterns: moodCounts,
        consistencyScore: Math.min((entries.length / 30) * 100, 100)
      };
    } catch (error) {
      console.error("Insights error:", error);
      return {};
    }
  }
}
