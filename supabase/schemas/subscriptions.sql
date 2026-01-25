-- Stripe subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text not null unique,
  stripe_subscription_id text,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id)
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Add updated_at trigger
create trigger set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();

-- Indexes
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
