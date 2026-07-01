drop policy if exists "announcements chair write" on public.announcements;
drop policy if exists "announcements admin insert" on public.announcements;
drop policy if exists "announcements admin update" on public.announcements;
drop policy if exists "announcements admin delete" on public.announcements;

create policy "announcements admin insert"
on public.announcements for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);

create policy "announcements admin update"
on public.announcements for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);

create policy "announcements admin delete"
on public.announcements for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('chair', 'vice_chair', 'economic')
  )
);
