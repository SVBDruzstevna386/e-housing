# e - Housing Solutions Licence: instalacia pre dalsi bytovy dom

Tento navod popisuje, ako nasadit samostatnu kopiu aplikacie e - Housing Solutions Licence pre iny bytovy dom alebo ine SVB.

Vysledkom bude nova LIVE aplikacia s vlastnou URL, vlastnou Supabase databazou, vlastnym uloziskom suborov, vlastnym Gmail odosielacim uctom a vlastnym uctom predsedu SVB.

## 1. Co treba pripravit

Pre novy dom treba pripravit alebo pocas instalacie spristupnit nove ucty a projekty:

- nazov SVB alebo domu,
- email predsedu SVB,
- Gmail ucet, z ktoreho budu odchadzat notifikacie,
- zoznam clenov dozornej rady,
- zoznam bytov a vlastnikov,
- fotografiu bytoveho domu,
- nazvy kategorii dokumentov,
- GitHub ucet,
- Vercel ucet,
- Supabase ucet,
- Google Cloud pristup pre Gmail API.

Nova instalacia sa nesmie pripojit k GitHub, Vercel, Supabase ani Gmail uctom povodneho domu. Pouzivatel novej instalacie vytvori nove ucty alebo udeli pristup k uz pripravenym uctom. Codex moze po udeleni pristupu vykonat technicku konfiguraciu, ale registraciu uctov, 2FA, OAuth suhlas a potvrdenie pripadnych nakladov musi vykonat alebo potvrdit vlastnik noveho domu.

## 2. Odporucana struktura

Pre kazdy dom odporucam samostatne prostredie:

- samostatny GitHub repozitar,
- samostatny Vercel projekt,
- samostatny Supabase projekt,
- samostatny Gmail ucet pre notifikacie,
- samostatny Google OAuth client.

Tak sa data roznych domov nemiesaju a kazdy dom ma vlastne prihlasovanie, dokumenty aj audit.

## 3. GitHub

1. Vytvorte novy GitHub repozitar, napriklad:

   ```text
   e-housing-druzstevna-386
   e-housing-hlavna-12
   e-housing-novy-dom
   ```

2. Nahrajte zdrojove subory aplikacie.
3. Do repozitara nedavajte ziadne tajne hodnoty:

   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REFRESH_TOKEN`
   - osobne pristupove tokeny

## 4. Supabase projekt

1. Otvorte https://supabase.com/dashboard
2. Vytvorte novy projekt.
3. Zvolte region blizko Slovenska, idealne EU region.
4. Po vytvoreni projektu si poznacte:

   - Project URL,
   - anon/public key,
   - service role key,
   - project ref.

5. Prepojte Supabase CLI s novym projektom a spustite migracie zo zlozky:

   ```text
   npx.cmd supabase link --project-ref NOVY_PROJECT_REF
   npx.cmd supabase db push
   ```

6. Overte, ze su vytvorene tabulky:

   - `profiles`
   - `owner_records`
   - `documents`
   - `document_categories`
   - `announcements`
   - `events`
   - `messages`
   - `votes`
   - `vote_questions`
   - `vote_answers`
   - `activities`
   - `photos`
   - `email_templates`
   - `notification_log`

7. Overte, ze je zapnute RLS.
8. Vytvorte Storage buckety pre dokumenty a fotky, ak este nie su vytvorene migraciou alebo setup SQL skriptom.

## 5. Supabase Edge Functions

Nasadte edge funkcie:

```powershell
npx supabase functions deploy send-notification --project-ref NOVY_PROJECT_REF
npx supabase functions deploy update-login-email --project-ref NOVY_PROJECT_REF
```

Funkcia `send-notification` posiela emaily cez Gmail API.
Funkcia `update-login-email` sluzi na zmenu login emailu pouzivatela.

## 6. Gmail ucet pre notifikacie

Pre kazdy dom odporucam samostatny Gmail ucet, napriklad:

```text
svb.novy.dom@gmail.com
```

Tento ucet bude pouzity ako skutocny odosielatel emailov.

## 7. Google Cloud a Gmail API

1. Otvorte https://console.cloud.google.com/
2. Vytvorte projekt pre konkretny dom.
3. Zapnite `Gmail API`.
4. Nastavte OAuth consent screen.
5. Ak aplikacia ostava v rezime Testing, pridajte Gmail ucet domu medzi test users.
6. Vytvorte OAuth client typu `Desktop app`.
7. Ziskajte:

   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REFRESH_TOKEN`

