create table if not exists public.platform_support_nonces (
  nonce text primary key,
  access_log_id uuid,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.platform_support_nonces enable row level security;
revoke all on public.platform_support_nonces from anon, authenticated;

create index if not exists platform_support_nonces_expires_idx
on public.platform_support_nonces(expires_at);

comment on table public.platform_support_nonces is
'Server-only replay protection for short-lived Platform Admin support handoff tokens.';
