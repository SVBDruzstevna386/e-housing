drop policy "vote question options chair write" on public.vote_question_options;

create policy "vote question options chair insert"
on public.vote_question_options
for insert
to authenticated
with check (app_private.is_chair());

create policy "vote question options chair update"
on public.vote_question_options
for update
to authenticated
using (app_private.is_chair())
with check (app_private.is_chair());

create policy "vote question options chair delete"
on public.vote_question_options
for delete
to authenticated
using (app_private.is_chair());
