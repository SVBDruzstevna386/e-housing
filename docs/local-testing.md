# Lokalne testovanie

## 1. Spustenie

V priecinku `outputs/e-housing` spustit:

```powershell
npm run dev
```

Ak PowerShell zahlasi, ze `npm.ps1` je blokovane cez Execution Policy, pouzit:

```powershell
npm.cmd run dev
```

Alebo bez npm:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Potom otvorit:

```text
http://127.0.0.1:4173/index.html
```

## 2. Zakladna kontrola

Pred nasadenim skontrolovat:

- ci sa zobrazi dashboard `Prehlad domu`
- ci funguje prepnutie roly predseda / dozorna rada / vlastnik
- ci sa daju otvorit sekcie Dokumenty, Komunikacia, Hlasovania, Kalendar, Vlastnici, Nastavenia
- ci tlacidlo na pridanie novej polozky otvori dialog
- ci vyhladavanie v dokumentoch a vlastnikoch filtruje zoznam
- ci je aplikacia pouzitelna na uzkej sirke obrazovky

## 3. Technicka kontrola

```powershell
npm run check
```

Pripadne:

```powershell
npm.cmd run check
```

Tento prikaz overi syntakticku spravnost `app.js`.

## 4. Poznamka k PWA

Service worker a instalacia aplikacie funguju spolahlivo az cez HTTP/HTTPS. Pri otvoreni suboru priamo z disku sa PWA cast nemusi aktivovat.
