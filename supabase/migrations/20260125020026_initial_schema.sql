
  create table "public"."jobber_connections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "jobber_user_id" text not null,
    "access_token" text not null,
    "refresh_token" text not null,
    "expires_at" timestamp with time zone not null,
    "connected_at" timestamp with time zone not null default now(),
    "last_synced_at" timestamp with time zone,
    "is_active" boolean not null default true
      );


alter table "public"."jobber_connections" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "stripe_customer_id" text not null,
    "stripe_subscription_id" text,
    "status" text not null,
    "current_period_end" timestamp with time zone,
    "cancel_at_period_end" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."subscriptions" enable row level security;


  create table "public"."user_settings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "weekly_brief_email" text not null,
    "timezone" text not null default 'America/Toronto'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_settings" enable row level security;


  create table "public"."weekly_snapshots" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "week_start_date" date not null,
    "snapshot_data" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."weekly_snapshots" enable row level security;

CREATE INDEX idx_jobber_connections_is_active ON public.jobber_connections USING btree (is_active) WHERE (is_active = true);

CREATE INDEX idx_jobber_connections_user_id ON public.jobber_connections USING btree (user_id);

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);

CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions USING btree (stripe_customer_id);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions USING btree (user_id);

CREATE INDEX idx_user_settings_user_id ON public.user_settings USING btree (user_id);

CREATE INDEX idx_weekly_snapshots_user_id ON public.weekly_snapshots USING btree (user_id);

CREATE INDEX idx_weekly_snapshots_week_start ON public.weekly_snapshots USING btree (user_id, week_start_date DESC);

CREATE UNIQUE INDEX jobber_connections_pkey ON public.jobber_connections USING btree (id);

CREATE UNIQUE INDEX jobber_connections_user_id_key ON public.jobber_connections USING btree (user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_stripe_customer_id_key ON public.subscriptions USING btree (stripe_customer_id);

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX weekly_snapshots_pkey ON public.weekly_snapshots USING btree (id);

CREATE UNIQUE INDEX weekly_snapshots_user_id_week_start_date_key ON public.weekly_snapshots USING btree (user_id, week_start_date);

alter table "public"."jobber_connections" add constraint "jobber_connections_pkey" PRIMARY KEY using index "jobber_connections_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."weekly_snapshots" add constraint "weekly_snapshots_pkey" PRIMARY KEY using index "weekly_snapshots_pkey";

alter table "public"."jobber_connections" add constraint "jobber_connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."jobber_connections" validate constraint "jobber_connections_user_id_fkey";

alter table "public"."jobber_connections" add constraint "jobber_connections_user_id_key" UNIQUE using index "jobber_connections_user_id_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'canceled'::text, 'past_due'::text, 'trialing'::text, 'incomplete'::text, 'incomplete_expired'::text, 'unpaid'::text, 'paused'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_status_check";

alter table "public"."subscriptions" add constraint "subscriptions_stripe_customer_id_key" UNIQUE using index "subscriptions_stripe_customer_id_key";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_key" UNIQUE using index "subscriptions_user_id_key";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_key" UNIQUE using index "user_settings_user_id_key";

alter table "public"."weekly_snapshots" add constraint "weekly_snapshots_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."weekly_snapshots" validate constraint "weekly_snapshots_user_id_fkey";

alter table "public"."weekly_snapshots" add constraint "weekly_snapshots_user_id_week_start_date_key" UNIQUE using index "weekly_snapshots_user_id_week_start_date_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."jobber_connections" to "anon";

grant insert on table "public"."jobber_connections" to "anon";

grant references on table "public"."jobber_connections" to "anon";

grant select on table "public"."jobber_connections" to "anon";

grant trigger on table "public"."jobber_connections" to "anon";

grant truncate on table "public"."jobber_connections" to "anon";

grant update on table "public"."jobber_connections" to "anon";

grant delete on table "public"."jobber_connections" to "authenticated";

grant insert on table "public"."jobber_connections" to "authenticated";

grant references on table "public"."jobber_connections" to "authenticated";

grant select on table "public"."jobber_connections" to "authenticated";

grant trigger on table "public"."jobber_connections" to "authenticated";

grant truncate on table "public"."jobber_connections" to "authenticated";

grant update on table "public"."jobber_connections" to "authenticated";

grant delete on table "public"."jobber_connections" to "service_role";

grant insert on table "public"."jobber_connections" to "service_role";

grant references on table "public"."jobber_connections" to "service_role";

grant select on table "public"."jobber_connections" to "service_role";

grant trigger on table "public"."jobber_connections" to "service_role";

grant truncate on table "public"."jobber_connections" to "service_role";

grant update on table "public"."jobber_connections" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";

grant delete on table "public"."weekly_snapshots" to "anon";

grant insert on table "public"."weekly_snapshots" to "anon";

grant references on table "public"."weekly_snapshots" to "anon";

grant select on table "public"."weekly_snapshots" to "anon";

grant trigger on table "public"."weekly_snapshots" to "anon";

grant truncate on table "public"."weekly_snapshots" to "anon";

grant update on table "public"."weekly_snapshots" to "anon";

grant delete on table "public"."weekly_snapshots" to "authenticated";

grant insert on table "public"."weekly_snapshots" to "authenticated";

grant references on table "public"."weekly_snapshots" to "authenticated";

grant select on table "public"."weekly_snapshots" to "authenticated";

grant trigger on table "public"."weekly_snapshots" to "authenticated";

grant truncate on table "public"."weekly_snapshots" to "authenticated";

grant update on table "public"."weekly_snapshots" to "authenticated";

grant delete on table "public"."weekly_snapshots" to "service_role";

grant insert on table "public"."weekly_snapshots" to "service_role";

grant references on table "public"."weekly_snapshots" to "service_role";

grant select on table "public"."weekly_snapshots" to "service_role";

grant trigger on table "public"."weekly_snapshots" to "service_role";

grant truncate on table "public"."weekly_snapshots" to "service_role";

grant update on table "public"."weekly_snapshots" to "service_role";


  create policy "Users can delete own jobber connections"
  on "public"."jobber_connections"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own jobber connections"
  on "public"."jobber_connections"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own jobber connections"
  on "public"."jobber_connections"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own jobber connections"
  on "public"."jobber_connections"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Users can insert own subscriptions"
  on "public"."subscriptions"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own subscriptions"
  on "public"."subscriptions"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own subscriptions"
  on "public"."subscriptions"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own settings"
  on "public"."user_settings"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own settings"
  on "public"."user_settings"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own settings"
  on "public"."user_settings"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own snapshots"
  on "public"."weekly_snapshots"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own snapshots"
  on "public"."weekly_snapshots"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own snapshots"
  on "public"."weekly_snapshots"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.jobber_connections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


