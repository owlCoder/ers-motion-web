# ERS nastavni materijali

Javni statički sajt za predmet **Elementi razvoja softvera** na studijskom programu Primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Univerzitet u Novom Sadu.

Sajt sadrži tri dokumenta:

- **Praktikum 2026/27** — nastavni materijal za vežbe i samostalni rad;
- **Specifikacija projektnog zadatka 2026/27** — zvanični uslovi za izradu, predaju i odbranu projekta;
- **Projekat 2026/27** — jedna zajednička projektna tema, jedan proizvod i više razvojnih timova.

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
- `src/StaticApp.tsx` — prikaz Praktikuma, Specifikacije i Projekta samo za čitanje, sa direktnim izvozom u PDF;
- `src/static-site.css` — stilovi za prikaz na ekranu i štampu;
- `src/content/` — strukturirani nastavni sadržaj;
- `src/content/teamProject.ts` — pravila i organizacija zajedničkog timskog projekta;
- `public/course-assets/` — nastavne ilustracije i snimci ekrana iz Tapiz Boards;
- `public/brand/` — institucionalni logotipi;
- `.github/workflows/build.yml` — automatska provera izgradnje;
- `.github/workflows/pages.yml` — automatsko objavljivanje na GitHub Pages.

Statički prikaz automatski generiše navigaciju kroz naslove, numeraciju slika, listinga i tabela, blokove koda sa označavanjem sintakse, akademske tabele, napomene, dijagrame i slike.

## Projektni model

Tab **Projekat** opisuje jednu zajedničku temu: razvoj integrisanog poslovnog informacionog sistema. Studenti rade u više timova nad istim proizvodom i istim repozitorijumom. Svaki tim preuzima odgovornost za jedan modul, na primer Finansije, Podršku korisnicima, CRM, Zalihe, Ljudske resurse, Projekte, Platformu ili Analitiku. To nisu zasebne teme, već delovi istog sistema koji moraju da se integrišu u jednu celinu.

Zvanični uslovi nalaze se u tabu **Specifikacija**. Tab **Projekat** opisuje organizaciju rada: Tapiz Boards, podelu odgovornosti, Git i zahteve za spajanje, pregled koda, testiranje, automatizaciju, arhitektonske odluke i saradnju između timova. Pravila iz Specifikacije imaju prednost ako postoji razlika u tumačenju.

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
