create table if not exists public.owner_records (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade default '38600000-0000-0000-0000-000000000386',
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  flat_number text not null default '',
  share_text text not null default '0,00 %',
  login_email text,
  account_status text not null default 'Čaká na autorizáciu',
  approval_status public.approval_status not null default 'pending',
  owned_from date,
  is_debtor boolean not null default false,
  debt_amount numeric(12, 2) not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.owner_records enable row level security;
grant select, insert, update, delete on public.owner_records to authenticated;

drop policy if exists "owner records read" on public.owner_records;
create policy "owner records read" on public.owner_records
for select to authenticated
using (true);

drop policy if exists "owner records chair write" on public.owner_records;
create policy "owner records chair write" on public.owner_records
for all to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "owner records self update contact" on public.owner_records;
create policy "owner records self update contact" on public.owner_records
for update to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

insert into public.owner_records (
  profile_id,
  full_name,
  flat_number,
  login_email,
  account_status,
  approval_status,
  owned_from,
  is_debtor,
  debt_amount,
  note
)
select
  p.id,
  p.full_name,
  coalesce(p.flat_number, ''),
  p.email,
  case when p.approval_status = 'approved' then 'Aktívny' else 'Čaká na autorizáciu' end,
  p.approval_status,
  p.owned_from,
  p.is_debtor,
  p.debt_amount,
  p.note
from public.profiles p
where p.role = 'owner'
  and not exists (
    select 1
    from public.owner_records o
    where o.profile_id = p.id
  );

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
  profile_status public.approval_status;
begin
  requested_role := coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'owner'::public.app_role);
  profile_status := case when requested_role = 'owner' then 'pending'::public.approval_status else 'approved'::public.approval_status end;

  insert into public.profiles (id, full_name, email, flat_number, role, approval_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'flat_number',
    requested_role,
    profile_status
  )
  on conflict (id) do nothing;

  if requested_role = 'owner' then
    insert into public.owner_records (profile_id, full_name, flat_number, login_email, account_status, approval_status, owned_from, note)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
      coalesce(new.raw_user_meta_data ->> 'flat_number', ''),
      new.email,
      'Čaká na autorizáciu',
      profile_status,
      current_date,
      'Registrácia vlastníka čaká na kontrolu predsedu'
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;
