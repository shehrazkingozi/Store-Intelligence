-- Copy and paste this code into your Supabase SQL Editor and click RUN.
-- This schema is designed for massive scalability (100M+ apps).

-- 1. Apps Table: Stores static app information (fast lookups, updated only when static info changes)
CREATE TABLE IF NOT EXISTS apps (
  app_id text primary key,
  title text not null,
  developer text,
  icon text,
  genre text,
  released text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Daily Stats Table: Stores temporal/historical data (installs, rank, score)
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid default uuid_generate_v4() primary key,
  date date default CURRENT_DATE,
  app_id text references apps(app_id) on delete cascade,
  installs text,
  max_installs bigint,
  score numeric,
  ratings bigint,
  reviews bigint,
  category_rank integer,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Prevent duplicate entries for the same app on the same day
  CONSTRAINT unique_app_date UNIQUE(app_id, date)
);

-- 3. Indexes for fast retrieval
-- Index on app_id in daily_stats is crucial for fetching an app's history quickly
CREATE INDEX IF NOT EXISTS idx_daily_stats_app_id ON daily_stats (app_id);
-- Index on date for daily analytics across all apps
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats (date);

-- 4. New Columns for Full App Details
ALTER TABLE apps ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS screenshots jsonb;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS similar_apps jsonb;

-- 5. App History Table: Tracks changes to app title and description over time
CREATE TABLE IF NOT EXISTS app_history (
  id uuid default gen_random_uuid() primary key,
  app_id text references apps(app_id) on delete cascade,
  title text,
  description text,
  changed_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_app_history_app_id ON app_history (app_id);
