alter table public.announcements
  add column if not exists storage_path text,
  add column if not exists youtube_url text;

alter table public.documents
  add column if not exists youtube_url text;
