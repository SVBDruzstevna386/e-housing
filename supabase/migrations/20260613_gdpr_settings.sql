alter table public.profiles
add column if not exists gdpr_accepted_at timestamptz,
add column if not exists gdpr_version text;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
begin
  requested_role := coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'owner'::public.app_role);
  insert into public.profiles (id, full_name, email, flat_number, role, approval_status, gdpr_accepted_at, gdpr_version)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'flat_number',
    requested_role,
    case when requested_role = 'owner' then 'pending'::public.approval_status else 'approved'::public.approval_status end,
    nullif(new.raw_user_meta_data ->> 'gdpr_accepted_at', '')::timestamptz,
    nullif(new.raw_user_meta_data ->> 'gdpr_version', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

insert into public.app_settings (key, value, updated_at)
values
  ('gdpr_notice_version', 'GDPR-SVB-2026-01', now()),
  ('gdpr_required', 'true', now()),
  ('gdpr_notice_text', 'Informácie o spracúvaní osobných údajov pre aplikáciu e-housing

Prevádzkovateľ: SVB a NP Družstevná 386, zastúpené predsedom SVB alebo poverenou osobou správou domu.

Účel spracúvania: vedenie elektronickej evidencie vlastníkov bytov a členov orgánov SVB, sprístupňovanie dokumentov domu, komunikácia medzi SVB a vlastníkmi, evidencia hlasovaní a vyjadrení, zverejňovanie vyúčtovaní priradených ku konkrétnemu vlastníkovi, evidencia denníka činností, hospodárenia, podnetov, fotoalbumu a zasielanie nevyhnutných notifikácií.

Kategórie osobných údajov: meno a priezvisko, email, telefón, číslo bytu alebo poznámka k bytu, rola používateľa, stav autorizácie účtu, údaje o vlastníctve uvádzané v aplikácii, údaje o dlhu ak sú vedené, obsah správ, komentárov, hlasovaní, denníkových záznamov a dokumentov priradených k používateľovi.

Právny základ: plnenie zákonných a zmluvných povinností súvisiacich so správou bytového domu a oprávnený záujem SVB na efektívnej a preukázateľnej komunikácii s vlastníkmi. Pri technicky dobrovoľných funkciách, ktoré nie sú nevyhnutné na správu domu, môže byť právnym základom aj súhlas používateľa. Potvrdenie pri registrácii znamená oboznámenie sa s týmito informáciami; nejde o súhlas tam, kde spracúvanie vyplýva zo zákonnej povinnosti alebo oprávneného záujmu.

Príjemcovia a sprostredkovatelia: autorizovaní používatelia aplikácie podľa pridelených rolí, poskytovatelia technickej infraštruktúry použití pre aplikáciu, najmä Supabase na autentifikáciu, databázu a úložisko, Vercel na webhosting a Gmail/Google na odosielanie emailových notifikácií. Prístup je obmedzený podľa rolí v aplikácii.

Doba uchovávania: osobné údaje sa uchovávajú počas trvania vlastníckeho alebo funkčného vzťahu k domu a následne počas doby potrebnej na preukazovanie práv a povinností SVB, archiváciu dokumentov, účtovné a právne nároky. Účet alebo nepotrebné údaje sa majú vymazať alebo obmedziť, keď pominie účel spracúvania, ak ich ďalšie uchovanie nevyžaduje právny predpis alebo oprávnený záujem.

Práva dotknutej osoby: používateľ má právo na prístup k údajom, opravu, výmaz alebo obmedzenie spracúvania v prípadoch podľa GDPR, právo namietať proti spracúvaniu založenému na oprávnenom záujme, právo na prenosnosť pri údajoch spracúvaných na základe súhlasu alebo zmluvy automatizovane a právo podať návrh alebo sťažnosť na Úrad na ochranu osobných údajov SR.

Bezpečnosť: aplikácia používa prihlasovanie, roly, schvaľovanie registrácie a databázové pravidlá prístupu. Používatelia sú povinní chrániť svoje heslo a nesprístupňovať údaje neoprávneným osobám.

Kontakt pre uplatnenie práv: predseda SVB alebo poverená osoba správy domu na kontaktoch zverejnených v aplikácii.', now())
on conflict (key) do nothing;
