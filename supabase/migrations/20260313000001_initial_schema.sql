-- 8Patas: Initial schema for Supabase PostgreSQL
-- Users are managed by Supabase Auth (auth.users)
-- Profile table extends auth.users with app-specific data

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  basic_info TEXT NOT NULL,
  size TEXT,
  weight TEXT,
  photo_url TEXT,
  ai_breed TEXT,
  ai_care_script TEXT,
  ai_suggested_symptoms TEXT,
  ai_breed_diseases TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  date_time TIMESTAMPTZ NOT NULL,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_pet ON appointments(pet_id);
CREATE INDEX idx_appointments_date ON appointments(date_time);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own profile
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pets: user can CRUD own pets
CREATE POLICY "Users read own pets" ON pets FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users create own pets" ON pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users delete own pets" ON pets FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Users update own pets" ON pets FOR UPDATE USING (auth.uid() = owner_id);

-- Appointments: user can CRUD own appointments
CREATE POLICY "Users read own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own appointments" ON appointments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
