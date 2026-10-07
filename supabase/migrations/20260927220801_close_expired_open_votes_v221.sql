update public.votes
set status = 'Ukončené'
where closes_at <= now()
  and lower(trim(status)) in ('open', 'prebieha');
