import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise3 = (): DocumentPage[] => [
  page('Vežba 3 — Zahtevi, Scrum i rana AI podrška', [
    text('h1', 'Vežba 3 — Zahtevi, Scrum i rana AI podrška'),
    text('paragraph', 'Agilni razvoj polazi od pretpostavke da se razumevanje problema razvija zajedno sa proizvodom. Umesto detaljnog plana koji se unapred smatra nepromenljivim, tim radi u kratkim iteracijama, održava transparentan backlog i redovno proverava rezultat sa zainteresovanim stranama. U ovoj vežbi AI se uvodi rano, ali samo kao podrška analizi zahteva i proveri formulacija — ne kao zamena za razumevanje problema.'),
    image('/course-assets/requirements-ai.svg', 'Od nejasnog zahteva ka User Story-ju, kriterijumima prihvatanja i proverljivom kontekstu za AI alat.', 'Zahtevi i AI podrška'),
    table(['Scrum element', 'Svrha'], [
      ['Sprint', 'Fiksni vremenski okvir u kome nastaje proverljiv inkrement proizvoda.'],
      ['Product Backlog', 'Prioritizovana i adaptivna lista potrebnih unapređenja proizvoda.'],
      ['Sprint Backlog', 'Izabrani cilj i stavke na kojima tim radi u tekućem sprintu.'],
      ['Sprint Review', 'Pregled ostvarenog inkrementa i prilagođavanje narednih prioriteta.'],
      ['Retrospektiva', 'Analiza procesa rada i dogovor o konkretnim poboljšanjima tima.'],
    ]),
  ]),
  page('3.1. User Story i kriterijumi prihvatanja', [
    text('h2', '3.1. User Story i kriterijumi prihvatanja'),
    text('paragraph', 'Canva materijal koristi klasičan obrazac: „Kao [uloga], želim [akciju], kako bih [vrednost]“. Obrazac je koristan jer podseća tim da zahtev nije tehnička funkcija sama za sebe, već ponašanje koje nekom korisniku donosi vrednost. Međutim, User Story bez kriterijuma prihvatanja često ostaje previše neodređen za implementaciju i testiranje.'),
    callout('info', 'Primer', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za termin, kako bih sprečio dvostruku rezervaciju i unapred znao da je oprema dostupna.'),
    table(['Kriterijum', 'Primer'], [
      ['Pozitivan scenario', 'Rezervacija se kreira kada je oprema slobodna i termin validan.'],
      ['Konflikt termina', 'Sistem odbija zahtev ako se termin preklapa sa postojećom aktivnom rezervacijom.'],
      ['Nevažeći period', 'Sistem odbija zahtev kada je početak posle kraja termina.'],
      ['Nedostupna oprema', 'Sistem vraća eksplicitan neuspeh ako je oprema van upotrebe.'],
    ], 'Kriterijumi treba da opisuju ponašanje koje se kasnije može proveriti.'),
    callout('task', 'Rad na vežbi', 'Za jedan zahtev iz projektnog domena napisati User Story, najmanje dva pozitivna i tri negativna kriterijuma prihvatanja. Za svaki kriterijum naznačiti kako bi se kasnije proverio: unit testom, integracionim testom ili ručnim scenarijem.'),
  ]),
  page('3.2. Product Backlog, Sprint Backlog i procena', [
    text('h2', '3.2. Backlog i Story Points'),
    text('paragraph', 'Product Backlog predstavlja sortiranu listu potreba proizvoda i menja se tokom razvoja. Refinement razlaže velike i nejasne stavke u manje elemente koji imaju dovoljno informacija da mogu ući u sprint. Sprint Backlog zatim predstavlja konkretan plan rada tima u tekućoj iteraciji.'),
    diagram('Od ideje do rada u sprintu', [
      ['Problem', 'potreba korisnika ili ograničenje', 'slate'],
      ['Product Backlog', 'prioritet i početni opis', 'blue'],
      ['Refinement', 'razlaganje + kriterijumi', 'cyan'],
      ['Sprint Backlog', 'odabrane stavke i plan', 'violet'],
      ['Increment', 'završeno prema Definition of Done', 'emerald'],
    ]),
    text('paragraph', 'Story Points nisu sati. Oni predstavljaju relativnu procenu napora koja u obzir uzima složenost, količinu posla, neizvesnost i rizik. Vrednost procene je u razgovoru tima: ako članovi daju veoma različite procene, to je signal da stavku ne razumeju na isti način.'),
    list([
      'Ne koristiti Story Points da bi se „merila produktivnost“ pojedinačnih članova.',
      'Veliku stavku prvo razložiti; broj poena nije zamena za razumevanje zahteva.',
      'Definition of Done treba da uključuje kvalitet: build, testove, review i potrebnu dokumentaciju.',
      'Na kraju sprinta rezultat treba da bude potencijalno upotrebljiv inkrement, ne samo kolekcija nedovršenih branch-eva.'),
  ]),
  page('3.3. AI kao pomoć u razjašnjenju zahteva', [
    text('h2', '3.3. AI kao pomoć u razjašnjenju zahteva'),
    text('paragraph', 'AI alat može rano da bude koristan ako dobije dovoljno konteksta i jasno ograničen zadatak. Na primer, umesto „napravi mi sistem rezervacija“, smisleniji zadatak je da pregleda konkretan User Story, pronađe nejasnoće i predloži dodatna pitanja i negativne scenarije. Student i dalje bira koje sugestije odgovaraju domenu.'),
    code('markdown', `# Zadatak\nPregledaj User Story i kriterijume prihvatanja. Nemoj generisati kod.\n\n# Kontekst\n- Sistem rezerviše fakultetsku opremu.\n- Jedna oprema ne sme imati preklapajuće aktivne rezervacije.\n- Termin mora biti u budućnosti.\n- Samo ovlašćeni korisnik može rezervisati.\n\n# Očekivani izlaz\n1. Nejasnoće koje treba razjasniti.\n2. Nedostajući negativni scenariji.\n3. Predlog testabilnih kriterijuma prihvatanja.\n4. Bez implementacionih detalja i bez koda.`,'Primer ograničenog zadatka za analizu zahteva'),
    callout('note', 'Zašto ovo nije „AI radi projekat“', 'AI ovde ne donosi konačnu domensku odluku niti implementira sistem. On služi kao drugi par očiju koji može ukazati na propušten scenario. Tim mora da pročita predlog, proveri ga prema stvarnom problemu i dokumentuje svoju odluku.'),
    list([
      'Zabeležiti početni zahtev i verziju nakon pregleda.',
      'Navesti najmanje jednu prihvaćenu i jednu odbačenu AI sugestiju, ako ih ima, sa kratkim razlogom.',
      'Ne unositi privatne podatke, tajne ili nerelevantan sadržaj projekta u spoljne alate.',
    ]),
  ]),
  page('3.4. Projektne instrukcije i kontekst', [
    text('h2', '3.4. Projektne instrukcije i kontekst'),
    text('paragraph', 'Prompt predstavlja konkretan zahtev u jednoj interakciji, dok projektne instrukcije čuvaju pravila koja treba da važe kroz više zadataka. Takva pravila mogu opisati arhitektonske granice, coding konvencije i obavezne provere. U ovoj fazi instrukcije su još kratke i ne daju AI-ju pravo da samostalno implementira kompletne funkcionalnosti.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Arhitektonska pravila\n- Poslovna pravila ne smeju biti u Presentation sloju.\n- Domain ne zavisi od Infrastructure.\n- Spoljne zavisnosti uvode se kroz ugovore i dependency injection.\n\n## Rad pre implementacije\n1. Sažmi zahtev svojim rečima.\n2. Navedi pogođene slojeve i rizike.\n3. Predloži plan i kriterijume verifikacije.\n4. Ne menjaj kod dok korisnik izričito ne zatraži implementaciju.\n\n## Verifikacija\n- Svaka promena mora da ima build/test ili drugi jasno naveden dokaz.`),
    callout('warning', 'Instrukcija nije garancija', 'Tekstualno pravilo može biti ignorisano ili pogrešno protumačeno. Kasnije u praktikumu uvodimo hooks/guardrails upravo za zahteve koji moraju biti deterministički sprovedeni.'),
  ]),
  page('3.5. Projektni checkpoint P1', [
    text('h2', '3.5. Projektni checkpoint P1 — problem, backlog i AI trag'),
    text('paragraph', 'Na prvom projektnom checkpoint-u tim ne predaje gotovu arhitekturu. Cilj je da se potvrdi da je problem dovoljno jasan, da postoji početni backlog i da se AI koristi transparentno kao podrška razmišljanju.'),
    list([
      'README opisuje realan problem, korisničke uloge i granice sistema.',
      'Backlog sadrži najmanje osam smislenih User Story-ja, ne samo listu CRUD operacija.',
      'Najmanje tri važna Story-ja imaju pozitivne i negativne kriterijume prihvatanja.',
      'Postoje početni `AI_INSTRUCTIONS.md` i `AI_USAGE.md`.',
      '`AI_USAGE.md` sadrži makar jednu sesiju analize zahteva: zadatak, alat/model, sažetak predloga, odluka tima i način provere.'),
    image('/course-assets/semester-map.svg', 'Checkpoint P1 je početak kontinuiteta: svaki naredni princip menja isti projektni repozitorijum.', 'Tok praktikuma i projekta'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati jedan User Story i tražiti od AI alata samo review kriterijuma. Predati početnu verziju, finalnu verziju i do 120 reči obrazloženja šta je iz sugestija prihvaćeno ili odbačeno.'),
  ]),
]
