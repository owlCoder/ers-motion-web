import type { CourseDocument, DocumentPage } from '../types'
import { callout, code, diagram, image, list, page, table, text } from './canvaPracticumShared'

const projectPages = (): DocumentPage[] => [
  page('1. Tema i cilj projekta', [
    text('h1', '1. Tema i cilj projekta'),
    text('paragraph', 'Semestralni projekat ima jednu zajedničku temu: razvoj integrisanog poslovnog informacionog sistema za rad jedne organizacije. Svi studenti rade na istom proizvodu i u istom repozitorijumu, a posao je podeljen između više timova koji preuzimaju odgovornost za različite module sistema.'),
    callout('info', 'Jedna tema, jedan proizvod', 'Moduli navedeni u ovom dokumentu nisu različite projektne teme. Oni su delovi istog informacionog sistema i moraju na kraju da funkcionišu kao jedna celina.'),
    diagram('Organizacija projekta', [
      ['Zajednički proizvod', 'Jedan repozitorijum i jedna integrisana aplikacija', 'blue'],
      ['Timski moduli', 'Svaki tim je odgovoran za određeni deo sistema', 'violet'],
      ['Zajednička platforma', 'Autentifikacija, autorizacija, infrastruktura i zajedničke tehničke potrebe', 'cyan'],
      ['Integracija', 'Timovi usaglašavaju ugovore i proveravaju međusobne zavisnosti', 'emerald'],
    ], 'Cilj je da studenti iskuse razvoj većeg sistema u kome promene jednog tima mogu da utiču na druge timove.'),
    callout('warning', 'Odnos prema Specifikaciji', 'Tab Specifikacija sadrži zvanične uslove za izradu, predaju i odbranu projekta. Ovaj dokument opisuje konkretnu organizaciju zajedničkog projekta. Ako se dva dokumenta različito tumače, primenjuje se Specifikacija.'),
  ]),

  page('2. Moduli zajedničkog proizvoda', [
    text('h1', '2. Moduli zajedničkog proizvoda'),
    text('paragraph', 'Zajednički informacioni sistem sastoji se od više poslovnih i tehničkih modula. Konačna raspodela zavisi od broja studenata i timova, ali tema projekta ostaje ista. Pojedini moduli mogu da se spoje ili podele kada je to potrebno da bi obim rada bio uravnotežen.'),
    table(['Modul', 'Primer odgovornosti'], [
      ['Finansije', 'Fakture, prihodi, rashodi, obračuni i finansijski izveštaji.'],
      ['Podrška korisnicima', 'Korisnički zahtevi, komentari, statusi, prioriteti, rokovi odgovora i eskalacije.'],
      ['Odnosi sa klijentima (CRM)', 'Klijenti, kontakti, poslovne prilike i istorija komunikacije.'],
      ['Zalihe i skladište', 'Artikli, skladišta, stanje zaliha, ulaz, izlaz i rezervacije.'],
      ['Ljudski resursi', 'Zaposleni, organizacione jedinice, odsustva i osnovni podaci o angažovanju.'],
      ['Projekti i radni zadaci', 'Projekti, zadaci, članovi, evidencija rada i rokovi.'],
      ['Platforma', 'Autentifikacija, autorizacija, obaveštenja, evidencija aktivnosti i zajednička infrastruktura.'],
      ['Izveštavanje i analitika', 'Pregledi, pokazatelji, agregacije i izveštaji nad podacima iz više modula.'],
    ]),
    callout('note', 'Modul nije zaseban projekat', 'Tim može samostalno da razvija svoj modul, ali mora da poštuje zajedničku arhitekturu i dogovorene ugovore sa drugim delovima sistema. Završni rezultat se ocenjuje kao deo zajedničkog proizvoda.'),
  ]),

  page('3. Timovi i odgovornosti', [
    text('h1', '3. Timovi i odgovornosti'),
    text('paragraph', 'Tim okvirno ima od 6 do 10 članova. Broj članova može da se prilagodi veličini grupe. Svaki tim ima vlasništvo nad svojim modulom, ali svi članovi moraju da učestvuju u razvoju i da razumeju ključne odluke koje utiču na njihov deo sistema.'),
    table(['Odgovornost', 'Šta se očekuje'], [
      ['Koordinacija', 'Praćenje obaveza, zavisnosti i dogovora sa drugim timovima.'],
      ['Razvoj funkcionalnosti', 'Implementacija poslovnih zahteva uz odgovarajuće testove.'],
      ['Pregled koda', 'Provera čitljivosti, dizajna, ispravnosti i uticaja promene na ostatak sistema.'],
      ['Provera kvaliteta', 'Provera kriterijuma prihvatanja, negativnih scenarija i regresija.'],
      ['Automatizacija', 'Uvođenje korisne automatizovane provere ili postupka koji timu štedi vreme i smanjuje mogućnost greške.'],
    ]),
    callout('warning', 'Odgovornosti se rotiraju', 'Ne uvode se trajne uloge u kojima jedan student tokom celog semestra radi samo testiranje, dokumentaciju ili automatizaciju. Svaki student mora da ima merljiv doprinos razvoju i da na odbrani ume da objasni svoj rad.'),
  ]),

  page('4. Tapiz Boards i tok zadatka', [
    text('h1', '4. Tapiz Boards i tok zadatka'),
    text('paragraph', 'Svaki tim vodi svoj operativni backlog u Tapiz Boards. Tabla treba da prikazuje stvarno stanje rada, a ne da se popunjava naknadno pred kontrolnu tačku. Korisnička priča opisuje poslovnu vrednost, dok zadaci opisuju konkretan razvojni ili verifikacioni posao.'),
    image('/course-assets/tapiz-team-backlog.svg', 'Primer timskog backlog-a. Pravila iz praktikuma o korisničkim pričama, kriterijumima prihvatanja, prioritetima i procenama ostaju obavezna.', 'Tapiz Boards — timski backlog'),
    table(['Status', 'Značenje'], [
      ['Backlog', 'Zahtev postoji, ali još nije spreman za rad.'],
      ['Spremno', 'Zahtev je dovoljno jasan, ima kriterijume prihvatanja i može da se preuzme.'],
      ['U radu', 'Rad je započet i postoji odgovorna osoba.'],
      ['Pregled koda', 'Implementacija je završena i čeka tehničku proveru drugog člana.'],
      ['Provera', 'Proveravaju se kriterijumi prihvatanja, testovi i integracija.'],
      ['Završeno', 'Promena je spojena, proverena i ispunjava zajedničke kriterijume završetka.'],
    ]),
    callout('task', 'Povezivanje rada', 'Grana, commit ili zahtev za spajanje treba da može da se poveže sa odgovarajućom stavkom na Tapiz tabli. Na osnovu table mora da bude moguće da se razume šta je urađeno, ko je radio i kako je promena proverena.'),
  ]),

  page('5. Arhitektura i vlasništvo nad modulima', [
    text('h1', '5. Arhitektura i vlasništvo nad modulima'),
    text('paragraph', 'Preporučeni arhitektonski pravac je modularni monolit. Poslovni moduli imaju jasne granice, ali se sistem razvija i isporučuje kao jedna aplikacija. Mikroservisi nisu cilj predmeta i ne uvode se samo zato što na projektu radi više timova.'),
    code('text', `src/\n  modules/\n    finance/\n    support/\n    crm/\n    inventory/\n  platform/\n    auth/\n    permissions/\n    notifications/\n    audit/\n  shared/\n    contracts/\n    validation/\n    common/`, 'Primer moguće strukture. Konkretna organizacija zavisi od tehnologije i obrazloženih arhitektonskih odluka.'),
    list([
      'Tim je prvenstveno odgovoran za kvalitet svog modula.',
      'Izmena zajedničkog ili platformskog koda mora da ima jasan razlog i odgovarajući pregled.',
      'Podaci i poslovna pravila drugog modula ne kopiraju se samo da bi se izbegla koordinacija.',
      'Zavisnosti između modula prolaze kroz jasno definisane ugovore ili druge eksplicitne granice.',
      'SOLID, Clean Code i Clean Architecture ostaju osnovni kriterijumi za tehničke odluke.'
    ]),
  ]),

  page('6. Git i zahtev za spajanje', [
    text('h1', '6. Git i zahtev za spajanje'),
    text('paragraph', 'Direktan razvoj na glavnoj grani (`main`) nije prihvatljiv redovan tok rada. Promena se razvija na kratkotrajnoj grani, proverava se i zatim se otvara zahtev za spajanje (Pull Request). Na taj način ostaje jasan razvojni trag i smanjuje se rizik da neproverena promena uđe u zajednički proizvod.'),
    code('bash', `git switch main\ngit pull\ngit switch -c feature/FIN-123-create-invoice\n# rad i lokalna provera\ngit add .\ngit commit -m "FIN-123 implement invoice creation"\ngit push -u origin feature/FIN-123-create-invoice`, 'Primer toka za zadatak povezan sa stavkom iz backlog-a.'),
    table(['Zahtev za spajanje mora da pokaže', 'Minimalno očekivanje'], [
      ['Razlog', 'Koji zahtev ili problem se rešava.'],
      ['Promenu', 'Šta je izmenjeno i koji moduli su pogođeni.'],
      ['Proveru', 'Koji testovi, scenariji ili druge provere su izvršeni.'],
      ['Rizik', 'Da li promena utiče na druge timove, zajedničke ugovore ili podatke.'],
    ]),
    callout('success', 'Glavna grana treba da ostane stabilna', 'Promena nije završena zato što radi na računaru autora. Završena je kada je pregledana, proverena i bezbedno integrisana u zajednički sistem.'),
  ]),

  page('7. Zajednički kriterijumi završetka', [
    text('h1', '7. Zajednički kriterijumi završetka'),
    text('paragraph', 'Svi timovi koriste isti osnovni skup kriterijuma završetka. Tim može da uvede dodatne provere za svoj modul, ali ne može da ukloni zajedničke zahteve.'),
    list([
      'Kriterijumi prihvatanja su ispunjeni i mogu da se demonstriraju.',
      'Kod poštuje dogovorene granice modula i principe kvaliteta iz Specifikacije i Praktikuma.',
      'Postoje testovi koji odgovaraju riziku i vrsti promene.',
      'Lokalni build i obavezne automatizovane provere prolaze.',
      'Kod je pregledao najmanje jedan drugi član tima; promenu koja utiče na drugi modul pregleda i predstavnik pogođenog tima.',
      'Tapiz stavka je ažurirana i povezana sa stvarnim razvojnim tragom.',
      'Dokumentacija i ADR zapis su ažurirani kada promena utiče na arhitekturu ili dogovor između timova.',
    ]),
    callout('warning', 'Završeno znači provereno', 'Neproverena funkcionalnost, nejasna promena ili testovi koji ne prolaze ne mogu da budu označeni kao završeni.'),
  ]),

  page('8. Zavisnosti između timova i arhitektonske odluke', [
    text('h1', '8. Zavisnosti između timova i arhitektonske odluke'),
    text('paragraph', 'Zajednički proizvod podrazumeva da moduli sarađuju. Na primer, modul Finansije može da koristi podatke o klijentu iz CRM modula, dok Podrška korisnicima može da koristi identitet korisnika iz Platforme. Takve veze moraju da budu dogovorene i tehnički jasno definisane.'),
    diagram('Primer zavisnosti', [
      ['CRM', 'Vlasnik podataka o klijentima', 'violet'],
      ['Finansije', 'Koriste klijenta pri izdavanju fakture', 'blue'],
      ['Platforma', 'Obezbeđuje identitet i prava pristupa', 'cyan'],
      ['Podrška', 'Koristi korisnika i klijenta pri obradi zahteva', 'emerald'],
    ], 'Tim koji koristi podatke mora da zna ko je njihov vlasnik i preko kog ugovora ih dobija.'),
    text('h2', '8.1. Arhitektonski savet'),
    text('paragraph', 'Po jedan predstavnik svakog tima učestvuje u kratkom periodičnom tehničkom usaglašavanju. Razmatraju se promene zajedničkih ugovora, nove biblioteke, migracije, prava pristupa i druge odluke koje mogu da utiču na više modula.'),
    text('h2', '8.2. ADR za važne odluke'),
    code('markdown', `# ADR-004: Obaveštenja u realnom vremenu\n\n## Kontekst\nZašto postoji potreba?\n\n## Opcije\n1. Periodično proveravanje\n2. Server-Sent Events\n3. WebSockets\n\n## Odluka\nIzabrana opcija i obrazloženje.\n\n## Posledice\nDobici, ograničenja i budući troškovi.`, 'Minimalni oblik zapisa arhitektonske odluke.'),
  ]),

  page('9. Automatizacija kao deo projekta', [
    text('h1', '9. Automatizacija kao deo projekta'),
    text('paragraph', 'Od svakog tima se očekuje najmanje jedna korisna automatizacija koja rešava stvaran problem projekta. To može da bude provera koja se često ponavlja, postupak koji je sklon greškama ili korak koji treba obavezno izvršiti pre spajanja promene.'),
    diagram('Od ručnog koraka do automatizovane provere', [
      ['Ručni problem', 'Tim ponavlja isti postupak ili proveru', 'amber'],
      ['Pravilo', 'Jasno se određuje šta predstavlja uspeh, a šta grešku', 'blue'],
      ['Automatizacija', 'CI, skripta ili drugi mehanizam izvršava proveru', 'violet'],
      ['Rezultat', 'Ishod je vidljiv timu i utiče na odluku o spajanju promene', 'emerald'],
    ]),
    list([
      'automatski build i pokretanje testova za svaki zahtev za spajanje;',
      'provera naziva grane ili povezanosti sa stavkom iz backlog-a;',
      'provera pokrivenosti testovima ili drugih dogovorenih kriterijuma kvaliteta;',
      'provera migracija, ugovora ili generisanih datoteka;',
      'automatsko formiranje beleški o izdanju ili evidencije verzija;',
      'provera zavisnosti i poznatih bezbednosnih problema.'
    ]),
    callout('note', 'Automatizacija mora da ima svrhu', 'Student treba da ume da objasni koji ručni problem je automatizovan, šta automatizacija proverava, kako prijavljuje grešku i kako se proverava da sama automatizacija radi ispravno.'),
  ]),

  page('10. Korišćenje AI alata', [
    text('h1', '10. Korišćenje AI alata'),
    text('paragraph', 'AI alati mogu da se koriste u skladu sa pravilima iz Specifikacije i Praktikuma. Mogu da pomognu pri analizi zahteva, predlogu rešenja, izmeni koda, pisanju testova, dokumentaciji i pregledu promene, ali student ostaje odgovoran za konačan rezultat.'),
    table(['Primer korišćenja', 'Obavezna provera'], [
      ['Analiza zahteva', 'Proveriti da zaključak odgovara stvarnom zahtevu i poslovnom domenu.'],
      ['Predlog arhitekture ili refaktorisanja', 'Uporediti alternative i obrazložiti izabrano rešenje.'],
      ['Izmena koda', 'Pregledati promenu, pokrenuti testove i razumeti relevantne delove koda.'],
      ['Pisanje testova', 'Proveriti da test zaista dokazuje očekivano ponašanje.'],
      ['Pomoć pri pregledu koda', 'Proveriti nalaz pre nego što se prihvati kao stvaran problem.'],
    ]),
    callout('task', 'Evidencija korišćenja', 'Kada Specifikacija ili Praktikum zahtevaju evidenciju u datoteci `AI_USAGE.md`, unos treba da bude kratak, konkretan i proverljiv: cilj, relevantan kontekst, prihvaćene ili odbačene izmene i način na koji je rezultat proveren.'),
  ]),

  page('11. Incidenti i regresije', [
    text('h1', '11. Incidenti i regresije'),
    text('paragraph', 'Zajednički repozitorijum omogućava realističnu vežbu rešavanja regresije. Nastavnik ili asistent može da zada situaciju u kojoj promena jednog modula neočekivano utiče na drugi deo sistema. Cilj je da tim pronađe tehnički uzrok, vrati sistem u stabilno stanje i uvede proveru koja smanjuje mogućnost ponavljanja problema.'),
    table(['Korak', 'Pitanje'], [
      ['Uticaj', 'Šta korisnik više ne može da uradi i koji moduli su pogođeni?'],
      ['Vremenski sled', 'Koja promena je povezana sa pojavom problema?'],
      ['Uzrok', 'Koja konkretna pretpostavka, greška ili promena je izazvala regresiju?'],
      ['Propust u proveri', 'Zašto testovi, pregled koda ili CI nisu otkrili problem pre integracije?'],
      ['Oporavak', 'Kako se sistem vraća u stabilno stanje?'],
      ['Prevencija', 'Koji novi test, ugovor ili automatizovana provera smanjuje mogućnost ponavljanja?'],
    ]),
    callout('success', 'Analiza incidenta je deo učenja', 'Ne traži se krivac. Ocenjuje se sposobnost tima da objasni tehnički uzrok, posledice i konkretno poboljšanje procesa ili sistema.'),
  ]),

  page('12. Veza sa kontrolnim tačkama P1–P8', [
    text('h1', '12. Veza sa kontrolnim tačkama P1–P8'),
    text('paragraph', 'Organizacioni model iz ovog dokumenta ne menja kontrolne tačke iz Praktikuma. On određuje kako se one primenjuju kada više timova radi na jednom zajedničkom proizvodu.'),
    table(['Kontrolna tačka', 'Primena u zajedničkom projektu'], [
      ['P1', 'Tim razrađuje zahteve svog modula, backlog i kriterijume prihvatanja.'],
      ['P2', 'Tim definiše granice modula, potrebne ugovore sa drugim modulima i najmanje jedan vertikalni prolaz kroz sistem.'],
      ['P3', 'Poslovni slučajevi upotrebe i ishodi moraju da budu koherentni unutar modula i usklađeni sa ostatkom proizvoda.'],
      ['P4', 'Funkcionalno jezgro se testira i stabilizuje; koristi se dogovorena osnovna tačka projekta i tag `manual-core-baseline`.'],
      ['P5', 'Projektne instrukcije i potrebna dokumentacija održavaju se dosledno u zajedničkom repozitorijumu.'],
      ['P6', 'Prilagođene veštine i agentski tokovi, kada se koriste, rešavaju stvaran i ponovljiv razvojni postupak.'],
      ['P7', 'MCP resursi i alati koriste stvarne podatke projekta i poštuju granice odgovornosti između modula.'],
      ['P8', 'Automatske provere, zaštitni mehanizmi, evaluacioni scenariji, vršnjačka provera i završna odbrana obuhvataju i integraciju sa drugim timovima.'],
    ]),
  ]),

  page('13. Obavezni projektni artefakti', [
    text('h1', '13. Obavezni projektni artefakti'),
    text('paragraph', 'Pored funkcionalnog koda, projekat mora da sadrži dovoljno dokaza da se može proveriti kako je tim radio, kako je testirao rešenje i kako je donosio važne odluke.'),
    list([
      'Tapiz tabla sa stvarnim backlog-om, prioritetima, kriterijumima prihvatanja i statusima;',
      'Git istorija sa smislenim granama, commit-ima i zahtevima za spajanje;',
      'README sa jasnim uputstvom za pokretanje i proveru sistema;',
      'testovi i automatizovane provere koje odgovaraju riziku modula;',
      'dokumentacija zahtevana Specifikacijom i Praktikumom, uključujući `AI_USAGE.md` kada je primenljivo;',
      'ADR zapisi za odluke koje imaju dugoročan uticaj ili utiču na više timova;',
      'jasno definisani ugovori između modula kada jedan tim koristi podatke ili ponašanje drugog;',
      'najmanje jedna korisna automatizacija po timu;',
      'završna demonstracija integrisanog proizvoda, a ne samo izolovanog modula.'
    ]),
    callout('info', 'Glavno merilo', 'Dobar projekat nije zbir nepovezanih funkcionalnosti. Dobar projekat pokazuje da timovi umeju da zajedno razvijaju održiv sistem, da poštuju granice odgovornosti i da mogu da dokažu kvalitet svog rada.'),
  ]),
]

export const teamProject2026: CourseDocument = {
  version: 2,
  id: 'ers-team-project-2026-27',
  title: 'Projekat 2026/27',
  subtitle: 'Jedna tema, jedan zajednički proizvod i više razvojnih timova',
  subject: 'Elementi razvoja softvera',
  kind: 'dokument',
  headerText: 'Elementi razvoja softvera',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-09-05T12:00:00.000Z',
  updatedAt: '2026-09-05T13:45:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'violet', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: projectPages(),
}
