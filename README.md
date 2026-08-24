# ERS Studio

ERS Studio je mali A4 editor za materijale predmeta **Elementi razvoja softvera**. Napravljen je kao React + Vite + TypeScript aplikacija i nema serverski backend.

## Šta je uključeno

- A4 portrait dokumenti sa ručnim stranicama i page-break kontrolom
- lokalna biblioteka dokumenata u IndexedDB-u
- početni **Praktikum 2026/27** i **Specifikacija projektnog zadatka 2026/27**
- tekst, naslovi, liste, callout blokovi, tabele, slike, vektorski dijagrami i code blokovi
- code blokovi su uvek u **light mode-u** radi štampe i čitljivosti
- syntax highlighting za C#, Bash, JSON, Markdown i TypeScript
- Open / Save preko `.ersdoc.json` formata
- autosave u browseru
- PDF export preko browser Print dijaloga (`Ctrl/Cmd + P` ili dugme PDF)
- Presentation mode za prikaz A4 stranica studentima
- promena teme, tipografije, gustine sadržaja i akcentne boje

## Pokretanje

### Windows — preporučeno

Dvoklik na `start.cmd`. Skripta proverava okruženje, instalira zavisnosti ako nedostaju, pokreće build, zatim Vite na `http://localhost:5173` i otvara browser.

### Ručno

```bash
npm install
npm run build
npm run dev -- --host 127.0.0.1 --port 5173
```

Aplikacija je dostupna na `http://localhost:5173`.

Za production build:

```bash
npm run build
npm run preview
```

## Čuvanje dokumenata

ERS Studio koristi dva nivoa čuvanja:

1. **Autosave** — dokument se automatski čuva u IndexedDB-u browsera.
2. **Sačuvaj** — dokument se izvozi na disk kao `*.ersdoc.json`.

U Chromium browserima se koristi File System Access API kada je dostupan. U drugim browserima aplikacija automatski koristi klasičan upload/download fallback.

Sadržaj slika ubačenih u dokument čuva se kao data URL unutar JSON dokumenta, tako da je fajl prenosiv.

## PDF

Dugme **PDF** otvara sistemski Print dijalog. Izabrati `Save as PDF`. Print CSS koristi A4 portrait, uklanja editor UI i zadržava svetlu pozadinu code blokova.

## Struktura

- `src/seeds/praktikum.json` — početni praktikum
- `src/seeds/project-spec.json` — početna projektna specifikacija
- `src/components/PageCanvas.tsx` — A4 stranica
- `src/components/BlockView.tsx` — prikaz blokova i vektorskih dijagrama
- `src/components/Inspector.tsx` — uređivanje svojstava blokova
- `src/db.ts` — IndexedDB persistence
- `src/fileIO.ts` — Open / Save JSON

## Napomena

Aplikacija je namerno client-only. Ako kasnije bude potreban zajednički rad više asistenata ili sinhronizacija između računara, persistence sloj se može zameniti REST/API ili cloud storage adapterom bez promene formata dokumenta.


## AI-assisted lokalni setup

`LUNA_LOCAL_SETUP_PROMPT.md` sadrži gotov prompt za lokalnog coding agenta. Pre korišćenja zameniti `{{REPO_URL}}` URL-om privatnog GitHub repozitorijuma.
