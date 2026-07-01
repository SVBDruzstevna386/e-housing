create table if not exists public.billing_settlements (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  settlement_year integer not null,
  note text,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists billing_settlements_owner_profile_id_idx
on public.billing_settlements(owner_profile_id);

alter table public.billing_settlements enable row level security;
grant select, insert, update, delete on public.billing_settlements to authenticated;

drop policy if exists "billing settlements role read" on public.billing_settlements;
create policy "billing settlements role read"
on public.billing_settlements for select
to authenticated
using (
  app_private.is_board_or_chair()
  or owner_profile_id = auth.uid()
);

drop policy if exists "billing settlements chair write" on public.billing_settlements;
create policy "billing settlements chair write"
on public.billing_settlements for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());
