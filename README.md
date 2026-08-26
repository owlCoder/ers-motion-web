# ERS nastavni materijali

Ovaj repozitorijum sadrži statički read-only sajt za predmet **Elementi razvoja softvera**.

Glavni prikaz ima dva dokumenta:

- **Praktikum 2026/27**
- **Specifikacija projektnog zadatka 2026/27**

Sadržaj se prikazuje kao kontinuiran akademski dokument. U browseru nema simulacije A4 stranica, editora, lokalne baze dokumenata niti ručnog prelamanja sadržaja. Na taj način se izbegavaju velike praznine, odsečeni blokovi i drugi problemi koji nastaju kada se browser koristi kao Word-style page editor.

## Pokretanje

```bash
npm install
npm run build
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

## Organizacija sajta

- `src/main.tsx` — minimalni entry point
- `src/StaticApp.tsx` — read-only prikaz Praktikuma i Specifikacije
- `src/static-site.css` — kompletan web i print stil
- `src/content/` — strukturirani nastavni sadržaj
- `public/course-assets/` — nastavne ilustracije i dijagrami
- `public/brand/` — institucionalni logotipi

Statički prikaz automatski generiše:

- navigaciju kroz naslove;
- numeraciju slika, listinga i tabela;
- light-mode code blokove sa syntax highlighting-om;
- akademske tabele, callout blokove, dijagrame i slike.

## PDF i štampa

Dugme **Štampaj / PDF** koristi browser print dijalog. A4 lom se primenjuje tek kroz `@media print`, dok web prikaz ostaje kontinualan i nema fiksnu visinu stranice.

Print CSS koristi `break-inside: avoid` za slike, dijagrame, tabele, callout blokove i listinge kako bi se izbeglo njihovo razdvajanje između dve strane kad god je to fizički moguće.

## Sačuvana verzija starog editora

Prethodni Word/Fluent UI editor je sačuvan na grani:

```text
archive/editor-word-ui-2026-08-26
```

`main` više ne koristi editor, IndexedDB, Fluent UI shell niti `.ersdoc` workflow.
