-- Jobber OAuth connections
create table if not exists public.jobber_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  jobber_user_id text not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  connected_at timestamptz default now() not null,
  last_synced_at timestamptz,
  is_active boolean default true not null,
  unique(user_id)
);

-- Enable RLS
alter table public.jobber_connections enable row level security;

-- Add updated_at trigger
create trigger set_updated_at
  before update on public.jobber_connections
  for each row
  execute function public.handle_updated_at();

-- Index for lookups
create index if not exists idx_jobber_connections_user_id on public.jobber_connections(user_id);
create index if not exists idx_jobber_connections_is_active on public.jobber_connections(is_active) where is_active = true;
