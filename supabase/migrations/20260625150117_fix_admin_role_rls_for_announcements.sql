alter type public.app_role add value if not exists 'vice_chair';

create or replace function app_private.is_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_private.current_role()::text in ('chair', 'vice_chair', 'economic');
$$;

create or replace function app_private.is_board_or_chair()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_private.current_role()::text in ('chair', 'vice_chair', 'economic', 'board');
$$;

drop policy if exists "announcements chair write" on public.announcements;
create policy "announcements chair write"
on public.announcements for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());
