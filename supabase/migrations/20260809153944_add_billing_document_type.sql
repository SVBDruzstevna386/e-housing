alter table public.billing_settlements
add column if not exists document_type text not null default 'Vyúčtovanie';

alter table public.billing_settlements
drop constraint if exists billing_settlements_document_type_check;

alter table public.billing_settlements
add constraint billing_settlements_document_type_check
check (document_type in ('Vyúčtovanie', 'Predpis'));

create index if not exists billing_settlements_document_type_idx
on public.billing_settlements(document_type);

notify pgrst, 'reload schema';
