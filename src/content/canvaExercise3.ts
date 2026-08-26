import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise3 = (): DocumentPage[] => [
  page('Vežba 3 — Zahtevi, Scrum i rana AI podrška', [
    text('h1', 'Vežba 3 — Zahtevi, Scrum i rana AI podrška'),
    text('paragraph', 'Agilni razvoj polazi od pretpostavke da se razumevanje problema razvija zajedno sa proizvodom. Umesto detaljnog plana koji se unapred smatra nepromenljivim, tim radi u kratkim iteracijama, održava transparentan backlog i redovno proverava rezultat sa zainteresovanim stranama. AI se u ovoj fazi koristi kao podrška analizi zahteva i proveri formulacija, dok odgovornost za poslovna pravila i konačnu odluku ostaje na timu.'),
    image('/course-assets/requirements-ai.svg', 'Od nejasnog zahteva ka User Story-ju, kriterijumima prihvatanja i proverljivom kontekstu za AI alat.', 'Zahtevi i AI podrška'),
    table(['Scrum element', 'Svrha'], [
      ['Sprint', 'Fiksni vremenski okvir u kome nastaje proverljiv inkrement proizvoda.'],
      ['Product Backlog', 'Prioritizovana i prilagodljiva lista potreba i unapređenja proizvoda.'],
      ['Sprint Backlog', 'Izabrani cilj i stavke na kojima tim radi u tekućem sprintu.'],
      ['Sprint Review', 'Pregled ostvarenog inkrementa i prilagođavanje narednih prioriteta.'],
      ['Retrospektiva', 'Analiza načina rada i dogovor o konkretnim poboljšanjima procesa tima.'],
    ]),
  ]),
  page('3.1. User Story i kriterijumi prihvatanja', [
    text('h2', '3.1. User Story i kriterijumi prihvatanja'),
    text('paragraph', 'User Story se često zapisuje obrascem „Kao [uloga], želim [cilj], kako bih [vrednost]“. Obrazac podseća tim da zahtev nije tehnička funkcija sama za sebe, već ponašanje koje određenom korisniku donosi vrednost. User Story bez kriterijuma prihvatanja, međutim, često ostaje previše neodređen za implementaciju, testiranje i pregled rezultata.'),
    callout('info', 'Primer User Story-ja', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za određeni termin, kako bih sprečio dvostruku rezervaciju i unapred znao da je oprema dostupna.'),
    table(['Vrsta kriterijuma', 'Primer'], [
      ['Uspešan scenario', 'Rezervacija se kreira kada je oprema slobodna, korisnik ovlašćen, a termin validan.'],
      ['Konflikt termina', 'Sistem odbija zahtev kada se termin preklapa sa postojećom aktivnom rezervacijom.'],
      ['Nevažeći period', 'Sistem odbija zahtev kada početak termina nije pre njegovog kraja.'],
      ['Nedostupna oprema', 'Sistem vraća eksplicitan poslovni neuspeh kada je oprema van upotrebe.'],
    ], 'Kriterijumi prihvatanja opisuju ponašanje koje se kasnije može proveriti.'),
    callout('task', 'Rad na vežbi', 'Za jedan zahtev iz projektnog domena napisati User Story, najmanje dva uspešna i tri negativna ili granična kriterijuma prihvatanja. Za svaki kriterijum naznačiti kako će kasnije biti proveren: unit testom, integracionim testom ili ručnim demonstracionim scenarijem.'),
  ]),
  page('3.2. Product Backlog, Sprint Backlog i procena', [
    text('h2', '3.2. Backlog, refinement i Story Points'),
    text('paragraph', 'Product Backlog predstavlja uređenu listu potreba proizvoda i menja se tokom razvoja. Refinement razlaže velike i nejasne stavke na manje elemente koji imaju dovoljno konteksta da tim može da razgovara o obimu, kriterijumima i rizicima. Sprint Backlog zatim predstavlja konkretan plan rada tima u tekućoj iteraciji.'),
    diagram('Od potrebe do rada u sprintu', [
      ['Problem', 'potreba korisnika ili ograničenje', 'slate'],
      ['Product Backlog', 'prioritet i početni opis', 'blue'],
      ['Refinement', 'razlaganje i kriterijumi', 'cyan'],
      ['Sprint Backlog', 'odabrane stavke i plan rada', 'violet'],
    ], 'Inkrement na kraju sprinta obuhvata završene stavke koje zadovoljavaju Definition of Done.'),
    text('paragraph', 'Story Points nisu mera vremena u satima. Predstavljaju relativnu procenu napora koja uzima u obzir složenost, količinu posla, neizvesnost i rizik. Najveća vrednost procene nalazi se u razgovoru tima: veoma različite procene često ukazuju da članovi ne razumeju stavku na isti način.'),
    list([
      'Story Points ne koristiti kao meru produktivnosti pojedinačnog člana tima.',
      'Veliku ili nejasnu stavku najpre razložiti; broj poena nije zamena za razumevanje zahteva.',
      'Definition of Done treba da obuhvati kvalitet: uspešnu izgradnju projekta, testove, pregled koda i potrebnu dokumentaciju.',
      'Na kraju sprinta cilj je potencijalno upotrebljiv inkrement, a ne zbir nedovršenih grana i parcijalnih promena.',
    ]),
  ]),
  page('3.3. Tapiz Boards kao prikaz agilnih artefakata', [
    text('h2', '3.3. Tapiz Boards kao prikaz agilnih artefakata'),
    text('paragraph', 'Na vežbi se Tapiz Boards koristi kao konkretno okruženje za povezivanje Scrum pojmova sa svakodnevnim radom tima. Aplikacija ne menja značenje Product Backlog-a, Sprint Backlog-a ili User Story-ja; ona omogućava da se ti artefakti vide, uređuju i prate kroz zajedničku radnu tablu.'),
    table(['Aktivnost u alatu', 'Softversko-inženjersko značenje'], [
      ['Izbor predmeta i pridruživanje timu', 'Uspostavljanje konteksta u kome tim deli isti backlog, sprintove i razvojni trag.'],
      ['Pregled i izmena backlog-a', 'Prioritizacija zahteva i priprema stavki za naredne iteracije.'],
      ['Dodavanje User Story-ja ili zadatka', 'Pretvaranje potrebe korisnika u stavku koja ima jasan naziv, opis i dovoljno konteksta za rad.'],
      ['Kreiranje sprinta', 'Definisanje vremenskog okvira, naziva i cilja iteracije.'],
      ['Raspoređivanje stavki u sprint', 'Formiranje Sprint Backlog-a i zajedničkog plana rada.'],
      ['Praćenje statusa na radnoj tabli', 'Transparentan prikaz rada koji nije samo tehnički status, već signal o toku kroz dogovoreni proces.'],
      ['Komentari, učesnici, veze i istorija izmena', 'Kontekst saradnje i sledljivost odluka u okviru konkretne stavke.'],
    ]),
    callout('note', 'Alat ne zamenjuje kvalitet zahteva', 'Kartica sa kratkim naslovom nije automatski dobar User Story. Pre početka implementacije tim mora da razume korisničku vrednost, poslovna pravila, kriterijume prihvatanja i granice obima. Radna tabla pomaže da se taj dogovor učini vidljivim i sledljivim.'),
  ]),
  page('3.4. Od User Story-ja do sprinta u Tapiz Boards-u', [
    text('h2', '3.4. Od User Story-ja do sprinta u Tapiz Boards-u'),
    text('paragraph', 'Timovi na predmetu postoje u okviru odgovarajućeg predmeta, a student se pridružuje timu sa kojim će raditi tokom semestra. Nakon toga tim održava backlog, kreira sprintove i raspoređuje stavke u odgovarajući vremenski okvir. Za svaki sprint unose se naziv, trajanje i cilj, dok pojedinačne stavke treba da imaju smislen naziv i dovoljno informacija da drugi član tima razume očekivani rezultat.'),
    diagram('Tok rada u Tapiz Boards-u', [
      ['Tim', 'zajednički projektni kontekst', 'slate'],
      ['Backlog', 'User Story-ji i druge stavke', 'blue'],
      ['Sprint', 'cilj, trajanje i odabrani obim', 'cyan'],
      ['Radna tabla', 'status stavki tokom rada', 'violet'],
    ], 'Završene stavke predstavljaju proverljiv deo inkrementa i treba da zadovolje dogovorenu Definition of Done.'),
    list([
      'Naziv stavke treba da bude dovoljno jasan da se iz njega razume predmet promene; generički nazivi poput „popravke“ ili „izmena“ nisu dovoljni.',
      'Opis treba da sadrži kontekst koji je potreban za razumevanje zahteva, a ne tehnički dnevnik implementacije.',
      'Ako UI nema posebno polje za kriterijume prihvatanja, oni mogu biti jasno strukturirani u opisu ili drugom dogovorenom delu stavke.',
      'Veće stavke treba razložiti na manje zadatke samo kada to olakšava planiranje, paralelan rad ili proveru napretka.',
      'Komentari i istorija izmena služe kao dodatni kontekst, ali ključne poslovne odluke treba preneti i u trajnu projektnu dokumentaciju kada su važne za buduće održavanje.',
    ]),
    callout('task', 'Rad na vežbi u Tapiz Boards-u', 'Kreirati najmanje jedan smislen User Story iz sopstvenog projektnog domena, dopuniti ga kriterijumima prihvatanja, proceniti relativni napor i rasporediti ga u sprint. Zatim razložiti rad na manje zadatke samo tamo gde postoji jasan razlog za takvu podelu.'),
  ]),
  page('3.5. AI kao pomoć u razjašnjenju zahteva', [
    text('h2', '3.5. AI kao pomoć u razjašnjenju zahteva'),
    text('paragraph', 'AI alat može biti koristan tokom analize zahteva ako dobije relevantan kontekst i jasno ograničen zadatak. Umesto zahteva da generiše kompletno rešenje, modelu se može zadati da pregleda konkretan User Story, identifikuje nejasnoće i predloži dodatna pitanja ili negativne scenarije. Tim zatim proverava sugestije u odnosu na stvarni domen i odlučuje koje će prihvatiti.'),
    code('markdown', `# Zadatak\nPregledaj User Story i kriterijume prihvatanja. Nemoj generisati kod.\n\n# Kontekst\n- Sistem rezerviše fakultetsku opremu.\n- Jedna oprema ne sme imati preklapajuće aktivne rezervacije.\n- Termin mora biti u budućnosti.\n- Samo ovlašćeni korisnik može rezervisati.\n\n# Očekivani izlaz\n1. Nejasnoće koje treba razjasniti.\n2. Nedostajući negativni i granični scenariji.\n3. Predlog testabilnih kriterijuma prihvatanja.\n4. Bez implementacionih detalja i bez koda.`, 'Ograničen zadatak za analizu zahteva'),
    callout('note', 'Granica odgovornosti AI podrške', 'Predlog modela nije poslovna odluka. Njegova vrednost je u tome da ukaže na moguće nejasnoće i propuštene scenarije; tim mora da proceni svaki predlog u kontekstu problema i zabeleži konačnu odluku.'),
    list([
      'Sačuvati početnu formulaciju zahteva i verziju nakon pregleda.',
      'Kada je primenljivo, navesti najmanje jednu prihvaćenu i jednu odbačenu sugestiju sa kratkim obrazloženjem.',
      'Ne unositi privatne podatke, tajne ili nerelevantan sadržaj projekta u spoljne alate.',
    ]),
  ]),
  page('3.6. Projektne instrukcije i kontekst', [
    text('h2', '3.6. Projektne instrukcije i kontekst'),
    text('paragraph', 'Prompt predstavlja konkretan zahtev u jednoj interakciji, dok projektne instrukcije čuvaju pravila koja treba da važe kroz više zadataka. Takva pravila mogu opisati arhitektonske granice, konvencije pisanja koda i obavezne provere. U ovoj fazi instrukcije su kratke i usmeravaju analizu; implementacione odluke i dalje prolaze kroz eksplicitnu proveru studenta.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Arhitektonska pravila\n- Poslovna pravila ne smeju biti u Presentation sloju.\n- Domain ne zavisi od Infrastructure.\n- Spoljne zavisnosti uvode se kroz ugovore i dependency injection.\n\n## Rad pre implementacije\n1. Sažmi zahtev svojim rečima.\n2. Navedi pogođene slojeve i rizike.\n3. Predloži plan i kriterijume verifikacije.\n4. Ne menjaj kod dok korisnik izričito ne zatraži implementaciju.\n\n## Verifikacija\n- Svaka promena mora da ima build/test ili drugi jasno naveden dokaz.`, 'Primer početnih projektnih instrukcija'),
    callout('warning', 'Instrukcija nije garancija', 'Tekstualno pravilo može biti pogrešno protumačeno ili preskočeno. Za zahteve koji moraju uvek da se sprovedu kasnije se uvode deterministički mehanizmi, kao što su hooks i guardrails.'),
  ]),
  page('3.7. Projektna kontrolna tačka P1', [
    text('h2', '3.7. Projektna kontrolna tačka P1 — problem, backlog i AI trag'),
    text('paragraph', 'Na prvoj projektnoj kontrolnoj tački tim ne predaje gotovu arhitekturu. Cilj je da se potvrdi da je problem dovoljno jasan, da postoji početni backlog i da se AI koristi transparentno kao podrška analizi i razmišljanju.'),
    table(['Artefakt', 'Minimalni sadržaj za P1'], [
      ['README', 'Opis problema, korisničke uloge, granice sistema i članovi tima.'],
      ['Product Backlog', 'Najmanje osam smislenih User Story-ja; prioritet i dovoljno konteksta za refinement.'],
      ['Kriterijumi prihvatanja', 'Uspešni, negativni i granični kriterijumi za najmanje tri važna User Story-ja.'],
      ['Tapiz Boards', 'Backlog i najmanje jedan sprint sa ciljem, odabranim stavkama i vidljivim statusom rada.'],
      ['AI_INSTRUCTIONS.md', 'Početna projektna pravila i ograničenja rada sa AI alatom.'],
      ['AI_USAGE.md', 'Najmanje jedna zabeležena analiza zahteva, odluka tima i način provere.'],
    ], 'Kontrolna tačka P1 povezuje zahtev, agilni razvojni trag i transparentnu upotrebu AI podrške.'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati jedan User Story i tražiti od AI alata isključivo pregled kriterijuma prihvatanja. Predati početnu i konačnu verziju kriterijuma i do 120 reči obrazloženja koje su sugestije prihvaćene ili odbačene i zbog čega.'),
  ]),
]
