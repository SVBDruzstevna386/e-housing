insert into public.classified_categories (title, sort_order)
values ('Podporte', 50)
on conflict (title) do update set
  sort_order = excluded.sort_order;
