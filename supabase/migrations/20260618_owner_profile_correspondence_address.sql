alter table public.profiles
  add column if not exists correspondence_street text,
  add column if not exists correspondence_city text,
  add column if not exists correspondence_postal_code text;

alter table public.owner_records
  add column if not exists phone text,
  add column if not exists correspondence_street text,
  add column if not exists correspondence_city text,
  add column if not exists correspondence_postal_code text;

update public.owner_records owner_record
set phone = coalesce(owner_record.phone, profile.phone),
    correspondence_street = coalesce(owner_record.correspondence_street, profile.correspondence_street),
    correspondence_city = coalesce(owner_record.correspondence_city, profile.correspondence_city),
    correspondence_postal_code = coalesce(owner_record.correspondence_postal_code, profile.correspondence_postal_code)
from public.profiles profile
where owner_record.profile_id = profile.id;
