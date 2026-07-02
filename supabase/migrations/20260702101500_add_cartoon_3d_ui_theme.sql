alter table public.profiles
  drop constraint if exists profiles_ui_theme_check;

alter table public.profiles
  add constraint profiles_ui_theme_check
  check (ui_theme in ('classic_light', 'cartoon_3d'))
  not valid;

alter table public.profiles
  validate constraint profiles_ui_theme_check;
