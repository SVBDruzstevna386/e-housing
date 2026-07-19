drop policy if exists "profiles delete chair" on public.profiles;
create policy "profiles delete chair"
on public.profiles for delete
to authenticated
using (
  app_private.is_chair()
  and role <> 'chair'::public.app_role
);

drop policy if exists "profiles update self or chair" on public.profiles;
create policy "profiles update self or chair"
on public.profiles for update
to authenticated
using (
  id = auth.uid()
  or (app_private.is_chair() and role <> 'chair'::public.app_role)
)
with check (
  id = auth.uid()
  or (app_private.is_chair() and role <> 'chair'::public.app_role)
);
