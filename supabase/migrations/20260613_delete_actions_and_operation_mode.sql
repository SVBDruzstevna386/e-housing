drop policy if exists "messages delete own or chair" on public.messages;
create policy "messages delete own or chair"
on public.messages for delete
to authenticated
using (sender_id = auth.uid() or app_private.is_chair());

create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

grant select on public.app_settings to anon, authenticated;
grant insert, update, delete on public.app_settings to authenticated;

insert into public.app_settings (key, value, updated_at)
values ('operation_mode_text', 'Live testovací režim', now())
on conflict (key) do nothing;
