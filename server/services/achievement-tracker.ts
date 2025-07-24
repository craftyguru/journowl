import { storage } from "../storage";
import type { User, JournalEntry } from "@shared/schema";

// Define all 24 achievements with their tracking criteria
const ACHIEVEMENT_DEFINITIONS = [
  // Common achievements (easy to get)
  { id: "first_steps", title: "First Steps", description: "Write your first journal entry", icon: "📝", rarity: "common", type: "milestone", targetValue: 1 },
  { id: "daily_writer", title: "Daily Writer", description: "Write for 3 consecutive days", icon: "📅", rarity: "common", type: "streak", targetValue: 3 },
  { id: "word_explorer", title: "Word Explorer", description: "Write 100 words in a single entry", icon: "📚", rarity: "common", type: "writing", targetValue: 100 },
  { id: "mood_tracker", title: "Mood Tracker", description: "Track your mood for 5 days", icon: "😊", rarity: "common", type: "mood", targetValue: 5 },
  { id: "early_bird", title: "Early Bird", description: "Write an entry before 9 AM", icon: "🌅", rarity: "common", type: "time", targetValue: 1 },
  { id: "night_owl", title: "Night Owl", description: "Write an entry after 10 PM", icon: "🌙", rarity: "common", type: "time", targetValue: 1 },
  { id: "grateful_heart", title: "Grateful Heart", description: "Write about gratitude 3 times", icon: "🙏", rarity: "common", type: "reflection", targetValue: 3 },
  { id: "weather_reporter", title: "Weather Reporter", description: "Mention weather in 5 entries", icon: "🌤️", rarity: "common", type: "observation", targetValue: 5 },
  
  // Rare achievements (moderate difficulty)
  { id: "weekly_warrior", title: "Weekly Warrior", description: "Write every day for a week", icon: "⚔️", rarity: "rare", type: "streak", targetValue: 7 },
  { id: "storyteller", title: "Storyteller", description: "Write 500 words in one entry", icon: "📖", rarity: "rare", type: "writing", targetValue: 500 },
  { id: "photo_memory", title: "Photo Memory", description: "Add 10 photos to your entries", icon: "📸", rarity: "rare", type: "media", targetValue: 10 },
  { id: "emoji_master", title: "Emoji Master", description: "Use 50 different emojis", icon: "🎭", rarity: "rare", type: "creative", targetValue: 50 },
  { id: "deep_thinker", title: "Deep Thinker", description: "Write reflective entries for 10 days", icon: "🤔", rarity: "rare", type: "reflection", targetValue: 10 },
  { id: "adventure_logger", title: "Adventure Logger", description: "Document 15 different activities", icon: "🗺️", rarity: "rare", type: "adventure", targetValue: 15 },
  { id: "mood_rainbow", title: "Mood Rainbow", description: "Experience all 7 mood types", icon: "🌈", rarity: "rare", type: "mood", targetValue: 7 },
  { id: "time_traveler", title: "Time Traveler", description: "Write about past memories 20 times", icon: "⏰", rarity: "rare", type: "memory", targetValue: 20 },
  
  // Epic achievements (challenging)
  { id: "monthly_champion", title: "Monthly Champion", description: "Write every day for 30 days", icon: "🏆", rarity: "epic", type: "streak", targetValue: 30 },
  { id: "novel_writer", title: "Novel Writer", description: "Write 5,000 words total", icon: "📜", rarity: "epic", type: "writing", targetValue: 5000 },
  { id: "memory_keeper", title: "Memory Keeper", description: "Create 100 journal entries", icon: "🗂️", rarity: "epic", type: "milestone", targetValue: 100 },
  { id: "artist", title: "Artist", description: "Add drawings to 20 entries", icon: "🎨", rarity: "epic", type: "creative", targetValue: 20 },
  { id: "wisdom_seeker", title: "Wisdom Seeker", description: "Write philosophical thoughts 25 times", icon: "🧠", rarity: "epic", type: "wisdom", targetValue: 25 },
  { id: "social_butterfly", title: "Social Butterfly", description: "Write about relationships 30 times", icon: "🦋", rarity: "epic", type: "social", targetValue: 30 },
  { id: "goal_crusher", title: "Goal Crusher", description: "Complete 50 personal goals", icon: "💪", rarity: "epic", type: "achievement", targetValue: 50 },
  { id: "master_chronicler", title: "Master Chronicler", description: "Write 10,000 words lifetime", icon: "👑", rarity: "legendary", type: "legendary", targetValue: 10000 }
];

