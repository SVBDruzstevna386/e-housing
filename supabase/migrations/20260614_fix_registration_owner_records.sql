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
  profile_status := case
    when requested_role = 'owner' then 'pending'::public.approval_status
    else 'approved'::public.approval_status
  end;
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

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

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
  profile.id,
  profile.full_name,
  coalesce(profile.flat_number, ''),
  profile.email,
  case
    when profile.approval_status = 'approved' then 'Aktívny'
    when profile.approval_status = 'disabled' then 'Neaktívny'
    when profile.approval_status = 'rejected' then 'Zamietnutý'
    else 'Čaká na autorizáciu'
  end,
  profile.approval_status,
  coalesce(profile.owned_from, current_date),
  coalesce(profile.is_debtor, false),
  coalesce(profile.debt_amount, 0),
  coalesce(profile.note, 'Registrácia vlastníka čaká na kontrolu predsedu')
from public.profiles profile
where profile.role = 'owner'
  and not exists (
    select 1
    from public.owner_records owner_record
    where owner_record.profile_id = profile.id
       or lower(owner_record.login_email) = lower(profile.email)
  );
