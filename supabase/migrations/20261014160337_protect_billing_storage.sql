-- Owner-record assignment is authoritative; the profile is a legacy fallback only.
drop policy if exists "billing settlements role read" on public.billing_settlements;
create policy "billing settlements role read" on public.billing_settlements
for select to authenticated using (
  app_private.is_chair()
  or (
    exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.approval_status = 'approved')
    and (
      (owner_record_id is null and owner_profile_id = (select auth.uid()))
      or exists (
        select 1 from public.owner_records o
        where o.id = billing_settlements.owner_record_id
          and o.profile_id = (select auth.uid()) and o.approval_status = 'approved'
          and o.building_id = billing_settlements.building_id
      )
    )
  )
);

-- Only exposes a classification boolean, never document metadata. Must see rows
-- hidden by RLS to protect legacy files outside the billing/ prefix too.
create or replace function app_private.is_billing_storage_path(object_name text)
returns boolean language sql stable security definer
set search_path = '' as $$
  select exists (select 1 from public.billing_settlements b where b.storage_path = object_name);
$$;
revoke all on function app_private.is_billing_storage_path(text) from public;
grant execute on function app_private.is_billing_storage_path(text) to authenticated;

-- RESTRICTIVE intersects every permissive SELECT/ALL policy, including the
-- historical bucket-wide read policy. Other shared attachments keep their access.
create policy "billing files read guard" on storage.objects as restrictive
for select to authenticated using (
  bucket_id <> 'e-housing-files'
  or app_private.is_chair()
  or (
    name not like 'billing/%'
    and not app_private.is_billing_storage_path(name)
  )
  or exists (select 1 from public.billing_settlements b where b.storage_path = storage.objects.name)
);

-- Reserve the namespace, including orphan uploads, for document administrators.
create policy "billing files insert guard" on storage.objects as restrictive
for insert to authenticated with check (
  bucket_id <> 'e-housing-files' or app_private.is_chair()
  or (name not like 'billing/%' and not app_private.is_billing_storage_path(name))
);

-- Enforce private serving without moving or modifying any stored object.
update storage.buckets set public = false where id = 'e-housing-files';
notify pgrst, 'reload schema';
