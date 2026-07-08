# e - Housing Solutions Licence: instalacny postup pre novu instalaciu

Tento subor sluzi ako rychly postup pre vytvorenie samostatnej instalacie aplikacie e - Housing Solutions Licence pre iny bytovy dom.

## 1. Pripravit ucty

Pre kazdy novy dom odporucam samostatne ucty a projekty:

- GitHub repozitar,
- Vercel projekt,
- Supabase projekt,
- Gmail ucet pre odosielanie emailov,
- Google Cloud projekt s Gmail API.

## 2. Vytvorit GitHub repozitar

1. Na GitHube vytvorte novy privatny repozitar.
2. Nahrajte obsah instalacneho balika.
3. Do repozitara nevkladajte `.env`, `.vercel` ani tajne kluce.

## 3. Vytvorit Supabase projekt

1. Otvorte `https://supabase.com/dashboard`.
2. Vytvorte novy projekt v EU regione.
3. Spustite vsetky SQL migracie zo zlozky `supabase/migrations` v poradi podla nazvu suboru.
4. Overte, ze su aktivne RLS politiky.
5. V Supabase Storage overte buckety pre dokumenty a obrazky.

## 4. Nasadit Supabase Edge Functions

```powershell
npx.cmd supabase functions deploy send-notification --project-ref NOVY_PROJECT_REF
npx.cmd supabase functions deploy update-login-email --project-ref NOVY_PROJECT_REF
npx.cmd supabase functions deploy delete-owner-account --project-ref NOVY_PROJECT_REF
npx.cmd supabase functions deploy cleanup-orphan-auth-user --project-ref NOVY_PROJECT_REF
```

## 5. Nastavit Supabase secrets

```powershell
npx.cmd supabase secrets set `
  GMAIL_CLIENT_ID="..." `
  GMAIL_CLIENT_SECRET="..." `
  GMAIL_REFRESH_TOKEN="..." `
  GMAIL_FROM_EMAIL="svb.novy.dom@gmail.com" `
  GMAIL_FROM_NAME="Nazov SVB" `
  APP_URL="https://novy-projekt.vercel.app" `
  --project-ref NOVY_PROJECT_REF
```

## 6. Upravit verejnu konfiguraciu aplikacie

V `app.js` nastavte verejne hodnoty noveho Supabase projektu:

```js
const SUPABASE_URL = "https://NOVY_PROJECT_REF.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "NOVY_SUPABASE_ANON_KEY";
```

Tieto hodnoty su verejne. Bezpecnost dat musi byt riesena cez Supabase RLS.

## 7. Nasadit na Vercel

1. Vo Verceli importujte GitHub repozitar.
2. Projekt nastavte ako staticku aplikaciu.
3. Nasadte produkcnu verziu.
4. V Supabase Auth nastavte `Site URL` a redirect URL na novu Vercel URL.

## 8. Vytvorit prveho predsedu SVB

1. V Supabase Auth vytvorte pouzivatela predsedu.
2. V tabulke `profiles` nastavte rolu `chair`, stav `approved` a spravny email.
3. Predseda sa prihlasi a v profile si zmeni heslo.

## 9. Otestovat

Pred spustenim ostrej prevadzky skontrolujte:

- prihlasenie predsedu,
- registraciu vlastnika,
- schvalenie vlastnika,
- nahratie, otvorenie a stiahnutie dokumentu,
- odoslanie Gmail notifikacie,
- odpoved na spravu,
- hlasovanie,
- vyuctovanie,
- fotoalbum,
- PWA instalaciu na Windows/Android/iOS/macOS.

Podrobnejsi postup je v `docs/new-house-installation-guide.md`.
