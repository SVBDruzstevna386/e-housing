create index if not exists partner_installations_created_by_idx
on public.partner_installations(created_by);

create index if not exists partner_jobs_requested_by_idx
on public.partner_provisioning_jobs(requested_by);

create index if not exists partner_events_actor_idx
on public.partner_installation_events(actor_id, created_at desc);

create index if not exists platform_access_admin_idx
on public.platform_access_logs(platform_admin_id, requested_at desc);
