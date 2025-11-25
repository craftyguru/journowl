import { storage } from "./storage";

export class StoryModeService {
  static async generateNarrative(userId: number): Promise<string> {
    try {
      const entries = await storage.getJournalEntries(userId, 7);
      if (entries.length === 0) return "Start writing to generate your story!";

      let narrative = "📖 **Your Week's Journey**\n\n";
      
      entries.forEach((entry, idx) => {
        const date = new Date(entry.createdAt).toLocaleDateString();
        const mood = entry.mood || "thoughtful";
        const preview = (entry.content || "").substring(0, 100) + "...";
        
        narrative += `**${date}** - ${mood.toUpperCase()}\n`;
        narrative += `> ${preview}\n\n`;
      });

      narrative += `\n✨ *${entries.length} chapters in your story this week*`;
      return narrative;
    } catch (e) {
      return "";
    }
  }

  static async getStoryStats(userId: number): Promise<any> {
    try {
      const entries = await storage.getJournalEntries(userId, 999);
      const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
      const avgMood = entries.length > 0 ? "balanced" : "neutral";
      
      return {
        totalEntries: entries.length,
        totalWords,
        avgMood,
        consistency: Math.round((entries.length / 365) * 100),
        readingTime: Math.ceil(totalWords / 200) // avg 200 wpm
      };
    } catch (e) {
      return {};
    }
  }
}
