import { storage } from "./storage";

export interface EmotionLocation {
  mood: string;
  latitude: number;
  longitude: number;
  intensity: number;
  date: string;
}

export class EmotionHeatmapService {
  static async getEmotionHeatmap(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 365);
      
      // Simulated location data - would come from location service in real app
      const locations: EmotionLocation[] = entries
        .filter(e => e.mood)
        .map((e, idx) => ({
          mood: e.mood || "neutral",
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
          intensity: (e.wordCount || 0) / 100,
          date: new Date(e.createdAt).toISOString()
        }));

      // Mood distribution
      const moodCounts: any = {};
      entries.forEach(e => {
        const mood = e.mood || "neutral";
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });

      return {
        locations,
        moodDistribution: Object.entries(moodCounts).map(([mood, count]: any) => ({
          mood,
          count,
          percentage: Math.round((count / entries.length) * 100)
        })),
        totalEntries: entries.length,
        predominantMood: Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "neutral"
      };
    } catch (e) {
      return { locations: [], moodDistribution: [] };
    }
  }
}
