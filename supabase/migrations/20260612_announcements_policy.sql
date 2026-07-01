drop policy if exists "announcements chair write" on public.announcements;
create policy "announcements chair write" on public.announcements
for all to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'chair'::public.app_role
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'chair'::public.app_role
  )
);
