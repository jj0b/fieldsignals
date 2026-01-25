-- User settings
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weekly_brief_email text not null,
  timezone text default 'America/Toronto' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Enable RLS
alter table public.user_settings enable row level security;

-- Add updated_at trigger
create trigger set_updated_at
  before update on public.user_settings
  for each row
  execute function public.handle_updated_at();

-- Index
create index if not exists idx_user_settings_user_id on public.user_settings(user_id);
