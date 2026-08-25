import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise3 = (): DocumentPage[] => [
  page('Vežba 3 — Zahtevi, Scrum i rana AI podrška', [
    text('h1', 'Vežba 3 — Zahtevi, Scrum i rana AI podrška'),
    text('paragraph', 'Agilni razvoj polazi od pretpostavke da se razumevanje problema razvija zajedno sa proizvodom. Umesto detaljnog plana koji se unapred smatra nepromenljivim, tim radi u kratkim iteracijama, održava transparentan backlog i redovno proverava rezultat sa zainteresovanim stranama. AI se u ovoj fazi koristi kao podrška analizi zahteva i proveri formulacija, dok odgovornost za domenska pravila i konačnu odluku ostaje na timu.'),
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
    text('paragraph', 'User Story se najčešće zapisuje obrascem „Kao [uloga], želim [akciju], kako bih [vrednost]“. Obrazac podseća tim da zahtev nije tehnička funkcija sama za sebe, već ponašanje koje određenom korisniku donosi vrednost. User Story bez kriterijuma prihvatanja, međutim, često ostaje previše neodređen za implementaciju i testiranje.'),
    callout('info', 'Primer', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za termin, kako bih sprečio dvostruku rezervaciju i unapred znao da je oprema dostupna.'),
    table(['Kriterijum', 'Primer'], [
      ['Pozitivan scenario', 'Rezervacija se kreira kada je oprema slobodna i termin validan.'],
      ['Konflikt termina', 'Sistem odbija zahtev ako se termin preklapa sa postojećom aktivnom rezervacijom.'],
      ['Nevažeći period', 'Sistem odbija zahtev kada je početak posle kraja termina.'],
      ['Nedostupna oprema', 'Sistem vraća eksplicitan neuspeh ako je oprema van upotrebe.'],
    ], 'Kriterijumi opisuju ponašanje koje se kasnije može proveriti.'),
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
      'Ne koristiti Story Points da bi se merila produktivnost pojedinačnih članova.',
      'Veliku stavku prvo razložiti; broj poena nije zamena za razumevanje zahteva.',
      'Definition of Done treba da uključuje kvalitet: build, testove, review i potrebnu dokumentaciju.',
      'Na kraju sprinta rezultat treba da bude potencijalno upotrebljiv inkrement, ne kolekcija nedovršenih grana.',
    ]),
  ]),
  page('3.3. AI kao pomoć u razjašnjenju zahteva', [
    text('h2', '3.3. AI kao pomoć u razjašnjenju zahteva'),
    text('paragraph', 'AI alat može biti koristan već tokom analize zahteva ako dobije relevantan kontekst i jasno ograničen zadatak. Umesto zahteva za generisanje celog rešenja, modelu se može zadati da pregleda konkretan User Story, pronađe nejasnoće i predloži pitanja ili negativne scenarije. Tim zatim proverava sugestije prema stvarnom domenu i odlučuje koje će prihvatiti.'),
    code('markdown', `# Zadatak\nPregledaj User Story i kriterijume prihvatanja. Nemoj generisati kod.\n\n# Kontekst\n- Sistem rezerviše fakultetsku opremu.\n- Jedna oprema ne sme imati preklapajuće aktivne rezervacije.\n- Termin mora biti u budućnosti.\n- Samo ovlašćeni korisnik može rezervisati.\n\n# Očekivani izlaz\n1. Nejasnoće koje treba razjasniti.\n2. Nedostajući negativni scenariji.\n3. Predlog testabilnih kriterijuma prihvatanja.\n4. Bez implementacionih detalja i bez koda.`, 'Ograničen zadatak za analizu zahteva'),
    callout('note', 'Granica odgovornosti AI podrške', 'Predlog modela nije domenska odluka. Njegova vrednost je u tome da ukaže na moguće nejasnoće i propuštene scenarije; tim mora da proceni svaki predlog u kontekstu problema i zabeleži konačnu odluku.'),
    list([
      'Zabeležiti početni zahtev i verziju nakon pregleda.',
      'Navesti najmanje jednu prihvaćenu i jednu odbačenu sugestiju, kada takvi slučajevi postoje, sa kratkim razlogom.',
      'Ne unositi privatne podatke, tajne ili nerelevantan sadržaj projekta u spoljne alate.',
    ]),
  ]),
  page('3.4. Projektne instrukcije i kontekst', [
    text('h2', '3.4. Projektne instrukcije i kontekst'),
    text('paragraph', 'Prompt predstavlja konkretan zahtev u jednoj interakciji, dok projektne instrukcije čuvaju pravila koja treba da važe kroz više zadataka. Takva pravila mogu opisati arhitektonske granice, coding konvencije i obavezne provere. U ovoj fazi instrukcije su kratke i usmeravaju analizu; implementacione odluke i dalje prolaze kroz eksplicitnu proveru studenta.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Arhitektonska pravila\n- Poslovna pravila ne smeju biti u Presentation sloju.\n- Domain ne zavisi od Infrastructure.\n- Spoljne zavisnosti uvode se kroz ugovore i dependency injection.\n\n## Rad pre implementacije\n1. Sažmi zahtev svojim rečima.\n2. Navedi pogođene slojeve i rizike.\n3. Predloži plan i kriterijume verifikacije.\n4. Ne menjaj kod dok korisnik izričito ne zatraži implementaciju.\n\n## Verifikacija\n- Svaka promena mora da ima build/test ili drugi jasno naveden dokaz.`, 'Primer projektnih instrukcija'),
    callout('warning', 'Instrukcija nije garancija', 'Tekstualno pravilo može biti pogrešno protumačeno ili preskočeno. Za zahteve koji moraju uvek da se sprovedu kasnije uvodimo determinističke mehanizme, kao što su hooks i guardrails.'),
  ]),
  page('3.5. Projektni checkpoint P1', [
    text('h2', '3.5. Projektni checkpoint P1 — problem, backlog i AI trag'),
    text('paragraph', 'Na prvom projektnom checkpoint-u tim ne predaje gotovu arhitekturu. Cilj je da se potvrdi da je problem dovoljno jasan, da postoji početni backlog i da se AI koristi transparentno kao podrška razmišljanju.'),
    table(['Artefakt', 'Minimalni sadržaj za P1'], [
      ['README', 'Opis problema, korisničke uloge, granice sistema i članovi tima.'],
      ['Product Backlog', 'Najmanje osam smislenih User Story-ja; prioritet i dovoljno konteksta za refinement.'],
      ['Acceptance criteria', 'Pozitivni i negativni kriterijumi za najmanje tri važna Story-ja.'],
      ['AI_INSTRUCTIONS.md', 'Početna projektna pravila i ograničenja rada sa AI alatom.'],
      ['AI_USAGE.md', 'Najmanje jedna zabeležena analiza zahteva, odluka tima i način provere.'],
    ], 'Checkpoint P1 povezuje zahtev, razvojni trag i transparentnu upotrebu AI podrške.'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati jedan User Story i tražiti od AI alata samo review kriterijuma. Predati početnu verziju, finalnu verziju i do 120 reči obrazloženja šta je iz sugestija prihvaćeno ili odbačeno.'),
  ]),
]
