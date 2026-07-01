drop policy if exists "categories chair write" on public.document_categories;
create policy "categories chair write" on public.document_categories
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "events chair write" on public.events;
create policy "events chair write" on public.events
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "votes chair write" on public.votes;
create policy "votes chair write" on public.votes
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "templates chair write" on public.email_templates;
create policy "templates chair write" on public.email_templates
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "owner records chair write" on public.owner_records;
create policy "owner records chair write" on public.owner_records
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "notifications chair insert" on public.notification_log;
create policy "notifications chair insert" on public.notification_log
for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "notifications chair read" on public.notification_log;
create policy "notifications chair read" on public.notification_log
for select to authenticated
using (
  recipient_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "activities board chair write" on public.activities;
create policy "activities board chair write" on public.activities
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('chair'::public.app_role, 'board'::public.app_role)))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('chair'::public.app_role, 'board'::public.app_role)));

drop policy if exists "messages read relevant" on public.messages;
create policy "messages read relevant" on public.messages
for select to authenticated
using (
  scope = 'public'
  or sender_id = auth.uid()
  or recipient_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('chair'::public.app_role, 'board'::public.app_role))
);

drop policy if exists "messages update own or chair" on public.messages;
create policy "messages update own or chair" on public.messages
for update to authenticated
using (
  sender_id = auth.uid()
  or recipient_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
)
with check (
  sender_id = auth.uid()
  or recipient_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "profiles update self or chair" on public.profiles;
create policy "profiles update self or chair" on public.profiles
for update to authenticated
using (
  id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
)
with check (
  id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "profiles delete chair" on public.profiles;
create policy "profiles delete chair" on public.profiles
for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "photos delete chair" on public.photos;
create policy "photos delete chair" on public.photos
for delete to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "storage update e-housing" on storage.objects;
create policy "storage update e-housing" on storage.objects
for update to authenticated
using (
  bucket_id = 'e-housing-files'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
)
with check (
  bucket_id = 'e-housing-files'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "storage delete e-housing chair" on storage.objects;
create policy "storage delete e-housing chair" on storage.objects
for delete to authenticated
using (
  bucket_id = 'e-housing-files'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);
