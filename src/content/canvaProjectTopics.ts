import type { Block, CourseDocument, DocumentPage } from '../types'
import { text, list, callout, table, page } from './canvaPracticumShared'

let sequence = 0
const id = (prefix: string) => `topics-${prefix}-${String(++sequence).padStart(3, '0')}`

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
    { id: id('title'), type: 'text', variant: 'title', html: 'Projektne teme', align: 'center' },
    { id: id('subtitle'), type: 'text', variant: 'subtitle', html: 'Elementi razvoja softvera · 2026/2027', align: 'center' },
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Predlozi domena za semestralni projekat. Sve teme podležu istoj zvaničnoj specifikaciji.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const topic = (
  number: number,
  title: string,
  problem: string,
  roles: string,
  rules: string[],
): DocumentPage => page(`${number}. ${title}`, [
  text('h1', `${number}. ${title}`),
  text('paragraph', problem),
  table(['Element', 'Predlog'], [
    ['Tipične uloge', roles],
    ['Fokus', 'Modelovati tokove i pravila domena, a ne samo CRUD nad podacima.'],
  ]),
  text('h2', 'Moguća netrivijalna pravila'),
  list(rules),
  callout('note', 'Tema nije gotova specifikacija', 'Tim definiše sopstvene User Story-je, acceptance criteria, model i arhitekturu. Navedena pravila služe samo kao smernice da domen ima dovoljno prostora za ozbiljan projektni rad.'),
])

