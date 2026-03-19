-- ============================================================
-- 002_price_history_and_deals.sql
-- PostgreSQL migrations for FlyDeals price history tracking
-- Run in the Supabase SQL Editor.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ----------------------------------------------------------
-- 1. Create price_history table for storing historical prices
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_airport VARCHAR(3) NOT NULL,
  arrival_airport VARCHAR(3) NOT NULL,
  travel_date DATE NOT NULL,
  price_nok NUMERIC NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source VARCHAR(20) NOT NULL DEFAULT 'rapidapi',
  UNIQUE(departure_airport, arrival_airport, travel_date, DATE(fetched_at))
);

-- ----------------------------------------------------------
-- 2. Add price history columns to flights table
-- ----------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'avg_price') THEN
    ALTER TABLE flights ADD COLUMN avg_price NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'price_level') THEN
    ALTER TABLE flights ADD COLUMN price_level VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'typical_price_low') THEN
    ALTER TABLE flights ADD COLUMN typical_price_low NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flights' AND column_name = 'typical_price_high') THEN
    ALTER TABLE flights ADD COLUMN typical_price_high NUMERIC;
  END IF;
END
$$;

-- ----------------------------------------------------------
-- 3. Create indexes for efficient queries
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_price_history_route_date
  ON price_history (departure_airport, arrival_airport, travel_date DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_fetched
  ON price_history (fetched_at DESC);

CREATE INDEX IF NOT EXISTS idx_flights_avg_price
  ON flights (avg_price);

-- ----------------------------------------------------------
-- 4. Enable Row Level Security on price_history
-- ----------------------------------------------------------
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read price history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'price_history' AND policyname = 'Authenticated users can read price history'
  ) THEN
    CREATE POLICY "Authenticated users can read price history"
      ON price_history
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Allow only service_role to insert price history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'price_history' AND policyname = 'Service role can insert price history'
  ) THEN
    CREATE POLICY "Service role can insert price history"
      ON price_history
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END
$$;

-- Allow only service_role to delete price history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'price_history' AND policyname = 'Service role can delete price history'
  ) THEN
    CREATE POLICY "Service role can delete price history"
      ON price_history
      FOR DELETE
      TO service_role
      USING (true);
  END IF;
END
$$;

-- ----------------------------------------------------------
-- 5. Create view for price statistics (14-day rolling average)
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW price_statistics AS
SELECT
  departure_airport,
  arrival_airport,
  travel_date,
  ROUND(AVG(price_nok)::NUMERIC, 0) as avg_price_14d,
  ROUND(MIN(price_nok)::NUMERIC, 0) as min_price_14d,
  ROUND(MAX(price_nok)::NUMERIC, 0) as max_price_14d,
  COUNT(*) as data_points
FROM price_history
WHERE fetched_at >= NOW() - INTERVAL '14 days'
GROUP BY departure_airport, arrival_airport, travel_date;

-- ----------------------------------------------------------
-- 6. Grant permissions to service_role for views
-- ----------------------------------------------------------
GRANT SELECT ON price_statistics TO service_role;

-- ----------------------------------------------------------
-- Sample comment showing expected data flow
-- ----------------------------------------------------------
-- INSERT INTO price_history (departure_airport, arrival_airport, travel_date, price_nok, source)
-- VALUES
--   ('OSL', 'BKK', '2026-04-15', 4890, 'rapidapi'),
--   ('OSL', 'BKK', '2026-04-16', 4850, 'rapidapi'),
--   ('OSL', 'BKK', '2026-04-17', 4920, 'rapidapi');
--
-- UPDATE flights
-- SET avg_price = 4885, price_level = 'typical', typical_price_low = 4500, typical_price_high = 5200
-- WHERE departure_airport = 'OSL' AND arrival_airport = 'BKK';
