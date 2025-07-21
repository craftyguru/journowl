-- Create users table with correct schema matching shared/schema.ts
CREATE TABLE users (
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
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  banned_at TIMESTAMP,
  banned_by INTEGER,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  flagged_at TIMESTAMP,
  flagged_by INTEGER,
  suspicious_activity_count INTEGER DEFAULT 0,
  last_suspicious_activity TIMESTAMP,
  last_login_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP,
  requires_email_verification BOOLEAN DEFAULT true,
  current_plan TEXT DEFAULT 'free',
  prompts_used_this_month INTEGER DEFAULT 0,
  prompts_remaining INTEGER DEFAULT 100,
  storage_used_mb INTEGER DEFAULT 0,
  last_usage_reset TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
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
  is_private BOOLEAN DEFAULT false,
  location TEXT,
  weather TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  achievement_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common',
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  goal_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  category TEXT,
  difficulty TEXT DEFAULT 'beginner',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create mood_trends table
CREATE TABLE mood_trends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE user_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  total_entries INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  favorite_mood TEXT,
  average_words_per_entry INTEGER DEFAULT 0,
  most_active_hour INTEGER,
  total_photos INTEGER DEFAULT 0,
  total_drawings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create journal_prompts table
CREATE TABLE journal_prompts (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  prompt TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  is_kid_friendly BOOLEAN DEFAULT false,
  tags JSON,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create session table for express-session
CREATE TABLE session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

-- Create indexes
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_mood_trends_user_id ON mood_trends(user_id);
CREATE INDEX idx_mood_trends_date ON mood_trends(date);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_session_expire ON session(expire);

-- Insert some default journal prompts
INSERT INTO journal_prompts (category, prompt, difficulty, is_kid_friendly) VALUES
('reflection', 'What made you smile today?', 'beginner', true),
('dreams', 'Describe your perfect day', 'beginner', true),
('gratitude', 'What are you grateful for?', 'beginner', true),
('adventure', 'Write about a place you''d love to visit', 'beginner', true),
('memories', 'Tell me about your favorite childhood memory', 'intermediate', true),
('reflection', 'What challenge did you overcome recently?', 'intermediate', false),
('growth', 'What would you tell your younger self?', 'advanced', false),
('creativity', 'If you could invent anything, what would it be?', 'intermediate', true);