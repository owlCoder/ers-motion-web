# ERS Studio

ERS Studio je lokalni A4 editor za nastavne materijale predmeta **Elementi razvoja softvera**. Aplikacija je izrađena u React + Vite + TypeScript okruženju i nema serverski backend.

Repo: `https://github.com/owlCoder/ers-motion-web`

## Korisnički interfejs

Interaktivni deo aplikacije koristi **Fluent UI React v9** (`@fluentui/react-components`): alatne trake, dugmad, paneli, forme, tooltip-ovi, obaveštenja i dijalozi dele isti Fluent sistem komponenti i dizajn tokena. Browser-native `alert`/`confirm` dijalozi se ne koriste za akcije editora.

A4 dokument je namerno odvojen od aplikacionog interfejsa. `src/document.css` sadrži isključivo stilove sadržaja koji se prikazuje na papiru/PDF-u: tipografiju dokumenta, code blokove, tabele, dijagrame, slike, naslovnu stranu i print pravila. Na taj način Fluent UI upravlja editorom, dok dokument ostaje stabilan i predvidljiv za štampu.

## Šta je uključeno

- kontinuirani Word/LibreOffice stil prikaza A4 stranica;
- lokalna biblioteka dokumenata u IndexedDB-u;
- početni **Praktikum 2026/27** i **Specifikacija projektnog zadatka 2026/27**;
- tekst, naslovi, liste, istaknuti blokovi, tabele, slike, vektorski/responsive dijagrami i code blokovi;
- code blokovi su uvek u **light mode-u** radi štampe, projektora i čitljivosti;
- syntax highlighting za C#, Bash, JSON, Markdown i TypeScript;
- Open / Save preko `.ersdoc.json` formata;
- autosave u browseru;
- PDF export preko browser Print dijaloga;
- režim prikaza za izvođenje nastave;
- podešavanje tipografije, gustine sadržaja i akcentne boje.

## Pokretanje

### Windows

Dvoklik na `start.cmd`. Skripta proverava okruženje, instalira zavisnosti ako nedostaju, pokreće build, zatim Vite na `http://localhost:5600` i otvara browser.

### Ručno

```bash
npm install
npm run build
npm run dev -- --host 127.0.0.1 --port 5600
```

Aplikacija je dostupna na:

```text
http://localhost:5600
```

Za production build:

```bash
npm run build
npm run preview
```

## Čuvanje dokumenata

ERS Studio koristi dva nivoa čuvanja:

1. **Autosave** — dokument se automatski čuva u IndexedDB-u browsera.
2. **Sačuvaj** — dokument se izvozi na disk kao `*.ersdoc.json`.

U Chromium browserima koristi se File System Access API kada je dostupan. U drugim browserima aplikacija koristi upload/download fallback.

Sadržaj slika ubačenih u dokument može biti sačuvan kao data URL unutar JSON dokumenta, tako da dokument ostaje prenosiv.

## PDF i štampa

Dugme **Izvezi PDF** otvara sistemski Print dijalog. A4 renderer koristi svetlu pozadinu i posebno vodi računa da code blokovi ostanu light mode. Editor chrome nije deo dokumenta koji se izvozi.

## Struktura

- `src/App.tsx` — Fluent UI aplikacioni shell, biblioteka, navigacija i lifecycle editora
- `src/components/Inspector.tsx` — Fluent UI panel za svojstva dokumenta i blokova
- `src/components/BlockView.tsx` — render sadržajnih blokova i Fluent UI editing chrome
- `src/components/PageCanvas.tsx` — A4 strana
- `src/components/Presentation.tsx` — režim prikaza
- `src/document.css` — isključivo A4/PDF dokument stilovi
- `src/seeds/praktikum.part1.txt` + `src/seeds/praktikum.chunk*.txt` — transportni delovi početnog praktikuma
- `src/seeds/project-spec.json` — početna projektna specifikacija
- `src/seed.ts` — sklapanje početnih dokumenata
- `src/db.ts` — IndexedDB persistence
- `src/fileIO.ts` — Open / Save `.ersdoc.json`

Transportni delovi praktikuma postoje samo zbog ograničenja pojedinačnog remote upload-a. Aplikacija ih pri učitavanju spaja i parsira kao jedan `CourseDocument`.

## Lokalni AI-assisted setup

`LUNA_LOCAL_SETUP_PROMPT.md` sadrži gotov prompt za lokalnog coding agenta. Prompt koristi ovaj privatni repozitorijum i vodi kroz clone, dependency install, build, smoke test i pokretanje na `http://localhost:5600`.
