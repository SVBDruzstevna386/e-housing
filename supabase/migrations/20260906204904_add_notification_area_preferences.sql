create table public.notification_preferences (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  area text not null,
  email_enabled boolean not null default true,
  push_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint notification_preferences_pkey primary key (profile_id, area),
  constraint notification_preferences_area_check check (
    area in (
      'overview',
      'votes',
      'billing',
      'documents',
      'document_history',
      'executions',
      'finance',
      'messages',
      'calendar',
      'activities',
      'photo_album',
      'classifieds',
      'talk'
    )
  ),
  constraint notification_preferences_required_areas_check check (
    area not in ('overview', 'votes', 'billing')
    or (email_enabled and push_enabled)
  )
);

comment on table public.notification_preferences is
  'Per-account email and Web Push preferences. Missing rows default to enabled.';

alter table public.notification_preferences enable row level security;

revoke all on table public.notification_preferences from anon;
grant select, insert, update on table public.notification_preferences to authenticated;
grant all on table public.notification_preferences to service_role;

create policy "Users can read own notification preferences"
  on public.notification_preferences
  for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "Users can insert own notification preferences"
  on public.notification_preferences
  for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "Users can update own notification preferences"
  on public.notification_preferences
  for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

alter table public.notification_log
  add column notification_area text null;

alter table public.notification_log
  add constraint notification_log_area_check check (
    notification_area is null
    or notification_area in (
      'overview',
      'votes',
      'billing',
      'documents',
      'document_history',
      'executions',
      'finance',
      'messages',
      'calendar',
      'activities',
      'photo_album',
      'classifieds',
      'talk'
    )
  );

notify pgrst, 'reload schema';
