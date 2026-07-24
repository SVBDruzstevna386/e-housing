alter table public.owner_records
add column if not exists can_manage_cleaning_calendar boolean not null default false;

alter table public.events
add column if not exists event_type text not null default 'general',
add column if not exists owner_record_id uuid references public.owner_records(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_event_type_check'
      and conrelid = 'public.events'::regclass
  ) then
    alter table public.events
    add constraint events_event_type_check
    check (event_type in ('general', 'cleaning', 'cleaning_extra'));
  end if;
end
$$;

create index if not exists owner_records_profile_id_idx
on public.owner_records (profile_id);

create index if not exists events_created_by_idx
on public.events (created_by);

create index if not exists events_owner_record_id_idx
on public.events (owner_record_id);

create or replace function app_private.protect_cleaning_calendar_permission()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.can_manage_cleaning_calendar
     is distinct from coalesce(old.can_manage_cleaning_calendar, false)
     and app_private.current_role()::text <> 'chair' then
    raise exception 'Only the chair may change cleaning calendar access.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_cleaning_calendar_permission on public.owner_records;
create trigger protect_cleaning_calendar_permission
before update of can_manage_cleaning_calendar on public.owner_records
for each row
execute function app_private.protect_cleaning_calendar_permission();

create or replace function app_private.protect_cleaning_calendar_permission_on_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.can_manage_cleaning_calendar
     and app_private.current_role()::text <> 'chair' then
    raise exception 'Only the chair may grant cleaning calendar access.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_cleaning_calendar_permission_on_insert on public.owner_records;
create trigger protect_cleaning_calendar_permission_on_insert
before insert on public.owner_records
for each row
execute function app_private.protect_cleaning_calendar_permission_on_insert();

drop policy if exists "events owner cleaning insert" on public.events;
create policy "events owner cleaning insert"
on public.events
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and event_type in ('cleaning', 'cleaning_extra')
  and title = case event_type
    when 'cleaning' then 'Upratovanie'
    when 'cleaning_extra' then 'Upratovanie - extra'
  end
  and owner_record_id is not null
  and exists (
    select 1
    from public.owner_records owner_record
    where owner_record.id = events.owner_record_id
      and owner_record.profile_id = (select auth.uid())
      and owner_record.building_id = events.building_id
      and owner_record.approval_status = 'approved'::public.approval_status
      and owner_record.can_manage_cleaning_calendar
  )
);

drop policy if exists "events owner cleaning update" on public.events;
create policy "events owner cleaning update"
on public.events
for update
to authenticated
using (
  created_by = (select auth.uid())
  and event_type in ('cleaning', 'cleaning_extra')
)
with check (
  created_by = (select auth.uid())
  and event_type in ('cleaning', 'cleaning_extra')
  and title = case event_type
    when 'cleaning' then 'Upratovanie'
    when 'cleaning_extra' then 'Upratovanie - extra'
  end
  and owner_record_id is not null
  and exists (
    select 1
    from public.owner_records owner_record
    where owner_record.id = events.owner_record_id
      and owner_record.profile_id = (select auth.uid())
      and owner_record.building_id = events.building_id
      and owner_record.approval_status = 'approved'::public.approval_status
      and owner_record.can_manage_cleaning_calendar
  )
);

drop policy if exists "events owner cleaning delete" on public.events;
create policy "events owner cleaning delete"
on public.events
for delete
to authenticated
using (
  created_by = (select auth.uid())
  and event_type in ('cleaning', 'cleaning_extra')
  and exists (
    select 1
    from public.owner_records owner_record
    where owner_record.id = events.owner_record_id
      and owner_record.profile_id = (select auth.uid())
      and owner_record.approval_status = 'approved'::public.approval_status
      and owner_record.can_manage_cleaning_calendar
  )
);
