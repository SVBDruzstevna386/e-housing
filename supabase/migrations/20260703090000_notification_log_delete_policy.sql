drop policy if exists "notifications chair delete" on public.notification_log;
create policy "notifications chair delete"
on public.notification_log for delete
to authenticated
using (app_private.is_chair());