// Define all 24 goals with their tracking criteria
const GOAL_DEFINITIONS = [
  // Beginner goals (daily habits)
  { id: "daily_writing", title: "Daily Writing", description: "Write at least one journal entry every day", type: "streak", targetValue: 7, difficulty: "beginner" },
  { id: "word_count_goal", title: "Word Count Goal", description: "Write at least 100 words per entry", type: "writing", targetValue: 100, difficulty: "beginner" },
  { id: "mood_tracking", title: "Mood Tracking", description: "Track your mood for 5 consecutive days", type: "mood", targetValue: 5, difficulty: "beginner" },
  { id: "photo_memories", title: "Photo Memories", description: "Add photos to 3 journal entries", type: "media", targetValue: 3, difficulty: "beginner" },
  { id: "morning_pages", title: "Morning Pages", description: "Write 3 morning entries this week", type: "routine", targetValue: 3, difficulty: "beginner" },
  { id: "gratitude_practice", title: "Gratitude Practice", description: "List 3 things you're grateful for daily", type: "gratitude", targetValue: 3, difficulty: "beginner" },
  { id: "emotion_explorer", title: "Emotion Explorer", description: "Use 10 different emotion words", type: "vocabulary", targetValue: 10, difficulty: "beginner" },
  { id: "weekend_warrior", title: "Weekend Warrior", description: "Write on both weekend days", type: "consistency", targetValue: 2, difficulty: "beginner" },
  
  // Intermediate goals (weekly habits)
  { id: "weekly_consistency", title: "Weekly Consistency", description: "Maintain a 7-day writing streak", type: "streak", targetValue: 7, difficulty: "intermediate" },
  { id: "detailed_entries", title: "Detailed Entries", description: "Write entries with at least 300 words", type: "writing", targetValue: 300, difficulty: "intermediate" },
  { id: "creative_expression", title: "Creative Expression", description: "Use drawings in 5 journal entries", type: "creative", targetValue: 5, difficulty: "intermediate" },
  { id: "reflection_master", title: "Reflection Master", description: "Write about gratitude for 7 days", type: "reflection", targetValue: 7, difficulty: "intermediate" },
  { id: "memory_lane", title: "Memory Lane", description: "Write about 10 childhood memories", type: "memory", targetValue: 10, difficulty: "intermediate" },
  { id: "dream_journal", title: "Dream Journal", description: "Record 15 dreams or aspirations", type: "dreams", targetValue: 15, difficulty: "intermediate" },
  { id: "adventure_seeker", title: "Adventure Seeker", description: "Document 12 new experiences", type: "adventure", targetValue: 12, difficulty: "intermediate" },
  { id: "social_stories", title: "Social Stories", description: "Write about relationships 20 times", type: "social", targetValue: 20, difficulty: "intermediate" },
  
  // Advanced goals (long-term achievements)
  { id: "monthly_champion", title: "Monthly Champion", description: "Write every day for 30 days", type: "streak", targetValue: 30, difficulty: "advanced" },
  { id: "novel_writer", title: "Novel Writer", description: "Write a total of 5,000 words", type: "writing", targetValue: 5000, difficulty: "advanced" },
  { id: "memory_keeper", title: "Memory Keeper", description: "Create 50 journal entries", type: "milestone", targetValue: 50, difficulty: "advanced" },
  { id: "mindfulness_journey", title: "Mindfulness Journey", description: "Practice mindful writing for 21 days", type: "mindfulness", targetValue: 21, difficulty: "advanced" },
  { id: "wisdom_collector", title: "Wisdom Collector", description: "Write 100 life lessons learned", type: "wisdom", targetValue: 100, difficulty: "advanced" },
  { id: "year_of_growth", title: "Year of Growth", description: "Maintain 100-day writing streak", type: "epic", targetValue: 100, difficulty: "advanced" },
  { id: "master_storyteller", title: "Master Storyteller", description: "Write 8,000 words total", type: "mastery", targetValue: 8000, difficulty: "advanced" },
  { id: "life_chronicler", title: "Life Chronicler", description: "Document 150 significant moments", type: "chronicle", targetValue: 150, difficulty: "advanced" }
];

export class AchievementTracker {
  // Initialize all achievements and goals for a new user
  static async initializeUserProgress(userId: number): Promise<void> {
    // Create all achievements in locked state
    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      try {
        await storage.createAchievement({
          userId,
          achievementId: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity,
          type: achievement.type
        } as any);
      } catch (error) {
        // Ignore if already exists
      }
    }

    // Create all goals with initial progress
    for (const goal of GOAL_DEFINITIONS) {
      try {
        await storage.createGoal({
          userId,
          goalId: goal.id,
          title: goal.title,
          description: goal.description || '',
          type: goal.type,
          difficulty: goal.difficulty,
          targetValue: goal.targetValue
        } as any);
      } catch (error) {
        // Ignore if already exists
      }
    }

