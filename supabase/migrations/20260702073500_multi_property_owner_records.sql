alter table public.vote_answers
add column if not exists owner_record_id uuid references public.owner_records(id) on delete cascade;

alter table public.billing_settlements
add column if not exists owner_record_id uuid references public.owner_records(id) on delete set null;

create index if not exists vote_answers_owner_record_id_idx
on public.vote_answers(owner_record_id);

create index if not exists billing_settlements_owner_record_id_idx
on public.billing_settlements(owner_record_id);

update public.vote_answers a
set owner_record_id = (
  select o.id
  from public.owner_records o
  where o.profile_id = a.profile_id
  order by
    case when o.approval_status = 'approved' then 0 else 1 end,
    o.created_at,
    o.id
  limit 1
)
where a.owner_record_id is null;

update public.billing_settlements b
set owner_record_id = (
  select o.id
  from public.owner_records o
  where o.profile_id = b.owner_profile_id
  order by
    case when o.approval_status = 'approved' then 0 else 1 end,
    o.created_at,
    o.id
  limit 1
)
where b.owner_record_id is null;

drop index if exists public.vote_answers_vote_question_profile_key;

create unique index if not exists vote_answers_vote_question_owner_record_key
on public.vote_answers(vote_id, question_id, owner_record_id);

create unique index if not exists vote_answers_vote_question_profile_without_owner_key
on public.vote_answers(vote_id, question_id, profile_id)
where owner_record_id is null;

drop policy if exists "owner records self pairing insert" on public.owner_records;
create policy "owner records self pairing insert"
on public.owner_records for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and coalesce(approval_status, 'pending') = 'pending'
);

drop policy if exists "vote answers own insert" on public.vote_answers;
create policy "vote answers own insert"
on public.vote_answers for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and (
    owner_record_id is null
    or exists (
      select 1
      from public.owner_records o
      where o.id = owner_record_id
        and o.profile_id = (select auth.uid())
    )
  )
);

drop policy if exists "vote answers own update" on public.vote_answers;
create policy "vote answers own update"
on public.vote_answers for update
to authenticated
using (
  profile_id = (select auth.uid())
  and (
    owner_record_id is null
    or exists (
      select 1
      from public.owner_records o
      where o.id = owner_record_id
        and o.profile_id = (select auth.uid())
    )
  )
)
with check (
  profile_id = (select auth.uid())
  and (
    owner_record_id is null
    or exists (
      select 1
      from public.owner_records o
      where o.id = owner_record_id
        and o.profile_id = (select auth.uid())
    )
  )
);

drop policy if exists "billing settlements role read" on public.billing_settlements;
create policy "billing settlements role read"
on public.billing_settlements for select
to authenticated
using (
  app_private.is_board_or_chair()
  or owner_profile_id = (select auth.uid())
  or exists (
    select 1
    from public.owner_records o
    where o.id = owner_record_id
      and o.profile_id = (select auth.uid())
  )
);
