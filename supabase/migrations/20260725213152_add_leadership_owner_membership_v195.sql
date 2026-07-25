create or replace function app_private.ensure_leadership_owner_record()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role::text not in ('chair', 'vice_chair', 'board') then
    return new;
  end if;

  update public.owner_records owner_record
  set profile_id = new.id,
      full_name = coalesce(nullif(owner_record.full_name, ''), new.full_name),
      login_email = coalesce(owner_record.login_email, new.email),
      updated_at = now()
  where owner_record.profile_id is null
    and new.email is not null
    and lower(owner_record.login_email) = lower(new.email);

  update public.owner_records
  set full_name = new.full_name,
      login_email = new.email,
      phone = coalesce(new.phone, phone),
      approval_status = new.approval_status,
      account_status = case
        when new.approval_status = 'approved'::public.approval_status then 'Aktívny'
        when new.approval_status = 'disabled'::public.approval_status then 'Neaktívny'
        when new.approval_status = 'rejected'::public.approval_status then 'Zamietnutý'
        else 'Čaká na autorizáciu'
      end,
      updated_at = now()
  where profile_id = new.id;

  if not exists (
    select 1
    from public.owner_records owner_record
    where owner_record.profile_id = new.id
  ) then
    insert into public.owner_records (
      profile_id,
      full_name,
      flat_number,
      login_email,
      phone,
      correspondence_street,
      correspondence_city,
      correspondence_postal_code,
      account_status,
      approval_status,
      owned_from,
      is_debtor,
      debt_amount,
      can_manage_cleaning_calendar,
      note
    )
    values (
      new.id,
      new.full_name,
      coalesce(new.flat_number, ''),
      new.email,
      new.phone,
      new.correspondence_street,
      new.correspondence_city,
      new.correspondence_postal_code,
      case
        when new.approval_status = 'approved'::public.approval_status then 'Aktívny'
        when new.approval_status = 'disabled'::public.approval_status then 'Neaktívny'
        when new.approval_status = 'rejected'::public.approval_status then 'Zamietnutý'
        else 'Čaká na autorizáciu'
      end,
      new.approval_status,
      coalesce(new.owned_from, current_date),
      coalesce(new.is_debtor, false),
      coalesce(new.debt_amount, 0),
      false,
      coalesce(new.note, 'Vlastník nehnuteľnosti s funkciou vo vedení SVB')
    );
  end if;

  return new;
end;
$$;

revoke all on function app_private.ensure_leadership_owner_record() from public;
revoke all on function app_private.ensure_leadership_owner_record() from anon;
revoke all on function app_private.ensure_leadership_owner_record() from authenticated;

drop trigger if exists ensure_leadership_owner_record on public.profiles;
create trigger ensure_leadership_owner_record
after insert or update of role, approval_status
on public.profiles
for each row
execute function app_private.ensure_leadership_owner_record();

update public.owner_records owner_record
set profile_id = profile.id,
    full_name = coalesce(nullif(owner_record.full_name, ''), profile.full_name),
    login_email = coalesce(owner_record.login_email, profile.email),
    updated_at = now()
from public.profiles profile
where owner_record.profile_id is null
  and profile.role::text in ('chair', 'vice_chair', 'board')
  and profile.email is not null
  and lower(owner_record.login_email) = lower(profile.email);

insert into public.owner_records (
  profile_id,
  full_name,
  flat_number,
  login_email,
  phone,
  correspondence_street,
  correspondence_city,
  correspondence_postal_code,
  account_status,
  approval_status,
  owned_from,
  is_debtor,
  debt_amount,
  can_manage_cleaning_calendar,
  note
)
select
  profile.id,
  profile.full_name,
  coalesce(profile.flat_number, ''),
  profile.email,
  profile.phone,
  profile.correspondence_street,
  profile.correspondence_city,
  profile.correspondence_postal_code,
  case
    when profile.approval_status = 'approved'::public.approval_status then 'Aktívny'
    when profile.approval_status = 'disabled'::public.approval_status then 'Neaktívny'
    when profile.approval_status = 'rejected'::public.approval_status then 'Zamietnutý'
    else 'Čaká na autorizáciu'
  end,
  profile.approval_status,
  coalesce(profile.owned_from, current_date),
  coalesce(profile.is_debtor, false),
  coalesce(profile.debt_amount, 0),
  false,
  coalesce(profile.note, 'Vlastník nehnuteľnosti s funkciou vo vedení SVB')
from public.profiles profile
where profile.role::text in ('chair', 'vice_chair', 'board')
  and not exists (
    select 1
    from public.owner_records owner_record
    where owner_record.profile_id = profile.id
  );

notify pgrst, 'reload schema';
