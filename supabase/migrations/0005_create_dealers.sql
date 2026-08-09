-- ============================================================================
--  dealers — automotive parts dealers table (auto parts suppliers, Tunisia)
--  Source: scraped Google Maps dataset (JSON), cleaned & normalized.
--  Cleansing rules applied:
--    * Markdown-wrapped URLs from the raw dataset stripped to plain links.
--    * Rows without a name dropped.
--    * Ratings normalized to decimal ("4,9" -> 4.9); null when unavailable.
--  Run: paste into Supabase SQL Editor, or supabase db push
-- ============================================================================

-- ----------------------------------------------------------------------------
--  Table definition
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dealers (
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  address      text,
  city         text,
  zip_code     text,
  latitude     numeric,
  longitude    numeric,
  website      text,
  facebook_url text,
  instagram_url text,
  phone        text,
  google_rating numeric,
  review_count integer,
  created_at   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT dealers_pkey PRIMARY KEY (id)
);

-- Row Level Security: public read access, writes via service role only
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on dealers" ON public.dealers;
CREATE POLICY "Allow public read access on dealers"
  ON public.dealers
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ----------------------------------------------------------------------------
--  Seed data (12 dealers)
-- ----------------------------------------------------------------------------
INSERT INTO public.dealers (name, address, latitude, longitude, website, facebook_url, phone, google_rating, review_count)
VALUES
  ('AD Tunisie', 'Route Z4 Saint Gobain Tunis, 1009, Tunisia', null, null, 'https://www.ad-tunisie.com/', null, '+21670603133', 4.2, 34),
  ('AAPT - Asian Auto Parts Tunisia', '17 Boulevard Mohamed Bouazizi, Tunis, Tunisia', null, null, null, null, null, null, null),
  ('Société Ben Hriz Auto', 'R3CH+M5X, Tunis, Manouba, Tunisia, 2086', null, null, 'https://benhrizauto.com/', 'https://www.facebook.com/Ben-Hriz-Auuto-219596806714792', '+21692920807', 4.5, 33),
  ('BM Auto Parts', '13 Route X Bardo, Tunis 2000, Tunisia', 36.818753, 10.12914, 'https://bmauto.tn/', null, '+21655325328', 4.7, 20),
  ('GDIS - Générale Distribution Industrielle et Services', 'Q66G+92X, Ben Arous, Tunisia', null, null, null, null, '+21627440805', null, null),
  ('STE Global Pièces Auto', 'Tunis 2050, Tunisia', null, null, null, null, '+21698346386', null, null),
  ('Société Jaouani Spare Parts - JSP', '7 Rue El Kods, Megrine, Tunisia', null, null, null, null, '+21621272727', null, null),
  ('CIFA - Comptoir Industriel et Fournitures Automobiles', '57 Rue Ali Darghouth, Tunis 1000, Tunisia', null, null, null, null, null, null, null),
  ('EL HOG AUTO PARTS - HAP', '4021 Route de Sousse, Tunisia', null, null, null, null, '+21670634414', 5.0, 1),
  ('Ulysse Spare Parts - USP', '14 Rue 8611, Zone Industrielle Charguia, Tunis 1080, Tunisia', null, null, 'https://www.ad-tunisie.com/', null, null, null, null),
  ('Electro Diesel Tunisie - EDT', '9 Avenue Hammouda Pacha, Tunis 1001, Tunisia', null, null, 'https://www.ad-tunisie.com/', null, '+21671333066', null, null),
  ('Aures Gros', 'Tunis / Ariana, Tunisia', null, null, null, null, null, null, null);
