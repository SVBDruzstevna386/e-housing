# e - Housing Solutions Licence - čistá inštalácia

Čistý inštalačný ZIP je určený pre samostatnú inštanciu aplikácie pre iný bytový dom. Obsahuje web/PWA aplikáciu, Supabase migrácie a Edge Functions, Vercel konfiguráciu, grafické súbory, dokumentáciu a konfiguračný skript.

## Oddelenie jednotlivých domov

Každý nový bytový dom musí používať vlastné prostredie:

- nový súkromný GitHub repozitár,
- nový Vercel projekt a produkčnú URL,
- nový Supabase projekt, databázu, Auth a Storage,
- nový Gmail účet určený pre daný dom,
- nový Google Cloud projekt a OAuth klient pre Gmail API.

Účty a projekty vytvorí alebo sprístupní používateľ novej inštalácie. Codex ich môže nakonfigurovať po udelení prístupu. Registráciu účtov, dvojfaktorové overenie, OAuth súhlas a potvrdenie prípadných nákladov musí vykonať alebo výslovne potvrdiť vlastník účtu.

## Bezpečnostné vlastnosti balíka

Balík neobsahuje `.git`, `.vercel`, `supabase/.temp`, produkčné dáta ani reálne tajné kľúče. Pri vytvorení ZIP súboru sa automaticky kontrolujú známe identifikátory súčasnej produkcie a formáty citlivých tokenov. Súčasťou balíka je manifest a zoznam SHA-256 kontrolných súčtov.

## Postup obnovy

1. Rozbaľte ZIP do čistého priečinka.
2. Prečítajte `CLEAN_INSTALL_QUICK_START.md` a `INSTALL_PACKAGE_MANIFEST.json`.
3. Získajte nové verejné hodnoty Supabase a novú Vercel URL.
4. Spustite `tools/configure-clean-instance.ps1`.
5. Nahrajte nakonfigurovaný projekt do nového súkromného GitHub repozitára.
6. Prepojte Supabase CLI s novým projektom a spustite migrácie cez `supabase db push`.
7. Nastavte Supabase secrets pre Gmail API a nasaďte Edge Functions.
8. Nasaďte aplikáciu do nového Vercel projektu.
9. Nastavte Supabase Auth Site URL a povolené Redirect URLs na novú doménu.
10. Vytvorte prvého predsedu SVB a vykonajte kompletný test podľa `docs/deployment-checklist.md`.

Balík je zdrojový a migračný template, nie kópia dát existujúceho domu. Vďaka tomu je vhodný na bezpečné opakované nasadenie pre ďalších správcov.
