do $$
declare
  canonical_owner_record_id uuid;
begin
  select owner_record.id
  into canonical_owner_record_id
  from public.owner_records owner_record
  join public.profiles profile on profile.id = owner_record.profile_id
  where lower(profile.email) = lower('erinka75@centrum.sk')
    and lower(owner_record.login_email) = lower('erinka75@centrum.sk')
    and owner_record.building_id = '38600000-0000-0000-0000-000000000386'::uuid
    and btrim(owner_record.flat_number) = '30'
  order by owner_record.created_at, owner_record.id
  limit 1;

  if canonical_owner_record_id is null then
    raise exception 'Canonical owner record for flat 30 was not found';
  end if;

  update public.billing_settlements
  set owner_record_id = canonical_owner_record_id
  where owner_record_id in (
    select duplicate.id
    from public.owner_records duplicate
    where duplicate.profile_id = (
      select profile_id from public.owner_records where id = canonical_owner_record_id
    )
      and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
      and btrim(duplicate.flat_number) = '30'
      and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
      and duplicate.id <> canonical_owner_record_id
  );

  update public.events
  set owner_record_id = canonical_owner_record_id
  where owner_record_id in (
    select duplicate.id from public.owner_records duplicate
    where duplicate.profile_id = (select profile_id from public.owner_records where id = canonical_owner_record_id)
      and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
      and btrim(duplicate.flat_number) = '30'
      and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
      and duplicate.id <> canonical_owner_record_id
  );

  update public.execution_cases
  set owner_record_id = canonical_owner_record_id
  where owner_record_id in (
    select duplicate.id from public.owner_records duplicate
    where duplicate.profile_id = (select profile_id from public.owner_records where id = canonical_owner_record_id)
      and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
      and btrim(duplicate.flat_number) = '30'
      and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
      and duplicate.id <> canonical_owner_record_id
  );

  update public.vote_answers
  set owner_record_id = canonical_owner_record_id
  where owner_record_id in (
    select duplicate.id from public.owner_records duplicate
    where duplicate.profile_id = (select profile_id from public.owner_records where id = canonical_owner_record_id)
      and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
      and btrim(duplicate.flat_number) = '30'
      and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
      and duplicate.id <> canonical_owner_record_id
  );

  update public.vote_proxies
  set owner_record_id = canonical_owner_record_id
  where owner_record_id in (
    select duplicate.id from public.owner_records duplicate
    where duplicate.profile_id = (select profile_id from public.owner_records where id = canonical_owner_record_id)
      and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
      and btrim(duplicate.flat_number) = '30'
      and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
      and duplicate.id <> canonical_owner_record_id
  );

  delete from public.owner_records duplicate
  where duplicate.profile_id = (
      select profile_id from public.owner_records where id = canonical_owner_record_id
    )
    and duplicate.building_id = '38600000-0000-0000-0000-000000000386'::uuid
    and btrim(duplicate.flat_number) = '30'
    and lower(duplicate.login_email) = lower('erinka75@centrum.sk')
    and duplicate.id <> canonical_owner_record_id;
end
$$;

create unique index owner_records_profile_building_flat_key
  on public.owner_records (building_id, profile_id, (lower(btrim(flat_number))))
  where profile_id is not null and nullif(btrim(flat_number), '') is not null;

notify pgrst, 'reload schema';
