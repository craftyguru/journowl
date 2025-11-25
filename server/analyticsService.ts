import { OpenAI } from "openai";
import type { MoodTrend } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class AnalyticsService {
  static async analyzeMoodTrends(moodData: MoodTrend[]): Promise<{
    trendDirection: "improving" | "declining" | "stable";
    confidence: number;
    insight: string;
    recommendation: string;
    predictedMood: string;
  }> {
    if (moodData.length < 2) {
      return {
        trendDirection: "stable",
        confidence: 0,
        insight: "Not enough data yet. Keep journaling!",
        recommendation: "Add more entries to unlock insights",
        predictedMood: "😊"
      };
    }

    const last7Days = moodData.slice(-7);
    const last30Days = moodData.slice(-30);
    
    const avg7 = last7Days.reduce((sum, m) => sum + m.value, 0) / last7Days.length;
    const avg30 = last30Days.reduce((sum, m) => sum + m.value, 0) / last30Days.length;
    
    let trendDirection: "improving" | "declining" | "stable" = "stable";
    if (avg7 > avg30 * 1.1) trendDirection = "improving";
    else if (avg7 < avg30 * 0.9) trendDirection = "declining";
    
    const confidence = Math.min(100, (last7Days.length / 7) * 100);
    
    const moodLabels: Record<number, string> = {
      1: "😢 Very Low",
      2: "😟 Low",
      3: "😐 Neutral",
      4: "🙂 Good",
      5: "😊 Excellent"
    };

    const insight = `Your mood has been **${trendDirection}** over the past week. Average: ${avg7.toFixed(1)}/5.`;
    
    const recommendations: Record<string, string> = {
      improving: "Keep up the positive momentum! Your recent entries show you're on an upward trajectory.",
      declining: "It looks like things have been challenging. Consider writing more to process your feelings.",
      stable: "You're maintaining consistency. Try exploring new topics to deepen your reflections."
    };

    const moodPrediction = Math.round(avg7) as 1 | 2 | 3 | 4 | 5;
    const predictedMood = moodLabels[moodPrediction] || "😊 Excellent";

    return {
      trendDirection,
      confidence,
      insight,
      recommendation: recommendations[trendDirection],
      predictedMood
    };
  }

  static async generateWeeklyInsights(entries: any[]): Promise<string> {
    if (entries.length === 0) return "No entries this week to analyze.";

    try {
      const entrySummaries = entries
        .slice(-7)
        .map((e, i) => `${i + 1}. ${e.title}: "${e.content.substring(0, 100)}..."`)
        .join("\n");

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a thoughtful journal analyst. Provide a 2-3 sentence weekly insight about the user's patterns, emotions, and growth. Be concise and encouraging."
          },
          {
            role: "user",
            content: `Analyze these week's journal entries:\n${entrySummaries}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "Keep journaling to unlock insights!";
    } catch (error) {
      console.error("Error generating insights:", error);
      return "Continue journaling to track your growth.";
    }
  }

  static calculateStrengthAreas(entries: any[]): string[] {
    const wordFreq: Record<string, number> = {};
    
    entries.forEach(entry => {
      const words = entry.content.toLowerCase().split(/\s+/);
      const positiveKeywords = ["grateful", "happy", "loved", "accomplished", "proud", "excited", "hope", "grateful"];
      
      words.forEach((word: string) => {
        if (positiveKeywords.some(kw => word.includes(kw))) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  }
}
