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
