do $$
declare
  permissions jsonb;
begin
  select value::jsonb
  into permissions
  from public.app_settings
  where key = 'role_permissions'
  for update;

  if permissions is null then
    raise exception 'The role_permissions setting is missing or empty.';
  end if;

  permissions := jsonb_set(
    permissions,
    '{board,calendar}',
    coalesce(permissions #> '{board,calendar}', '{}'::jsonb) || '{"delete": true}'::jsonb,
    true
  );

  update public.app_settings
  set value = permissions::text,
      updated_at = now()
  where key = 'role_permissions';

  if coalesce((permissions #>> '{board,calendar,delete}')::boolean, false) is not true then
    raise exception 'The board calendar delete permission could not be enabled.';
  end if;
end
$$;
