# Luna 5.6 High — ERS Studio lokalni setup i smoke test

Radi autonomno u terminalu, editoru i browseru. Cilj je da lokalno ažuriraš i podigneš ERS Studio, otkloniš eventualne build/runtime probleme i na kraju ostaviš aplikaciju pokrenutu na `http://localhost:5600`.

Repo:

`https://github.com/owlCoder/ers-motion-web`

## Važne arhitektonske odluke

ERS Studio je React + Vite + TypeScript client-only aplikacija.

Interaktivni korisnički interfejs je standardizovan na **Fluent UI React v9** (`@fluentui/react-components`). Nemoj vraćati custom CSS za toolbar, sidebar, inspector, forme, dugmad, toast-ove ili dijaloge. Za interaktivni UI koristi Fluent komponente, `makeStyles` i Fluent design tokens.

`src/document.css` je namerno izuzetak: on sadrži samo A4/PDF stilove samog nastavnog dokumenta. To nije editor chrome. Code blokovi u dokumentu MORAJU ostati light/white zbog štampe i čitljivosti.

Browser-native `alert()` i `confirm()` ne treba koristiti za akcije aplikacije. Potvrde, poruke i greške prikazuju se Fluent UI dijalozima/toast-ovima. Sistemskom file picker-u je dozvoljeno da ostane native jer služi za Open/Save na disku.

## Koraci

1. Proveri okruženje:

```bash
git --version
node --version
npm --version
```

Preferiraj Node.js 22 LTS.

2. Ako repo ne postoji lokalno:

```bash
git clone https://github.com/owlCoder/ers-motion-web.git
cd ers-motion-web
```

Ako već postoji, prvo uradi `git status`, sačuvaj korisničke izmene i bezbedno povuci najnoviji `main`.

3. Pročitaj najmanje:

- `README.md`
- `package.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/Inspector.tsx`
- `src/components/BlockView.tsx`
- `src/components/PageCanvas.tsx`
- `src/components/Presentation.tsx`
- `src/document.css`
- `src/db.ts`
- `src/fileIO.ts`
- `src/seed.ts`
- `src/seeds/`

`src/seeds/praktikum.part1.txt` i `src/seeds/praktikum.chunk*.txt` su delovi jednog velikog JSON seed dokumenta; `src/seed.ts` ih spaja redom i parsira kao jedan `CourseDocument`.

4. Instaliraj zavisnosti:

```bash
npm install
```

Ako se napravi ili promeni `package-lock.json`, zadrži ga u repozitorijumu.

5. Obavezno pokreni:

```bash
npm run build
```

Build mora proći bez `@ts-ignore`, masovnog `any`, gašenja strict provera ili uklanjanja funkcionalnosti.

6. Pokreni aplikaciju:

```bash
npm run dev -- --host 127.0.0.1 --port 5600
```

Na Windows-u možeš koristiti `start.cmd`.

7. Automatski otvori:

`http://localhost:5600`

## Smoke test

Proveri sledeće:

### Fluent UI

- top toolbar koristi Fluent komponente i deluje konzistentno;
- levi panel biblioteke i sadržaja je vizuelno usklađen;
- desni Inspector koristi Fluent `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `Slider` i `Button` kontrole;
- potvrda brisanja dokumenta i stranice je Fluent `Dialog`, ne browser `confirm()`;
- obaveštenja koriste Fluent Toast/Toaster;
- block action rail i insert toolbar koriste Fluent kontrole;
- presentation toolbar koristi Fluent kontrole;
- nema aktivnih legacy `styles.css` / `professional.css` app-shell stilova.

### Word-like A4 rad

- sve A4 strane su prikazane u jednom kontinuiranom vertikalnom dokumentu;
- scroll prirodno prelazi na sledeću stranicu;
- aktivna stranica se automatski prati tokom skrolovanja;
- levi `Sadržaj` služi za skok na glavne celine, a ne kao obavezni page switcher;
- nema horizontalnog sečenja A4 strane pri normalnom zoom-u.

### Dokument i štampa

- A4 portrait;
- header/footer i brojevi stranica;
- profesionalna naslovna sa institucionalnim logotipima u seed dokumentima;
- code blokovi su svetli/beli;
- syntax highlighting radi;
- dijagrami i tabele ne izlaze iz stranice;
- `Izvezi PDF` ne štampa toolbar, sidebar ili inspector;
- print preview prikazuje samo A4 dokument i pravilne page break-ove.

### Editing

- inline edit teksta;
- izbor i podešavanje blokova;
- dodavanje/kopiranje/brisanje/pomeranje blokova;
- dodavanje/kopiranje/brisanje/pomeranje stranica;
- uređivanje dijagrama;
- Fluent confirmation dialog za destructive akcije.

### Persistence i fajlovi

- IndexedDB autosave preživi refresh;
- `*.ersdoc.json` Open/Save radi;
- početna biblioteka sadrži Praktikum i Specifikaciju projektnog zadatka.

### Runtime

Pregledaj terminal i browser console. Ispravi stvarne React/TypeScript/IndexedDB/Open-Save/print greške. Ne menjaj funkcionalni koncept bez potrebe.

## Git

Nakon eventualnih popravki:

```bash
npm run build
git diff
git status
```

Ako si nešto menjao, napravi smislen commit i pushuj proverene izmene na `main`. Ne pushuj neproveren kod.

Na kraju ostavi dev server uključen i prikaži samo kratak izveštaj: lokalna putanja, Node/npm verzije, build rezultat, šta je menjano, smoke-test rezultat i finalni URL `http://localhost:5600`.
