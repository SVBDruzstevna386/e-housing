create policy "svb problem notification privacy" on public.notification_log
as restrictive for select to authenticated
using (
  (related_table is distinct from 'svb_problems' and notification_area is distinct from 'problems')
  or recipient_id = (select auth.uid())
  or app_private.can_manage_svb_problems()
);
