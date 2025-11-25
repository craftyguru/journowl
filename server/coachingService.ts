export class CoachingService {
  static async generatePersonalizedPrompt(
    recentMoods: string[],
    recentTags: string[],
    currentStreak: number,
    entries: any[]
  ): Promise<{ prompt: string; tip: string; focus: string }> {
    // Analyze mood patterns
    const moodCounts: Record<string, number> = {};
    recentMoods.forEach((mood: string) => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "thoughtful";
    const moodTrend = this.analyzeMoodTrend(recentMoods);

    // Identify patterns and themes
    const tagCounts: Record<string, number> = {};
    recentTags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const topThemes = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    // Generate contextual prompt
    let prompt = "";
    let tip = "";
    let focus = "";

    if (moodTrend === "improving") {
      prompt = `You're on an upward trajectory! 📈 Today, explore what's contributing to your positive momentum. What's one specific thing that made you feel better lately?`;
      tip = `Celebrate small wins - your ${currentStreak}-day streak shows real commitment!`;
      focus = "growth";
    } else if (moodTrend === "declining") {
      prompt = `Your mood has been shifting. 🌊 Write about what might be weighing on you. Sometimes naming it helps.`;
      tip = `Consider reaching out to someone you trust or trying a small activity that usually lifts your mood.`;
      focus = "support";
    } else {
      prompt = `Your mood has been consistent. 🎯 Dive deeper today - what would you like to understand better about yourself?`;
      tip = `Consistency is powerful. Use this stable moment to explore a new aspect of your inner world.`;
      focus = "reflection";
    }

    // Personalize based on themes
    if (topThemes.length > 0) {
      prompt += ` (You've been reflecting on ${topThemes.join(", ")} - keep exploring!)`;
    }

    return { prompt, tip, focus };
  }

  static analyzeMoodTrend(recentMoods: string[]): "improving" | "declining" | "stable" {
    if (recentMoods.length < 2) return "stable";

    const positiveEmojis = ["😊", "😄", "🤩", "😌", "🙌"];
    const recentHalf = recentMoods.slice(-Math.ceil(recentMoods.length / 2));
    const olderHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));

    const recentPositiveCount = recentHalf.filter(m => positiveEmojis.includes(m)).length;
    const olderPositiveCount = olderHalf.filter(m => positiveEmojis.includes(m)).length;

    const recentRatio = recentPositiveCount / recentHalf.length;
    const olderRatio = olderPositiveCount / olderHalf.length;

    if (recentRatio > olderRatio + 0.2) return "improving";
    if (recentRatio < olderRatio - 0.2) return "declining";
    return "stable";
  }

  static generateGrowthRecommendations(stats: any): string[] {
    const recommendations = [];

    if (stats.currentStreak >= 30 && stats.currentStreak < 60) {
      recommendations.push("You're in the habit-building zone! Keep this up for 30 more days to cement the habit.");
    }

    if (stats.currentStreak >= 7 && stats.currentStreak < 14) {
      recommendations.push("One week down! Push to two weeks - that's when journaling becomes your sanctuary.");
    }

    if (stats.totalWords > 50000) {
      recommendations.push("50K+ words written! Consider sharing your journey or exploring deeper themes.");
    }

    if (stats.totalEntries > 100 && stats.totalEntries % 50 === 0) {
      recommendations.push(`Milestone: ${stats.totalEntries} entries! Celebrate this progress with yourself.`);
    }

    if (!recommendations.length) {
      recommendations.push("Start today - every entry brings you closer to self-understanding.");
      recommendations.push("Consistency over perfection - write whenever it feels right for you.");
    }

    return recommendations;
  }
}
