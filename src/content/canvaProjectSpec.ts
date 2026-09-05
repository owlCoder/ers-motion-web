import type { Block, CourseDocument, DocumentPage } from '../types'
import { text, list, callout, table, diagram, page } from './canvaPracticumShared'

let sequence = 0
const id = (prefix: string) => `spec-${prefix}-${String(++sequence).padStart(3, '0')}`

const institution = (): Block => ({
  id: id('institution'),
  type: 'institution',
  university: 'Univerzitet u Novom Sadu',
  faculty: 'Fakultet tehničkih nauka',
  department: 'Primenjeno softversko inženjerstvo · 2026/2027',
  leftLogoSrc: '/brand/university.svg',
  rightLogoSrc: '/brand/ftn.svg',
})

const cover = (): DocumentPage => ({
  id: id('page'),
  label: 'Naslovna',
  layout: 'cover',
  blocks: [
    institution(),
    { id: id('title'), type: 'text', variant: 'title', html: 'Specifikacija projektnog zadatka', align: 'center' },
    { id: id('subtitle'), type: 'text', variant: 'subtitle', html: 'Elementi razvoja softvera · 2026/2027', align: 'center' },
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Zvanični opšti uslovi za izradu, predaju i odbranu semestralnog projekta.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const pages = (): DocumentPage[] => [
  page('1. Status i svrha specifikacije', [
    text('h1', '1. Status i svrha specifikacije'),
    text('paragraph', 'Ovaj dokument predstavlja zvaničnu opštu specifikaciju semestralnog projektnog zadatka iz predmeta Elementi razvoja softvera. Pravila važe nezavisno od izabrane projektne teme. Konkretne ponuđene teme objavljuju se odvojeno i ne menjaju tehničke, procesne i kvalitativne uslove navedene u ovoj specifikaciji.'),
    callout('info', 'Specifikacija nije template', 'Ne propisuje se gotova struktura foldera, broj klasa niti jedan model rešenja koji treba kopirati. Ocenjuje se sposobnost tima da primeni principe predmeta na sopstveni domen i da svoje odluke argumentuje.'),
    list([
      'Projektni zadatak je kontinuirani razvojni rad, a ne jednokratna završna predaja.',
      'Kvalitet arhitekture, poslovnog modela, testova i razumevanja ima prednost nad pukim brojem funkcionalnosti.',
      'Svi članovi tima odgovorni su za razumevanje ključnih delova sistema, bez obzira na internu podelu posla.',
      'Sve obavezne zahteve iz ovog dokumenta treba moći pokazati kroz repozitorijum, izvršivu aplikaciju, testove, dokumentaciju i odbranu.'
    ]),
  ]),

  page('2. Opšti uslovi projektnog sistema', [
    text('h1', '2. Opšti uslovi projektnog sistema'),
    text('paragraph', 'Tema i domen mogu biti različiti, ali projekat mora biti dovoljno sadržajan da omogući primenu principa sa predmeta. Jednostavan CRUD nad nekoliko tabela bez poslovnih pravila i smislenih promena stanja nije dovoljan.'),
    list([
      'Sistem mora rešavati jasan poslovni, organizacioni, institucionalni ili drugi realističan problem.',
      'Mora postojati više smislenih korisničkih tokova i najmanje nekoliko pravila koja mogu dovesti do pozitivnog i negativnog ishoda.',
      'Stanje sistema mora se menjati kroz eksplicitne use-case operacije, uz validaciju ulaza i poslovnih ograničenja.',
      'Korisničke uloge i autorizacija uvode se kada ih domen opravdava; ne dodaju se veštački samo radi ispunjavanja forme.',
      'Obim projekta treba da bude kontrolisan: manji sistem sa dobrim granicama i testovima vredniji je od velikog sistema sa slabim dizajnom.',
      'Starter template se ne dobija. Tim samostalno postavlja solution, projekte, konfiguraciju i composition root.'
    ]),
    callout('warning', 'CRUD nije poslovno pravilo', 'Operacije Create/Read/Update/Delete same po sebi ne dokazuju modelovanje domena. Potrebno je pokazati pravila, dozvole, konflikte, ograničenja, promene stanja i očekivane neuspehe koji pripadaju problemu koji sistem rešava.'),
  ]),

  page('3. Zahtevi i funkcionalni obim', [
    text('h1', '3. Zahtevi i funkcionalni obim'),
    text('paragraph', 'Funkcionalnosti treba da proisteknu iz korisničkih potreba i da budu opisane na način koji omogućava proveru. Zahtev nije završen dok nije jasno šta predstavlja prihvatljiv ishod i kako se ponašanje proverava.'),
    list([
      'Glavne funkcionalnosti voditi kroz User Story-je, use-case opise ili ekvivalentne zahteve sa jasnom korisničkom vrednošću.',
      'Za ključne zahteve definisati testabilne acceptance criteria, uključujući negativne i granične slučajeve kada su relevantni.',
      'Eksplicitno modelovati očekivane poslovne neuspehe; ne koristiti izuzetke kao zamenu za svaki negativan poslovni ishod.',
      'Kompleksniji use-case treba da orkestrira domenska pravila i spoljne zavisnosti bez skrivanja poslovne logike u UI-u, kontrolerima ili repozitorijumima.',
      'Promena zahteva tokom semestra treba da bude lokalizovana koliko arhitektura dozvoljava i pokrivena odgovarajućom verifikacijom.'
    ]),
  ]),

  page('4. Clean Architecture i smer zavisnosti', [
    text('h1', '4. Clean Architecture i smer zavisnosti'),
    text('paragraph', 'Projekat se realizuje u .NET/C# okruženju i mora imati jasno razdvojeno poslovno jezgro, aplikacionu orkestraciju, infrastrukturne detalje i presentation sloj. Tačan broj projekata i foldera nije propisan; propisane su odgovornosti i dozvoljeni smer zavisnosti.'),
    table(['Oblast', 'Opšti zahtev'], [
      ['Domain / jezgro', 'Stabilni poslovni pojmovi, invarijante i pravila bez zavisnosti od UI-a, baze i framework detalja.'],
      ['Application / use-case', 'Orkestracija korisničkih operacija, ugovori prema spoljnim potrebama i eksplicitni rezultati.'],
      ['Infrastructure', 'Baza, fajlovi, spoljne usluge, repozitorijumi i adapteri kao promenljivi tehnički detalji.'],
      ['Presentation', 'Web/API/desktop/console ulazi i izlazi bez skrivene domenske logike.'],
      ['Composition root', 'Jedno jasno mesto u kome se biraju konkretne implementacije i sastavlja graf zavisnosti.'],
    ]),
    callout('note', 'Clean Architecture nije raspored foldera', 'Struktura može biti prilagođena projektu ako tim može da pokaže da poslovno jezgro ne zavisi od promenljivih tehničkih detalja i da smer zavisnosti ima smisla.'),
  ]),

  page('5. SOLID, Clean Code i kvalitet dizajna', [
    text('h1', '5. SOLID, Clean Code i kvalitet dizajna'),
    text('paragraph', 'SOLID principi i Clean Code smernice primenjuju se kroz stvarne projektantske odluke. Ne ocenjuje se broj interfejsa niti formalno označavanje obrazaca, već posledice dizajna pri razumevanju, testiranju i promeni sistema.'),
    list([
      'Klase, servisi i moduli treba da imaju koherentne odgovornosti i razumljive razloge za promenu.',
      'Varijabilna ponašanja izdvajati iza odgovarajućih apstrakcija kada to smanjuje spregnutost i olakšava zamenu implementacije.',
      'Implementacije istog ugovora moraju poštovati očekivanja klijenta; nasleđivanje i interfejsi ne uvode se samo radi forme.',
      'Interfejsi treba da budu usmereni na potrebe klijenta i bez nepotrebnih operacija.',
      'Poslovni kod ne treba direktno da zavisi od promenljivih infrastrukturnih detalja kada se ta zavisnost može smisleno invertovati.',
      'Imenovanje, formatiranje, veličina metoda, kontrola grananja i organizacija koda moraju omogućiti efikasan review.',
      'Dupliranje, magic vrednosti, skrivene globalne zavisnosti i prevelike klase treba refaktorisati kada predstavljaju stvarni rizik za održavanje.'
    ]),
    callout('info', 'Dokaz na odbrani', 'Student treba da pokaže nekoliko konkretnih primera gde je dobra granica olakšala testiranje ili promenu, kao i najmanje jednu odluku gde je svesno izbegnuta nepotrebna apstrakcija.'),
  ]),

  page('6. Poslovna logika i modelovanje ishoda', [
    text('h1', '6. Poslovna logika i modelovanje ishoda'),
    text('paragraph', 'Ključni deo projekta je ponašanje sistema. Poslovna pravila treba da budu vidljiva u kodu, testabilna i odvojena od detalja prikaza i skladištenja podataka.'),
    list([
      'Use-case ulazi i izlazi treba da imaju jasne tipove i odgovornosti.',
      'Očekivani neuspeh treba modelovati eksplicitno kada je deo normalnog poslovnog toka.',
      'Validacija sintakse i formata ulaza razlikuje se od domenskih pravila i dozvola.',
      'Transakcione i konkurentne situacije treba rešavati tamo gde su relevantne za izabrani domen.',
      'Mapiranje između transportnih, aplikacionih i domenskih modela ne sme sakrivati poslovna pravila.',
      'Spoljni API, baza ili fajl sistem ne određuju oblik poslovnog jezgra više nego što je neophodno.'
    ]),
  ]),

  page('7. Testiranje i verifikacija', [
    text('h1', '7. Testiranje i verifikacija'),
    text('paragraph', 'Testovi su dokaz ponašanja i zaštita od regresije. U fokusu su domenska pravila, ključni use-case-ovi i rizici, a ne samo procenat pokrivenosti koda.'),
    list([
      'Koristiti NUnit za automatizovane testove ključnih use-case-ova i domenskih pravila.',
      'Za važne zahteve pokriti pozitivne, negativne i relevantne granične scenarije.',
      'Moq ili druge test doubles koristiti samo kada test treba da izoluje promenljivu spoljnu zavisnost ili proveri važnu interakciju.',
      'Testovi treba da budu deterministički, čitljivi i nezavisni od redosleda izvršavanja.',
      'Coverage izveštaj koristiti kao signal za pronalaženje slepih tačaka, ne kao jedinu metriku kvaliteta.',
      'Kada se tokom rada otkrije bug ili regresija, poželjno je prvo reprodukovati problem testom, pa zatim izvršiti korekciju.'
    ]),
    callout('warning', 'Visok coverage nije dovoljan', 'Pokrivena linija koda nije isto što i provereno poslovno pravilo. Na odbrani student treba da objasni zašto je izabrani test relevantan i šta konkretno štiti.'),
  ]),

  page('8. Git, GitHub i razvojni proces', [
    text('h1', '8. Git, GitHub i razvojni proces'),
    text('paragraph', 'Repozitorijum je deo projektnog dokaza. Istorija treba da omogući rekonstrukciju razvoja i doprinosa, a ne da sadrži samo završno stanje projekta.'),
    list([
      'Raditi kontinuirano kroz smislene commit-e sa opisima koji odražavaju stvarnu izmenu.',
      'Glavne funkcionalnosti povezati sa issue/User Story tragom ili ekvivalentnom evidencijom zahteva.',
      'Za veće izmene koristiti feature grane i pull request/review tok ili drugi uredan timski workflow sa uporedivim tragom.',
      'Ne prepisivati istoriju na način koji uklanja dokaz rada neposredno pred predaju.',
      'README mora sadržati opis sistema, preduslove, pokretanje, testiranje i reprezentativan demo scenario.',
      'Tajne, lozinke, tokeni i privatni ključevi ne smeju biti commit-ovani u repozitorijum.'
    ]),
    callout('warning', 'Jedan završni commit nije dovoljan', 'Masovno kopiranje gotovog projekta neposredno pred odbranu ne pokazuje razvojni proces, otežava procenu doprinosa i može biti razlog za dodatnu proveru autorstva i razumevanja.'),
  ]),

  page('9. Korišćenje AI alata', [
    text('h1', '9. Korišćenje AI alata'),
    text('paragraph', 'AI alati su dozvoljeni i predstavljaju deo sadržaja predmeta, ali student ostaje odgovoran za svaku predatu izmenu. AI ne zamenjuje razumevanje zahteva, arhitekture, koda, testova i bezbednosnih posledica.'),
    table(['Oblast', 'Opšti uslov'], [
      ['Analiza i planiranje', 'AI se može koristiti za razjašnjenje zahteva, alternativne planove, review i predlog scenarija.'],
      ['Izmena koda', 'Generisane ili izmenjene delove proveriti kroz diff, build, testove i razumevanje uticaja na arhitekturu.'],
      ['Instrukcije', 'Stabilna projektna pravila zapisati u AI_INSTRUCTIONS.md ili ekvivalentnom dokumentu koji tim zaista koristi.'],
      ['Evidencija', 'AI_USAGE.md ili ekvivalent treba da zabeleži reprezentativne upotrebe, odluke tima i način verifikacije.'],
      ['Automatizacija', 'Skills/procedure, agentne uloge, MCP i hooks/guardrails uvoditi kada rešavaju stvarnu potrebu i imaju proverljiv rezultat.'],
      ['Bezbednost', 'Ne slati credential-e, tajne ili osetljive podatke spoljnim modelima i alatima.'],
    ]),
    list([
      'Kompletan projekat ili ključna funkcionalnost ne smeju biti predati kao neprovereni generisani rezultat koji tim ne razume.',
      'Svaka važna AI izmena mora imati odgovarajući signal verifikacije: test, build, statičku proveru, diff review ili drugi smislen dokaz.',
      'AI artefakti se ocenjuju po korisnosti i pouzdanosti, a ne po količini promptova, agenata ili generisanog teksta.',
      'Student na odbrani mora moći da objasni zašto je AI predlog prihvaćen, izmenjen ili odbijen.'
    ]),
  ]),

  page('10. Obavezna dokumentacija i reproduktivnost', [
    text('h1', '10. Obavezna dokumentacija i reproduktivnost'),
    text('paragraph', 'Druga osoba treba da može da preuzme projekat, razume osnovnu strukturu i pokrene reprezentativan scenario bez dodatnih usmenih instrukcija autora.'),
    list([
      'README: problem koji sistem rešava, preduslovi, konfiguracija, pokretanje, testiranje i glavni demo scenario.',
      '`docs/architecture.md` ili ekvivalent: granice sistema, smer zavisnosti, ključne odluke i bitni kompromisi.',
      '`AI_INSTRUCTIONS.md` i `AI_USAGE.md` kada se koriste AI alati u okviru projektnog workflow-a.',
      'Dodatna dokumentacija za MCP server, hooks, evals ili druge projektne alate kada oni nisu očigledni iz glavnog README-a.',
      'Konfiguracione vrednosti koje nisu tajne obezbediti kroz primer konfiguracije, a tajne učitavati van repozitorijuma.',
      'Komande navedene u dokumentaciji moraju biti proverene na finalnoj verziji projekta.'
    ]),
    callout('info', 'Peer QA', 'Pre odbrane preporučuje se da drugi student ili tim pokrene projekat samo na osnovu README-a i zabeleži konkretan rezultat pregleda. Cilj je proveriti reproduktivnost, ne formalno proizvesti još jedan dokument.'),
  ]),

  page('11. Checkpoint-i i promena zahteva', [
    text('h1', '11. Checkpoint-i i promena zahteva'),
    text('paragraph', 'Rad se prati kroz semestar u fazama koje prate redosled sadržaja na predmetu. Konkretni termini se objavljuju kroz zvanične kanale predmeta; ovaj dokument definiše šta se kroz te faze očekuje da postane vidljivo u projektu.'),
    table(['Faza', 'Očekivani dokaz'], [
      ['Zahtevi', 'Problem, glavni korisnički tokovi, acceptance criteria i početni backlog.'],
      ['Arhitektura', 'Solution struktura, smer zavisnosti, prvi vertikalni prolaz i obrazložene granice.'],
      ['Poslovno jezgro', 'Ključni use-case-ovi, domenska pravila i eksplicitni ishodi.'],
      ['Verifikacija', 'NUnit/Moq testovi, coverage pregled i dokaz regresionog razmišljanja.'],
      ['AI engineering', 'Uređene instrukcije i najmanji smisleni proverljiv workflow sa alatima/automatizacijom prema sadržaju predmeta.'],
      ['Finalizacija', 'Dokumentacija, peer QA, stabilno pokretanje i spremnost za individualnu odbranu.'],
    ]),
    text('h2', '11.1. Naknadni change request'),
    text('paragraph', 'U završnoj fazi može biti zadat dodatni zahtev ili izmena postojećeg pravila. Cilj je provera da li tim ume da izvrši impact analysis, lokalizuje promenu, sačuva postojeće ponašanje i dokaže novu funkcionalnost.'),
    diagram('Očekivani tok izmene', [
      ['Zahtev', 'razumeti novo pravilo', 'slate'],
      ['Uticaj', 'granice, rizici i testovi', 'cyan'],
      ['Plan', 'mali proverljivi koraci', 'blue'],
      ['Izmena', 'ograničen i razumljiv diff', 'violet'],
      ['Provera', 'build, testovi i review', 'emerald'],
    ]),
  ]),

  page('12. Predaja i finalna verzija', [
    text('h1', '12. Predaja i finalna verzija'),
    text('paragraph', 'Finalna predaja mora predstavljati jasno identifikovanu i reproduktivnu verziju projekta. Rokovi i način evidencije termina objavljuju se odvojeno; tehnički uslovi finalne verzije ostaju isti za sve teme.'),
    list([
      'Repozitorijum mora sadržati verziju koja se gradi i pokreće prema dokumentovanom postupku.',
      'Preporučuje se tag ili release koji nedvosmisleno označava verziju namenjenu odbrani.',
      'Svi obavezni testovi treba da prolaze na predatoj verziji ili da eventualno poznato ograničenje bude eksplicitno dokumentovano.',
      'Ne ostavljati lokalne apsolutne putanje, development credential-e ili skrivene preduslove bez kojih projekat ne radi.',
      'Dokumentacija, migracije, seed podaci i potrebne skripte moraju odgovarati predatoj verziji koda.',
      'Naknadne izmene nakon zvanične predaje treba da budu jasno vidljive u Git istoriji.'
    ]),
  ]),

  page('13. Odbrana i uslovi uspešnog polaganja projekta', [
    text('h1', '13. Odbrana i uslovi uspešnog polaganja projekta'),
    text('paragraph', 'Odbrana je individualna provera razumevanja rada koji je tim predao. Zajednički projekat ne znači zajedničku ocenu bez provere pojedinačnog znanja.'),
    list([
      'Demonstrirati reprezentativan korisnički scenario i najmanje jedan negativni ili granični poslovni ishod.',
      'Pratiti najmanje jedan zahtev od acceptance criteria kroz use-case, implementaciju i test.',
      'Objasniti smer zavisnosti i konkretnu SOLID/Clean Architecture odluku iz sopstvenog koda.',
      'Pokazati relevantan deo Git istorije i objasniti kako je funkcionalnost nastajala ili menjana.',
      'Objasniti način testiranja, izbor test doubles i značenje coverage rezultata za konkretan deo sistema.',
      'Ako je AI korišćen, pokazati jedan stvarni workflow ili reprezentativnu upotrebu i način na koji je rezultat verifikovan.',
      'Odgovoriti na pitanje ili manju izmenu koja proverava sposobnost snalaženja u sopstvenom kodu.'
    ]),
    callout('warning', 'Minimalni uslovi', 'Projekat ne može uspešno da bude odbranjen ako se finalna verzija ne može razumno pokrenuti/proveriti, ako student ne razume ključne delove predatog rešenja ili ako nije moguće utvrditi autorstvo i razvojni proces kroz raspoložive dokaze.'),
    callout('note', 'AI ne prenosi odgovornost', 'Činjenica da je određeni kod, test ili dokument generisao AI alat ne umanjuje obavezu studenta da razume njegovu ulogu, rizike i posledice u konačnom sistemu.'),
  ]),

  page('14. Kriterijumi ocenjivanja', [
    text('h1', '14. Kriterijumi ocenjivanja'),
    text('paragraph', 'Ocena projekta zasniva se na konzistentnom softversko-inženjerskom radu. Veći broj funkcionalnosti ne može da kompenzuje ozbiljne probleme u arhitekturi, testiranju ili razumevanju sopstvenog rešenja.'),
    table(['Oblast', 'Udeo i fokus'], [
      ['Softversko-inženjerska ispravnost', '40% — zahtevi, SOLID, Clean Architecture, poslovna logika i kvalitet implementacije.'],
      ['Testiranje i verifikacija', '20% — NUnit/Moq, relevantni scenariji, coverage interpretacija i regresiona zaštita.'],
      ['Git i razvojni proces', '15% — kontinuitet rada, istorija, review trag i dokumentovane odluke.'],
      ['AI engineering', '20% — odgovorna i proverljiva upotreba AI-a, instrukcije i automatizacija u skladu sa sadržajem predmeta.'],
      ['Dokumentacija i odbrana', '5% — reproduktivnost i sposobnost jasnog objašnjavanja sopstvenih odluka.'],
    ]),
    callout('info', 'Kvalitet iznad količine', 'Dodatni framework-i, veliki broj obrazaca, agenata, servisa ili ekrana ne donose sami po sebi dodatnu vrednost. Svaki element treba da ima jasnu svrhu i da bude proporcionalan problemu koji rešava.'),
  ]),
]

export const projectSpec2026: CourseDocument = {
  version: 3,
  id: 'ers-project-spec-2026-27-current',
  title: 'Specifikacija projektnog zadatka 2026/27',
  subtitle: 'Zvanični opšti uslovi · Elementi razvoja softvera',
  subject: 'Elementi razvoja softvera',
  kind: 'specifikacija',
  headerText: 'Elementi razvoja softvera · 2026/2027',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-08-25T12:00:00.000Z',
  updatedAt: '2026-09-05T10:23:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'blue', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), ...pages()],
}
