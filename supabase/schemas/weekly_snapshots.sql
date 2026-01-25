-- Weekly metric snapshots (flexible JSONB structure for MVP)
create table if not exists public.weekly_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start_date date not null,
  snapshot_data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  unique(user_id, week_start_date)
);

-- Enable RLS
alter table public.weekly_snapshots enable row level security;

-- Indexes for efficient lookups
create index if not exists idx_weekly_snapshots_user_id on public.weekly_snapshots(user_id);
create index if not exists idx_weekly_snapshots_week_start on public.weekly_snapshots(user_id, week_start_date desc);
