alter table public.messages
  add column if not exists message_section text not null default 'repair';

alter table public.messages
  drop constraint if exists messages_message_section_check;

alter table public.messages
  add constraint messages_message_section_check
  check (message_section in ('repair', 'talk'));

create index if not exists messages_section_parent_created_idx
  on public.messages (message_section, parent_id, created_at);

create or replace function app_private.inherit_message_section_from_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.parent_id is not null then
    select parent.message_section
    into new.message_section
    from public.messages parent
    where parent.id = new.parent_id;

    if not found then
      raise exception 'Parent message does not exist.'
        using errcode = '23503';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function app_private.inherit_message_section_from_parent() from public;
revoke all on function app_private.inherit_message_section_from_parent() from anon;
revoke all on function app_private.inherit_message_section_from_parent() from authenticated;

drop trigger if exists inherit_message_section_from_parent on public.messages;
create trigger inherit_message_section_from_parent
before insert or update of parent_id, message_section
on public.messages
for each row
execute function app_private.inherit_message_section_from_parent();

notify pgrst, 'reload schema';
