begin;
create temporary table problem_test_context as select
  (select id from public.profiles where role = 'chair' and approval_status = 'approved' limit 1) chair_id,
  (select id from public.profiles where role = 'owner' and approval_status = 'approved' order by id limit 1) owner_id,
  (select id from public.profiles where role = 'owner' and approval_status = 'approved' order by id offset 1 limit 1) other_id,
  (select id from public.profiles where role = 'board' and approval_status = 'approved' limit 1) board_id,
  gen_random_uuid() public_id, gen_random_uuid() private_id, gen_random_uuid() other_private_id;
grant select on problem_test_context to authenticated;

insert into public.svb_problems (id, created_by, recipient_id, title, body, photo_paths)
select public_id, chair_id, null, 'RLS verification public', 'Temporary transaction', array[public_id::text || '/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg'] from problem_test_context
union all
select private_id, chair_id, owner_id, 'RLS verification private', 'Temporary transaction', array[private_id::text || '/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg'] from problem_test_context
union all
select other_private_id, chair_id, other_id, 'RLS verification other', 'Temporary transaction', array[other_private_id::text || '/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg'] from problem_test_context;
insert into storage.objects (bucket_id, name)
select 'svb-problem-photos', unnest(photo_paths) from public.svb_problems where id in (select public_id from problem_test_context union all select private_id from problem_test_context union all select other_private_id from problem_test_context);
insert into public.notification_log (recipient_id, subject, related_table, related_id, notification_area)
select owner_id, 'RLS verification private notice', 'svb_problems', private_id, 'problems' from problem_test_context;

select set_config('request.jwt.claims', jsonb_build_object('sub', owner_id, 'role', 'authenticated')::text, true) from problem_test_context;
set local role authenticated;
do $$
declare count_rows int;
begin
  select count(*) into count_rows from public.svb_problems where title like 'RLS verification%';
  if count_rows <> 2 then raise exception 'Owner saw % events, expected 2', count_rows; end if;
  select count(*) into count_rows from storage.objects where bucket_id = 'svb-problem-photos' and split_part(name, '/', 1) in (select public_id::text from problem_test_context union all select private_id::text from problem_test_context union all select other_private_id::text from problem_test_context);
  if count_rows <> 2 then raise exception 'Owner saw % photos, expected 2', count_rows; end if;
  if not exists(select 1 from public.notification_log where subject = 'RLS verification private notice') then raise exception 'Owner cannot read own problem notification'; end if;
  begin
    insert into public.svb_problems (created_by,title,body) values (auth.uid(),'Forbidden','Forbidden');
    raise exception 'Owner inserted a problem';
  exception when insufficient_privilege then null;
  end;
  update public.svb_problems set body = 'Forbidden' where title like 'RLS verification%';
  get diagnostics count_rows = row_count;
  if count_rows <> 0 then raise exception 'Owner updated a problem'; end if;
  delete from public.svb_problems where title like 'RLS verification%';
  get diagnostics count_rows = row_count;
  if count_rows <> 0 then raise exception 'Owner deleted a problem'; end if;
  begin
    insert into storage.objects (bucket_id,name) values ('svb-problem-photos','forbidden.jpg');
    raise exception 'Owner uploaded problem photo';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claims', jsonb_build_object('sub', board_id, 'role', 'authenticated')::text, true) from problem_test_context;
set local role authenticated;
do $$
declare count_rows int;
begin
  select count(*) into count_rows from public.svb_problems where title like 'RLS verification%';
  if count_rows <> 1 then raise exception 'Board saw private events'; end if;
  select count(*) into count_rows from storage.objects where bucket_id = 'svb-problem-photos' and split_part(name, '/', 1) in (select public_id::text from problem_test_context union all select private_id::text from problem_test_context union all select other_private_id::text from problem_test_context);
  if count_rows <> 1 then raise exception 'Board saw private photos'; end if;
  if exists(select 1 from public.notification_log where subject = 'RLS verification private notice') then raise exception 'Board saw another owner problem notification'; end if;
  begin
    insert into public.svb_problems (created_by,title,body) values (auth.uid(),'Forbidden','Forbidden');
    raise exception 'Board inserted a problem';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claims', jsonb_build_object('sub', chair_id, 'role', 'authenticated')::text, true) from problem_test_context;
set local role authenticated;
do $$
declare count_rows int; created_id uuid;
begin
  select count(*) into count_rows from public.svb_problems where title like 'RLS verification%';
  if count_rows <> 3 then raise exception 'Chair cannot read all events'; end if;
  if not exists(select 1 from public.notification_log where subject = 'RLS verification private notice') then raise exception 'Chair cannot read problem notification'; end if;
  insert into public.svb_problems (created_by,title,body) values (auth.uid(),'RLS chair CRUD','Temporary') returning id into created_id;
  update public.svb_problems set body = 'Updated' where id = created_id;
  if not exists(select 1 from public.svb_problems where id = created_id and body = 'Updated') then raise exception 'Chair update failed'; end if;
  delete from public.svb_problems where id = created_id;
  if exists(select 1 from public.svb_problems where id = created_id) then raise exception 'Chair delete failed'; end if;
end $$;
reset role;

select set_config('request.jwt.claims', jsonb_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$
begin
  if exists (select 1 from public.svb_problems) then raise exception 'Unapproved account read problems'; end if;
  if exists (select 1 from storage.objects where bucket_id = 'svb-problem-photos') then raise exception 'Unapproved account read photos'; end if;
end $$;
reset role;
rollback;
select 'PASS: owner and board isolation; private photo and notification isolation; chair CRUD; unapproved denied; all fixtures rolled back' result;
