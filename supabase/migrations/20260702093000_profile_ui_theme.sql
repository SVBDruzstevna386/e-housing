alter table public.profiles
  add column if not exists ui_theme text not null default 'classic_light';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_ui_theme_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_ui_theme_check
      check (ui_theme in ('classic_light'))
      not valid;
  end if;
end $$;

alter table public.profiles
  validate constraint profiles_ui_theme_check;
