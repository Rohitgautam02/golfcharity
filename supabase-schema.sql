-- USERS EXTENSION (Supabase auth.users already exists)
-- We extend with a profiles table

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' 
    CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'lapsed')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly')),
  subscription_renewal_date TIMESTAMPTZ,
  charity_id UUID, -- We'll add the reference after creating charities table
  charity_contribution_percent INTEGER DEFAULT 10 
    CHECK (charity_contribution_percent >= 10 AND charity_contribution_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  website_url TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add the reference now that charities table exists
ALTER TABLE profiles 
ADD CONSTRAINT fk_charity FOREIGN KEY (charity_id) REFERENCES charities(id);

CREATE TABLE IF NOT EXISTS charity_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS golf_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)          -- one score per date per user
);

CREATE TABLE IF NOT EXISTS draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_month INTEGER NOT NULL,         -- 1-12
  draw_year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'simulated', 'published')),
  draw_type TEXT DEFAULT 'random' 
    CHECK (draw_type IN ('random', 'algorithmic')),
  winning_numbers INTEGER[] NOT NULL,  -- array of 5 scores
  jackpot_amount DECIMAL(10,2) DEFAULT 0,
  pool_3match DECIMAL(10,2) DEFAULT 0,
  pool_4match DECIMAL(10,2) DEFAULT 0,
  pool_5match DECIMAL(10,2) DEFAULT 0,
  jackpot_rolled_over BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS draw_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  scores_snapshot INTEGER[],           -- snapshot of user's 5 scores at draw time
  matched_count INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id),
  user_id UUID REFERENCES profiles(id),
  draw_entry_id UUID REFERENCES draw_entries(id),
  match_type TEXT CHECK (match_type IN ('3-match', '4-match', '5-match')),
  prize_amount DECIMAL(10,2) NOT NULL,
  verification_status TEXT DEFAULT 'pending' 
    CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  proof_url TEXT,
  payment_status TEXT DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid')),
  verified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  plan TEXT CHECK (plan IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'completed',
  prize_pool_contribution DECIMAL(10,2),
  charity_contribution DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own scores" ON golf_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON golf_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON golf_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON golf_scores FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Charities are public" ON charities FOR SELECT USING (TRUE);
CREATE POLICY "Draws are public after publish" ON draws FOR SELECT USING (status = 'published');

-- FUNCTIONS
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger name check to avoid duplicates if re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SEED: 6 Charities
INSERT INTO charities (name, description, image_url, category, is_featured) VALUES
('Children First UK', 'Supporting underprivileged children with education and healthcare across the UK.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', 'Children', TRUE),
('Green Earth Alliance', 'Planting trees and restoring ecosystems across 30 countries worldwide.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'Environment', FALSE),
('Hunger Free Tomorrow', 'Providing daily meals to families in food insecure communities globally.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800', 'Food Security', TRUE),
('Veterans Support Network', 'Mental health and rehabilitation support for military veterans and their families.', 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=800', 'Veterans', FALSE),
('Coastal Clean Initiative', 'Organizing beach and ocean cleanup operations to protect marine life.', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800', 'Environment', FALSE),
('Education Without Borders', 'Delivering digital learning tools to remote communities with no school access.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'Education', FALSE);
