export interface JournalEntry {
  id: number;
  userId: number;
  title: string;
  content: string;
  mood: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: number;
  userId: number;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserStats {
  id: number;
  userId: number;
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  updatedAt: string;
}

export interface AIPrompt {
  prompt: string;
}

export interface AIInsight {
  insight: string;
}

export type MoodEmoji = "😊" | "😐" | "😔" | "🤔" | "😄" | "🎉" | "😠" | "😴";
