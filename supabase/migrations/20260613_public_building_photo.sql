insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'e-housing-public',
  'e-housing-public',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

drop policy if exists "app settings public read" on public.app_settings;
create policy "app settings public read"
on public.app_settings for select
to anon, authenticated
using (true);

drop policy if exists "app settings chair write" on public.app_settings;
create policy "app settings chair write"
on public.app_settings for all
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

drop policy if exists "public assets read" on storage.objects;
create policy "public assets read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'e-housing-public');

drop policy if exists "public assets chair insert" on storage.objects;
create policy "public assets chair insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'e-housing-public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "public assets chair update" on storage.objects;
create policy "public assets chair update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'e-housing-public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
)
with check (
  bucket_id = 'e-housing-public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

drop policy if exists "public assets chair delete" on storage.objects;
create policy "public assets chair delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'e-housing-public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role)
);

grant select on public.app_settings to anon, authenticated;
grant insert, update, delete on public.app_settings to authenticated;
