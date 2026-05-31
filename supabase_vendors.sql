-- ============================================================
-- VENDOR MARKETPLACE MIGRATION
-- Paste this into Supabase SQL Editor
-- ============================================================

-- 1. Vendor Categories
CREATE TABLE IF NOT EXISTS public.vendor_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT
);

INSERT INTO public.vendor_categories (name, slug, icon, description) VALUES
  ('Venues', 'venues', 'location_city', 'Ballrooms, gardens, and heritage halls'),
  ('Photographers', 'photographers', 'photo_camera', 'Capturing your story in timeless frames'),
  ('Decorators', 'decorators', 'auto_fix_high', 'Transforming spaces into dreamscapes'),
  ('Florists', 'florists', 'local_florist', 'Ethiopian blooms and floral art'),
  ('Makeup Artists', 'makeup-artists', 'face', 'Habesha bridal beauty specialists'),
  ('Caterers', 'caterers', 'restaurant', 'Traditional and modern Ethiopian cuisine'),
  ('DJs & MCs', 'djs-mcs', 'music_note', 'Live music and cultural entertainment'),
  ('Photographers (Video)', 'videographers', 'videocam', 'Cinematic wedding films')
ON CONFLICT (slug) DO NOTHING;

-- 2. Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.vendor_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  location TEXT,
  price_range TEXT CHECK (price_range IN ('budget', 'mid', 'premium', 'luxury')),
  cover_image TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'inquiry_only')),
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vendor Reviews
CREATE TABLE IF NOT EXISTS public.vendor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  body TEXT,
  couple_names TEXT,
  wedding_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vendor Contact Requests
CREATE TABLE IF NOT EXISTS public.vendor_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  event_date DATE,
  budget_range TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Vendors are public" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Categories are public" ON public.vendor_categories FOR SELECT USING (true);
CREATE POLICY "Reviews are public" ON public.vendor_reviews FOR SELECT USING (true);
CREATE POLICY "Users can submit reviews" ON public.vendor_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can submit inquiries" ON public.vendor_inquiries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own inquiries" ON public.vendor_inquiries FOR SELECT USING (auth.uid() = user_id);

-- 6. Inspiration Requests (Feature 7 - replaces checkout)
CREATE TABLE IF NOT EXISTS public.inspiration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  board_items JSONB DEFAULT '[]'::JSONB,
  notes TEXT,
  wedding_date DATE,
  budget_range TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inspiration_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own requests" ON public.inspiration_requests FOR ALL USING (auth.uid() = user_id);

-- 7. Seed a few demo vendors
INSERT INTO public.vendors (name, slug, tagline, description, location, price_range, cover_image, availability_status, contact_whatsapp, is_featured, is_verified, rating, review_count, category_id)
VALUES
(
  'Abeba Photography Studio',
  'abeba-photography',
  'Timeless Ethiopian wedding stories',
  'Specialized in documentary-style wedding photography that blends traditional Habesha ceremony with modern editorial craft. Over 12 years capturing unions across Addis Ababa.',
  'Bole, Addis Ababa',
  'premium',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAiNY3KP8aM7nbeMg0J117_MtRjKFO5wxv2oHuO3CeApOW28ZkTaR0rTxYD7WN8eQU1c1RclTZHEbxKOljZwadnvt4prpSdskbUhcZBQ7OpvzJ1yEZEshygDbvS9BQSPNYFlMe8EK6sBZ40upQKSxnlBO5_t5eUzJQc1Ehq0LK7PbqIlccGCidI4QgFVtuHOEKtM1P1NpOeC0_HUamdJgjRsfXmAY75c_txynHSQ5XQr0ubn4o46zdZRiPJ5T3B53JoQUEzWOiapBc',
  'available',
  '251973094991',
  true,
  true,
  4.9,
  47,
  (SELECT id FROM public.vendor_categories WHERE slug = 'photographers')
),
(
  'Mekdes Bloom Florals',
  'mekdes-bloom',
  'Ethiopian blooms, global elegance',
  'From coffee ceremony arrangements to grand ceremony arches, we specialize in Habesha floral traditions fused with contemporary botanical design.',
  'Kazanchis, Addis Ababa',
  'mid',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8k8P_d2b-_cneDSAYLy6seE4U5uyrfBX87vWbEMh0JSLHFW4GxggjDPSZ2sWBBpPuB_4Vpq8eXfLW6YaY9mzUkigIPokyAUQ2xAbUQ-ARgh9Eb5P80a_n-ZdtvUae4uFGzCrU6mEb9RrPE7rOSCVtyJDBOzT1ywdT0eay5cpxNLj9g1riIbQrbrGZrezk93ZPWZQGqFU-nb5vciH46-_arA2WuXEnM4zMDpRBBTFwnanIt_rLgWr_biUFc9OoR2SrK3QpV11YI',
  'available',
  '251911234567',
  true,
  true,
  4.7,
  23,
  (SELECT id FROM public.vendor_categories WHERE slug = 'florists')
),
(
  'Skylight Events & Decor',
  'skylight-events',
  'Grand visions brought to life',
  'Premium Ethiopian event decoration specializing in grand ballroom transformations with a fusion of Ethiopian textile motifs and luxury modern aesthetics.',
  'Sarbet, Addis Ababa',
  'luxury',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDaRTpRSenyBc2V5VBs5rRM0_tmXB9SUrFSUvEvqlZU2qvuyd_k0hPHE39vsst1P3U_g6PFRXsZyNbOmcNaKi_2NO2i72akDidi6_tao2lDHE9ZD9-uzNp_CtVWWW91ejDVSD2QmLPvVy6kvewVkRB8bZzb75QHlMCYBAOgTQW-mnaqDCJS3nSSNC7k9wzv4r-W3N4UF2w9EtKbgwd6EefQHRhmGcDE67M7p8cGXlSAyiwRRXN7jsHW9tILh9A8cU1ihVoK5FBtXEw',
  'inquiry_only',
  '251922345678',
  false,
  true,
  4.8,
  34,
  (SELECT id FROM public.vendor_categories WHERE slug = 'decorators')
);
