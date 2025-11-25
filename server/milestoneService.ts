import { storage } from "./storage";

export interface Milestone {
  id: string;
  title: string;
  type: "words" | "streak" | "entries" | "consistency";
  threshold: number;
  icon: string;
  animation: string;
  message: string;
}

export class MilestoneService {
  private static milestones: Milestone[] = [
    { id: "100w", title: "100-Word Entry", type: "words", threshold: 100, icon: "📝", animation: "celebration", message: "You've written 100 words!" },
    { id: "500w", title: "Epic Essay", type: "words", threshold: 500, icon: "✍️", animation: "fireworks", message: "500 words - you're unstoppable!" },
    { id: "1kw", title: "Novelist", type: "words", threshold: 1000, icon: "📚", animation: "confetti", message: "1000 words in one entry!" },
    { id: "7day", title: "Week Warrior", type: "streak", threshold: 7, icon: "🔥", animation: "sparkle", message: "7-day streak!" },
    { id: "30day", title: "Monthly Master", type: "streak", threshold: 30, icon: "👑", animation: "explosion", message: "30-day streak!" },
    { id: "100day", title: "Century Club", type: "streak", threshold: 100, icon: "🏆", animation: "rainbow", message: "100-day streak!" },
    { id: "10entry", title: "Decade", type: "entries", threshold: 10, icon: "🎉", animation: "bounce", message: "10 entries written!" },
    { id: "100entry", title: "Centennial", type: "entries", threshold: 100, icon: "🌟", animation: "glow", message: "100 entries milestone!" }
  ];

  static async checkMilestones(userId: number): Promise<Milestone[]> {
    try {
      const stats = await storage.getUserStats(userId);
      const entries = await storage.getJournalEntries(userId, 999);

      const achieved: Milestone[] = [];

      this.milestones.forEach(m => {
        let threshold = 0;
        if (m.type === "words") {
          threshold = Math.max(...entries.map(e => e.wordCount || 0), 0);
        } else if (m.type === "streak") {
          threshold = stats?.longestStreak || 0;
        } else if (m.type === "entries") {
          threshold = entries.length;
        }

        if (threshold >= m.threshold) achieved.push(m);
      });

      return achieved;
    } catch (e) {
      return [];
    }
  }
}
