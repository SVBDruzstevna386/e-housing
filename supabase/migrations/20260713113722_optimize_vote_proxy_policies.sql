drop policy if exists "vote proxies read own or chair" on public.vote_proxies;
create policy "vote proxies read own or chair"
on public.vote_proxies for select
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies insert own or chair" on public.vote_proxies;
create policy "vote proxies insert own or chair"
on public.vote_proxies for insert
to authenticated
with check (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies update own or chair" on public.vote_proxies;
create policy "vote proxies update own or chair"
on public.vote_proxies for update
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()))
with check (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

drop policy if exists "vote proxies delete own or chair" on public.vote_proxies;
create policy "vote proxies delete own or chair"
on public.vote_proxies for delete
to authenticated
using (grantor_profile_id = (select auth.uid()) or (select app_private.is_chair()));

notify pgrst, 'reload schema';