8. Hodnoty ulozte do Supabase secrets:

```powershell
npx supabase secrets set `
  GMAIL_CLIENT_ID="..." `
  GMAIL_CLIENT_SECRET="..." `
  GMAIL_REFRESH_TOKEN="..." `
  GMAIL_FROM_EMAIL="svb.novy.dom@gmail.com" `
  GMAIL_FROM_NAME="Nazov SVB" `
  --project-ref NOVY_PROJECT_REF
```

## 8. Vercel projekt

1. Otvorte https://vercel.com/
2. Importujte GitHub repozitar.
3. Nastavte projekt ako staticku aplikaciu.
4. Nasadte aplikaciu.
5. Po nasadeni skontrolujte LIVE URL.

Ak sa meni Supabase projekt, treba v aplikacii upravit verejne hodnoty:

```js
const SUPABASE_URL = "https://NOVY_PROJECT_REF.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "NOVY_SUPABASE_PUBLISHABLE_KEY";
```

Tieto hodnoty su verejne, ale databazu chrani RLS.

## 9. Prvy predseda SVB

Pre kazdy novy dom treba vytvorit prvy ucet predsedu SVB.

Odporucany postup:

1. V Supabase Auth vytvorte pouzivatela predsedu.
2. Nastavte mu docasne heslo.
3. V tabulke `profiles` nastavte:

   ```text
   role = chair
   approval_status = approved
   full_name = meno predsedu
   email = login email predsedu
   ```

4. Predseda sa prihlasi a zmeni si heslo v zalozke Profil.

## 10. Prve nastavenie v aplikacii

Po prihlaseni predsedu odporucam nastavit:

- fotku domu,
- nazov SVB,
- kontakty predsedu a dozornej rady,
- kategorie dokumentov,
- email sablony,
- zoznam vlastnikov,
- pravidla komunikacie,
- prvy testovaci dokument,
- prvu testovaciu email notifikaciu.

## 11. Test pred ostrym pouzivanim

Pred spustenim pre vlastnikov prejdite tento test:

- predseda sa vie prihlasit,
- vlastnik sa vie registrovat,
- predseda vie registraciu schvalit,
- vlastnik po schvaleni vidi svoje prostredie,
- dokument sa vie nahrat,
- dokument sa da otvorit a stiahnut,
- dokument sa zobrazi v historii,
- oznamenie sa ulozi do databazy,
- kalendarova udalost sa ulozi do databazy,
- email notifikacia odide z Gmail uctu domu,
- odpoved na email pride do Gmail schranky domu,
- hlasovanie funguje pre vlastnika,
- predseda vidi vysledky hlasovania,
- komunikacia a odpovede ostavaju v jednej konverzacii,
- PWA instalacia funguje na Windows/Android/iOS/macOS.

## 12. Co je dobre automatizovat neskor

Do buducna sa da vytvorit instalacny wizard, ktory sa opyta na:

- nazov domu,
- email predsedu,
- Gmail odosielaci ucet,
- Supabase projekt,
- Vercel projekt,
- prvu fotku domu,
- zoznam vlastnikov.

Wizard by nasledne pripravil konfiguraciu a spustil nasadenie.

Aktualne je najbezpecnejsi postup manualny podla tohto navodu, lebo Google OAuth a Supabase secrets obsahuju citlive udaje.
