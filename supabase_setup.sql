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
