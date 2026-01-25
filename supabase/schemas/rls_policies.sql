-- Row Level Security Policies
-- Users can only access their own data

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Jobber connections policies
create policy "Users can view own jobber connections"
  on public.jobber_connections
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobber connections"
  on public.jobber_connections
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobber connections"
  on public.jobber_connections
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobber connections"
  on public.jobber_connections
  for delete
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscriptions"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions
  for update
  using (auth.uid() = user_id);

-- User settings policies
create policy "Users can view own settings"
  on public.user_settings
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings
  for update
  using (auth.uid() = user_id);

-- Weekly snapshots policies
create policy "Users can view own snapshots"
  on public.weekly_snapshots
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own snapshots"
  on public.weekly_snapshots
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snapshots"
  on public.weekly_snapshots
  for update
  using (auth.uid() = user_id);
