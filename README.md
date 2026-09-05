# ERS nastavni materijali

Javni statički sajt za predmet **Elementi razvoja softvera** na studijskom programu Primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Univerzitet u Novom Sadu.

Sajt sadrži tri dokumenta:

- **Praktikum 2026/27** — nastavni materijal za vežbe i samostalni rad
- **Specifikacija projektnog zadatka 2026/27** — zvanični opšti uslovi za izradu, predaju i odbranu projekta
- **Projektne teme 2026/27** — predlozi domena izdvojeni od opšte specifikacije

Produkcijska verzija je predviđena za GitHub Pages:

**https://owlcoder.github.io/ers-motion-web/**

> Ako Pages još nije aktiviran za repozitorijum, u **Settings → Pages → Build and deployment** treba jednokratno izabrati **GitHub Actions**. Nakon toga svaki push na `main` automatski gradi i objavljuje sajt.

## Pokretanje lokalno

Potreban je Node.js 22 (podržan je i Node.js `^20.19.0`).

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5600
```

Zatim otvoriti:

```text
http://localhost:5600
```

Na macOS/Linux može se koristiti i:

```bash
./start.sh
```

Na Windows-u:

```text
start.cmd
```

## Build

```bash
npm run build
npm run preview
```

Vite koristi relativni `base`, pa isti `dist/` radi i lokalno i na GitHub Pages project URL-u (`/ers-motion-web/`).

## Organizacija sajta

- `src/main.tsx` — minimalni entry point
- `src/StaticApp.tsx` — read-only prikaz Praktikuma, Specifikacije i Projektnih tema i direktan PDF export
- `src/static-site.css` — web i print stilovi
- `src/content/` — strukturirani nastavni sadržaj
- `public/course-assets/` — nastavne ilustracije i TAPIZ screenshots
- `public/brand/` — institucionalni logotipi
- `.github/workflows/build.yml` — build provera
- `.github/workflows/pages.yml` — automatski deploy na GitHub Pages

Statički prikaz automatski generiše navigaciju kroz naslove, numeraciju slika/listinga/tabela, light-mode code blokove sa syntax highlighting-om i akademske tabele, callout blokove, dijagrame i slike.

## TAPIZ Boards screenshots

Screenshotovi za TAPIZ Boards koriste slike dostavljene uz praktikum u izvornim piksel dimenzijama, bez resize-a. Cilj je da tekst i detalji interfejsa ostanu čitljivi i pri uvećanju, umesto prethodnog blurry prikaza.

## PDF

Dugme **Preuzmi PDF** više ne otvara browser print dijalog. PDF se generiše direktno u browseru za trenutno otvoreni dokument i preuzima kao A4 fajl.

Dokument se tokom izvoza deli na A4 stranice pre renderovanja, umesto da se ceo praktikum pretvara u jedan ogroman canvas. To izbegava browser ograničenja za veoma dugačke dokumente i zadržava bolju čitljivost slika.

## GitHub Pages

Workflow `.github/workflows/pages.yml` na svaki push na `main`:

1. instalira dependencies;
2. pokreće `npm run build`;
3. pakuje `dist/` kao Pages artifact;
4. objavljuje artifact preko zvaničnog `actions/deploy-pages` workflow-a.

Repository je javan, pa GitHub Pages može da se koristi i na GitHub Free planu.

## Sačuvana verzija starog editora

Prethodni Word/Fluent UI editor je sačuvan na grani:

```text
archive/editor-word-ui-2026-08-26
```

`main` koristi samo statički read-only prikaz i nema IndexedDB, Fluent UI shell niti `.ersdoc` workflow.
