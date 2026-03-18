-- ============================================================
-- 001_update_flights_table.sql
-- Run in the Supabase SQL Editor.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ----------------------------------------------------------
-- 1. Add missing columns to the existing flights table
--    Existing columns: id, departure_airport, arrival_airport,
--    price_nok, travel_date, found_date, updated_at,
--    normal_price, discount_pct, airline, direct, country
-- ----------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'departure_city') THEN
    ALTER TABLE flights ADD COLUMN departure_city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'arrival_city') THEN
    ALTER TABLE flights ADD COLUMN arrival_city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'country_code') THEN
    ALTER TABLE flights ADD COLUMN country_code TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'dates_text') THEN
    ALTER TABLE flights ADD COLUMN dates_text TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'return_date') THEN
    ALTER TABLE flights ADD COLUMN return_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'booking_url') THEN
    ALTER TABLE flights ADD COLUMN booking_url TEXT;
  END IF;
END
$$;

-- ----------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read deals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'flights' AND policyname = 'Authenticated users can read flights'
  ) THEN
    CREATE POLICY "Authenticated users can read flights"
      ON flights
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Allow only service_role to insert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'flights' AND policyname = 'Service role can insert flights'
  ) THEN
    CREATE POLICY "Service role can insert flights"
      ON flights
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END
$$;

-- Allow only service_role to update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'flights' AND policyname = 'Service role can update flights'
  ) THEN
    CREATE POLICY "Service role can update flights"
      ON flights
      FOR UPDATE
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Allow only service_role to delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'flights' AND policyname = 'Service role can delete flights'
  ) THEN
    CREATE POLICY "Service role can delete flights"
      ON flights
      FOR DELETE
      TO service_role
      USING (true);
  END IF;
END
$$;

-- ----------------------------------------------------------
-- 3. Index for efficient filtering by departure + best deals
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_flights_departure_discount
  ON flights (departure_airport, discount_pct DESC);

-- ----------------------------------------------------------
-- 4. Unique constraint for upserts (route-based)
-- ----------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'flights_route_uq'
  ) THEN
    ALTER TABLE flights
      ADD CONSTRAINT flights_route_uq
      UNIQUE (departure_airport, arrival_airport);
  END IF;
END
$$;

-- ----------------------------------------------------------
-- 5. Seed data — Norwegian airports to popular destinations
--    Uses actual column names from the existing table:
--    price_nok, direct (boolean), travel_date
-- ----------------------------------------------------------
INSERT INTO flights (
  departure_airport, arrival_airport, departure_city, arrival_city,
  country_code, price_nok, normal_price, discount_pct, airline,
  direct, dates_text, travel_date, return_date, booking_url
) VALUES
  -- OSL departures
  ('OSL', 'BKK', 'Oslo', 'Bangkok', 'th',
   2489, 4890, 49, 'Thai Airways', false,
   'Mar–Apr 2026', '2026-03-28', '2026-04-11',
   'https://www.thaiairways.com'),

  ('OSL', 'JFK', 'Oslo', 'New York', 'us',
   3190, 5800, 45, 'SAS', true,
   'Apr–Mai 2026', '2026-04-15', '2026-04-29',
   'https://www.flysas.com'),

  ('OSL', 'DXB', 'Oslo', 'Dubai', 'ae',
   1890, 3400, 44, 'Emirates', true,
   'Mai–Jun 2026', '2026-05-10', '2026-05-20',
   'https://www.emirates.com'),

  ('OSL', 'HND', 'Oslo', 'Tokyo', 'jp',
   4290, 7800, 45, 'Norwegian', false,
   'Jun–Jul 2026', '2026-06-20', '2026-07-05',
   'https://www.norwegian.com'),

  ('OSL', 'DPS', 'Oslo', 'Bali', 'id',
   3690, 6700, 45, 'KLM', false,
   'Jul–Aug 2026', '2026-07-05', '2026-07-19',
   'https://www.klm.com'),

  ('OSL', 'BCN', 'Oslo', 'Barcelona', 'es',
   899, 1650, 46, 'Norwegian', true,
   'Mar–Apr 2026', '2026-03-22', '2026-03-29',
   'https://www.norwegian.com'),

  ('OSL', 'GRU', 'Oslo', 'São Paulo', 'br',
   4790, 8900, 46, 'SAS', false,
   'Aug–Sep 2026', '2026-08-12', '2026-08-28',
   'https://www.flysas.com'),

  ('OSL', 'ATH', 'Oslo', 'Athen', 'gr',
   1190, 2350, 49, 'Norwegian', true,
   'Mai–Jun 2026', '2026-05-15', '2026-05-22',
   'https://www.norwegian.com'),

  -- BGO departures
  ('BGO', 'LHR', 'Bergen', 'London', 'gb',
   790, 1450, 46, 'SAS', true,
   'Apr–Mai 2026', '2026-04-03', '2026-04-10',
   'https://www.flysas.com'),

  ('BGO', 'FCO', 'Bergen', 'Roma', 'it',
   1190, 2200, 46, 'Norwegian', false,
   'Mai–Jun 2026', '2026-05-18', '2026-05-25',
   'https://www.norwegian.com'),

  -- TRD departures
  ('TRD', 'BCN', 'Trondheim', 'Barcelona', 'es',
   990, 1800, 45, 'Ryanair', false,
   'Jun–Jul 2026', '2026-06-14', '2026-06-21',
   'https://www.ryanair.com'),

  ('TRD', 'CDG', 'Trondheim', 'Paris', 'fr',
   1090, 2100, 48, 'SAS', true,
   'Mai–Jun 2026', '2026-05-22', '2026-05-29',
   'https://www.flysas.com'),

  -- SVG departure
  ('SVG', 'AMS', 'Stavanger', 'Amsterdam', 'nl',
   690, 1250, 45, 'KLM', true,
   'Apr–Mai 2026', '2026-04-10', '2026-04-17',
   'https://www.klm.com'),

  -- TOS departure
  ('TOS', 'KEF', 'Tromsø', 'Reykjavik', 'is',
   1290, 2500, 48, 'Icelandair', true,
   'Jun–Jul 2026', '2026-06-28', '2026-07-05',
   'https://www.icelandair.com'),

  -- TRF departure
  ('TRF', 'ALC', 'Torp', 'Alicante', 'es',
   599, 1100, 46, 'Ryanair', true,
   'Apr–Mai 2026', '2026-04-18', '2026-04-25',
   'https://www.ryanair.com')

ON CONFLICT ON CONSTRAINT flights_route_uq
DO UPDATE SET
  departure_city = EXCLUDED.departure_city,
  arrival_city   = EXCLUDED.arrival_city,
  country_code   = EXCLUDED.country_code,
  price_nok      = EXCLUDED.price_nok,
  normal_price   = EXCLUDED.normal_price,
  discount_pct   = EXCLUDED.discount_pct,
  airline        = EXCLUDED.airline,
  direct         = EXCLUDED.direct,
  dates_text     = EXCLUDED.dates_text,
  travel_date    = EXCLUDED.travel_date,
  return_date    = EXCLUDED.return_date,
  booking_url    = EXCLUDED.booking_url,
  updated_at     = now();
