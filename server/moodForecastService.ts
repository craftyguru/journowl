import { storage } from "./storage";

export class MoodForecastService {
  static async forecastMood(userId: number, days: number = 7): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 30);
      
      const moodPatterns: any = {};
      const moodScores: any = { happy: 5, good: 4, neutral: 3, sad: 2, angry: 1 };
      
      entries.forEach(e => {
        const dayOfWeek = new Date(e.createdAt).toLocaleDateString("en-US", { weekday: "long" });
        const moodScore = moodScores[e.mood as keyof typeof moodScores] || 3;
        
        if (!moodPatterns[dayOfWeek]) moodPatterns[dayOfWeek] = [];
        moodPatterns[dayOfWeek].push(moodScore);
      });

      // Calculate forecasts
      const forecast = [];
      const now = new Date();
      
      for (let i = 1; i <= days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        
        const patternScores = moodPatterns[dayOfWeek] || [3];
        const avgScore = patternScores.reduce((a: number, b: number) => a + b, 0) / patternScores.length;
        
        const moodMap: any = { 1: "angry", 2: "sad", 3: "neutral", 4: "good", 5: "happy" };
        
        forecast.push({
          date: date.toISOString().split("T")[0],
          predictedMood: moodMap[Math.round(avgScore)] || "neutral",
          confidence: Math.min(70 + (patternScores.length * 5), 95)
        });
      }

      return forecast;
    } catch (e) {
      return [];
    }
  }
}
