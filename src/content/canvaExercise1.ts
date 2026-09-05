import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise1 = (): DocumentPage[] => [
  page('Vežba 1 — Zahtevi, backlog, Git i timski razvoj', [
    text('h1', 'Vežba 1 — Zahtevi, backlog, Git i timski razvoj'),
    text('paragraph', 'Razvoj softvera počinje razumevanjem problema, ali se kvalitet tog razumevanja potvrđuje tek kada zahtev postane proverljiva promena u proizvodu. U ovoj vežbi zahtevi, planiranje rada i Git ne posmatraju se kao odvojene teme. Oni čine jedan razvojni tok: poslovna potreba se oblikuje kao stavka u backlog-u, razrađuje kroz kriterijume prihvatanja, implementira na izdvojenoj grani, pregleda kroz pull request i integriše tek nakon provere.'),
    diagram('Od zahteva do integrisane promene', [
      ['Potreba', 'problem ili korisnička vrednost', 'slate'],
      ['Backlog', 'prioritet, opis i kriterijumi', 'cyan'],
      ['Grana', 'izolovana implementacija', 'blue'],
      ['Pull request', 'pregled, testovi i diskusija', 'violet'],
      ['Integracija', 'proverena promena u glavnoj grani', 'emerald'],
    ], 'Razvojni trag treba da omogući timu da poveže zahtev, odluku, implementaciju i proveru rezultata.'),
    callout('info', 'Osnovna ideja', 'Git istorija nije rezervna kopija završnog rešenja. Backlog nije spisak želja. Pull request nije formalnost. Svaki od ovih elemenata predstavlja deo proverljivog procesa razvoja.'),
  ]),

  page('1.1. User Story i kriterijumi prihvatanja', [
    text('h2', '1.1. User Story i kriterijumi prihvatanja'),
    text('paragraph', 'User Story predstavlja sažet zapis potrebe korisnika ili drugog učesnika u poslovnom procesu. Njegova svrha nije da unapred propiše klasu, tabelu ili tehnološko rešenje, već da jasno odredi kome je funkcionalnost potrebna, koji rezultat se očekuje i zbog čega taj rezultat ima vrednost.'),
    callout('info', 'Primer', 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za određeni termin, kako bih unapred znao da je oprema dostupna i sprečio dvostruku rezervaciju.'),
    text('paragraph', 'Kriterijumi prihvatanja pretvaraju opšti zahtev u skup uslova koji mogu da se provere testom ili demonstracionim scenarijem. Dobro napisan kriterijum opisuje spolja vidljivo ponašanje sistema i izbegava nepotrebno vezivanje za detalje implementacije.'),
    table(['Vrsta scenarija', 'Primer kriterijuma'], [
      ['Uspešan tok', 'Rezervacija se kreira kada je oprema dostupna, korisnik ovlašćen, a vremenski period ispravan.'],
      ['Poslovni konflikt', 'Sistem odbija zahtev kada se period preklapa sa postojećom aktivnom rezervacijom iste opreme.'],
      ['Neispravan ulaz', 'Sistem odbija zahtev kada početak termina nije pre njegovog kraja.'],
      ['Granični slučaj', 'Pravilo mora jasno da odredi da li nova rezervacija može početi tačno u trenutku završetka prethodne.'],
    ]),
    callout('task', 'Rad na vežbi', 'Za jednu stavku projektnog domena napisati User Story, najmanje dva uspešna i tri negativna ili granična kriterijuma prihvatanja. Za svaki kriterijum navesti kako će se proveriti.'),
  ]),

  page('1.2. Backlog, Tapiz Boards i plan rada', [
    text('h2', '1.2. Backlog, Tapiz Boards i plan rada'),
    text('paragraph', 'Backlog je uređena lista rada, a ne arhiva nepovezanih ideja. Stavka koja ulazi u aktivan rad treba da ima dovoljno jasan cilj, prioritet, kriterijume prihvatanja i poznata ograničenja da tim može da proceni njen obim i započne implementaciju bez nagađanja o osnovnom poslovnom smislu.'),
    image('/course-assets/tapiz/03-backlog-view.webp', 'Product Backlog u Tapiz Boards-u omogućava timu da sagleda prioritete, stanje pripreme i plan narednog rada.', 'Tapiz Boards — pregled backlog-a'),
    table(['Status', 'Značenje'], [
      ['Backlog', 'Stavka postoji, ali još nije spremna za neposredan rad.'],
      ['Ready', 'Cilj, kriterijumi i osnovna ograničenja su dovoljno jasni za početak rada.'],
      ['In Progress', 'Implementacija je u toku i postoji odgovorna osoba ili par.'],
      ['Code Review', 'Promena je implementirana i čeka stručni pregled koda.'],
      ['QA/Verify', 'Proverava se ponašanje sistema u odnosu na kriterijume prihvatanja.'],
      ['Done', 'Promena je integrisana i ispunjava dogovorenu Definition of Done.'],
    ]),
    image('/course-assets/tapiz/02-board-overview.webp', 'Radna tabla prikazuje stvarno stanje stavki u dogovorenom razvojnom procesu.', 'Tapiz Boards — tok rada'),
    callout('note', 'Status mora odgovarati stvarnom stanju', 'Kartica se ne smatra završenom zato što je ručno premeštena u poslednju kolonu. Status Done znači da su ispunjeni kriterijumi prihvatanja, izvršene potrebne provere i integrisana odgovarajuća promena u repozitorijumu.'),
  ]),

  page('1.3. Git kao sledljiv zapis razvoja', [
    text('h2', '1.3. Git kao sledljiv zapis razvoja'),
    text('paragraph', 'Git omogućava da se razvoj rekonstruiše kroz male i smislene promene. Radno stablo sadrži trenutne izmene, staging area određuje šta ulazi u naredni commit, a commit predstavlja imenovanu tačku istorije. U timskom radu posebna grana izdvaja jednu promenu od stabilne glavne grane.'),
    table(['Pojam', 'Uloga u radu tima'], [
      ['Working tree', 'Datoteke koje se trenutno menjaju.'],
      ['Staging area', 'Izbor sadržaja koji će ući u naredni commit.'],
      ['Commit', 'Koherentna promena sa porukom koja opisuje njenu nameru.'],
      ['Branch', 'Izdvojena linija razvoja za jednu funkcionalnost, ispravku ili drugi ograničen posao.'],
      ['Remote', 'Udaljeni repozitorijum preko kog tim razmenjuje promene.'],
    ]),
    code('bash', `git status\ngit diff\ngit add src/Application/ReservationService.cs\ngit add tests/ReservationServiceTests.cs\ngit diff --staged\ngit commit -m "Add reservation overlap rule"\ngit push -u origin feature/reservation-overlap`, 'Primer malog i proverljivog razvojnog koraka'),
    list([
      'Pre commit-a pregledati pripremljeni diff i razumeti svaku uključenu promenu.',
      'Jedan commit treba da predstavlja jednu koherentnu nameru kad god je to praktično moguće.',
      'Promene koje nisu povezane sa ciljem stavke ne treba usput uključivati u isti pull request.',
      'Glavna grana treba da ostane stabilna i spremna za zajednički rad tima.',
    ]),
  ]),

  page('1.4. Pull request, pregled koda i konflikti', [
    text('h2', '1.4. Pull request, pregled koda i konflikti'),
    text('paragraph', 'Pull request je mesto na kome se zahtev povezuje sa konkretnom implementacijom. Pregledalac proverava da li je promena u odgovarajućem obimu, da li poštuje arhitektonska pravila, da li postoje potrebni testovi i da li se iz diff-a može razumeti namera autora. Tek nakon pregleda i provere promena se integriše u glavnu granu.'),
    diagram('Tok jedne promene', [
      ['Stavka', 'jasan cilj i kriterijumi', 'slate'],
      ['Grana', 'ograničena implementacija', 'cyan'],
      ['Commit-i', 'smisleni razvojni koraci', 'blue'],
      ['Pregled', 'kod, testovi i rizici', 'amber'],
      ['QA i merge', 'provereno ponašanje i integracija', 'emerald'],
    ], 'Pull request povezuje poslovni zahtev sa implementacijom i dokazima provere.'),
    text('paragraph', 'Konflikt pri spajanju nastaje kada Git ne može samostalno da odredi konačni sadržaj. Rešavanje konflikta nije uklanjanje tehničkih markera, već odluka o tome koje ponašanje treba da ostane nakon spajanja paralelnih promena.'),
    code('bash', `git checkout main\ngit pull\ngit checkout feature/reservation-overlap\ngit merge main\n# rešiti konflikt i pregledati konačan diff\ngit add src/Application/ReservationService.cs\ngit commit -m "Resolve reservation rule conflict"\ndotnet test`, 'Rešavanje konflikta uz završnu proveru'),
    callout('warning', 'Prepisivanje zajedničke istorije', '`git push --force` nije deo uobičajenog timskog toka. Na deljenim granama može ukloniti tuđe commit-e i koristi se samo kada tim razume posledice i postoji opravdan razlog.'),
  ]),

  page('1.5. Prva projektna kontrolna tačka P1', [
    text('h2', '1.5. Projektna kontrolna tačka P1 — problem, backlog i razvojni tok'),
    text('paragraph', 'Na prvoj kontrolnoj tački ne očekuje se završena arhitektura ni veliki obim implementacije. Potrebno je pokazati da tim razume problem, da rad može da se planira kroz proverljive stavke i da repozitorijum već predstavlja stvarni trag zajedničkog razvoja.'),
    list([
      'Postoji zajednički projektni repozitorijum sa početnim README dokumentom i odgovarajućim pristupom članova tima.',
      'Tapiz Boards sadrži početni backlog sa prioritetima i jasno izdvojenim stavkama spremnim za rad.',
      'Najmanje jedna stavka ima proverljive kriterijume prihvatanja i povezana je sa konkretnom granom ili pull request-om.',
      'Tim koristi dogovoreni tok Backlog → Ready → In Progress → Code Review → QA/Verify → Done.',
      'Najmanje jedan pull request pokazuje pregled diff-a, rezultat provere i smislen razgovor o promeni.',
      'Ako je AI alat korišćen pri analizi zahteva, tim može da objasni šta je prihvaćeno, šta je odbačeno i kako je rezultat proveravan.'),
    callout('success', 'Ishod vežbe', 'Student ume da poveže zahtev, backlog, Git istoriju, pull request i proveru ponašanja u jedan sledljiv razvojni proces.'),
  ]),
]
