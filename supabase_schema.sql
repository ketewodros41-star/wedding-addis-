-- Enable UUID-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VENUES
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  location TEXT,
  guest_count INT,
  budget NUMERIC,
  preferences JSONB DEFAULT '{}'::JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSPIRATION BOARDS
CREATE TABLE public.inspiration_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVITATIONS
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues: Anyone can view venues (public read)
CREATE POLICY "Venues are viewable by everyone" ON public.venues FOR SELECT USING (true);

-- Bookings: Users can do CRUD on their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookings" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- Inspiration Boards: Users can see and modify their own inspiration board
CREATE POLICY "Users can view own inspiration board" ON public.inspiration_boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inspiration board" ON public.inspiration_boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inspiration board" ON public.inspiration_boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inspiration board" ON public.inspiration_boards FOR DELETE USING (auth.uid() = user_id);

-- Invitations: Users can do CRUD on their own invitations
CREATE POLICY "Users can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invitations" ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON public.invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON public.invitations FOR DELETE USING (auth.uid() = user_id);

-- Create a trigger to automatically create a profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Dummy data for Venues
INSERT INTO public.venues (name, location, capacity, images, description) VALUES
('Skylight Grand Ballroom', 'Bole, Addis Ababa', 1500, ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCY1aqFZR2gOL9lZTP-_PVWhWOqPxvPsfznPVPoZhyWrTE_cxeFG614bAmJBmVRPUdbcLcs_FML8cVnKpyxxU4c9KFe-05nOHqcrl-d15IL4CVcT6j6RdfhTHbRPpswnTCi3QJBhAe29pRCoamq4VTzLfZGFBD4lEbLeN83huAn8suyhPiU0SRjguOd8xuQJHN4HafcWD7gHTg7T5FhyzDf1-iIwqTxBhhtqTxVCru-jhYi_RP6nLggK81XOzIqESFH-1OS-LO3mSs'], 'Luxury grand ballroom in Addis Ababa with massive chandeliers, gold-leaf pillars and velvet seating for a high-end wedding.'),
('Entoto Forest Gardens', 'Entoto Hills', 400, ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8k8P_d2b-_cneDSAYLy6seE4U5uyrfBX87vWbEMh0JSLHFW4GxggjDPSZ2sWBBpPuB_4Vpq8eXfLW6YaY9mzUkigIPokyAUQ2xAbUQ-ARgh9Eb5P80a_n-ZdtvUae4uFGzCrU6mEb9RrPE7rOSCVtyJDBOzT1ywdT0eay5cpxNLj9g1riIbQrbrGZrezk93ZPWZQGqFU-nb5vciH46-_arA2WuXEnM4zMDpRBBTFwnanIt_rLgWr_biUFc9OoR2SrK3QpV11YI'], 'Lush botanical garden wedding venue in the Ethiopian highlands featuring a white floral archway and wooden seating.'),
('The Hyatt Regency Terrace', 'Meskel Square', 250, ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuDaRTpRSenyBc2V5VBs5rRM0_tmXB9SUrFSUvEvqlZU2qvuyd_k0hPHE39vsst1P3U_g6PFRXsZyNbOmcNaKi_2NO2i72akDidi6_tao2lDHE9ZD9-uzNp_CtVWWW91ejDVSD2QmLPvVy6kvewVkRB8bZzb75QHlMCYBAOgTQW-mnaqDCJS3nSSNC7k9wzv4r-W3N4UF2w9EtKbgwd6EefQHRhmGcDE67M7p8cGXlSAyiwRRXN7jsHW9tILh9A8cU1ihVoK5FBtXEw'], 'Sophisticated hotel rooftop wedding venue overlooking the Addis Ababa skyline at twilight with modern cocktail lounge furniture.');

-- EXTENSION FOR MVP EXPANSION

-- Extend bookings table with richer fields
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS bride_name TEXT,
  ADD COLUMN IF NOT EXISTS groom_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS wedding_type TEXT,
  ADD COLUMN IF NOT EXISTS ceremony_type TEXT,
  ADD COLUMN IF NOT EXISTS preferred_area TEXT,
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS themes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS vision_notes TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Planner tasks
CREATE TABLE IF NOT EXISTS public.planner_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guests
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  invited BOOLEAN DEFAULT true,
  attending BOOLEAN,
  plus_one BOOLEAN DEFAULT false,
  table_assignment TEXT,
  dietary_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs (linked to invitation slug)
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INT DEFAULT 1,
  dietary_notes TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add slug + public flag to invitations
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS wedding_message TEXT;

-- RLS for new tables
ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- POLICIES for new tables
CREATE POLICY "Users manage own tasks" ON public.planner_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own guests" ON public.guests FOR ALL USING (
  auth.uid() = (SELECT user_id FROM public.bookings WHERE id = booking_id)
);
CREATE POLICY "Anyone can submit RSVP" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Invitation owner views RSVPs" ON public.rsvps FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.invitations WHERE id = invitation_id)
);
