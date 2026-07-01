drop policy if exists "documents chair write" on public.documents;
create policy "documents chair write" on public.documents
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
