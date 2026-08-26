import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise3 = (): DocumentPage[] => [
  page('Vežba 3 — Zahtevi, Scrum i rana AI podrška', [
    text('h1', 'Vežba 3 — Zahtevi, Scrum i rana AI podrška'),
    text('paragraph', 'Agilni razvoj polazi od pretpostavke da se razumevanje problema razvija zajedno sa proizvodom. Tim zato radi u kratkim iteracijama, održava uređenu listu potreba i redovno proverava ostvareni inkrement. AI se u ovoj fazi koristi kao pomoć pri razjašnjenju zahteva i uočavanju propuštenih scenarija, dok odgovornost za poslovna pravila, prioritete i konačne odluke ostaje na timu.'),
    table(['Scrum element', 'Svrha'], [
      ['Sprint', 'Fiksni vremenski okvir u kome nastaje proverljiv inkrement proizvoda.'],
      ['Product Backlog', 'Uređena i prilagodljiva lista potreba, funkcionalnosti i unapređenja proizvoda.'],
      ['Sprint Backlog', 'Izabrane stavke i plan rada kojima tim ostvaruje cilj tekućeg sprinta.'],
      ['Sprint Review', 'Pregled ostvarenog inkrementa i prilagođavanje narednih prioriteta.'],
      ['Retrospektiva', 'Analiza načina rada i dogovor o konkretnim poboljšanjima procesa tima.'],
    ]),
  ]),

  page('3.1. User Story i kriterijumi prihvatanja', [
    text('h2', '3.1. User Story i kriterijumi prihvatanja'),
    text('paragraph', 'User Story se često zapisuje obrascem „Kao [uloga], želim [cilj], kako bih [vrednost]“. Obrazac usmerava razgovor na korisnika i očekivanu vrednost, ali sam po sebi nije dovoljan. Kriterijumi prihvatanja određuju proverljivo ponašanje sistema i predstavljaju vezu između zahteva, testnog scenarija i implementacije.'),
    image('/course-assets/requirements-ai.svg', 'Od poslovne potrebe do proverljivog User Story-ja, kriterijuma prihvatanja i stručnog pregleda zahteva.', 'Tok od zahteva do proverljivog ponašanja'),
    callout('info', 'Primer User Story-ja', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za određeni termin, kako bih unapred znao da je oprema dostupna i sprečio dvostruku rezervaciju.'),
    table(['Vrsta kriterijuma', 'Primer'], [
      ['Uspešan scenario', 'Rezervacija se kreira kada je oprema slobodna, korisnik ovlašćen, a vremenski period validan.'],
      ['Konflikt termina', 'Sistem odbija zahtev kada se period preklapa sa postojećom aktivnom rezervacijom iste opreme.'],
      ['Nevažeći period', 'Sistem odbija zahtev kada početak termina nije pre njegovog kraja.'],
      ['Nedostupna oprema', 'Sistem vraća eksplicitan poslovni neuspeh kada je oprema označena kao nedostupna.'],
    ], 'Kriterijumi prihvatanja opisuju ponašanje koje se kasnije proverava testom ili demonstracionim scenarijem.'),
    callout('task', 'Rad na vežbi', 'Za jedan zahtev iz projektnog domena napisati User Story, najmanje dva uspešna i tri negativna ili granična kriterijuma prihvatanja. Za svaki kriterijum naznačiti način provere: jedinični test, integracioni test ili ručni demonstracioni scenario.'),
  ]),

  page('3.2. Product Backlog, Sprint Backlog i procena', [
    text('h2', '3.2. Product Backlog, dorada stavki i Story Points'),
    text('paragraph', 'Product Backlog predstavlja uređenu listu potreba proizvoda i menja se tokom razvoja. Dorada backlog-a (refinement) služi da se velike ili nedovoljno jasne stavke razlože, dopune kontekstom i pripreme za razgovor o obimu, kriterijumima prihvatanja i rizicima. Sprint Backlog zatim predstavlja konkretan plan rada za tekuću iteraciju.'),
    diagram('Od potrebe do rada u sprintu', [
      ['Problem', 'potreba korisnika ili ograničenje', 'slate'],
      ['Product Backlog', 'prioritet i početni opis', 'blue'],
      ['Dorada stavke', 'razlaganje, pitanja i kriterijumi', 'cyan'],
      ['Sprint Backlog', 'odabrane stavke i plan rada', 'violet'],
    ], 'Završene stavke na kraju sprinta čine proverljiv inkrement koji zadovoljava dogovorenu Definition of Done.'),
    text('paragraph', 'Story Points predstavljaju relativnu procenu napora, a ne broj radnih sati. Procena obuhvata složenost, količinu posla, neizvesnost i rizik. Njena najveća vrednost nalazi se u razgovoru tima: izrazito različite procene najčešće ukazuju na različito razumevanje iste stavke.'),
    list([
      'Story Points ne koristiti kao meru produktivnosti pojedinačnog člana tima.',
      'Veliku ili nejasnu stavku najpre razložiti; broj poena nije zamena za razumevanje zahteva.',
      'Definition of Done treba da obuhvati kvalitet: uspešnu izgradnju projekta, testove, pregled koda i potrebnu dokumentaciju.',
      'Cilj sprinta je potencijalno upotrebljiv inkrement, a ne zbir nedovršenih grana i parcijalnih promena.',
    ]),
  ]),

  page('3.3. Tapiz Boards: tim i backlog', [
    text('h2', '3.3. Tapiz Boards: tim, backlog i User Story'),
    text('paragraph', 'Tapiz Boards se na vežbi koristi kao konkretno okruženje u kome se Scrum artefakti povezuju sa svakodnevnim radom tima. Nakon izbora predmeta student pristupa svom timu, a zatim kroz zajednički backlog vidi, dopunjava i prioritetizuje stavke koje predstavljaju potrebe projekta.'),
    image('/course-assets/tapiz-team-backlog.svg', 'Pregled tima i Product Backlog-a u Tapiz Boards-u: stavke imaju naziv, opis, relativnu procenu i kontekst potreban za planiranje.', 'Tapiz Boards — tim i Product Backlog'),
    text('paragraph', 'Backlog treba da ostane čitljiv i drugom članu tima koji nije učestvovao u pisanju stavke. Naslov saopštava predmet promene, opis daje poslovni kontekst, a procena i prioritet pomažu pri planiranju. Kartica sa kratkim nazivom nije automatski kvalitetan User Story; ključna pravila i kriterijumi prihvatanja moraju biti eksplicitno zabeleženi.'),
    callout('note', 'Kriterijumi prihvatanja u alatu', 'Ako interfejs nema zasebno polje za kriterijume prihvatanja, tim ih zapisuje jasno i strukturirano u opisu stavke ili drugom unapred dogovorenom delu zapisa. Važno je da kriterijumi ostanu vidljivi, proverljivi i povezani sa odgovarajućim User Story-jem.'),
  ]),

  page('3.4. Tapiz Boards: sprint, zadatak i radna tabla', [
    text('h2', '3.4. Od User Story-ja do sprinta u Tapiz Boards-u'),
    text('paragraph', 'Kada su prioriteti dovoljno jasni, tim kreira sprint i bira stavke koje podržavaju njegov cilj. Za sprint se definišu naziv, vremenski okvir i cilj. Ove informacije ne predstavljaju administrativni dodatak: cilj sprinta treba da objasni koji proverljiv napredak tim očekuje na kraju iteracije.'),
    image('/course-assets/tapiz-sprint-create.svg', 'Kreiranje sprinta zahteva smislen naziv, trajanje i jasan cilj koji povezuje odabrane backlog stavke u koherentnu iteraciju.', 'Tapiz Boards — kreiranje sprinta'),
    text('h3', '3.4.1. Razlaganje rada na zadatke'),
    text('paragraph', 'User Story opisuje korisnički smislen rezultat, dok zadatak predstavlja konkretniji deo rada potreban da bi se taj rezultat ostvario. Razlaganje je korisno kada olakšava paralelan rad, proveru napretka ili jasnije razdvaja odgovornosti. Preterano usitnjavanje stvara administrativni trošak i otežava sagledavanje korisničke vrednosti.'),
    image('/course-assets/tapiz-task-detail.svg', 'Detalj zadatka povezuje opis rada, status, učesnike, procenu, komentare, veze sa drugim stavkama i istoriju izmena.', 'Tapiz Boards — detalj zadatka'),
    text('h3', '3.4.2. Radna tabla i tok kroz sprint'),
    text('paragraph', 'Radna tabla daje transparentan prikaz stanja rada tokom sprinta. Kolona nije samo vizuelna oznaka: prelazak stavke treba da odgovara dogovorenom procesu tima. Stavka se ne smatra završenom zato što je prevučena u poslednju kolonu, već kada ispunjava Definition of Done i postoji odgovarajući dokaz provere.'),
    image('/course-assets/tapiz-board.svg', 'Radna tabla prikazuje tok stavki kroz sprint i omogućava timu da uoči rad koji čeka, rad u toku, stavke na pregledu i završene stavke.', 'Tapiz Boards — radna tabla sprinta'),
    list([
      'Naziv stavke treba da jasno označi predmet promene; generički nazivi poput „popravke“ ili „izmena“ nisu dovoljni.',
      'Opis sadrži kontekst potreban za razumevanje zahteva, a ne dnevnik implementacionih detalja.',
      'Komentari i istorija izmena dopunjuju saradnju, ali važne arhitektonske i poslovne odluke treba preneti i u trajnu projektnu dokumentaciju.',
      'Status na radnoj tabli mora odgovarati stvarnom stanju rada i dogovorenom kriterijumu završetka.',
    ]),
    callout('task', 'Rad na vežbi u Tapiz Boards-u', 'Kreirati najmanje jedan smislen User Story iz sopstvenog projektnog domena, dopuniti ga kriterijumima prihvatanja, proceniti relativni napor i rasporediti ga u sprint. Zatim razložiti rad na manje zadatke samo tamo gde takva podela olakšava planiranje ili proveru.'),
  ]),

  page('3.5. AI kao pomoć u razjašnjenju zahteva', [
    text('h2', '3.5. AI kao pomoć u razjašnjenju zahteva'),
    text('paragraph', 'AI alat može biti koristan tokom analize zahteva ako dobije relevantan kontekst i jasno ograničen zadatak. Umesto zahteva da generiše kompletno rešenje, modelu se može zadati da pregleda konkretan User Story, identifikuje nejasnoće i predloži dodatna pitanja ili negativne scenarije. Tim zatim proverava predloge u odnosu na stvarni domen i odlučuje koje će prihvatiti.'),
    code('markdown', `# Zadatak\nPregledaj User Story i kriterijume prihvatanja. Nemoj generisati kod.\n\n# Kontekst\n- Sistem rezerviše fakultetsku opremu.\n- Jedna oprema ne sme imati preklapajuće aktivne rezervacije.\n- Termin mora biti u budućnosti.\n- Samo ovlašćeni korisnik može rezervisati.\n\n# Očekivani izlaz\n1. Nejasnoće koje treba razjasniti.\n2. Nedostajući negativni i granični scenariji.\n3. Predlog proverljivih kriterijuma prihvatanja.\n4. Bez implementacionih detalja i bez koda.`, 'Ograničen zadatak za analizu zahteva'),
    callout('note', 'Granica odgovornosti AI podrške', 'Predlog modela nije poslovna odluka. Njegova vrednost je u tome da ukaže na moguće nejasnoće i propuštene scenarije; tim procenjuje svaki predlog u kontekstu problema i beleži konačnu odluku.'),
    list([
      'Sačuvati početnu formulaciju zahteva i verziju nakon pregleda.',
      'Kada je primenljivo, navesti najmanje jednu prihvaćenu i jednu odbačenu sugestiju sa kratkim obrazloženjem.',
      'Ne unositi privatne podatke, tajne ili nerelevantan sadržaj projekta u spoljne alate.',
    ]),
  ]),

  page('3.6. Projektne instrukcije i kontekst', [
    text('h2', '3.6. Projektne instrukcije i kontekst'),
    text('paragraph', 'Prompt predstavlja konkretan zahtev u jednoj interakciji, dok projektne instrukcije čuvaju stabilna pravila koja treba da važe kroz više zadataka. Takva pravila mogu opisati arhitektonske granice, konvencije pisanja koda i obavezne provere. U ovoj fazi instrukcije prvenstveno usmeravaju analizu; implementacione odluke i dalje prolaze kroz eksplicitnu proveru studenta.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Arhitektonska pravila\n- Poslovna pravila ne smeju biti u Presentation sloju.\n- Domain ne zavisi od Infrastructure.\n- Spoljne zavisnosti uvode se kroz ugovore i dependency injection.\n\n## Rad pre implementacije\n1. Sažmi zahtev svojim rečima.\n2. Navedi pogođene slojeve i rizike.\n3. Predloži plan i kriterijume verifikacije.\n4. Ne menjaj kod dok korisnik izričito ne zatraži implementaciju.\n\n## Verifikacija\n- Svaka promena mora imati uspešnu izgradnju, test ili drugi jasno naveden dokaz.`, 'Primer početnih projektnih instrukcija'),
    callout('warning', 'Instrukcija nije garancija', 'Tekstualno pravilo može biti pogrešno protumačeno ili preskočeno. Za zahteve koji moraju uvek da se sprovedu kasnije se uvode deterministički mehanizmi, kao što su hooks i guardrails.'),
  ]),

  page('3.7. Projektna kontrolna tačka P1', [
    text('h2', '3.7. Projektna kontrolna tačka P1 — problem, backlog i trag upotrebe AI podrške'),
    text('paragraph', 'Na prvoj projektnoj kontrolnoj tački tim ne predaje gotovu arhitekturu. Cilj je da se potvrdi da je problem dovoljno jasan, da postoji početni backlog, da je rad organizovan u Tapiz Boards-u i da se AI koristi transparentno kao podrška analizi zahteva.'),
    table(['Artefakt', 'Minimalni sadržaj za P1'], [
      ['README', 'Opis problema, korisničke uloge, granice sistema i članovi tima.'],
      ['Product Backlog', 'Najmanje osam smislenih User Story-ja sa prioritetom i dovoljnim kontekstom za doradu.'],
      ['Kriterijumi prihvatanja', 'Uspešni, negativni i granični kriterijumi za najmanje tri važna User Story-ja.'],
      ['Tapiz Boards', 'Backlog i najmanje jedan sprint sa ciljem, odabranim stavkama i vidljivim tokom rada.'],
      ['AI_INSTRUCTIONS.md', 'Početna projektna pravila i ograničenja rada sa AI alatom.'],
      ['AI_USAGE.md', 'Najmanje jedna zabeležena analiza zahteva, odluka tima i način nezavisne provere.'],
    ], 'Kontrolna tačka P1 povezuje zahtev, agilni razvojni trag i transparentnu upotrebu AI podrške.'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati jedan User Story i tražiti od AI alata isključivo pregled kriterijuma prihvatanja. Predati početnu i konačnu verziju kriterijuma i do 120 reči obrazloženja koje su sugestije prihvaćene ili odbačene i zbog čega.'),
  ]),
]
