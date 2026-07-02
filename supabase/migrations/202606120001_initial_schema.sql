create type public.app_role as enum ('chair', 'economic', 'board', 'owner');
create type public.message_scope as enum ('public', 'private');
create type public.vote_status as enum ('draft', 'open', 'closed', 'archived');

create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  role public.app_role not null default 'owner',
  full_name text not null,
  email text not null,
  phone text,
  profile_photo_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.flats (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  flat_number text not null,
  floor text,
  share_percent numeric(8, 4) not null default 0,
  created_at timestamptz not null default now(),
  unique (building_id, flat_number)
);

create table public.flat_owners (
  id uuid primary key default gen_random_uuid(),
  flat_id uuid not null references public.flats(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  ownership_share numeric(8, 4) not null default 100,
  valid_from date not null default current_date,
  valid_to date,
  unique (flat_id, profile_id, valid_from)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  category text not null,
  description text,
  storage_path text not null,
  is_urgent boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  category text not null default 'Prevadzka',
  is_urgent boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  scope public.message_scope not null default 'public',
  title text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table public.thread_members (
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (thread_id, profile_id)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  description text not null,
  status public.vote_status not null default 'draft',
  weighted_by_share boolean not null default true,
  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.vote_options (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create table public.vote_answers (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  option_id uuid not null references public.vote_options(id),
  profile_id uuid not null references public.profiles(id),
  comment text,
  weight numeric(8, 4) not null default 1,
  created_at timestamptz not null default now(),
  unique (vote_id, profile_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create table public.notification_log (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id),
  subject text not null,
  channel text not null default 'email',
  related_table text,
  related_id uuid,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.buildings enable row level security;
alter table public.profiles enable row level security;
alter table public.flats enable row level security;
alter table public.flat_owners enable row level security;
alter table public.documents enable row level security;
alter table public.announcements enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.thread_members enable row level security;
alter table public.votes enable row level security;
alter table public.vote_options enable row level security;
alter table public.vote_answers enable row level security;
alter table public.events enable row level security;
alter table public.notification_log enable row level security;
alter table public.audit_log enable row level security;
