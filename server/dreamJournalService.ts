import { storage } from "./storage";

export interface Dream {
  id: string;
  userId: number;
  date: Date;
  title: string;
  description: string;
  mood: string;
  themes: string[];
  vividness: number;
}

class DreamStore {
  private dreams: Map<string, Dream> = new Map();
  private dreamId = 0;

  addDream(userId: number, title: string, description: string, mood: string, vividness: number): Dream {
    const id = `dream_${++this.dreamId}`;
    const dream: Dream = {
      id,
      userId,
      date: new Date(),
      title,
      description,
      mood,
      themes: this.extractThemes(description),
      vividness
    };
    this.dreams.set(id, dream);
    return dream;
  }

  private extractThemes(text: string): string[] {
    const themes: { [key: string]: boolean } = {};
    const keywords = ["flying", "falling", "water", "animals", "people", "darkness", "light", "chase", "lost", "home"];
    keywords.forEach(k => {
      if (text.toLowerCase().includes(k)) themes[k] = true;
    });
    return Object.keys(themes);
  }

  getUserDreams(userId: number): Dream[] {
    return Array.from(this.dreams.values()).filter(d => d.userId === userId).sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

const dreamStore = new DreamStore();

export class DreamJournalService {
  static addDream(userId: number, title: string, description: string, mood: string, vividness: number): Dream {
    return dreamStore.addDream(userId, title, description, mood, vividness);
  }

  static getUserDreams(userId: number): Dream[] {
    return dreamStore.getUserDreams(userId);
  }

  static async getDreamAnalysis(userId: number): Promise<any> {
    const dreams = dreamStore.getUserDreams(userId);
    const themeCounts: any = {};
    const moods: string[] = [];

    dreams.forEach(d => {
      moods.push(d.mood);
      d.themes.forEach(t => {
        themeCounts[t] = (themeCounts[t] || 0) + 1;
      });
    });

    return {
      totalDreams: dreams.length,
      commonThemes: Object.entries(themeCounts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5),
      averageVividness: dreams.length > 0 ? Math.round((dreams.reduce((sum, d) => sum + d.vividness, 0) / dreams.length) * 10) / 10 : 0,
      recentMood: moods[0] || "neutral"
    };
  }
}
