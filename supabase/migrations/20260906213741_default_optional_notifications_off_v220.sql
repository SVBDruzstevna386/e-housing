alter table public.notification_preferences
  alter column email_enabled set default false,
  alter column push_enabled set default false;

comment on table public.notification_preferences is
  'Per-account email and Web Push preferences. Missing optional rows default to disabled; required areas remain enabled.';

insert into public.notification_preferences (
  profile_id,
  area,
  email_enabled,
  push_enabled
)
select
  profiles.id,
  areas.area,
  areas.required,
  areas.required
from public.profiles as profiles
cross join (
  values
    ('overview'::text, true),
    ('votes'::text, true),
    ('billing'::text, true),
    ('documents'::text, false),
    ('document_history'::text, false),
    ('executions'::text, false),
    ('finance'::text, false),
    ('messages'::text, false),
    ('calendar'::text, false),
    ('activities'::text, false),
    ('photo_album'::text, false),
    ('classifieds'::text, false),
    ('talk'::text, false)
) as areas(area, required)
on conflict (profile_id, area) do nothing;

notify pgrst, 'reload schema';
