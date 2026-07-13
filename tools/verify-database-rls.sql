\set ON_ERROR_STOP on

select id as chair_id
from public.profiles
where role = 'chair' and approval_status = 'approved'
order by created_at
limit 1
\gset

select id as owner_id
from public.profiles
where role = 'owner'
order by created_at desc
limit 1
\gset

select id as owner_record_id
from public.owner_records
where profile_id = :'owner_id'
order by created_at desc
limit 1
\gset

select id as building_id
from public.buildings
order by created_at
limit 1
\gset

begin;

update public.profiles
set approval_status = 'approved'
where id = :'owner_id';

update public.owner_records
set approval_status = 'approved', account_status = 'Aktívny'
where id = :'owner_record_id';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', :'chair_id', 'role', 'authenticated')::text,
  true
);

insert into public.announcements (building_id, created_by, title, body, category)
values (:'building_id', :'chair_id', 'RLS test oznam', 'Transakčný test', 'Oznam');

insert into public.documents (building_id, created_by, title, category, description)
values (:'building_id', :'chair_id', 'RLS test dokument', 'Iné dokumenty', 'Transakčný test');

insert into public.events (building_id, created_by, title, description, starts_at)
values (:'building_id', :'chair_id', 'RLS test udalosť', 'Transakčný test', now());

insert into public.messages (building_id, sender_id, recipient_id, recipient_label, subject, body, scope)
values (:'building_id', :'chair_id', :'owner_id', 'Testovací vlastník', 'RLS test správa', 'Transakčný test', 'private');

insert into public.votes (building_id, created_by, title, description, status, closes_at, vote_type)
values (:'building_id', :'chair_id', 'RLS test hlasovanie', 'Transakčný test', 'open', now() + interval '1 day', 'present_majority')
returning id as vote_id
\gset

insert into public.vote_questions (vote_id, question, sort_order)
values (:'vote_id', 'RLS test otázka?', 10)
returning id as question_id
\gset

insert into public.vote_comments (vote_id, profile_id, visibility, body)
values (:'vote_id', :'chair_id', 'public', 'Komentár predsedu');

insert into public.activities (building_id, profile_id, person, role, title, month, hours, status)
values (:'building_id', :'chair_id', 'Predseda SVB', 'Predseda SVB', 'RLS test denník', to_char(current_date, 'YYYY-MM'), 1, 'Dokončené');

insert into public.billing_settlements (building_id, owner_profile_id, owner_record_id, created_by, title, settlement_year, storage_path)
values (:'building_id', :'owner_id', :'owner_record_id', :'chair_id', 'RLS test vyúčtovanie', extract(year from current_date)::integer, 'tests/settlement.pdf');

insert into public.execution_cases (building_id, owner_record_id, owner_profile_id, created_by, owner_name, debt_amount)
values (:'building_id', :'owner_record_id', :'owner_id', :'chair_id', 'Testovací vlastník', 10);

insert into public.finance_entries (building_id, created_by, entry_type, title, amount, entry_date, finance_year)
values (:'building_id', :'chair_id', 'other_expense', 'RLS test financie', 10, current_date, extract(year from current_date)::integer);

insert into public.innovation_ideas (building_id, created_by, title, description, estimated_cost, finance_year)
values (:'building_id', :'chair_id', 'RLS test podnet', 'Transakčný test', 10, extract(year from current_date)::integer)
returning id as chair_idea_id
\gset

insert into public.innovation_comments (idea_id, profile_id, body)
values (:'chair_idea_id', :'chair_id', 'Komentár predsedu');

insert into public.photos (building_id, created_by, title, category, description)
values (:'building_id', :'chair_id', 'RLS test foto', 'Iné', 'Transakčný test');

insert into public.classifieds (building_id, created_by, title, category, description, status)
values (:'building_id', :'chair_id', 'RLS test inzercia', 'Darujem', 'Transakčný test', 'Aktívne');

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claims',
  json_build_object('sub', :'owner_id', 'role', 'authenticated')::text,
  true
);

select count(*) as visible_documents
from public.documents;

insert into public.announcements (building_id, created_by, title, body, category)
values (:'building_id', :'owner_id', 'RLS test oznam vlastníka', 'Transakčný test', 'Oznam');

insert into public.messages (building_id, sender_id, recipient_id, recipient_label, subject, body, scope)
values (:'building_id', :'owner_id', :'chair_id', 'Predseda SVB', 'RLS test správa vlastníka', 'Transakčný test', 'private');

insert into public.vote_answers (vote_id, question_id, profile_id, owner_record_id, answer)
values (:'vote_id', :'question_id', :'owner_id', :'owner_record_id', 'Za');

insert into public.vote_comments (vote_id, profile_id, recipient_id, visibility, body)
values (:'vote_id', :'owner_id', :'chair_id', 'private_chair', 'Súkromný komentár vlastníka');

insert into public.innovation_ideas (building_id, created_by, title, description, estimated_cost, finance_year)
values (:'building_id', :'owner_id', 'RLS test podnet vlastníka', 'Transakčný test', 0, extract(year from current_date)::integer)
returning id as owner_idea_id
\gset

insert into public.innovation_comments (idea_id, profile_id, body)
values (:'owner_idea_id', :'owner_id', 'Komentár vlastníka');

insert into public.photos (building_id, created_by, title, category, description)
values (:'building_id', :'owner_id', 'RLS test foto vlastníka', 'Iné', 'Transakčný test');

insert into public.classifieds (building_id, created_by, title, category, description, status)
values (:'building_id', :'owner_id', 'RLS test inzercia vlastníka', 'Predám', 'Transakčný test', 'Aktívne');

rollback;

select 'DATABASE_RLS_VERIFICATION_OK' as result;
