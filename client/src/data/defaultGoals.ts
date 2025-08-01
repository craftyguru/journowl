export const defaultGoals = [
  {
    id: 'entries_per_week',
    title: 'Weekly Writing Goal',
    description: 'Write at least 3 journal entries this week',
    type: 'entries',
    targetValue: 3,
    currentValue: 0,
    difficulty: 'Easy',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'words_per_month',
    title: 'Monthly Word Count',
    description: 'Write 5,000 words this month',
    type: 'words',
    targetValue: 5000,
    currentValue: 0,
    difficulty: 'Medium',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'daily_streak',
    title: 'Daily Streak Challenge',
    description: 'Write every day for 7 days straight',
    type: 'streak',
    targetValue: 7,
    currentValue: 0,
    difficulty: 'Hard',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'photo_entries',
    title: 'Visual Storytelling',
    description: 'Add photos to 5 journal entries',
    type: 'photos',
    targetValue: 5,
    currentValue: 0,
    difficulty: 'Easy',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mood_tracking',
    title: 'Mood Awareness',
    description: 'Track your mood daily for 2 weeks',
    type: 'mood',
    targetValue: 14,
    currentValue: 0,
    difficulty: 'Medium',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];