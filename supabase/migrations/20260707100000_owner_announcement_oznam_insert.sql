drop policy if exists "announcements owner oznam insert" on public.announcements;

create policy "announcements owner oznam insert"
on public.announcements for insert
to authenticated
with check (
  created_by = auth.uid()
  and category = 'Oznam'
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text = 'owner'
  )
  and exists (
    select 1
    from public.owner_records o
    where o.profile_id = auth.uid()
      and o.approval_status = 'approved'
  )
);
