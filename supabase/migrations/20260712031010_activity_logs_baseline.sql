create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  actor_name text,
  actor_role text,
  activity_type text not null,
  activity_label text not null,
  related_table text,
  related_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);
create index if not exists activity_logs_actor_idx on public.activity_logs(actor_id, created_at desc);

alter table public.activity_logs enable row level security;
grant select, insert on public.activity_logs to authenticated;

drop policy if exists "activity logs chair read" on public.activity_logs;
create policy "activity logs chair read"
on public.activity_logs for select to authenticated
using ((select app_private.is_chair()));

drop policy if exists "activity logs authenticated insert" on public.activity_logs;
create policy "activity logs authenticated insert"
on public.activity_logs for insert to authenticated
with check (actor_id = auth.uid());
