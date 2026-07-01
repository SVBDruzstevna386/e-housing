create table if not exists public.execution_cases (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  owner_record_id uuid references public.owner_records(id) on delete set null,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null default 'Vymáhanie nedoplatku',
  owner_name text not null default '',
  flat_number text,
  owner_email text,
  debt_amount numeric(12,2) not null default 0,
  debt_since date,
  status text not null default 'Evidovaný dlh',
  execution_title_status text not null default 'Neposúdené',
  legal_status text,
  debt_history text,
  last_action_date date,
  next_step_date date,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists execution_cases_owner_record_id_idx on public.execution_cases(owner_record_id);
create index if not exists execution_cases_owner_profile_id_idx on public.execution_cases(owner_profile_id);
create index if not exists execution_cases_status_idx on public.execution_cases(status);
create index if not exists execution_cases_updated_at_idx on public.execution_cases(updated_at desc);

alter table public.execution_cases enable row level security;

grant select, insert, update, delete on public.execution_cases to authenticated;

drop policy if exists "execution cases read authenticated" on public.execution_cases;
create policy "execution cases read authenticated"
on public.execution_cases
for select
to authenticated
using (true);

drop policy if exists "execution cases chair insert" on public.execution_cases;
create policy "execution cases chair insert"
on public.execution_cases
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role::text = 'chair'
  )
);

drop policy if exists "execution cases chair update" on public.execution_cases;
create policy "execution cases chair update"
on public.execution_cases
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role::text = 'chair'
  )
)
with check (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role::text = 'chair'
  )
);

drop policy if exists "execution cases chair delete" on public.execution_cases;
create policy "execution cases chair delete"
on public.execution_cases
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role::text = 'chair'
  )
);
