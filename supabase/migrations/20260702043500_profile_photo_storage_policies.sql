drop policy if exists "profile photos owner insert" on storage.objects;
create policy "profile photos owner insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'e-housing-public'
  and name like ('profile-photos/' || (select auth.uid())::text || '/%')
);

drop policy if exists "profile photos owner update" on storage.objects;
create policy "profile photos owner update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'e-housing-public'
  and name like ('profile-photos/' || (select auth.uid())::text || '/%')
)
with check (
  bucket_id = 'e-housing-public'
  and name like ('profile-photos/' || (select auth.uid())::text || '/%')
);

drop policy if exists "profile photos owner delete" on storage.objects;
create policy "profile photos owner delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'e-housing-public'
  and name like ('profile-photos/' || (select auth.uid())::text || '/%')
);
