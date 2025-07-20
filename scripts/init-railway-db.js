#!/usr/bin/env node

import postgres from 'postgres';
import bcrypt from 'bcrypt';

// Railway PostgreSQL connection
const sql = postgres("postgresql://postgres:CzuYLahCEgyGOhgyERweTArgAgDqUhSL@ballast.proxy.rlwy.net:32118/railway", {
  ssl: { rejectUnauthorized: false }
});

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Railway PostgreSQL database...');
    
    // Create users table
    await sql`
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
        preferences JSON,
        ai_personality TEXT DEFAULT 'friendly',
        provider TEXT DEFAULT 'local',
        provider_id TEXT,
        profile_image_url TEXT,
        first_name TEXT,
        last_name TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        current_plan TEXT DEFAULT 'free',
        prompts_used_this_month INTEGER DEFAULT 0,
        prompts_remaining INTEGER DEFAULT 100,
        storage_used_mb INTEGER DEFAULT 0,
        last_usage_reset TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Users table created');

    // Create journal_entries table
    await sql`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        font_family TEXT DEFAULT 'Inter',
        font_size INTEGER DEFAULT 16,
        text_color TEXT DEFAULT '#ffffff',
        background_color TEXT DEFAULT '#1e293b',
        drawings JSON,
        photos JSON,
        tags JSON,
        ai_insights JSON,
        is_private BOOLEAN DEFAULT FALSE,
        location TEXT,
        weather TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Journal entries table created');

    // Create achievements table
    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        achievement_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        rarity TEXT NOT NULL,
        type TEXT NOT NULL,
        target_value INTEGER,
        current_value INTEGER DEFAULT 0,
        unlocked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Achievements table created');

    // Create user_stats table
    await sql`
      CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        total_entries INTEGER DEFAULT 0,
        total_words INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_entry_date TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ User stats table created');

    // Create session table for express-session
    await sql`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (sid)
      )
    `;
    console.log('✅ Session table created');

    // Create other necessary tables
    await sql`
      CREATE TABLE IF NOT EXISTS mood_trends (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        date TIMESTAMP DEFAULT NOW() NOT NULL,
        mood TEXT NOT NULL,
        value INTEGER NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        goal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        target_value INTEGER NOT NULL,
        current_value INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        deadline TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS journal_prompts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        tags JSON DEFAULT '[]',
        is_kid_friendly BOOLEAN DEFAULT FALSE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_analytics (
        id SERIAL PRIMARY KEY,
        total_users INTEGER DEFAULT 0,
        total_entries INTEGER DEFAULT 0,
        active_users INTEGER DEFAULT 0,
        new_users_today INTEGER DEFAULT 0,
        average_words_per_entry INTEGER DEFAULT 0,
        date TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create email_campaigns table
    await sql`
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        html_content TEXT,
        target_audience TEXT DEFAULT 'all',
        status TEXT DEFAULT 'draft',
        scheduled_at TIMESTAMP,
        sent_at TIMESTAMP,
        recipient_count INTEGER DEFAULT 0,
        open_rate INTEGER DEFAULT 0,
        click_rate INTEGER DEFAULT 0,
        created_by INTEGER REFERENCES users(id) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create user_activity_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action TEXT NOT NULL,
        details JSON,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create site_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT,
        type TEXT DEFAULT 'string',
        description TEXT,
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create moderation_queue table
    await sql`
      CREATE TABLE IF NOT EXISTS moderation_queue (
        id SERIAL PRIMARY KEY,
        content_type TEXT NOT NULL,
        content_id INTEGER NOT NULL,
        reported_by INTEGER REFERENCES users(id),
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create announcements table
    await sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        target_audience TEXT DEFAULT 'all',
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        created_by INTEGER REFERENCES users(id) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create support_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        message TEXT NOT NULL,
        sender VARCHAR(10) NOT NULL,
        attachment_url VARCHAR,
        attachment_type VARCHAR(20),
        admin_name VARCHAR,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create prompt_purchases table
    await sql`
      CREATE TABLE IF NOT EXISTS prompt_purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        stripe_payment_id TEXT NOT NULL UNIQUE,
        amount INTEGER NOT NULL,
        prompts_added INTEGER NOT NULL,
        status TEXT DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✅ All tables created successfully');

    // Create admin user
    const hashedPassword = await bcrypt.hash('7756guru', 10);
    
    // Check if admin user already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = 'CraftyGuru@1ofakindpiece.com'
    `;

    if (existingAdmin.length === 0) {
      await sql`
        INSERT INTO users (
          email, username, password, role, level, xp, 
          first_name, last_name, is_active, email_verified,
          current_plan, prompts_remaining
        ) VALUES (
          'CraftyGuru@1ofakindpiece.com', 
          'CraftyGuru', 
          ${hashedPassword}, 
          'admin', 
          25, 
          24500,
          'Crafty',
          'Guru',
          TRUE,
          TRUE,
          'pro',
          1000
        )
      `;
      
      // Create admin user stats
      const adminUser = await sql`SELECT id FROM users WHERE email = 'CraftyGuru@1ofakindpiece.com'`;
      const adminId = adminUser[0].id;
      
      await sql`
        INSERT INTO user_stats (
          user_id, total_entries, total_words, current_streak, longest_streak
        ) VALUES (
          ${adminId}, 42, 15600, 12, 18
        )
      `;

      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('🔑 Admin credentials: CraftyGuru@1ofakindpiece.com / 7756guru');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await sql.end();
  }
}

initializeDatabase();