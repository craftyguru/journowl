-- Create session table for express-session
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  quote TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  theme VARCHAR(50) DEFAULT 'light',
  email_verified BOOLEAN DEFAULT FALSE,
  ai_personality VARCHAR(50) DEFAULT 'friendly',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500),
  content TEXT,
  mood VARCHAR(100),
  tags TEXT[],
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  font_family VARCHAR(100),
  font_size INTEGER,
  font_color VARCHAR(50),
  background_color VARCHAR(50),
  photos TEXT[],
  drawings JSONB,
  ai_analysis JSONB,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_entries INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  rarity VARCHAR(50) DEFAULT 'common',
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  category VARCHAR(100),
  difficulty VARCHAR(50) DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, goal_id)
);

-- Create mood_trends table
CREATE TABLE IF NOT EXISTS mood_trends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  entry_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mood, date)
);

-- Create journal_prompts table
CREATE TABLE IF NOT EXISTS journal_prompts (
  id SERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  category VARCHAR(100),
  difficulty VARCHAR(50) DEFAULT 'beginner',
  is_kid_friendly BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert some default prompts
INSERT INTO journal_prompts (prompt, category, difficulty, is_kid_friendly) VALUES
('What made you smile today?', 'reflection', 'beginner', true),
('Describe your perfect day', 'dreams', 'beginner', true),
('What are you grateful for?', 'mindfulness', 'beginner', true),
('Write about a challenge you overcame', 'reflection', 'intermediate', false),
('What would you tell your younger self?', 'reflection', 'advanced', false)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_trends_user_id ON mood_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_trends_date ON mood_trends(date);
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);