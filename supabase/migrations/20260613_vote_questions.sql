create table if not exists public.vote_questions (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  question text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.vote_questions enable row level security;
grant select, insert, update, delete on public.vote_questions to authenticated;

drop policy if exists "vote questions read" on public.vote_questions;
create policy "vote questions read" on public.vote_questions
for select to authenticated
using (true);

drop policy if exists "vote questions chair write" on public.vote_questions;
create policy "vote questions chair write" on public.vote_questions
for all to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'chair'::public.app_role));

insert into public.vote_questions (vote_id, question, sort_order)
select v.id, coalesce(nullif(v.description, ''), v.title), 10
from public.votes v
where not exists (
  select 1 from public.vote_questions q where q.vote_id = v.id
);

alter table public.vote_answers
add column if not exists question_id uuid references public.vote_questions(id) on delete cascade;

update public.vote_answers a
set question_id = q.id
from public.vote_questions q
where q.vote_id = a.vote_id
  and a.question_id is null;

alter table public.vote_answers
alter column question_id set not null;

do $$
begin
  alter table public.vote_answers drop constraint vote_answers_vote_id_profile_id_key;
exception when undefined_object then null;
end $$;

create unique index if not exists vote_answers_vote_question_profile_key
on public.vote_answers (vote_id, question_id, profile_id);

create or replace function public.recalculate_vote_counts(target_vote_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.votes
  set
    yes_count = (
      select count(*)::integer
      from public.vote_answers
      where vote_id = target_vote_id and answer = 'Za'
    ),
    no_count = (
      select count(*)::integer
      from public.vote_answers
      where vote_id = target_vote_id and answer = 'Proti'
    ),
    abstain_count = (
      select count(*)::integer
      from public.vote_answers
      where vote_id = target_vote_id and answer = 'Zdržal sa'
    )
  where id = target_vote_id;
end;
$$;

revoke execute on function public.recalculate_vote_counts(uuid) from public, anon;
grant execute on function public.recalculate_vote_counts(uuid) to authenticated;
