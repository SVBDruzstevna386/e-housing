# e-housing

Webova PWA aplikacia pre spravu spolocenstva vlastnikov bytov a nebytovych priestorov.

Aktualna produkcna verzia je pripravena pre SVB a NP Druzstevna 386 a obsahuje prihlasovanie, role, dokumenty, historiu dokumentov, vyuctovanie, hospodarenie, hlasovanie, komunikaciu, fotoalbum, dennik, exekucie, nastavenia, logy, emailove sablony, Supabase databazu, Supabase Storage, Gmail notifikacie a PWA instalaciu.

## Hlavne moduly

- prihlasovanie a registracia pouzivatelov cez Supabase Auth,
- schvalovanie registracii predsedom SVB,
- role a prava: predseda SVB, podpredseda SVB, ekonomicka sprava, dozorna rada, vlastnik nehnutelnosti,
- dokumenty, historia dokumentov, prilohy, obrazky a YouTube odkazy,
- oznamenia a kalendar,
- hlasovanie s otazkami, komentarovou castou, statistikami a grafmi,
- komunikacia verejna aj sukromna,
- profil pouzivatela a zmena hesla,
- vyuctovanie pre konkretneho vlastnika,
- hospodarenie a financne grafy,
- fotoalbum,
- dennik aktivit,
- exekucie,
- GDPR texty a pravne informacie,
- auditne logy,
- livechat integracia,
- emailove notifikacie cez Gmail API,
- PWA instalacia pre Windows, Android, iOS a macOS.

## Lokalny start

```powershell
npm.cmd run dev
```

Potom otvorit:

```text
http://127.0.0.1:4173/index.html
```

## Kontrola JavaScriptu

```powershell
npm.cmd run check
```

## Nasadenie na Vercel

```powershell
npx.cmd vercel deploy --prod --yes
```

## Nova instalacia pre iny dom

Pre instalaciu aplikacie pre iny bytovy dom pouzite:

- `INSTALLATION.md`
- `docs/new-house-installation-guide.md`
- `docs/new-house-config-template.md`
- `docs/gmail-api-setup.md`
- `docs/deployment-checklist.md`

Balik pre novu instalaciu vytvorite prikazom:

```powershell
powershell -ExecutionPolicy Bypass -File tools/create-install-package.ps1
```

Vysledny ZIP sa ulozi do priecinka `release`.

## Citlive udaje

Do GitHub repozitara ani instalacneho ZIP balika neukladajte realne tajne hodnoty:

- Supabase service role key,
- Supabase database password,
- Gmail client secret,
- Gmail refresh token,
- osobne pristupove tokeny,
- `.env`,
- `.vercel`.

Verejne Supabase hodnoty v klientskom kode musia byt chranene spravne nastavenym RLS v Supabase databaze.
