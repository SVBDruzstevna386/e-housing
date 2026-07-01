create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  entry_type text not null check (entry_type in ('balance', 'planned_renovation', 'other_expense')),
  title text not null,
  amount numeric(12, 2) not null default 0,
  finance_year integer not null default extract(year from current_date)::integer,
  entry_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.innovation_ideas (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'Nový podnet',
  estimated_cost numeric(12, 2) not null default 0,
  finance_year integer not null default extract(year from current_date)::integer,
  quote_storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.innovation_comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.innovation_ideas(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.finance_entries enable row level security;
alter table public.innovation_ideas enable row level security;
alter table public.innovation_comments enable row level security;

grant select, insert, update, delete on public.finance_entries to authenticated;
grant select, insert, update, delete on public.innovation_ideas to authenticated;
grant select, insert, update, delete on public.innovation_comments to authenticated;

drop policy if exists "finance entries read" on public.finance_entries;
create policy "finance entries read"
on public.finance_entries for select
to authenticated
using (true);

drop policy if exists "finance entries chair write" on public.finance_entries;
create policy "finance entries chair write"
on public.finance_entries for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "innovation ideas read" on public.innovation_ideas;
create policy "innovation ideas read"
on public.innovation_ideas for select
to authenticated
using (true);

drop policy if exists "innovation ideas insert authenticated" on public.innovation_ideas;
create policy "innovation ideas insert authenticated"
on public.innovation_ideas for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "innovation ideas chair update" on public.innovation_ideas;
create policy "innovation ideas chair update"
on public.innovation_ideas for update
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "innovation ideas chair delete" on public.innovation_ideas;
create policy "innovation ideas chair delete"
on public.innovation_ideas for delete
to authenticated
using (app_private.is_chair());

drop policy if exists "innovation comments read" on public.innovation_comments;
create policy "innovation comments read"
on public.innovation_comments for select
to authenticated
using (true);

drop policy if exists "innovation comments insert authenticated" on public.innovation_comments;
create policy "innovation comments insert authenticated"
on public.innovation_comments for insert
to authenticated
with check (profile_id = auth.uid());

drop policy if exists "innovation comments own or chair update" on public.innovation_comments;
create policy "innovation comments own or chair update"
on public.innovation_comments for update
to authenticated
using (profile_id = auth.uid() or app_private.is_chair())
with check (profile_id = auth.uid() or app_private.is_chair());

drop policy if exists "innovation comments own or chair delete" on public.innovation_comments;
create policy "innovation comments own or chair delete"
on public.innovation_comments for delete
to authenticated
using (profile_id = auth.uid() or app_private.is_chair());
