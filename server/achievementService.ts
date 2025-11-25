export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "milestone" | "streak" | "social" | "writing" | "consistency";
  requirement: number;
  unlockedAt?: Date;
}

export const ACHIEVEMENTS = {
  FIRST_ENTRY: {
    id: "first_entry",
    name: "First Words",
    description: "Write your first journal entry",
    icon: "✍️",
    category: "milestone",
    requirement: 1
  },
  FIVE_ENTRIES: {
    id: "five_entries",
    name: "Getting Started",
    description: "Write 5 journal entries",
    icon: "📝",
    category: "milestone",
    requirement: 5
  },
  FIFTY_ENTRIES: {
    id: "fifty_entries",
    name: "Dedicated Journaler",
    description: "Write 50 journal entries",
    icon: "📚",
    category: "milestone",
    requirement: 50
  },
  HUNDRED_ENTRIES: {
    id: "hundred_entries",
    name: "Century Club",
    description: "Write 100 journal entries",
    icon: "💯",
    category: "milestone",
    requirement: 100
  },
  THOUSAND_WORDS: {
    id: "thousand_words",
    name: "Wordy",
    description: "Write 1,000 total words",
    icon: "📖",
    category: "writing",
    requirement: 1000
  },
  TEN_THOUSAND_WORDS: {
    id: "ten_thousand_words",
    name: "Prolific Writer",
    description: "Write 10,000 total words",
    icon: "🖊️",
    category: "writing",
    requirement: 10000
  },
  SEVEN_DAY_STREAK: {
    id: "seven_day_streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streak",
    requirement: 7
  },
  THIRTY_DAY_STREAK: {
    id: "thirty_day_streak",
    name: "Streak Master",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    category: "streak",
    requirement: 30
  },
  HUNDRED_DAY_STREAK: {
    id: "hundred_day_streak",
    name: "Legendary Streaker",
    description: "Maintain a 100-day streak",
    icon: "👑",
    category: "streak",
    requirement: 100
  },
  TEN_FOLLOWERS: {
    id: "ten_followers",
    name: "Popular",
    description: "Get 10 followers",
    icon: "👥",
    category: "social",
    requirement: 10
  },
  FIFTY_FOLLOWERS: {
    id: "fifty_followers",
    name: "Influencer",
    description: "Get 50 followers",
    icon: "⭐",
    category: "social",
    requirement: 50
  },
  DAILY_WRITER: {
    id: "daily_writer",
    name: "Daily Habit",
    description: "Journal every day for a week",
    icon: "📅",
    category: "consistency",
    requirement: 7
  }
};

export class AchievementService {
  static getLevel(totalEntries: number): number {
    if (totalEntries < 5) return 1;
    if (totalEntries < 10) return 2;
    if (totalEntries < 25) return 3;
    if (totalEntries < 50) return 4;
    if (totalEntries < 100) return 5;
    if (totalEntries < 200) return 6;
    if (totalEntries < 500) return 7;
    return 8;
  }

  static getLevelName(level: number): string {
    const names = ["Novice", "Beginner", "Explorer", "Journaler", "Dedicated", "Passionate", "Master", "Legend"];
    return names[Math.min(level - 1, 7)];
  }

  static getProgressToNextLevel(totalEntries: number): { current: number; next: number; progress: number } {
    const thresholds = [0, 5, 10, 25, 50, 100, 200, 500];
    const level = this.getLevel(totalEntries);
    const current = thresholds[level - 1] || 0;
    const next = thresholds[level] || 1000;
    const progress = Math.min(100, Math.round(((totalEntries - current) / (next - current)) * 100));
    return { current, next, progress };
  }

  static checkAchievements(
    totalEntries: number,
    totalWords: number,
    currentStreak: number,
    followerCount: number
  ): Achievement[] {
    const unlocked: Achievement[] = [];

    if (totalEntries >= 1) unlocked.push(ACHIEVEMENTS.FIRST_ENTRY as Achievement);
    if (totalEntries >= 5) unlocked.push(ACHIEVEMENTS.FIVE_ENTRIES as Achievement);
    if (totalEntries >= 50) unlocked.push(ACHIEVEMENTS.FIFTY_ENTRIES as Achievement);
    if (totalEntries >= 100) unlocked.push(ACHIEVEMENTS.HUNDRED_ENTRIES as Achievement);
    if (totalWords >= 1000) unlocked.push(ACHIEVEMENTS.THOUSAND_WORDS as Achievement);
    if (totalWords >= 10000) unlocked.push(ACHIEVEMENTS.TEN_THOUSAND_WORDS as Achievement);
    if (currentStreak >= 7) unlocked.push(ACHIEVEMENTS.SEVEN_DAY_STREAK as Achievement);
    if (currentStreak >= 30) unlocked.push(ACHIEVEMENTS.THIRTY_DAY_STREAK as Achievement);
    if (currentStreak >= 100) unlocked.push(ACHIEVEMENTS.HUNDRED_DAY_STREAK as Achievement);
    if (followerCount >= 10) unlocked.push(ACHIEVEMENTS.TEN_FOLLOWERS as Achievement);
    if (followerCount >= 50) unlocked.push(ACHIEVEMENTS.FIFTY_FOLLOWERS as Achievement);

    return unlocked;
  }

  static getAchievementStats(totalEntries: number) {
    const level = this.getLevel(totalEntries);
    const levelName = this.getLevelName(level);
    const { current, next, progress } = this.getProgressToNextLevel(totalEntries);

    return {
      level,
      levelName,
      nextLevel: level + 1,
      nextLevelName: this.getLevelName(level + 1),
      entriesUntilNextLevel: next - totalEntries,
      progressToNextLevel: progress,
      totalProgress: Math.round((totalEntries / 500) * 100)
    };
  }
}
