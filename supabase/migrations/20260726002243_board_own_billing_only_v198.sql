drop policy if exists "billing settlements role read" on public.billing_settlements;
create policy "billing settlements role read"
on public.billing_settlements
for select
to authenticated
using (
  app_private.is_chair()
  or owner_profile_id = (select auth.uid())
  or exists (
    select 1
    from public.owner_records owner_record
    where owner_record.id = billing_settlements.owner_record_id
      and owner_record.profile_id = (select auth.uid())
  )
);

notify pgrst, 'reload schema';
