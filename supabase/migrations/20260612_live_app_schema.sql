create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('chair', 'economic', 'board', 'owner');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.approval_status as enum ('pending', 'approved', 'rejected', 'disabled');
exception when duplicate_object then null;
end $$;

create schema if not exists app_private;
revoke all on schema app_private from anon, authenticated;

create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  created_at timestamptz not null default now()
);

insert into public.buildings (id, name, address)
values ('38600000-0000-0000-0000-000000000386', 'SVB a NP Družstevná 386', 'Družstevná 386')
on conflict (id) do update set name = excluded.name, address = excluded.address;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  role public.app_role not null default 'owner',
  approval_status public.approval_status not null default 'pending',
  full_name text not null default '',
  email text not null,
  phone text,
  flat_number text,
  gdpr_accepted_at timestamptz,
  gdpr_version text,
  owned_from date,
  is_debtor boolean not null default false,
  debt_amount numeric(12, 2) not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_categories (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  name text not null,
  sort_order integer not null default 0,
  unique (building_id, name)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  description text,
  storage_path text,
  is_history boolean not null default false,
  is_urgent boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  body text not null,
  category text not null default 'Prevádzka',
  is_urgent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  sender_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null,
  subject text not null default 'Správa',
  body text not null,
  scope text not null default 'private',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'open',
  closes_at timestamptz,
  yes_count integer not null default 0,
  no_count integer not null default 0,
  abstain_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.vote_answers (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  answer text not null,
  comment text,
  created_at timestamptz not null default now(),
  unique (vote_id, profile_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  profile_id uuid references public.profiles(id) on delete set null,
  person text not null,
  role text not null,
  title text not null,
  month text not null,
  hours numeric(8, 2) not null default 0,
  status text not null default 'Dokončené',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null default 'Iné',
  description text,
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  key text not null,
  title text not null,
  subject text not null,
  body text not null,
  unique (building_id, key)
);

create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  recipient_id uuid references public.profiles(id) on delete set null,
  subject text not null,
  channel text not null default 'email',
  related_table text,
  related_id uuid,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create or replace function app_private.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'owner'::public.app_role);
$$;

create or replace function app_private.is_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_private.current_role()::text in ('chair', 'economic');
$$;

create or replace function app_private.is_board_or_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_private.current_role()::text in ('chair', 'economic', 'board');
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
begin
  requested_role := coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'owner'::public.app_role);
  insert into public.profiles (id, full_name, email, flat_number, role, approval_status, gdpr_accepted_at, gdpr_version)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'flat_number',
    requested_role,
    case when requested_role = 'owner' then 'pending'::public.approval_status else 'approved'::public.approval_status end,
    nullif(new.raw_user_meta_data ->> 'gdpr_accepted_at', '')::timestamptz,
    nullif(new.raw_user_meta_data ->> 'gdpr_version', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.buildings enable row level security;
alter table public.profiles enable row level security;
alter table public.document_categories enable row level security;
alter table public.documents enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;
alter table public.votes enable row level security;
alter table public.vote_answers enable row level security;
alter table public.activities enable row level security;
alter table public.photos enable row level security;
alter table public.email_templates enable row level security;
alter table public.notification_log enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on schema app_private to authenticated;

drop policy if exists "authenticated read building" on public.buildings;
create policy "authenticated read building" on public.buildings for select to authenticated using (true);

drop policy if exists "profiles read authenticated" on public.profiles;
create policy "profiles read authenticated" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles update self or chair" on public.profiles;
create policy "profiles update self or chair" on public.profiles for update to authenticated using (id = auth.uid() or app_private.is_chair()) with check (id = auth.uid() or app_private.is_chair());
drop policy if exists "profiles delete chair" on public.profiles;
create policy "profiles delete chair" on public.profiles for delete to authenticated using (app_private.is_chair());

drop policy if exists "categories read" on public.document_categories;
create policy "categories read" on public.document_categories for select to authenticated using (true);
drop policy if exists "categories chair write" on public.document_categories;
create policy "categories chair write" on public.document_categories for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());

drop policy if exists "documents read" on public.documents;
create policy "documents read" on public.documents for select to authenticated using (true);
drop policy if exists "documents chair write" on public.documents;
create policy "documents chair write" on public.documents for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());

drop policy if exists "announcements read" on public.announcements;
create policy "announcements read" on public.announcements for select to authenticated using (true);
drop policy if exists "announcements chair write" on public.announcements;
create policy "announcements chair write" on public.announcements for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());

