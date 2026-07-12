# Partnerska zona a nove instalacie

## Ucel

Partnerska zona je centralne riadiace prostredie dostupne iba uctom vedenym v tabulke `platform_admins`. Je zapnuta iba v hlavnej instalacii SVB Druzstevna 386. Ciste instalacne baliky ju automaticky vypinaju a neobsahuju centralnu Edge Function `platform-support-session`.

Kazdy partnersky dom pouziva samostatne sluzby a udaje:

- sukromny GitHub repozitar,
- vlastny Supabase projekt a databazu,
- vlastny Vercel projekt a URL,
- vlastny Gmail ucet a OAuth autorizaciu,
- samostatne subory, pouzivatelov a konfiguraciu.

Medzi databazou SVB Druzstevna 386 a databazou partnerskeho domu sa nekopiruju prevadzkove data.

## Postup novej instalacie

1. Platform Admin v Partnerskej zone vyberie `Nova instalacia` a zada zakladne udaje domu a predsedu.
2. Vytvori sa zaznam instalacie a kontrolny zoznam krokov.
3. Pre dom sa vytvori novy sukromny GitHub repozitar z cisteho instalacneho balika.
4. Vytvori sa novy Supabase projekt a aplikuju sa migracie z balika.
5. Vytvori sa novy Vercel projekt, nastavia sa verejne premenne Supabase a vykona sa prve nasadenie.
6. Pouzivatel vytvori samostatny Gmail ucet, prida ho ako OAuth testovacieho alebo produkcneho pouzivatela a udeli suhlas na odosielanie.
7. Serverove Gmail tajomstva sa ulozia iba do Supabase Edge Function secrets noveho projektu.
8. Vytvori sa ucet predsedu, vykona sa kontrola prihlasenia, suborov, emailov, RLS a PWA.
9. Po uspesnej kontrole sa instalacia oznaci ako aktivna a predsedovi sa odoslu pristupove udaje.

## Servisny pristup

Servisny pristup je volitelny, kratkodoby a auditovany. Nepouziva heslo predsedu domu.

Centralny projekt potrebuje serverove tajomstvo:

```text
PARTNER_SUPPORT_CONFIG={"INSTALLATION_UUID":{"sharedSecret":"DLHE_NAHODNE_TAJOMSTVO"}}
```

Partnersky Supabase projekt potrebuje:

```text
PLATFORM_SUPPORT_SHARED_SECRET=DLHE_NAHODNE_TAJOMSTVO
PLATFORM_INSTALLATION_ID=INSTALLATION_UUID
PLATFORM_SUPPORT_EMAIL=servisny-ucet-pre-dany-dom@example.com
```

Rovnake zdielane tajomstvo je ulozene iba v serverovych secrets oboch projektov. Nikdy sa nevklada do `app.js`, Vercel frontend premennych, GitHub repozitara ani databazoveho zaznamu instalacie.

Po kliknuti na `Visit` centralna funkcia:

1. overi prihlaseneho Platform Admina,
2. vytvori auditny zaznam s povinnym dovodom vstupu,
3. vyda podpisany jednorazovy poziadavok s platnostou 5 minut,
4. partnerska funkcia overi podpis, instalaciu, cas a jednorazovy nonce,
5. Supabase Auth vytvori jednorazovy prihlasovaci odkaz,
6. aplikacia servisnu relaciu po uplynuti casu odhlasi.

Archivovanie partnerskeho zaznamu nevykonava destruktivne mazanie Vercel, Supabase, Gmail ani GitHub sluzieb.

## Bezpecnostna kontrola pred aktivaciou

- RLS je zapnute na vsetkych tabulkach s osobnymi alebo domovymi datami.
- Service role key a Gmail OAuth tajomstva nie su dostupne vo frontende.
- Supabase Auth redirect URL obsahuje novu produkcnu Vercel URL.
- `platform-support-login` je nasadena s vlastnym HMAC overenim a ochranou proti opakovaniu poziadavky.
- Platform Admin vstup ma vyplneny dovod a existuje v auditnom logu.
- Vlastnik jedneho domu nema pristup k datam ineho domu.
- Po ukonceni testu sa odstrania docasne testovacie ucty a dokumenty.
