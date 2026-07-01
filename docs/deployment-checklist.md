# Deployment checklist

## Pred LIVE nasadenim

- [ ] Lokalny prototyp je odsuhlaseny
- [ ] Je rozhodnute, ktore moduly idu do prvej ostrej verzie
- [ ] Supabase schema je odsuhlasena
- [ ] Su pripravene role: predseda, dozorna rada, vlastnik
- [ ] Su pripravene testovacie ucty
- [ ] Email notifikacie su otestovane najprv na testovacie adresy
- [ ] Hlasovanie je oznacene ako testovacie alebo pravne overene podla stanov SVB
- [ ] Dokumenty su ukladane do sukromneho storage bucketu
- [ ] Row level security pravidla su aktivne
- [ ] Vercel deployment ma nastavene environment variables

## Vercel

Projekt bude pripojeny na GitHub repo:

```text
SVBDruzstevna386/e-housing
```

Odporucane environment variables:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NOTIFICATION_FROM_EMAIL
APP_URL
```

## Supabase

Aktualny projekt:

```text
ifyyflvxqkazndkwffvm
```

Region:

```text
eu-central-1
```

Migracie budu pripravene v:

```text
supabase/migrations
```

## Gmail

Aktualny ucet:

```text
svbdruzstevna386@gmail.com
```

Pred ostrym posielanim vlastnikom odporucam:

- odoslat test len predsedovi
- potom test dozornej rade
- az potom zapnut notifikacie pre vlastnikov

