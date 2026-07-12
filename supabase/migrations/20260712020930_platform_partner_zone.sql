create table if not exists public.platform_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_access_at timestamptz
);

create table if not exists public.partner_installations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'),
  name text not null,
  building_address text not null default '',
  chair_name text not null default '',
  chair_email text not null,
  status text not null default 'draft' check (status in ('draft', 'awaiting_connections', 'provisioning', 'testing', 'active', 'suspended', 'failed', 'archived')),
  plan text not null default 'pilot_free' check (plan in ('pilot_free', 'commercial', 'internal')),
  app_version text not null default 'v172',
  github_repository_url text,
  vercel_project_id text,
  production_url text,
  supabase_project_ref text,
  gmail_sender_email text,
  service_state jsonb not null default '{"github":"pending","supabase":"pending","vercel":"pending","gmail":"pending","database":"pending","functions":"pending","chair_invite":"pending","support_access":"pending","verification":"pending"}'::jsonb,
  support_access_status text not null default 'not_configured' check (support_access_status in ('not_configured', 'ready', 'suspended')),
  notes text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.partner_provisioning_jobs (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.partner_installations(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'queued' check (status in ('queued', 'awaiting_authorization', 'running', 'completed', 'failed', 'cancelled')),
  current_step text not null default 'prepare',
  steps jsonb not null default '[]'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_installation_events (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid references public.partner_installations(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_access_logs (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.partner_installations(id) on delete restrict,
  platform_admin_id uuid not null references public.profiles(id) on delete restrict,
  session_id uuid not null default gen_random_uuid(),
  reason text not null,
  target_url text,
  status text not null default 'requested' check (status in ('requested', 'issued', 'opened', 'expired', 'revoked', 'failed')),
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  requested_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  ended_at timestamptz
);

create index if not exists partner_installations_status_idx on public.partner_installations(status, created_at desc);
create index if not exists partner_installations_search_idx on public.partner_installations(lower(name), lower(chair_email));
create index if not exists partner_jobs_installation_idx on public.partner_provisioning_jobs(installation_id, created_at desc);
create index if not exists partner_events_installation_idx on public.partner_installation_events(installation_id, created_at desc);
create index if not exists platform_access_installation_idx on public.platform_access_logs(installation_id, requested_at desc);

create or replace function app_private.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public, app_private
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.platform_admins
      where user_id = auth.uid()
        and active = true
    );
$$;

revoke all on function app_private.is_platform_admin() from public, anon;
grant execute on function app_private.is_platform_admin() to authenticated;

create or replace function app_private.touch_platform_updated_at()
returns trigger
language plpgsql
set search_path = public, app_private
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partner_installations_touch_updated_at on public.partner_installations;
create trigger partner_installations_touch_updated_at
before update on public.partner_installations
for each row execute function app_private.touch_platform_updated_at();

drop trigger if exists partner_jobs_touch_updated_at on public.partner_provisioning_jobs;
create trigger partner_jobs_touch_updated_at
before update on public.partner_provisioning_jobs
for each row execute function app_private.touch_platform_updated_at();

alter table public.platform_admins enable row level security;
alter table public.partner_installations enable row level security;
alter table public.partner_provisioning_jobs enable row level security;
alter table public.partner_installation_events enable row level security;
alter table public.platform_access_logs enable row level security;

revoke all on public.platform_admins, public.partner_installations, public.partner_provisioning_jobs, public.partner_installation_events, public.platform_access_logs from anon;
grant select on public.platform_admins to authenticated;
grant select, insert, update, delete on public.partner_installations to authenticated;
grant select, insert, update, delete on public.partner_provisioning_jobs to authenticated;
grant select, insert on public.partner_installation_events to authenticated;
grant select, insert, update on public.platform_access_logs to authenticated;

drop policy if exists "platform admins read own membership" on public.platform_admins;
create policy "platform admins read own membership"
on public.platform_admins for select to authenticated
using (user_id = auth.uid() and active = true);

drop policy if exists "platform admins read partner installations" on public.partner_installations;
create policy "platform admins read partner installations"
on public.partner_installations for select to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins create partner installations" on public.partner_installations;
create policy "platform admins create partner installations"
on public.partner_installations for insert to authenticated
with check ((select app_private.is_platform_admin()) and created_by = auth.uid());

drop policy if exists "platform admins update partner installations" on public.partner_installations;
create policy "platform admins update partner installations"
on public.partner_installations for update to authenticated
using ((select app_private.is_platform_admin()))
with check ((select app_private.is_platform_admin()));

drop policy if exists "platform admins archive partner installations" on public.partner_installations;
create policy "platform admins archive partner installations"
on public.partner_installations for delete to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins read provisioning jobs" on public.partner_provisioning_jobs;
create policy "platform admins read provisioning jobs"
on public.partner_provisioning_jobs for select to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins create provisioning jobs" on public.partner_provisioning_jobs;
create policy "platform admins create provisioning jobs"
on public.partner_provisioning_jobs for insert to authenticated
with check ((select app_private.is_platform_admin()) and requested_by = auth.uid());

drop policy if exists "platform admins update provisioning jobs" on public.partner_provisioning_jobs;
create policy "platform admins update provisioning jobs"
on public.partner_provisioning_jobs for update to authenticated
using ((select app_private.is_platform_admin()))
with check ((select app_private.is_platform_admin()));

drop policy if exists "platform admins delete provisioning jobs" on public.partner_provisioning_jobs;
create policy "platform admins delete provisioning jobs"
on public.partner_provisioning_jobs for delete to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins read installation events" on public.partner_installation_events;
create policy "platform admins read installation events"
on public.partner_installation_events for select to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins create installation events" on public.partner_installation_events;
create policy "platform admins create installation events"
on public.partner_installation_events for insert to authenticated
with check ((select app_private.is_platform_admin()) and actor_id = auth.uid());

drop policy if exists "platform admins read access logs" on public.platform_access_logs;
create policy "platform admins read access logs"
on public.platform_access_logs for select to authenticated
using ((select app_private.is_platform_admin()));

drop policy if exists "platform admins create access logs" on public.platform_access_logs;
create policy "platform admins create access logs"
on public.platform_access_logs for insert to authenticated
with check ((select app_private.is_platform_admin()) and platform_admin_id = auth.uid());

drop policy if exists "platform admins update own access logs" on public.platform_access_logs;
create policy "platform admins update own access logs"
on public.platform_access_logs for update to authenticated
using ((select app_private.is_platform_admin()) and platform_admin_id = auth.uid())
with check ((select app_private.is_platform_admin()) and platform_admin_id = auth.uid());

insert into public.platform_admins (user_id, display_name, active)
select id, coalesce(nullif(full_name, ''), email), true
from public.profiles
where id = '6013ff45-4d0a-41b3-abe2-707c3c226144'
on conflict (user_id) do update
set display_name = excluded.display_name,
    active = true;