    // Create a welcome achievement
    try {
      await storage.createAchievement({
        userId,
        achievementId: "welcome_owl",
        title: "Welcome to JournOwl!",
        description: "You've taken your first step on the journey to wise journaling",
        icon: "🦉",
        rarity: "common",
        type: "milestone"
      } as any);
    } catch (error) {
      // Ignore if already exists
    }
  }

  // Update achievement progress based on user actions
  static async updateAchievementProgress(userId: number, achievementId: string, newValue: number): Promise<void> {
    // Award small amounts of XP to prevent overflow
    const user = await storage.getUser(userId);
    if (user && newValue > 0) {
      // Award only 5 XP per achievement progress to prevent rapid accumulation
      await storage.updateUserXP(userId, 5);
    }
  }

  // Update goal progress based on user actions
  static async updateGoalProgress(userId: number, goalId: string, newValue: number): Promise<void> {
    // Award small amounts of XP to prevent overflow
    const user = await storage.getUser(userId);
    if (user && newValue > 0) {
      // Award only 2 XP per goal progress to prevent rapid accumulation
      await storage.updateUserXP(userId, 2);
    }
  }

  // Track journal entry creation and update relevant achievements/goals
  static async trackJournalEntry(userId: number, entry: JournalEntry): Promise<void> {
    const stats = await storage.getUserStats(userId);
    if (!stats) return;

    const wordCount = entry.wordCount || 0;
    const entryCount = stats.totalEntries + 1;
    const totalWords = stats.totalWords + wordCount;
    
    // Update streak tracking
    const today = new Date();
    const lastEntryDate = stats.lastEntryDate;
    let currentStreak = stats.currentStreak;
    
    if (lastEntryDate) {
      const daysSinceLastEntry = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastEntry === 1) {
        currentStreak += 1;
      } else if (daysSinceLastEntry > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    // Update user stats
    await storage.updateUserStats(userId, {
      totalEntries: entryCount,
      totalWords: totalWords,
      currentStreak: currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      lastEntryDate: today
    });

    // Update achievements
    await this.updateAchievementProgress(userId, "first_steps", 1);
    await this.updateAchievementProgress(userId, "memory_keeper", entryCount);
    await this.updateAchievementProgress(userId, "novel_writer", totalWords);
    await this.updateAchievementProgress(userId, "master_chronicler", totalWords);
    
    if (wordCount >= 100) {
      await this.updateAchievementProgress(userId, "word_explorer", 1);
    }
    if (wordCount >= 500) {
      await this.updateAchievementProgress(userId, "storyteller", 1);
    }
    
    // Streak achievements
    await this.updateAchievementProgress(userId, "daily_writer", currentStreak);
    await this.updateAchievementProgress(userId, "weekly_warrior", currentStreak);
    await this.updateAchievementProgress(userId, "monthly_champion", currentStreak);

    // Time-based achievements
    const hour = today.getHours();
    if (hour < 9) {
      await this.updateAchievementProgress(userId, "early_bird", 1);
    }
    if (hour >= 22) {
      await this.updateAchievementProgress(userId, "night_owl", 1);
    }

    // Check for keywords in content
    const content = entry.content.toLowerCase();
    if (content.includes('grateful') || content.includes('thankful') || content.includes('appreciate')) {
      await this.updateAchievementProgress(userId, "grateful_heart", 1);
    }
    if (content.includes('weather') || content.includes('sunny') || content.includes('rain') || content.includes('cloud')) {
      await this.updateAchievementProgress(userId, "weather_reporter", 1);
    }

    // Photos tracking
    if (entry.photos && Array.isArray(entry.photos) && entry.photos.length > 0) {
      const currentPhotoAchievement = await this.getCurrentAchievementValue(userId, "photo_memory");
      await this.updateAchievementProgress(userId, "photo_memory", currentPhotoAchievement + entry.photos.length);
    }

    // Drawings tracking
    if (entry.drawings && Array.isArray(entry.drawings) && entry.drawings.length > 0) {
      const currentDrawingAchievement = await this.getCurrentAchievementValue(userId, "artist");
      await this.updateAchievementProgress(userId, "artist", currentDrawingAchievement + 1);
    }

    // Update goals
    await this.updateGoalProgress(userId, "daily_writing", currentStreak);
    await this.updateGoalProgress(userId, "word_count_goal", wordCount);
    await this.updateGoalProgress(userId, "weekly_consistency", currentStreak);
    await this.updateGoalProgress(userId, "detailed_entries", wordCount);
    await this.updateGoalProgress(userId, "monthly_champion", currentStreak);
    await this.updateGoalProgress(userId, "novel_writer", totalWords);
    await this.updateGoalProgress(userId, "memory_keeper", entryCount);
    await this.updateGoalProgress(userId, "master_storyteller", totalWords);
    await this.updateGoalProgress(userId, "life_chronicler", entryCount);
  }

  // Helper method to get current achievement value
  private static async getCurrentAchievementValue(userId: number, achievementId: string): Promise<number> {
    const achievements = await storage.getUserAchievements(userId);
    const achievement = achievements.find(a => a.achievementId === achievementId);
    return achievement?.currentValue || 0;
  }

  // Track mood entries
  static async trackMoodEntry(userId: number, mood: string): Promise<void> {
    const currentMoodCount = await this.getCurrentAchievementValue(userId, "mood_tracker");
    await this.updateAchievementProgress(userId, "mood_tracker", currentMoodCount + 1);
    
    // Track unique moods for rainbow achievement
    const moodTypes = ['happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'frustrated'];
    const moodLower = mood.toLowerCase();
    if (moodTypes.includes(moodLower)) {
      // This would need more sophisticated tracking of unique moods
      await this.updateAchievementProgress(userId, "mood_rainbow", currentMoodCount + 1);
    }

    // Update mood-related goals
    await this.updateGoalProgress(userId, "mood_tracking", currentMoodCount + 1);
  }
}