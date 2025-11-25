export class NotificationService {
  static checkStreakMilestones(currentStreak: number): string | null {
    const milestones: Record<number, string> = {
      7: "🔥 7-Day Streak! You're on fire!",
      14: "🔥 14-Day Streak! Incredible consistency!",
      30: "🏆 30-Day Streak! You're a journaling champion!",
      60: "👑 60-Day Streak! Legendary dedication!",
      100: "⭐ 100-Day Streak! You're unstoppable!"
    };
    
    return milestones[currentStreak] || null;
  }

  static checkWordCountMilestones(totalWords: number): string | null {
    const milestones: Record<number, string> = {
      10000: "📖 10K Words! Your voice matters!",
      50000: "📖 50K Words! Prolific writer!",
      100000: "📖 100K Words! Author status unlocked!"
    };
    
    return Object.entries(milestones)
      .reverse()
      .find(([words]) => totalWords >= parseInt(words))?.[1] || null;
  }

  static checkEntryMilestones(totalEntries: number): string | null {
    const milestones: Record<number, string> = {
      10: "📝 10 Entries! You've started your journey!",
      50: "📝 50 Entries! Your story unfolds!",
      100: "📝 100 Entries! You're a journaling master!",
      365: "🌟 365 Entries! A full year of reflection!"
    };
    
    return Object.entries(milestones)
      .reverse()
      .find(([entries]) => totalEntries >= parseInt(entries))?.[1] || null;
  }

  static getStreakReminderTime(userTimeZone?: string): Date {
    const now = new Date();
    const reminderHour = 20; // 8 PM
    
    let reminderTime = new Date();
    reminderTime.setHours(reminderHour, 0, 0, 0);
    
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    return reminderTime;
  }

  static formatNotification(type: string, milestone: string): { title: string; body: string } {
    const [icon, message] = milestone.split(" ");
    
    return {
      title: `${icon} Streak Milestone!`,
      body: message
    };
  }

  static buildStreakReminderMessage(currentStreak: number, longestStreak: number): string {
    if (currentStreak === 0) {
      return "Start your streak today! Every entry counts. 🦉";
    }
    
    if (currentStreak > longestStreak * 0.5) {
      return `Keep going! You're ${longestStreak - currentStreak} entries away from your record! 🔥`;
    }
    
    return `Don't break your ${currentStreak}-day streak! Write today and keep the momentum. 📝`;
  }
}
