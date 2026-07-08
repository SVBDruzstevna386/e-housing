create table if not exists public.classified_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.classifieds (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references public.buildings(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null default 'Predam',
  description text,
  contact text,
  price text,
  status text not null default 'Aktivne',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.classified_categories (title, sort_order)
values
  ('Predám', 10),
  ('Kúpim', 20),
  ('Darujem', 30),
  ('Zháňam', 40)
on conflict (title) do nothing;

alter table public.classified_categories enable row level security;
alter table public.classifieds enable row level security;

grant select, insert, update, delete on public.classified_categories to authenticated;
grant select, insert, update, delete on public.classifieds to authenticated;

drop policy if exists "classified categories read" on public.classified_categories;
drop policy if exists "classified categories chair manage" on public.classified_categories;
drop policy if exists "classifieds read" on public.classifieds;
drop policy if exists "classifieds insert" on public.classifieds;
drop policy if exists "classifieds author update" on public.classifieds;
drop policy if exists "classifieds author delete" on public.classifieds;
drop policy if exists "classifieds admin update" on public.classifieds;
drop policy if exists "classifieds admin delete" on public.classifieds;

create policy "classified categories read"
on public.classified_categories for select
to authenticated
using (true);

create policy "classified categories chair manage"
on public.classified_categories for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);

create policy "classifieds read"
on public.classifieds for select
to authenticated
using (true);

create policy "classifieds insert"
on public.classifieds for insert
to authenticated
with check (created_by = auth.uid());

create policy "classifieds author update"
on public.classifieds for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "classifieds author delete"
on public.classifieds for delete
to authenticated
using (created_by = auth.uid());

create policy "classifieds admin update"
on public.classifieds for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);

create policy "classifieds admin delete"
on public.classifieds for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);