const pages = (): DocumentPage[] => [
  page('1. Kako se bira tema', [
    text('h1', '1. Kako se bira tema'),
    text('paragraph', 'Ovaj dokument sadrži predloge projektnih domena. Tema određuje problem koji tim rešava, ali ne menja opšte uslove iz dokumenta „Specifikacija“. Sve teme se ocenjuju prema istim kriterijumima: zahtevi, SOLID, Clean Architecture, poslovna logika, testiranje, Git proces, odgovorna AI upotreba, dokumentacija i odbrana.'),
    list([
      'Tim bira jednu ponuđenu temu ili predlaže sopstvenu temu slične složenosti.',
      'Sopstvena tema treba da bude potvrđena pre ozbiljne implementacije kako bi se proverilo da domen ima dovoljno poslovnih pravila.',
      'Naziv teme nije specifikacija funkcionalnosti; tim samostalno definiše backlog i acceptance criteria.',
      'Tema se ne bira prema broju ekrana ili tabela, već prema kvalitetu problema i mogućnosti da se pokažu odluke dizajna.',
      'Nije cilj implementirati sve ideje iz opisa. Potrebno je odabrati kontrolisan, koherentan skup use-case-ova.'
    ]),
    callout('info', 'Sopstvene teme su dobrodošle', 'Ako tim ima kvalitetan domen koji nije na listi, može ga predložiti. Potrebno je jasno opisati korisnike, problem, stanje sistema i nekoliko netrivijalnih pravila koja opravdavaju projekat.'),
  ]),

  topic(
    2,
    'Rezervacija laboratorijske opreme i prostora',
    'Sistem podržava rezervaciju ograničenih resursa kao što su laboratorijska oprema, učionice ili specijalizovani termini. Glavni izazov je sprečavanje konflikata i primena pravila dostupnosti.',
    'Student/korisnik, nastavnik ili odgovorno lice, administrator resursa',
    [
      'Isti resurs ne može biti rezervisan u vremenski preklapajućim terminima.',
      'Određene kategorije opreme mogu zahtevati prethodno odobrenje ili obuku korisnika.',
      'Otkazivanje neposredno pre termina može imati drugačija pravila od ranog otkazivanja.',
      'Prioritetna rezervacija može biti dozvoljena samo određenim ulogama ili za određene namene.',
      'Resurs van upotrebe automatski blokira buduće rezervacije dok se status ne promeni.'
    ],
  ),

  topic(
    3,
    'Servisni centar i upravljanje intervencijama',
    'Sistem prati prijavu kvara ili zahteva, dodelu tehničara, planiranje intervencije, rezervne delove i zatvaranje slučaja. Domen je pogodan za modelovanje stanja i pravila prioriteta.',
    'Korisnik, dispečer, tehničar, administrator',
    [
      'Prioritet intervencije zavisi od kategorije problema, ugovora i procene uticaja.',
      'Tehničar ne može istovremeno imati preklapajuće terenske termine.',
      'Slučaj se ne može zatvoriti bez obaveznog izveštaja ili potvrde izvršene intervencije.',
      'Određeni rezervni delovi zahtevaju evidenciju izdavanja i povrat neiskorišćenih količina.',
      'Ponovljeni kvar u kratkom periodu može automatski promeniti klasifikaciju ili eskalirati slučaj.'
    ],
  ),

  topic(
    4,
    'Upravljanje događajima i prijavama učesnika',
    'Sistem podržava organizaciju radionica, konferencija ili internih događaja, prijavu učesnika, kapacitete, liste čekanja i pravila pristupa sesijama.',
    'Učesnik, organizator, moderator ili predavač, administrator',
    [
      'Prijava se odbija ili prebacuje na listu čekanja kada je kapacitet popunjen.',
      'Učesnik ne može izabrati dve sesije koje se vremenski preklapaju.',
      'Određene sesije mogu imati preduslove ili ograničene kategorije učesnika.',
      'Oslobođeno mesto sa liste čekanja dodeljuje se po jasno definisanom pravilu.',
      'Izmena termina sesije mora otkriti postojeće konflikte prijavljenih učesnika.'
    ],
  ),

  topic(
    5,
    'Biblioteka, pozajmice i rezervacije primeraka',
    'Sistem upravlja naslovima i fizičkim ili digitalnim primercima, pozajmicama, rezervacijama, produženjima i ograničenjima članova. Nije dovoljno modelovati samo katalog knjiga.',
    'Član biblioteke, bibliotekar, administrator',
    [
      'Broj aktivnih pozajmica može zavisiti od kategorije člana.',
      'Primerak koji je rezervisan za drugog člana ne može se slobodno produžiti.',
      'Kašnjenje može blokirati novu pozajmicu dok se obaveza ne razreši.',
      'Red čekanja za popularan naslov poštuje definisani prioritet i rok preuzimanja.',
      'Gubitak ili oštećenje primerka menja njegov status i dostupnost za buduće rezervacije.'
    ],
  ),

  topic(
    6,
    'Planiranje dostave i kurirskih naloga',
    'Sistem prati naloge za dostavu, raspoloživost kurira, dodelu pošiljki, statuse isporuke i neuspešne pokušaje. Pogodan je za pravila prioriteta, kapaciteta i promena stanja.',
    'Klijent, dispečer, kurir, administrator',
    [
      'Kuriru se ne dodeljuje pošiljka koja prelazi njegov raspoloživ kapacitet ili područje rada.',
      'Prioritetna dostava utiče na redosled dodele, ali ne sme narušiti obavezna ograničenja.',
      'Neuspešna isporuka mora imati razlog i može pokrenuti ograničen broj novih pokušaja.',
      'Promena adrese nakon određenog statusa zahteva ponovno planiranje ili odobrenje.',
      'Pošiljka se ne može označiti isporučenom bez propisanog dokaza za odgovarajuću vrstu naloga.'
    ],
  ),

  topic(
    7,
    'Upravljanje članstvom, paketima i pogodnostima',
    'Sistem upravlja članovima, paketima usluga, periodima važenja, zamrzavanjem članstva i pogodnostima. Primeri domena mogu biti sportski centar, coworking, klub ili slična usluga.',
    'Član, operater, menadžer, administrator',
    [
      'Pogodnost je dostupna samo ako članstvo i odgovarajući paket važe u trenutku korišćenja.',
      'Zamrzavanje članstva produžava važenje samo pod dozvoljenim uslovima i u ograničenom broju dana.',
      'Promena paketa može imati drugačiji obračun u zavisnosti od trenutka u obračunskom periodu.',
      'Određene pogodnosti se ne mogu kombinovati ili imaju mesečni limit korišćenja.',
      'Neizmirena obaveza može privremeno ograničiti pristup pojedinim uslugama.'
    ],
  ),

  topic(
    8,
    'Evidencija prakse, mentorstva i studentskih angažovanja',
    'Sistem povezuje studente, mentore i organizacije kroz prijave, ponude angažovanja, odobravanje tema ili zadataka i praćenje statusa realizacije.',
    'Student, mentor, koordinator, predstavnik organizacije',
    [
      'Student ne može imati više aktivnih angažovanja ako pravila programa to zabranjuju.',
      'Prijava se može podneti samo na ponudu za koju student ispunjava definisane preduslove.',
      'Promena mentora ili organizacije nakon odobrenja zahteva eksplicitnu proceduru.',
      'Završetak angažovanja zahteva evaluaciju ili potvrdu više strana.',
      'Rokovi i statusi određuju koje izmene su još dozvoljene u prijavi.'
    ],
  ),

  topic(
    9,
    'Sistem za prijavu problema i održavanje objekata',
    'Sistem prati prijave problema u zgradama, kampusu, kompaniji ili stambenom objektu, kategorizaciju, dodelu odgovorne službe, SLA pravila i verifikaciju rešavanja.',
    'Prijavilac, operater, izvođač ili služba održavanja, administrator',
    [
      'Prioritet prijave zavisi od tipa problema, lokacije i procenjenog rizika.',
      'Duplikat prijave za isti problem treba povezati sa postojećim slučajem umesto otvaranja nezavisnog toka.',
      'Određeni statusi dozvoljavaju samo određene naredne tranzicije.',
      'Prekoračenje ciljnog vremena može izazvati eskalaciju ili promenu odgovorne službe.',
      'Zatvaranje kritične prijave može zahtevati potvrdu prijavioca ili nadležnog lica.'
    ],
  ),

  topic(
    10,
    'Naručivanje, zalihe i pravila dostupnosti proizvoda',
    'Sistem povezuje naručivanje sa stanjem zaliha, rezervacijom količina, pravilima popusta i obradom otkaza. Fokus je na konzistentnosti poslovnih pravila, ne na izradi klasičnog web shop UI-a.',
    'Kupac, operater prodaje, magacioner, administrator',
    [
      'Količina se rezerviše za porudžbinu samo ako je zaista dostupna prema pravilima skladišta.',
      'Popusti i kuponi imaju uslove važenja i ne moraju se međusobno kombinovati.',
      'Otkazivanje porudžbine nakon određenog statusa može zahtevati drugačiji tok i povrat rezervisanih količina.',
      'Delimična isporuka je dozvoljena samo kada je to eksplicitno prihvaćeno ili podržano pravilima sistema.',
      'Promena cene proizvoda ne sme retroaktivno menjati već potvrđenu cenu postojeće porudžbine.'
    ],
  ),

  topic(
    11,
    'Zakazivanje termina i upravljanje redom čekanja',
    'Sistem je namenjen zakazivanju termina kod savetnika, servisa, ordinacije, laboratorije ili druge usluge sa ograničenim kapacitetom. Potrebno je modelovati dostupnost i promene termina.',
    'Korisnik, pružalac usluge, operater, administrator',
    [
      'Novi termin mora biti unutar radnog vremena i bez konflikta sa postojećim obavezama pružaoca usluge.',
      'Trajanje termina može zavisiti od vrste usluge.',
      'Otkazivanje ili pomeranje termina može imati vremenska ograničenja.',
      'Lista čekanja može automatski ponuditi oslobođeni termin sledećem podobnom korisniku.',
      'Određene usluge mogu zahtevati prethodno završenu drugu uslugu ili odobrenje.'
    ],
  ),

  page('12. Predlog sopstvene teme', [
    text('h1', '12. Predlog sopstvene teme'),
    text('paragraph', 'Sopstvena tema je dozvoljena ako pruža najmanje isti prostor za primenu ishoda predmeta kao ponuđeni domeni. Pre odobrenja tim treba da opiše problem dovoljno jasno da se može proceniti da li projekat ima smisleno poslovno ponašanje.'),
    table(['Potrebno navesti', 'Šta se očekuje'], [
      ['Problem', 'Koji realističan problem sistem rešava i za koga.'],
      ['Korisnici', 'Glavne uloge ili tipovi korisnika i njihove različite potrebe.'],
      ['Stanje', 'Koji važni podaci i statusi se menjaju kroz vreme.'],
      ['Ključni tokovi', 'Najmanje nekoliko reprezentativnih operacija sa jasnom korisničkom vrednošću.'],
      ['Poslovna pravila', 'Primeri ograničenja, konflikata, dozvola ili negativnih ishoda koji nisu običan CRUD.'],
      ['Spoljne zavisnosti', 'Baza, fajlovi, API ili drugi tehnički detalji samo ako su relevantni za domen.'],
    ]),
    callout('warning', 'Šta treba izbegavati', 'Tema koja se svodi na unos, prikaz, izmenu i brisanje jednostavnih podataka bez poslovnih pravila verovatno neće pružiti dovoljan prostor za kvalitetnu odbranu principa sa predmeta.'),
  ]),
]

export const projectTopics2026: CourseDocument = {
  version: 1,
  id: 'ers-project-topics-2026-27-current',
  title: 'Projektne teme 2026/27',
  subtitle: 'Predlozi domena · Elementi razvoja softvera',
  subject: 'Elementi razvoja softvera',
  kind: 'dokument',
  headerText: 'Elementi razvoja softvera · 2026/2027',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-09-05T10:23:00.000Z',
  updatedAt: '2026-09-05T10:23:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'cyan', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), ...pages()],
}
