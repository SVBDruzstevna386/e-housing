drop policy if exists "classified categories chair manage" on public.classified_categories;

create policy "classified categories chair manage"
on public.classified_categories for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text = 'chair'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text = 'chair'
  )
);