drop policy if exists "events read" on public.events;
create policy "events read" on public.events for select to authenticated using (true);
drop policy if exists "events chair write" on public.events;
create policy "events chair write" on public.events for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());

drop policy if exists "messages read relevant" on public.messages;
create policy "messages read relevant" on public.messages for select to authenticated using (scope = 'public' or sender_id = auth.uid() or recipient_id = auth.uid() or app_private.is_board_or_chair());
drop policy if exists "messages insert authenticated" on public.messages;
create policy "messages insert authenticated" on public.messages for insert to authenticated with check (sender_id = auth.uid());
drop policy if exists "messages update own or chair" on public.messages;
create policy "messages update own or chair" on public.messages for update to authenticated using (sender_id = auth.uid() or recipient_id = auth.uid() or app_private.is_chair()) with check (sender_id = auth.uid() or recipient_id = auth.uid() or app_private.is_chair());

drop policy if exists "votes read" on public.votes;
create policy "votes read" on public.votes for select to authenticated using (true);
drop policy if exists "votes chair write" on public.votes;
create policy "votes chair write" on public.votes for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());
drop policy if exists "vote answers read" on public.vote_answers;
create policy "vote answers read" on public.vote_answers for select to authenticated using (true);
drop policy if exists "vote answers own insert" on public.vote_answers;
create policy "vote answers own insert" on public.vote_answers for insert to authenticated with check (profile_id = auth.uid());
drop policy if exists "vote answers own update" on public.vote_answers;
create policy "vote answers own update" on public.vote_answers for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "activities read" on public.activities;
create policy "activities read" on public.activities for select to authenticated using (true);
drop policy if exists "activities board chair write" on public.activities;
create policy "activities board chair write" on public.activities for all to authenticated using (app_private.is_board_or_chair()) with check (app_private.is_board_or_chair());

drop policy if exists "photos read" on public.photos;
create policy "photos read" on public.photos for select to authenticated using (true);
drop policy if exists "photos insert authenticated" on public.photos;
create policy "photos insert authenticated" on public.photos for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "photos delete chair" on public.photos;
create policy "photos delete chair" on public.photos for delete to authenticated using (app_private.is_chair());

drop policy if exists "templates read" on public.email_templates;
create policy "templates read" on public.email_templates for select to authenticated using (true);
drop policy if exists "templates chair write" on public.email_templates;
create policy "templates chair write" on public.email_templates for all to authenticated using (app_private.is_chair()) with check (app_private.is_chair());

drop policy if exists "notifications chair read" on public.notification_log;
create policy "notifications chair read" on public.notification_log for select to authenticated using (app_private.is_chair() or recipient_id = auth.uid());
drop policy if exists "notifications chair insert" on public.notification_log;
create policy "notifications chair insert" on public.notification_log for insert to authenticated with check (app_private.is_chair());

insert into public.document_categories (name, sort_order) values
  ('Zápisnice', 10),
  ('Zmluvy nájmov', 20),
  ('Iné zmluvy', 30),
  ('Iné dokumenty', 40)
on conflict (building_id, name) do nothing;

insert into public.email_templates (key, title, subject, body) values
  ('registration', 'Registrácia vlastníka', 'Vitajte v e-housing pre SVB a NP Družstevná 386', 'Dobrý deň, bol Vám vytvorený prístup do aplikácie e-housing.'),
  ('event', 'Nová udalosť', 'Nová udalosť v dome: {{title}}', 'Dobrý deň, v aplikácii pribudla nová udalosť {{title}}.'),
  ('document', 'Nový dokument', 'Nový dokument: {{title}}', 'Dobrý deň, v aplikácii bol zverejnený nový dokument {{title}}.')
on conflict (building_id, key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'e-housing-files',
  'e-housing-files',
  true,
  20971520,
  array['application/pdf','image/png','image/jpeg','image/webp','image/gif','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage read e-housing" on storage.objects;
create policy "storage read e-housing" on storage.objects for select to authenticated using (bucket_id = 'e-housing-files');
drop policy if exists "storage insert e-housing" on storage.objects;
create policy "storage insert e-housing" on storage.objects for insert to authenticated with check (bucket_id = 'e-housing-files');
drop policy if exists "storage update e-housing" on storage.objects;
create policy "storage update e-housing" on storage.objects for update to authenticated using (bucket_id = 'e-housing-files' and app_private.is_chair()) with check (bucket_id = 'e-housing-files' and app_private.is_chair());
drop policy if exists "storage delete e-housing chair" on storage.objects;
create policy "storage delete e-housing chair" on storage.objects for delete to authenticated using (bucket_id = 'e-housing-files' and app_private.is_chair());
