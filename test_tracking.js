// Test script to verify real-time achievement and goal tracking
const { storage } = require('./server/storage.js');
const { AchievementTracker } = require('./server/services/achievement-tracker.js');

async function testTracking() {
  try {
    console.log('🧪 Testing real-time achievement and goal tracking...');
    
    // Get a test user (assuming user ID 1 exists)
    const userId = 1;
    const user = await storage.getUser(userId);
    
    if (!user) {
      console.log('❌ No test user found. Please create a user first.');
      return;
    }
    
    console.log(`✅ Testing with user: ${user.username} (ID: ${user.id})`);
    
    // Initialize tracking for the user
    console.log('🚀 Initializing achievement and goal tracking...');
    await AchievementTracker.initializeUserProgress(userId);
    
    // Get initial stats
    const beforeStats = await storage.getUserStats(userId);
    const beforeAchievements = await storage.getUserAchievements(userId);
    const beforeGoals = await storage.getUserGoals(userId);
    
    console.log(`📊 Before: XP=${beforeStats?.xp || 0}, Achievements=${beforeAchievements.length}, Goals=${beforeGoals.length}`);
    
    // Simulate creating a journal entry
    console.log('📝 Creating a test journal entry...');
    const testEntry = await storage.createJournalEntry({
      userId,
      title: "Testing Real-Time Tracking",
      content: "This is a test entry to verify that achievements and goals are being tracked in real-time. I'm feeling grateful today for this amazing journaling app!",
      mood: "happy",
      wordCount: 25
    });
    
    // Track the journal entry
    await AchievementTracker.trackJournalEntry(userId, testEntry);
    await AchievementTracker.trackMoodEntry(userId, testEntry.mood);
    
    // Get updated stats
    const afterStats = await storage.getUserStats(userId);
    const afterAchievements = await storage.getUserAchievements(userId);
    const afterGoals = await storage.getUserGoals(userId);
    
    console.log(`📈 After: XP=${afterStats?.xp || 0}, Achievements=${afterAchievements.length}, Goals=${afterGoals.length}`);
    
    // Show XP gained
    const xpGained = (afterStats?.xp || 0) - (beforeStats?.xp || 0);
    console.log(`🎉 XP Gained: +${xpGained}`);
    
    console.log('✅ Real-time tracking test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTracking();