#!/usr/bin/env node

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let dbUrl = process.env.DATABASE_URL;
if (dbUrl?.includes('DATABASE_URL=')) {
  dbUrl = dbUrl.replace('DATABASE_URL=', '');
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up JournOwl database tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        avatar TEXT,
        theme TEXT DEFAULT 'purple',
        bio TEXT,
        favorite_quote TEXT,
        preferences JSONB,
        ai_personality TEXT DEFAULT 'friendly',
        provider TEXT DEFAULT 'local',
        provider_id TEXT,
        profile_image_url TEXT,
        first_name TEXT,
        last_name TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_banned BOOLEAN DEFAULT FALSE,
        ban_reason TEXT,
        banned_at TIMESTAMP,
        banned_by INTEGER,
        is_flagged BOOLEAN DEFAULT FALSE,
        flag_reason TEXT,
        flagged_at TIMESTAMP,
        flagged_by INTEGER,
        suspicious_activity_count INTEGER DEFAULT 0,
        last_suspicious_activity TIMESTAMP,
        last_login_at TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        email_verification_token TEXT,
        email_verification_expires TIMESTAMP,
        requires_email_verification BOOLEAN DEFAULT TRUE,
        current_plan TEXT DEFAULT 'free',
        prompts_used_this_month INTEGER DEFAULT 0,
        prompts_remaining INTEGER DEFAULT 100,
        storage_used_mb INTEGER DEFAULT 0,
        last_usage_reset TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create session table
    await client.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
    `);

    // Create journal_entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        font_family TEXT DEFAULT 'Inter',
        font_size INTEGER DEFAULT 16,
        text_color TEXT DEFAULT '#ffffff',
        background_color TEXT DEFAULT '#1e293b',
        drawings JSONB,
        photos JSONB,
        tags JSONB,
        ai_insights JSONB,
        is_private BOOLEAN DEFAULT FALSE,
        location TEXT,
        weather TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create user_stats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) UNIQUE,
        total_entries INTEGER DEFAULT 0,
        total_words INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_entry_date TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create achievements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        achievement_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT DEFAULT '🏆',
        rarity TEXT DEFAULT 'common',
        type TEXT NOT NULL,
        target_value INTEGER DEFAULT 0,
        current_value INTEGER DEFAULT 0,
        unlocked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        goal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        difficulty TEXT DEFAULT 'beginner',
        target_value INTEGER NOT NULL,
        current_value INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        deadline TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ All database tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();