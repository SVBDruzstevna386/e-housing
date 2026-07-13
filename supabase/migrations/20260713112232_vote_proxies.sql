create table if not exists public.vote_proxies (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  grantor_profile_id uuid not null references public.profiles(id) on delete cascade,
  owner_record_id uuid references public.owner_records(id) on delete set null,
  grantor_full_name text not null,
  grantor_birth_date date,
  grantor_permanent_address text not null,
  property_number text not null,
  proxy_full_name text not null,
  proxy_birth_date date,
  proxy_permanent_address text not null,
  proxy_identity_document text not null,
  meeting_date date not null,
  signature_place text not null,
  signature_date date not null,
  official_verification_acknowledged boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vote_proxies_required_text check (
    btrim(grantor_full_name) <> ''
    and btrim(grantor_permanent_address) <> ''
    and btrim(property_number) <> ''
    and btrim(proxy_full_name) <> ''
    and btrim(proxy_permanent_address) <> ''
    and btrim(proxy_identity_document) <> ''
    and btrim(signature_place) <> ''
  ),
  constraint vote_proxies_official_verification_required check (official_verification_acknowledged),
  constraint vote_proxies_vote_grantor_property_unique unique (vote_id, grantor_profile_id, property_number)
);

create index if not exists vote_proxies_vote_id_idx on public.vote_proxies(vote_id);
create index if not exists vote_proxies_grantor_profile_id_idx on public.vote_proxies(grantor_profile_id);
create index if not exists vote_proxies_owner_record_id_idx on public.vote_proxies(owner_record_id);

create or replace function app_private.touch_vote_proxy_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vote_proxies_touch_updated_at on public.vote_proxies;
create trigger vote_proxies_touch_updated_at
before update on public.vote_proxies
for each row execute function app_private.touch_vote_proxy_updated_at();

alter table public.vote_proxies enable row level security;

drop policy if exists "vote proxies read own or chair" on public.vote_proxies;
create policy "vote proxies read own or chair"
on public.vote_proxies for select
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies insert own or chair" on public.vote_proxies;
create policy "vote proxies insert own or chair"
on public.vote_proxies for insert
to authenticated
with check (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies update own or chair" on public.vote_proxies;
create policy "vote proxies update own or chair"
on public.vote_proxies for update
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()))
with check (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies delete own or chair" on public.vote_proxies;
create policy "vote proxies delete own or chair"
on public.vote_proxies for delete
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

grant select, insert, update, delete on public.vote_proxies to authenticated;
revoke all on public.vote_proxies from anon;

comment on table public.vote_proxies is 'Splnomocnenia naviazane na konkretne hlasovanie a nehnutelnost.';
comment on column public.vote_proxies.official_verification_acknowledged is 'Pouzivatel berie na vedomie, ze podpis splnomocnitela musi byt uradne overeny.';

notify pgrst, 'reload schema';
