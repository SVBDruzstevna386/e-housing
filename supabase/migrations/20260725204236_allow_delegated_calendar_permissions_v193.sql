create or replace function app_private.has_calendar_permission(required_action text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_role text;
  configured_permissions jsonb;
begin
  if required_action not in ('write', 'delete') then
    return false;
  end if;

  select profile.role::text
  into actor_role
  from public.profiles profile
  where profile.id = (select auth.uid())
    and profile.approval_status = 'approved'::public.approval_status
    and profile.role::text in ('chair', 'vice_chair', 'economic', 'board');

  if actor_role is null then
    return false;
  end if;

  select setting.value::jsonb
  into configured_permissions
  from public.app_settings setting
  where setting.key = 'role_permissions';

  return coalesce(
    (configured_permissions -> actor_role -> 'calendar' ->> required_action)::boolean,
    false
  );
exception
  when invalid_text_representation then
    return false;
end;
$$;

revoke all on function app_private.has_calendar_permission(text) from public;
revoke all on function app_private.has_calendar_permission(text) from anon;
grant execute on function app_private.has_calendar_permission(text) to authenticated;

drop policy if exists "events delegated calendar insert" on public.events;
create policy "events delegated calendar insert"
on public.events
for insert
to authenticated
with check (
  (select app_private.has_calendar_permission('write'))
  and created_by = (select auth.uid())
  and event_type = 'general'
  and owner_record_id is null
);

drop policy if exists "events delegated calendar update" on public.events;
create policy "events delegated calendar update"
on public.events
for update
to authenticated
using (
  (select app_private.has_calendar_permission('write'))
  and event_type = 'general'
  and owner_record_id is null
)
with check (
  (select app_private.has_calendar_permission('write'))
  and event_type = 'general'
  and owner_record_id is null
);

drop policy if exists "events delegated calendar delete" on public.events;
create policy "events delegated calendar delete"
on public.events
for delete
to authenticated
using (
  (select app_private.has_calendar_permission('delete'))
  and event_type = 'general'
  and owner_record_id is null
);

create or replace function app_private.protect_delegated_calendar_event_structure()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not app_private.is_chair()
     and (select app_private.has_calendar_permission('write'))
     and (
       new.created_by is distinct from old.created_by
       or new.building_id is distinct from old.building_id
       or new.event_type is distinct from old.event_type
       or new.owner_record_id is distinct from old.owner_record_id
     ) then
    raise exception 'Delegated calendar editors cannot change event ownership or type.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function app_private.protect_delegated_calendar_event_structure() from public;
revoke all on function app_private.protect_delegated_calendar_event_structure() from anon;
revoke all on function app_private.protect_delegated_calendar_event_structure() from authenticated;

drop trigger if exists protect_delegated_calendar_event_structure on public.events;
create trigger protect_delegated_calendar_event_structure
before update of created_by, building_id, event_type, owner_record_id
on public.events
for each row
execute function app_private.protect_delegated_calendar_event_structure();

notify pgrst, 'reload schema';
