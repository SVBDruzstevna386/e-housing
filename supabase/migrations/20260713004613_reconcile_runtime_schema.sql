alter table public.app_settings
  alter column value drop not null,
  alter column value drop default;

alter table public.messages
  add column if not exists recipient_label text;

alter table public.votes
  add column if not exists vote_type text not null default 'present_majority';

create index if not exists activity_logs_activity_type_idx
  on public.activity_logs(activity_type);

create index if not exists activity_logs_actor_id_idx
  on public.activity_logs(actor_id);

create index if not exists activity_logs_actor_role_idx
  on public.activity_logs(actor_role);

create index if not exists activity_logs_related_idx
  on public.activity_logs(related_table, related_id);

create index if not exists votes_vote_type_idx
  on public.votes(vote_type);


create schema if not exists private;

create table if not exists public.vote_comments (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null,
  visibility text not null default 'public'
    check (visibility in ('public', 'private_chair')),
  body text not null,
  parent_id uuid references public.vote_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists vote_comments_parent_id_idx
  on public.vote_comments(parent_id);

create index if not exists vote_comments_vote_id_created_at_idx
  on public.vote_comments(vote_id, created_at);

alter table public.vote_comments enable row level security;

grant usage on schema private to authenticated;
grant select, insert, update, delete on public.vote_comments to authenticated;

create or replace function private.can_insert_vote_comment_reply(
  target_parent_id uuid,
  target_vote_id uuid,
  actor_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select
    target_parent_id is null
    or exists (
      select 1
      from public.vote_comments parent
      where parent.id = target_parent_id
        and parent.vote_id = target_vote_id
        and (
          parent.visibility = 'public'
          or (
            parent.visibility = 'private_chair'
            and exists (
              select 1
              from public.profiles p
              where p.id = actor_id
                and p.role::text = 'chair'
                and p.approval_status::text = 'approved'
            )
          )
        )
    );
$$;

revoke all on function private.can_insert_vote_comment_reply(uuid, uuid, uuid)
  from public, anon;
grant execute on function private.can_insert_vote_comment_reply(uuid, uuid, uuid)
  to authenticated;

drop policy if exists "vote_comments_select_authenticated" on public.vote_comments;
create policy "vote_comments_select_authenticated"
on public.vote_comments for select
to authenticated
using (
  visibility = 'public'
  or profile_id = auth.uid()
  or recipient_id = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'chair'::public.app_role
      and p.approval_status = 'approved'::public.approval_status
  )
);

drop policy if exists "vote_comments_insert_authenticated" on public.vote_comments;
create policy "vote_comments_insert_authenticated"
on public.vote_comments for insert
to authenticated
with check (
  profile_id = auth.uid()
  and private.can_insert_vote_comment_reply(parent_id, vote_id, auth.uid())
);

drop policy if exists "vote_comments_update_own" on public.vote_comments;
create policy "vote_comments_update_own"
on public.vote_comments for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

drop policy if exists "vote_comments_delete_chair" on public.vote_comments;
create policy "vote_comments_delete_chair"
on public.vote_comments for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'chair'::public.app_role
      and p.approval_status = 'approved'::public.approval_status
  )
);

drop policy if exists "app settings chair write" on public.app_settings;
create policy "app settings chair write"
on public.app_settings for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "vote questions chair write" on public.vote_questions;
create policy "vote questions chair write"
on public.vote_questions for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

drop policy if exists "public assets chair insert" on storage.objects;
create policy "public assets chair insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'e-housing-public'
  and app_private.is_chair()
);

drop policy if exists "public assets chair update" on storage.objects;
create policy "public assets chair update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'e-housing-public'
  and app_private.is_chair()
)
with check (
  bucket_id = 'e-housing-public'
  and app_private.is_chair()
);

drop policy if exists "public assets chair delete" on storage.objects;
create policy "public assets chair delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'e-housing-public'
  and app_private.is_chair()
);

insert into public.email_templates (building_id, key, title, subject, body)
select
  id,
  'password-reset',
  'Reset hesla',
  'Obnova hesla do e - Housing Solutions Licence',
  'Dobrý deň, požiadali ste o obnovu hesla do aplikácie e - Housing Solutions Licence. Otvorte odkaz zo systémového emailu Supabase a nastavte si nové heslo. Ak ste o obnovu hesla nežiadali, túto správu ignorujte.'
from public.buildings
on conflict (building_id, key) do nothing;

notify pgrst, 'reload schema';
