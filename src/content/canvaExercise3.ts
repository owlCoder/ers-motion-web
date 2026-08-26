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
    text('paragraph', 'User Story je sažet zapis potrebe korisnika ili drugog učesnika u procesu. Njegova svrha nije da unapred propiše tehničku implementaciju, već da jasno odredi očekivani rezultat i vrednost koju taj rezultat donosi. Često se zapisuje obrascem „Kao [uloga], želim [cilj], kako bih [vrednost]“, koji predstavlja polaznu tačku za razgovor, procenu i proveru rezultata.'),
    image('/course-assets/requirements-ai.svg', 'Od poslovne potrebe do proverljivog User Story-ja, kriterijuma prihvatanja i stručnog pregleda zahteva.', 'Tok od zahteva do proverljivog ponašanja'),
    callout('info', 'Primer User Story-ja', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za određeni termin, kako bih unapred znao da je oprema dostupna i sprečio dvostruku rezervaciju.'),
    text('paragraph', 'Kriterijumi prihvatanja pretvaraju opšti zahtev u skup proverljivih uslova. Njihova uloga je da timu omoguće zajedničko razumevanje trenutka u kome se funkcionalnost može smatrati prihvaćenom i da obezbede jasnu vezu između zahteva, testnog scenarija i demonstracije ponašanja sistema.'),
    table(['Vrsta kriterijuma', 'Primer'], [
      ['Uspešan scenario', 'Rezervacija se kreira kada je oprema slobodna, korisnik ovlašćen, a vremenski period validan.'],
      ['Konflikt termina', 'Sistem odbija zahtev kada se period preklapa sa postojećom aktivnom rezervacijom iste opreme.'],
      ['Nevažeći period', 'Sistem odbija zahtev kada početak termina nije pre njegovog kraja.'],
      ['Nedostupna oprema', 'Sistem vraća eksplicitan poslovni neuspeh kada je oprema označena kao nedostupna.'],
    ], 'Primeri kriterijuma prihvatanja koji se kasnije proveravaju testom ili demonstracionim scenarijem.'),
    callout('task', 'Rad na vežbi', 'Za jedan zahtev iz projektnog domena napisati User Story, najmanje dva uspešna i tri negativna ili granična kriterijuma prihvatanja. Za svaki kriterijum naznačiti način provere: jedinični test, integracioni test ili ručni demonstracioni scenario.'),
  ]),

  page('3.2. Product Backlog, Sprint Backlog i procena', [
    text('h2', '3.2. Product Backlog, dorada stavki i Story Points'),
    text('paragraph', 'Product Backlog nije arhiva ideja, već uređena lista rada koja se menja tokom razvoja. Dorada stavki (refinement) služi da se veliki ili nedovoljno jasni zahtevi razlože, dopune kontekstom i pripreme za razgovor o obimu, kriterijumima prihvatanja i rizicima. Sprint Backlog predstavlja izbor stavki i plan rada za konkretnu iteraciju.'),
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

  page('3.3. Tapiz Boards: backlog i User Story', [
    text('h2', '3.3. Tapiz Boards: backlog i User Story'),
    text('paragraph', 'Tapiz Boards se na vežbi koristi kao konkretno okruženje u kome se agilni artefakti povezuju sa svakodnevnim radom tima. Na početku je važno razlikovati sam alat od procesa koji alat podržava: kvalitet zahteva ne određuje izgled kartice, već jasnoća cilja, poslovni kontekst, prioritet i mogućnost provere rezultata.'),
    image('/course-assets/tapiz/03-backlog-view.png', 'Pregled Product Backlog-a u stvarnom Tapiz Boards okruženju. Backlog omogućava timu da na jednom mestu sagleda stavke koje čekaju doradu, procenu ili izbor za naredni sprint.', 'Tapiz Boards — Product Backlog'),
    text('paragraph', 'Backlog treba da bude dovoljno jasan da drugi član tima može da razume predmet rada i bez dodatnog usmenog objašnjenja. Uređivanje prioriteta, procene i sadržaja stavke predstavlja deo planiranja, a ne administrativnu formalnost. Premeštanje stavke iz backloga u sprint zato predstavlja odluku o tome šta tim namerava da isporuči u narednoj iteraciji.'),
    text('h3', '3.3.1. Detalj User Story-ja'),
    image('/course-assets/tapiz/04-user-story-detail.png', 'Detalj User Story-ja prikazuje stvarne podatke koje Tapiz Boards nudi za opis, planiranje i praćenje stavke.', 'Tapiz Boards — detalj User Story-ja'),
    text('paragraph', 'User Story opisuje jednu korisnički smislenu i isporučivu funkcionalnost. Naslov treba da bude sažet, dok opis čuva kontekst potreban za razumevanje zahteva. Podaci o statusu, proceni, zaduženju i vremenskom okviru služe planiranju i praćenju rada, ali ne zamenjuju poslovno značenje same stavke.'),
    image('/course-assets/tapiz/05-create-or-edit-story.png', 'Forma za kreiranje ili izmenu stavke koristi se za dosledno evidentiranje zahteva i podataka potrebnih timu za planiranje.', 'Tapiz Boards — kreiranje i izmena User Story-ja'),
    text('h3', '3.3.2. Kriterijumi prihvatanja i kontrolna lista'),
    image('/course-assets/tapiz/06-acceptance-criteria-example.png', 'Kontrolna lista može da posluži za jasno evidentiranje proverljivih uslova ili koraka kada interfejs nema posebno polje za kriterijume prihvatanja.', 'Tapiz Boards — proverljivi uslovi kroz kontrolnu listu'),
    callout('note', 'Ograničenje trenutnog interfejsa', 'U trenutnoj verziji Tapiz Boards-a ne postoji zasebno polje pod nazivom „kriterijumi prihvatanja“. Tim zato kriterijume zapisuje strukturirano u opisu stavke ili, kada to odgovara prirodi zahteva, kroz kontrolnu listu. Bitno je da kriterijumi ostanu eksplicitni, proverljivi i povezani sa odgovarajućim User Story-jem.'),
  ]),

  page('3.4. Tapiz Boards: razlaganje rada i tok kroz sprint', [
    text('h2', '3.4. Razlaganje rada i tok kroz sprint u Tapiz Boards-u'),
    text('paragraph', 'Epika obuhvata širu poslovnu ili korisničku oblast, User Story opisuje jednu smislenu funkcionalnost, a zadatak predstavlja konkretan korak u realizaciji. Razlaganjem se veliki zahtev pretvara u jedinice koje tim može da proceni, dodeli i prati bez gubitka veze sa prvobitnim ciljem.'),
    image('/course-assets/tapiz/07-task-breakdown.png', 'Primer razlaganja rada na konkretnije zadatke koji se mogu dodeliti, pratiti i proveravati u okviru šireg zahteva.', 'Tapiz Boards — razlaganje rada na zadatke'),
    text('paragraph', 'Razlaganje je korisno kada olakšava paralelan rad, proveru napretka ili jasnije razdvaja odgovornosti. Preterano usitnjavanje, međutim, povećava administrativni trošak i otežava sagledavanje korisničke vrednosti. Zadatak treba da postoji zato što pomaže realizaciji User Story-ja, a ne samo da bi tabla sadržala veći broj kartica.'),
    text('h3', '3.4.1. Radna tabla kao prikaz procesa'),
    image('/course-assets/tapiz/02-board-overview.png', 'Pregled radne table u Tapiz Boards-u omogućava timu da prati raspored stavki i trenutno stanje rada u okviru izabrane iteracije.', 'Tapiz Boards — pregled radne table'),
    image('/course-assets/tapiz/08-workflow-transition.png', 'Promena statusa predstavlja prelazak stavke kroz dogovorene faze procesa, a ne samo promenu njenog vizuelnog položaja na tabli.', 'Tapiz Boards — promena statusa i tok rada'),
    text('paragraph', 'Statusna kolona opisuje fazu dogovorenog procesa. Prelazak stavke iz početnog statusa u rad, pregled i završeno stanje treba da odgovara stvarnom napretku. Stavka se ne smatra završenom samo zato što se nalazi u poslednjoj koloni, već kada ispunjava Definition of Done i postoji odgovarajući dokaz provere.'),
    text('h3', '3.4.2. Prioritet, zaduženje i vremenski okvir'),
    image('/course-assets/tapiz/09-priority-labels-assignees.png', 'Prioritet, zaduženje i drugi raspoloživi podaci o stavci pomažu timu da razlikuje važnost rada, odgovornost i očekivani vremenski okvir.', 'Tapiz Boards — prioritet i zaduženje'),
    text('paragraph', 'Prioritet određuje relativnu važnost stavke, zaduženje povezuje rad sa odgovornom osobom, a vremenski podaci olakšavaju planiranje. Ovi elementi ne menjaju poslovni sadržaj zahteva, ali čine raspodelu rada i obaveze tima vidljivijim.'),
    text('h3', '3.4.3. Komentari i istorija aktivnosti'),
    image('/course-assets/tapiz/10-activity-comments.png', 'Komentari i hronologija aktivnosti čuvaju kontekst saradnje i omogućavaju timu da naknadno rekonstruiše važne promene na stavci.', 'Tapiz Boards — komentari i istorija aktivnosti'),
    text('paragraph', 'Trag aktivnosti je koristan kada se tim vraća na raniji dogovor, objašnjava razlog promene statusa ili analizira kako je zahtev prolazio kroz različite faze rada. Važne poslovne i arhitektonske odluke ipak treba preneti i u trajnu projektnu dokumentaciju, jer komentar u alatu nije zamena za dokumentovanu odluku.'),
    callout('task', 'Rad na vežbi u Tapiz Boards-u', 'Kreirati najmanje jedan smislen User Story iz sopstvenog projektnog domena, dopuniti ga proverljivim kriterijumima, proceniti relativni napor i uključiti ga u plan rada. Zatim razložiti rad na manje zadatke samo tamo gde takva podela olakšava planiranje, raspodelu odgovornosti ili proveru rezultata.'),
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
      ['Tapiz Boards', 'Backlog i najmanje jedan aktivni plan rada sa vidljivim tokom stavki.'],
      ['AI_INSTRUCTIONS.md', 'Početna projektna pravila i ograničenja rada sa AI alatom.'],
      ['AI_USAGE.md', 'Najmanje jedna zabeležena analiza zahteva, odluka tima i način nezavisne provere.'],
    ], 'Kontrolna tačka P1 povezuje zahtev, agilni razvojni trag i transparentnu upotrebu AI podrške.'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati jedan User Story i tražiti od AI alata isključivo pregled kriterijuma prihvatanja. Predati početnu i konačnu verziju kriterijuma i do 120 reči obrazloženja koje su sugestije prihvaćene ili odbačene i zbog čega.'),
  ]),
]
