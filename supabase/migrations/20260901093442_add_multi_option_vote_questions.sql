create table public.vote_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.vote_questions(id) on delete cascade,
  label text not null check (btrim(label) <> '' and char_length(label) <= 500),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint vote_question_options_question_label_key unique (question_id, label),
  constraint vote_question_options_question_id_id_key unique (question_id, id)
);

create index vote_question_options_question_sort_idx
  on public.vote_question_options (question_id, sort_order, id);

alter table public.vote_answers
  add column selected_option_id uuid null;

alter table public.vote_answers
  add constraint vote_answers_question_selected_option_fkey
  foreign key (question_id, selected_option_id)
  references public.vote_question_options(question_id, id)
  on delete no action;

alter table public.vote_answers
  add constraint vote_answers_selected_option_answer_check
  check (
    selected_option_id is null
    or answer = 'Za'
  );

create index vote_answers_selected_option_id_idx
  on public.vote_answers (selected_option_id)
  where selected_option_id is not null;

alter table public.vote_question_options enable row level security;

grant select, insert, update, delete on public.vote_question_options to authenticated;
grant select, insert, update on public.vote_answers to authenticated;

create policy "vote question options read"
on public.vote_question_options
for select
to authenticated
using (true);

create policy "vote question options chair write"
on public.vote_question_options
for all
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

create or replace function public.recalculate_vote_counts(target_vote_id uuid)
returns void
language sql
security invoker
set search_path = public
as $$
  update public.votes
  set
    yes_count = (
      select count(*)::integer
      from public.vote_answers answer_row
      where answer_row.vote_id = target_vote_id
        and answer_row.answer = 'Za'
    ),
    no_count = (
      select coalesce(sum(
        case
          when answer_row.selected_option_id is not null and answer_row.answer = 'Za'
            then greatest(option_totals.option_count - 1, 0)
          when answer_row.selected_option_id is null and answer_row.answer = 'Proti'
            then 1
          else 0
        end
      ), 0)::integer
      from public.vote_answers answer_row
      left join lateral (
        select count(*)::integer as option_count
        from public.vote_question_options option_row
        where option_row.question_id = answer_row.question_id
      ) option_totals on true
      where answer_row.vote_id = target_vote_id
    ),
    abstain_count = (
      select coalesce(sum(
        case
          when answer_row.answer = 'Zdržal sa'
            then greatest(option_totals.option_count, 1)
          else 0
        end
      ), 0)::integer
      from public.vote_answers answer_row
      left join lateral (
        select count(*)::integer as option_count
        from public.vote_question_options option_row
        where option_row.question_id = answer_row.question_id
      ) option_totals on true
      where answer_row.vote_id = target_vote_id
    )
  where id = target_vote_id;
$$;

revoke execute on function public.recalculate_vote_counts(uuid) from public, anon;
grant execute on function public.recalculate_vote_counts(uuid) to authenticated;

notify pgrst, 'reload schema';
