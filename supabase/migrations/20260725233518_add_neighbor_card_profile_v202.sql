alter table public.profiles
  add column if not exists neighbor_card jsonb not null default '{
    "about": "",
    "interests": "",
    "contribution": "",
    "share_messaging": true,
    "share_email": false,
    "share_phone": false,
    "share_flat": false
  }'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_neighbor_card_object_check;

alter table public.profiles
  add constraint profiles_neighbor_card_object_check
  check (jsonb_typeof(neighbor_card) = 'object');

comment on column public.profiles.neighbor_card is
  'Owner-authored neighbor introduction and explicit contact visibility preferences.';

notify pgrst, 'reload schema';
