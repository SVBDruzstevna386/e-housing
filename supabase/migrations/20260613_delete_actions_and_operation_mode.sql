drop policy if exists "messages delete own or chair" on public.messages;
create policy "messages delete own or chair"
on public.messages for delete
to authenticated
using (sender_id = auth.uid() or app_private.is_chair());

insert into public.app_settings (key, value, updated_at)
values ('operation_mode_text', 'Live testovací režim', now())
on conflict (key) do nothing;
