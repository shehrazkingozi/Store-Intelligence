-- Copy and paste this code into your Supabase SQL Editor and click RUN.

CREATE TABLE daily_stats (
  id uuid default uuid_generate_v4() primary key,
  date date default CURRENT_DATE,
  app_id text not null,
  title text,
  installs text,
  max_installs bigint,
  score numeric,
  ratings bigint,
  reviews bigint,
  category text,
  category_rank integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Creates an index to make fetching history for a specific app very fast
CREATE INDEX idx_daily_stats_app_id ON daily_stats (app_id);
