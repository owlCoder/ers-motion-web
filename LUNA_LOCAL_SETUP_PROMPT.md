# Luna 5.6 High — lokalni setup ERS Studio

Radi autonomno u terminalu i editoru. Cilj je da lokalno podigneš postojeći ERS Studio projekat iz privatnog GitHub repozitorijuma, otkloniš eventualne build/runtime probleme i na kraju mi ostaviš aplikaciju pokrenutu u browseru.

## Repo

`https://github.com/owlCoder/ers-motion-web`

## Cilj

Na kraju želim da samo otvorim `http://localhost:5600` i koristim aplikaciju. Nemoj menjati funkcionalni koncept ili vizuelni dizajn bez potrebe; fokus je pouzdan lokalni setup, build ispravnost i osnovni smoke test postojeće aplikacije.

ERS Studio je React + Vite + TypeScript client-only aplikacija za uređivanje nastavnih materijala. Primarni prikaz je A4 portrait, dokumenti se lokalno čuvaju u IndexedDB-u i mogu da se uvoze/izvoze kao `.ersdoc.json`. Code blokovi MORAJU ostati light/white zbog štampe i čitljivosti.

## Obavezni koraci

1. Proveri dostupnost:

```bash
git --version
node --version
npm --version
```

2. Preferiraj Node.js 22 LTS. Ako je instaliran kompatibilan noviji Node, koristi ga osim ako build pokaže problem. Ako Node/npm nisu instalirani, instaliraj odgovarajuću stabilnu verziju za operativni sistem.

3. Kloniraj privatni repo u smislen lokalni folder:

```bash
git clone https://github.com/owlCoder/ers-motion-web.git
cd ers-motion-web
```

Ako repo već postoji lokalno, prvo uradi `git status`. Nemoj uništavati necommitovane korisničke izmene. Bezbedno ažuriraj `main`.

4. Pre izmene koda pročitaj najmanje:

- `README.md`
- `package.json`
- `.nvmrc`
- `src/App.tsx`
- `src/types.ts`
- `src/db.ts`
- `src/fileIO.ts`
- `src/styles.css`
- `src/components/`
- `src/seeds/`
- `src/seed.ts`

Napomena: `src/seeds/praktikum.part1.txt` i `src/seeds/praktikum.chunk*.txt` su transportni delovi jednog velikog JSON seed dokumenta. `src/seed.ts` ih spaja redom i zatim radi `JSON.parse`. Nemoj menjati njihov sadržaj niti ih tretirati kao odvojene dokumente. Ako želiš da ih kasnije konsoliduješ u jedan `praktikum.json`, uradi to samo ako možeš dokazati byte-for-byte ekvivalentan JSON i nakon toga build/smoke test prolaze; konsolidacija nije obavezna.

5. Instaliraj zavisnosti. Ako postoji validan `package-lock.json`, koristi:

```bash
npm ci
```

U suprotnom:

```bash
npm install
```

6. Obavezno pokreni:

```bash
npm run build
```

Build mora proći. Ako postoje TypeScript ili Vite greške, pronađi pravi uzrok i ispravi ga.

Nemoj rešavati probleme pomoću:

- masovnog `any`,
- `@ts-ignore`,
- gašenja TypeScript strict provera,
- uklanjanja funkcionalnosti,
- komentarisanja problematičnog koda samo da build postane zelen.

7. Nakon uspešnog build-a pokreni aplikaciju striktno na:

```text
http://localhost:5600
```

odnosno:

```bash
npm run dev -- --host 127.0.0.1 --port 5600
```

Na Windows-u možeš koristiti i postojeći `start.cmd` ako je praktičnije.

8. Nakon pokretanja automatski otvori `http://localhost:5600` u podrazumevanom browseru.

## Smoke test

Nemoj smatrati zadatak završenim samo zato što se početna stranica renderovala.

### Biblioteka

Početna biblioteka mora sadržati najmanje:

- Praktikum
- Specifikaciju projektnog zadatka

Ako seed parsiranje pukne, proveri redosled svih `praktikum.part/chunk` import-a i validnost sastavljenog JSON-a pre bilo kakve izmene sadržaja.

