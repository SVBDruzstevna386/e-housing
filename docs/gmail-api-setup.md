# Gmail API nastavenie pre e-housing

Notifikacie v aplikacii posiela Supabase Edge Function `send-notification` cez Gmail API.
Emaily budu odchadzat zo schranky `SVBDruzstevna386@gmail.com`.

## Co je uz pripravene

- Edge Function `send-notification` je prepnuta z Resendu na Gmail API.
- Supabase secrets uz obsahuju:
  - `GMAIL_FROM_EMAIL`
  - `GMAIL_FROM_NAME`

## Co este treba doplnit

Do Supabase secrets treba doplnit:

- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`

## Bezpecny postup

1. Otvor Google Cloud Console: https://console.cloud.google.com/
2. Prihlas sa ako `SVBDruzstevna386@gmail.com`.
3. Vytvor alebo vyber Google Cloud projekt pre e-housing.
4. Zapni API: `Gmail API`.
5. V `APIs & Services` nastav `OAuth consent screen`.
6. Vytvor OAuth client typu `Web application`.
7. Do autorizovanych redirect URI vloz docasnu redirect adresu, ktoru pouzijeme pri generovani refresh tokenu.
8. Z OAuth clienta ziskaj `Client ID` a `Client secret`.
9. Vygeneruj refresh token so scope:
   - `https://www.googleapis.com/auth/gmail.send`
10. Hodnoty nastavime do Supabase secrets.

## Supabase secrets prikaz

```powershell
npx supabase secrets set `
  GMAIL_CLIENT_ID="..." `
  GMAIL_CLIENT_SECRET="..." `
  GMAIL_REFRESH_TOKEN="..." `
  --project-ref ifyyflvxqkazndkwffvm
```

Po nastaveni tokenov treba spravit test vytvorenim udalosti v aplikacii s email notifikaciou.
