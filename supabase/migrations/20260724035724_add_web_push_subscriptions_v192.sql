create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_success_at timestamptz
);

create index push_subscriptions_profile_id_idx
on public.push_subscriptions(profile_id);

alter table public.push_subscriptions enable row level security;

revoke all on public.push_subscriptions from anon, authenticated;

create policy "push subscriptions read own"
on public.push_subscriptions
for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy "push subscriptions delete own"
on public.push_subscriptions
for delete
to authenticated
using ((select auth.uid()) = profile_id);

comment on table public.push_subscriptions is
  'Private Web Push device subscriptions. Writes are handled by the authenticated manage-push-subscription Edge Function.';
