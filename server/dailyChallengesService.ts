export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  completedAt?: Date;
}

export interface UserChallengeProgress {
  userId: number;
  date: string;
  completedChallenges: string[];
  dailyBonus: number;
  streak: number;
}

class DailyChallengeStore {
  private challenges: Map<string, DailyChallenge> = new Map();
  private userProgress: Map<string, UserChallengeProgress> = new Map();
  private challengeId = 0;

  constructor() {
    this.initializeDailyChallenges();
  }

  private initializeDailyChallenges() {
    const dailyChallenges = [
      { title: "Morning Reflection", description: "Write about your intentions for today", icon: "🌅", difficulty: "easy" as const, reward: 10 },
      { title: "Gratitude Journal", description: "List 3 things you're grateful for", icon: "🙏", difficulty: "easy" as const, reward: 15 },
      { title: "Emotion Explorer", description: "Describe your current emotions in detail", icon: "😊", difficulty: "medium" as const, reward: 20 },
      { title: "100-Word Wonder", description: "Write exactly 100+ words in one entry", icon: "📝", difficulty: "medium" as const, reward: 25 },
      { title: "Growth Reflection", description: "Write about a recent personal win", icon: "🚀", difficulty: "easy" as const, reward: 15 },
      { title: "Creative Challenge", description: "Use 5+ different emojis in your entry", icon: "🎨", difficulty: "medium" as const, reward: 20 },
      { title: "Deep Dive", description: "Write 300+ words exploring a topic", icon: "🌊", difficulty: "hard" as const, reward: 50 },
      { title: "Voice Entry", description: "Record a voice journal entry", icon: "🎤", difficulty: "medium" as const, reward: 25 },
    ];

    dailyChallenges.forEach(challenge => {
      const id = `challenge_${++this.challengeId}`;
      this.challenges.set(id, {
        id,
        ...challenge,
        completed: false
      });
    });
  }

  getDailyChallenges(userId: number): DailyChallenge[] {
    const today = new Date().toISOString().split('T')[0];
    const progressKey = `${userId}_${today}`;
    const progress = this.userProgress.get(progressKey);

    return Array.from(this.challenges.values()).map(challenge => ({
      ...challenge,
      completed: progress?.completedChallenges.includes(challenge.id) || false
    }));
  }

  completeChallenge(userId: number, challengeId: string): { success: boolean; reward: number } {
    const today = new Date().toISOString().split('T')[0];
    const progressKey = `${userId}_${today}`;
    
    let progress = this.userProgress.get(progressKey);
    if (!progress) {
      progress = {
        userId,
        date: today,
        completedChallenges: [],
        dailyBonus: 0,
        streak: 0
      };
    }

    const challenge = this.challenges.get(challengeId);
    if (!challenge || progress.completedChallenges.includes(challengeId)) {
      return { success: false, reward: 0 };
    }

    progress.completedChallenges.push(challengeId);
    progress.dailyBonus += challenge.reward;
    this.userProgress.set(progressKey, progress);

    return { success: true, reward: challenge.reward };
  }

  getUserProgress(userId: number): UserChallengeProgress | null {
    const today = new Date().toISOString().split('T')[0];
    const progressKey = `${userId}_${today}`;
    return this.userProgress.get(progressKey) || null;
  }

  getCompletionStats(userId: number): { totalCompleted: number; totalReward: number; streak: number } {
    const today = new Date().toISOString().split('T')[0];
    const progressKey = `${userId}_${today}`;
    const progress = this.userProgress.get(progressKey);

    return {
      totalCompleted: progress?.completedChallenges.length || 0,
      totalReward: progress?.dailyBonus || 0,
      streak: progress?.streak || 0
    };
  }
}

const challengeStore = new DailyChallengeStore();

export class DailyChallengeService {
  static getDailyChallenges(userId: number): DailyChallenge[] {
    return challengeStore.getDailyChallenges(userId);
  }

  static completeChallenge(userId: number, challengeId: string): { success: boolean; reward: number } {
    return challengeStore.completeChallenge(userId, challengeId);
  }

  static getUserProgress(userId: number): UserChallengeProgress | null {
    return challengeStore.getUserProgress(userId);
  }

  static getCompletionStats(userId: number) {
    return challengeStore.getCompletionStats(userId);
  }
}
