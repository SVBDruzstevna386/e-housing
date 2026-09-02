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
        and (
          answer_row.selected_option_id is not null
          or not exists (
            select 1
            from public.vote_question_options option_row
            where option_row.question_id = answer_row.question_id
          )
        )
    ),
    no_count = (
      select count(*)::integer
      from public.vote_answers answer_row
      where answer_row.vote_id = target_vote_id
        and answer_row.answer = 'Proti'
        and not exists (
          select 1
          from public.vote_question_options option_row
          where option_row.question_id = answer_row.question_id
        )
    ),
    abstain_count = (
      select count(*)::integer
      from public.vote_answers answer_row
      where answer_row.vote_id = target_vote_id
        and answer_row.answer = 'Zdržal sa'
    )
  where id = target_vote_id;
$$;

revoke execute on function public.recalculate_vote_counts(uuid) from public, anon;
grant execute on function public.recalculate_vote_counts(uuid) to authenticated;

notify pgrst, 'reload schema';
