alter table public.finance_entries
add column if not exists finance_year integer not null default extract(year from current_date)::integer;

update public.finance_entries
set finance_year = extract(year from coalesce(entry_date, created_at::date))::integer
where finance_year is null;

alter table public.innovation_ideas
add column if not exists finance_year integer not null default extract(year from current_date)::integer;

update public.innovation_ideas
set finance_year = extract(year from created_at)::integer
where finance_year is null;
