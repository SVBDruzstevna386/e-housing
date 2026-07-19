create or replace function app_private.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.profiles
      where id = auth.uid()
        and approval_status = 'approved'::public.approval_status
    ),
    'owner'::public.app_role
  );
$$;

create or replace function app_private.is_approved_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'chair'::public.app_role
      and approval_status = 'approved'::public.approval_status
  );
$$;

create or replace function app_private.prevent_profile_self_authorization()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if (
    old.role is distinct from new.role
    or old.approval_status is distinct from new.approval_status
  ) and not app_private.is_approved_chair() then
    raise exception 'Only an approved chair can change profile role or approval status.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_self_authorization on public.profiles;
create trigger prevent_profile_self_authorization
before update on public.profiles
for each row execute function app_private.prevent_profile_self_authorization();

create or replace function app_private.prevent_owner_record_self_authorization()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if old.approval_status is distinct from new.approval_status
    and not app_private.is_approved_chair() then
    raise exception 'Only an approved chair can change owner approval status.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_owner_record_self_authorization on public.owner_records;
create trigger prevent_owner_record_self_authorization
before update on public.owner_records
for each row execute function app_private.prevent_owner_record_self_authorization();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
  profile_status public.approval_status;
  full_name_value text;
  flat_number_value text;
begin
  requested_role := coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'owner'::public.app_role);
  profile_status := 'pending'::public.approval_status;
  full_name_value := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));
  flat_number_value := coalesce(new.raw_user_meta_data ->> 'flat_number', '');

  insert into public.profiles (
    id,
    full_name,
    email,
    flat_number,
    role,
    approval_status,
    gdpr_accepted_at,
    gdpr_version
  )
  values (
    new.id,
    full_name_value,
    new.email,
    nullif(flat_number_value, ''),
    requested_role,
    profile_status,
    nullif(new.raw_user_meta_data ->> 'gdpr_accepted_at', '')::timestamptz,
    nullif(new.raw_user_meta_data ->> 'gdpr_version', '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    flat_number = excluded.flat_number,
    role = excluded.role,
    approval_status = excluded.approval_status,
    gdpr_accepted_at = coalesce(public.profiles.gdpr_accepted_at, excluded.gdpr_accepted_at),
    gdpr_version = coalesce(public.profiles.gdpr_version, excluded.gdpr_version);

  if requested_role = 'owner' then
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
    values (
      new.id,
      full_name_value,
      flat_number_value,
      new.email,
      'Čaká na autorizáciu',
      profile_status,
      current_date,
      false,
      0,
      'Registrácia vlastníka čaká na kontrolu predsedu'
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop policy if exists "announcements admin insert" on public.announcements;
create policy "announcements admin insert"
on public.announcements for insert
to authenticated
with check (app_private.is_chair());

drop policy if exists "announcements admin update" on public.announcements;
create policy "announcements admin update"
on public.announcements for update
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "announcements admin delete" on public.announcements;
create policy "announcements admin delete"
on public.announcements for delete
to authenticated
using (app_private.is_chair());

drop policy if exists "classifieds admin update" on public.classifieds;
create policy "classifieds admin update"
on public.classifieds for update
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "classifieds admin delete" on public.classifieds;
create policy "classifieds admin delete"
on public.classifieds for delete
to authenticated
using (app_private.is_chair());

drop policy if exists "classified categories chair manage" on public.classified_categories;
create policy "classified categories chair manage"
on public.classified_categories for all
to authenticated
using (app_private.is_approved_chair())
with check (app_private.is_approved_chair());

drop policy if exists "execution cases chair insert" on public.execution_cases;
create policy "execution cases chair insert"
on public.execution_cases for insert
to authenticated
with check (app_private.is_approved_chair());

drop policy if exists "execution cases chair update" on public.execution_cases;
create policy "execution cases chair update"
on public.execution_cases for update
to authenticated
using (app_private.is_approved_chair())
with check (app_private.is_approved_chair());

drop policy if exists "execution cases chair delete" on public.execution_cases;
create policy "execution cases chair delete"
on public.execution_cases for delete
to authenticated
using (app_private.is_approved_chair());
