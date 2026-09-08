# ERS nastavni materijali

Javni statički sajt za predmet **Elementi razvoja softvera** na studijskom programu Primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Univerzitet u Novom Sadu.

Sajt sadrži:

- **Praktikum 2026/27** — nastavni materijal za vežbe, samostalni rad i projektni rad;
- **Prezentacije za vežbe** — nastavnički materijal koji prati sadržaj praktikuma.

Produkcijska verzija je predviđena za GitHub Pages:

**https://owlcoder.github.io/ers-motion-web/**

> Ako GitHub Pages još nije aktiviran za repozitorijum, u **Settings → Pages → Build and deployment** treba jednokratno izabrati **GitHub Actions**. Nakon toga svaki push na `main` automatski gradi i objavljuje sajt.

## Lokalno pokretanje

Potreban je Node.js 22, a podržan je i Node.js `^20.19.0`.

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5600
```

Zatim otvoriti:

```text
http://localhost:5600
```

Na macOS/Linux sistemima može se koristiti i:

```bash
./start.sh
```

Na Windows sistemu:

```text
start.cmd
```

## Izgradnja

```bash
npm run build
npm run preview
```

Vite koristi relativni `base`, pa isti `dist/` radi i lokalno i na GitHub Pages adresi projekta (`/ers-motion-web/`).

## Organizacija sajta

- `src/main.tsx` — minimalna ulazna tačka aplikacije;
- `src/StaticApp.tsx` — prikaz Praktikuma i Prezentacija;
- `src/static-site.css` — stilovi za prikaz na ekranu i štampu;
- `src/content/` — strukturirani nastavni sadržaj;
- `public/course-assets/` — nastavne ilustracije i snimci ekrana iz Tapiz Boards;
- `public/brand/` — institucionalni logotipi;
- `.github/workflows/build.yml` — automatska provera izgradnje;
- `.github/workflows/pages.yml` — automatsko objavljivanje na GitHub Pages.

Statički prikaz automatski generiše navigaciju kroz naslove, numeraciju slika, listinga i tabela, blokove koda sa označavanjem sintakse, akademske tabele, napomene, dijagrame i slike.

## Tapiz Boards — snimci ekrana

Snimci ekrana za Tapiz Boards koriste slike dostavljene uz Praktikum u izvornim dimenzijama, bez promene veličine. Cilj je da tekst i detalji interfejsa ostanu čitljivi i pri uvećanju.

## PDF

Dugme **Preuzmi PDF** ne otvara dijalog za štampu. PDF se generiše direktno u pregledaču za trenutno otvoreni dokument i preuzima kao A4 datoteka.

Dokument se tokom izvoza deli na A4 stranice pre iscrtavanja. Time se izbegavaju ograničenja pregledača kod veoma dugih dokumenata i zadržava se bolja čitljivost slika.

## GitHub Pages

Tok rada `.github/workflows/pages.yml` pri svakom push-u na `main`:

1. instalira zavisnosti;
2. pokreće `npm run build`;
3. pakuje `dist/` kao GitHub Pages artefakt;
4. objavljuje artefakt pomoću zvanične GitHub Pages akcije.

Repozitorijum je javan, pa GitHub Pages može da se koristi i na GitHub Free planu.

## Sačuvana verzija starog editora

Prethodni Word/Fluent UI editor sačuvan je na grani:

```text
archive/editor-word-ui-2026-08-26
```

`main` koristi samo statički prikaz i nema IndexedDB, Fluent UI okruženje niti `.ersdoc` tok rada.
