alter table public.classifieds
  add column if not exists storage_path text,
  add column if not exists youtube_url text;