### A4 editor

Proveri:

- A4 portrait stranice;
- pravilne margine;
- nema horizontalnog sečenja sadržaja;
- sadržaj ne izlazi izvan papira bez upozorenja;
- veliki dijagrami koriste raspoloživu širinu i ostaju oštri;
- dijagrami su HTML/CSS/vector-like blokovi, ne rasterizovani screenshotovi;
- editor UI nije deo same A4 stranice.

### Code blokovi — obavezan zahtev

Code blokovi moraju ostati u **LIGHT MODE-u**.

Pozadina mora biti bela ili veoma svetla zbog:

- štampe;
- PDF-a;
- projektora;
- čitljivosti studentskog materijala.

Nemoj uvoditi dark background za code blokove.

Proveri syntax highlighting za postojeće jezike, naročito C#, Bash, JSON, Markdown i TypeScript.

### Editing

Proveri:

- izbor bloka;
- inline edit teksta;
- Inspector;
- dodavanje bloka;
- brisanje;
- kopiranje;
- promena redosleda;
- dodavanje/kopiranje/brisanje stranica;
- uređivanje dijagrama iz Inspector-a.

### Persistence

Proveri IndexedDB.

Promeni deo dokumenta, sačekaj autosave, refreshuj aplikaciju i proveri da je izmena sačuvana. Browser console ne sme imati IndexedDB runtime error-e.

### Open / Save

Proveri import/export `*.ersdoc.json`.

Ako browser podržava File System Access API, koristi ga. Fallback upload/download mora ostati funkcionalan.

### PDF

Proveri Print/PDF prikaz:

- A4 portrait;
- editor toolbar/sidebar/inspector nisu odštampani;
- stranice imaju pravilne page break-ove;
- bela pozadina;
- code ostaje light;
- dijagrami i tekst nisu isečeni.

### Presentation mode

Proveri:

- prikaz trenutne A4 stranice;
- navigaciju između stranica;
- čitljivost na većem ekranu;
- izlazak preko Escape/close kontrole.

## Browser console i runtime

Pregledaj browser console i terminal. Ispravi:

- runtime error-e;
- React error-e;
- neuspele IndexedDB operacije;
- exception-e prilikom Open/Save/PDF rada;
- TypeScript/Vite probleme koji utiču na build ili funkcionalnost.

Nemoj trošiti vreme na kozmetičke warning-e trećih biblioteka koji ne utiču na aplikaciju.

## Funkcionalni zahtevi koje ne smeš promeniti

ERS Studio ostaje:

- React;
- Vite;
- TypeScript;
- client-only;
- bez serverskog backenda;
- bez cloud baze;
- sa IndexedDB lokalnim čuvanjem;
- sa prenosivim `.ersdoc.json` dokumentima;
- sa A4 formatom kao primarnim prikazom;
- sa light code blokovima;
- sa Praktikumom i Projektnom specifikacijom kao seed dokumentima.

Ne briši postojeći sadržaj nastavnih materijala.

## Git

Ako moraš da menjaš kod, pravi male i smislene izmene. Pre završetka ponovo pokreni:

```bash
npm run build
git diff
git status
```

Ako si napravio potrebne korekcije i smoke test je uspešan, commituj ih smislenim commit porukama. Push na `main` uradi tek nakon uspešnog build-a i osnovnog smoke testa.

Ako `npm install` generiše `package-lock.json`, zadrži ga i commituj ako je projekat stabilan.

## Završetak

Zadatak je završen tek kada:

- dependencies su instalirane;
- build prolazi;
- nema relevantnih runtime grešaka;
- osnovni smoke test je izvršen;
- aplikacija radi na `http://localhost:5600`;
- browser sa ERS Studio aplikacijom je otvoren;
- dev server ostaje pokrenut.

Na kraju mi prikaži samo kratak izveštaj:

- lokalna putanja repozitorijuma;
- Node verzija;
- npm verzija;
- rezultat build-a;
- koje si fajlove morao da promeniš i zašto;
- rezultat smoke testa;
- URL aplikacije.

Nemoj gasiti development server nakon završnog izveštaja.
