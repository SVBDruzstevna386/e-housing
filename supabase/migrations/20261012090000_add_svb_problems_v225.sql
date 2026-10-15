create or replace function app_private.can_manage_svb_problems()
returns boolean language sql stable security definer set search_path = ''
as $$
  select app_private.is_approved_chair() or app_private.is_platform_admin();
$$;

revoke all on function app_private.can_manage_svb_problems() from public, anon;
grant execute on function app_private.can_manage_svb_problems() to authenticated, service_role;

create table public.svb_problems (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id),
  recipient_id uuid references public.profiles(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 300),
  body text not null check (length(btrim(body)) between 1 and 20000),
  youtube_url text,
  photo_paths text[] not null default '{}',
  show_in_album boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint svb_problems_photo_count check (cardinality(photo_paths) <= 10)
);

create index svb_problems_recipient_created_idx on public.svb_problems (recipient_id, created_at desc);
alter table public.svb_problems enable row level security;
revoke all on public.svb_problems from anon, authenticated;
grant select, insert, update, delete on public.svb_problems to authenticated;
grant all on public.svb_problems to service_role;

create policy "svb problems read relevant" on public.svb_problems for select to authenticated
using (
  app_private.can_manage_svb_problems()
  or (
    (recipient_id is null or recipient_id = (select auth.uid()))
    and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.approval_status = 'approved')
  )
);
create policy "svb problems create admin" on public.svb_problems for insert to authenticated
with check (app_private.can_manage_svb_problems() and created_by = (select auth.uid()));
create policy "svb problems update admin" on public.svb_problems for update to authenticated
using (app_private.can_manage_svb_problems()) with check (app_private.can_manage_svb_problems());
create policy "svb problems delete admin" on public.svb_problems for delete to authenticated
using (app_private.can_manage_svb_problems());

create or replace function app_private.validate_svb_problem()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.id <> old.id or new.created_by <> old.created_by or new.created_at <> old.created_at then
      raise exception 'Problem identity and author cannot be changed.' using errcode = '23514';
    end if;
  end if;
  if new.recipient_id is not null and not exists (
    select 1 from public.profiles p where p.id = new.recipient_id and p.approval_status = 'approved'
    and (p.role in ('owner', 'chair', 'vice_chair', 'board') or exists (
      select 1 from public.owner_records o where o.profile_id = p.id and o.approval_status = 'approved'
    ))
  ) then
    raise exception 'Select an approved property owner.' using errcode = '23514';
  end if;
  if exists (
    select 1 from unnest(new.photo_paths) path
    where path is null or path !~ ('^' || new.id::text || '/[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$')
  ) or cardinality(new.photo_paths) <> (select count(distinct path) from unnest(new.photo_paths) path) then
    raise exception 'Invalid problem photo paths.' using errcode = '23514';
  end if;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function app_private.validate_svb_problem() from public, anon, authenticated;
create trigger validate_svb_problem before insert or update on public.svb_problems
for each row execute function app_private.validate_svb_problem();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('svb-problem-photos', 'svb-problem-photos', false, 10485760, array['image/jpeg','image/png','image/webp','image/gif']);

create policy "svb problem photos read relevant" on storage.objects for select to authenticated
using (bucket_id = 'svb-problem-photos' and (
  app_private.can_manage_svb_problems()
  or exists (select 1 from public.svb_problems p where name = any(p.photo_paths))
));
create policy "svb problem photos insert admin" on storage.objects for insert to authenticated
with check (bucket_id = 'svb-problem-photos' and app_private.can_manage_svb_problems());
create policy "svb problem photos delete admin" on storage.objects for delete to authenticated
using (bucket_id = 'svb-problem-photos' and app_private.can_manage_svb_problems());

alter table public.notification_preferences drop constraint notification_preferences_area_check;
alter table public.notification_preferences add constraint notification_preferences_area_check check (
  area in ('overview','votes','billing','documents','document_history','executions','finance','messages','calendar','activities','photo_album','classifieds','talk','problems')
);
alter table public.notification_preferences drop constraint notification_preferences_required_areas_check;
alter table public.notification_preferences add constraint notification_preferences_required_areas_check check (
  area not in ('overview','votes','billing','problems') or (email_enabled and push_enabled)
);
alter table public.notification_log drop constraint notification_log_area_check;
alter table public.notification_log add constraint notification_log_area_check check (
  notification_area is null or notification_area in ('overview','votes','billing','documents','document_history','executions','finance','messages','calendar','activities','photo_album','classifieds','talk','problems')
);

insert into public.email_templates (building_id, key, title, subject, body)
values ('38600000-0000-0000-0000-000000000386', 'svb-problem', 'Problémy SVB: nová udalosť',
  'Problémy SVB: {{title}}',
  'Dobrý deň,

predseda SVB zverejnil dôležitú informáciu týkajúcu sa vlastníkov nehnuteľností.

{{title}}

{{message}}

Podrobnosti, fotografie a prípadné video nájdete v záložke Problémy SVB:
{{actionUrl}}

{{sender}}
e - Housing Solutions Licence')
on conflict (building_id, key) do nothing;

notify pgrst, 'reload schema';
