-- SkillSwap Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== PROFILES TABLE =====
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  campus TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===== SKILLS TABLE =====
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policies for skills
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create skills"
  ON skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Seed some common skills
INSERT INTO skills (name, category) VALUES
  ('Python', 'Programming'),
  ('JavaScript', 'Programming'),
  ('React', 'Programming'),
  ('SQL', 'Programming'),
  ('Machine Learning', 'Programming'),
  ('Data Science', 'Programming'),
  ('Excel', 'Business'),
  ('Financial Modeling', 'Business'),
  ('Public Speaking', 'Business'),
  ('Copywriting', 'Business'),
  ('Content Writing', 'Business'),
  ('Guitar', 'Music'),
  ('Piano', 'Music'),
  ('Music Theory', 'Music'),
  ('Photography', 'Creative'),
  ('Video Editing', 'Creative'),
  ('Lightroom', 'Creative'),
  ('Adobe Premiere', 'Creative'),
  ('Figma', 'Design'),
  ('UI/UX Design', 'Design'),
  ('Canva', 'Design'),
  ('Yoga', 'Wellness'),
  ('Meditation', 'Wellness'),
  ('Tarot Reading', 'Wellness'),
  ('Social Media Marketing', 'Marketing'),
  ('Power BI', 'Analytics'),
  ('Tableau', 'Analytics');

-- ===== USER_SKILLS TABLE =====
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('teach', 'learn')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id, type)
);

-- Enable RLS
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Policies for user_skills
CREATE POLICY "User skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id);

-- ===== MATCHES TABLE =====
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_a_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_b_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  is_mutual BOOLEAN DEFAULT false,
  match_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a_id, user_b_id, skill_a_id, skill_b_id)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies for matches
CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ===== MESSAGES TABLE =====
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view messages in their matches"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- ===== BOOKINGS TABLE =====
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_mins INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('online', 'in-person')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view bookings in their matches"
  ON bookings FOR SELECT
  USING (
    auth.uid() = requester_id OR
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = bookings.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can create bookings in their matches"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = requester_id AND
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Users can update bookings they're part of"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = requester_id OR
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = bookings.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- ===== FUNCTIONS =====

-- Function to find skill matches for a user
CREATE OR REPLACE FUNCTION find_skill_matches(target_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  other_user_id UUID,
  skill_a_id UUID,
  skill_b_id UUID,
  is_mutual BOOLEAN,
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  -- Find mutual matches (both can teach what the other wants to learn)
  SELECT
    gen_random_uuid() AS match_id,
    us_teach.user_id AS other_user_id,
    us_learn.skill_id AS skill_a_id,
    us_teach.skill_id AS skill_b_id,
    true AS is_mutual,
    100 AS match_score
  FROM user_skills us_learn
  JOIN user_skills us_teach
    ON us_learn.skill_id = us_teach.skill_id
    AND us_teach.type = 'teach'
  WHERE us_learn.user_id = target_user_id
    AND us_learn.type = 'learn'
    AND us_teach.user_id != target_user_id
    AND EXISTS (
      SELECT 1 FROM user_skills my_teach
      WHERE my_teach.user_id = target_user_id
        AND my_teach.type = 'teach'
        AND my_teach.skill_id IN (
          SELECT skill_id FROM user_skills
          WHERE user_id = us_teach.user_id AND type = 'learn'
        )
    )
  
  UNION ALL
  
  -- Find one-sided matches (they can teach what I want to learn)
  SELECT
    gen_random_uuid() AS match_id,
    us_teach.user_id AS other_user_id,
    us_learn.skill_id AS skill_a_id,
    us_learn.skill_id AS skill_b_id,
    false AS is_mutual,
    50 AS match_score
  FROM user_skills us_learn
  JOIN user_skills us_teach
    ON us_learn.skill_id = us_teach.skill_id
    AND us_teach.type = 'teach'
  WHERE us_learn.user_id = target_user_id
    AND us_learn.type = 'learn'
    AND us_teach.user_id != target_user_id
  
  ORDER BY match_score DESC, other_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== INDEXES =====
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_type ON user_skills(type);
CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_bookings_match_id ON bookings(match_id);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);

-- ===== TRIGGERS =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
