const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createDemoAccount() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if demo account already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      ['demo@journowl.app', 'demo_user']
    );

    if (existingUser.rows.length > 0) {
      console.log('Demo account already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create demo user
    const userResult = await client.query(`
      INSERT INTO users (
        email, 
        username, 
        password_hash, 
        email_verified, 
        created_at, 
        updated_at,
        xp,
        level,
        streak_count,
        streak_frozen,
        profile_picture,
        bio
      ) VALUES (
        $1, $2, $3, true, NOW(), NOW(), 1500, 5, 15, false,
        'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        'Welcome to my demo journal! This is a test account where you can explore all the features of JournOwl.'
      ) RETURNING id
    `, ['demo@journowl.app', 'demo_user', hashedPassword]);

    const userId = userResult.rows[0].id;
    console.log('Created demo user with ID:', userId);

    // Add some sample journal entries
    const sampleEntries = [
      {
        title: "My First Journal Entry",
        content: "Welcome to JournOwl! This is a sample journal entry to show you how the app works. You can write about your thoughts, experiences, and memories here. The AI can help analyze your writing and provide insights.",
        mood: "😊",
        tags: ["welcome", "first-entry", "demo"]
      },
      {
        title: "A Productive Day",
        content: "Today was really productive! I accomplished several tasks on my to-do list and felt a great sense of achievement. The weather was perfect for a walk in the park, and I took some time to reflect on my goals.",
        mood: "🎯",
        tags: ["productivity", "achievement", "goals"]
      },
      {
        title: "Reflecting on Growth",
        content: "It's amazing how much I've grown over the past few months. Journaling has really helped me understand my thoughts and emotions better. I'm grateful for this journey of self-discovery.",
        mood: "🌱",
        tags: ["growth", "reflection", "gratitude"]
      }
    ];

    for (const entry of sampleEntries) {
      await client.query(`
        INSERT INTO journal_entries (
          user_id, 
          title, 
          content, 
          mood, 
          tags, 
          created_at, 
          updated_at,
          word_count,
          reading_time
        ) VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days', NOW(), $6, $7)
      `, [
        userId, 
        entry.title, 
        entry.content, 
        entry.mood, 
        JSON.stringify(entry.tags),
        entry.content.split(' ').length,
        Math.ceil(entry.content.split(' ').length / 200) // Rough reading time estimate
      ]);
    }

    // Add some achievements
    await client.query(`
      INSERT INTO achievements (user_id, achievement_type, earned_at)
      VALUES 
        ($1, 'first_entry', NOW() - INTERVAL '20 days'),
        ($1, 'weekly_writer', NOW() - INTERVAL '10 days'),
        ($1, 'streak_master', NOW() - INTERVAL '5 days')
    `, [userId]);

    // Add some goals
    await client.query(`
      INSERT INTO goals (user_id, title, description, target_value, current_value, created_at)
      VALUES 
        ($1, 'Write Daily', 'Write at least one journal entry every day', 30, 15, NOW() - INTERVAL '15 days'),
        ($1, 'Mindful Moments', 'Practice mindfulness through reflective writing', 50, 25, NOW() - INTERVAL '10 days')
    `, [userId]);

    console.log('Demo account setup completed successfully!');
    console.log('Demo credentials:');
    console.log('Email: demo@journowl.app');
    console.log('Username: demo_user');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error creating demo account:', error);
  } finally {
    await client.end();
  }
}

createDemoAccount();