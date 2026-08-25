import type { Block, CourseDocument, DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

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
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Projekat povezuje zahteve, SOLID i Clean Architecture, testiranje, Git trag i kontrolisanu AI integraciju kroz jedan kontinuirani razvojni proces.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const pages = (): DocumentPage[] => [
  page('1. Svrha projektnog zadatka', [
    text('h1', '1. Svrha projektnog zadatka'),
    text('paragraph', 'Projektni zadatak predstavlja glavni praktični artefakt predmeta. Tim tokom semestra razvija softverski sistem po sopstveno izabranoj temi i na istom repozitorijumu postepeno primenjuje principe sa vežbi. Cilj nije maksimalan broj ekrana ili CRUD operacija, već pokazivanje da studenti umeju da razumeju zahtev, projektuju granice, implementiraju poslovno ponašanje, napišu testove i uvedu AI alat bez gubitka odgovornosti za konačan rezultat.'),
    callout('warning', 'Starter template se ne dobija', 'Tim sam kreira solution, projekte, foldere, ugovore i composition root. Ocenjuje se sposobnost da se struktura obrazloži. Kopiranje nastavnog primera bez prilagođavanja domenu ne predstavlja projektovanje.'),
    list([
      'Tema treba da predstavlja realan poslovni, organizacioni ili institucionalni problem sa više smislenih pravila.',
      'Sistem se razvija kontinuirano kroz Git; završna verzija bez istorije rada nije dovoljna.',
      'AI se uvodi po fazama: rano za analizu i review, kasnije za kontrolisane izmene uz testove, tools i guardrails.',
      'Svaki član tima mora razumeti ključne delove projekta bez obzira na internu podelu rada.'
    ]),
  ]),
  page('2. Očekivani ishodi učenja', [
    text('h1', '2. Očekivani ishodi učenja'),
    text('paragraph', 'Uspešno završen projekat treba da pokaže povezivanje koncepata iz celog predmeta. Ishodi se dokazuju kodom, testovima, istorijom razvoja, dokumentacijom i usmenim objašnjenjem.'),
    list([
      'Formulisanje User Story-ja i testabilnih acceptance criteria iz nejasnog zahteva.',
      'Projektovanje arhitektonskih granica i objašnjavanje dozvoljenog smera zavisnosti.',
      'Primena SOLID principa na konkretne promene umesto formalnog dodavanja interfejsa.',
      'Modelovanje use-case-ova, domenskih pravila i eksplicitnih poslovnih ishoda.',
      'Pisanje NUnit testova i promišljeno korišćenje Moq-a.',
      'Korišćenje coverage-a kao razvojnog signala, ne kao jedine metrike kvaliteta.',
      'Uredan Git/GitHub tok sa issue-ima, granama, commit-ima i review tragom.',
      'Projektovanje instrukcija, skills, agentnih uloga i MCP integracije.',
      'Uvođenje hooks/guardrail provera i eval scenarija za AI workflow.',
      'Kritička procena AI predloga i nezavisna verifikacija kroz kod, diff i testove.'
    ]),
  ]),
  page('3. Projektna tema i funkcionalni obim', [
    text('h1', '3. Projektna tema i funkcionalni obim'),
    text('paragraph', 'Tema mora imati jasne korisničke uloge, stanje koje se menja i najmanje nekoliko netrivijalnih pravila. Nije potrebno praviti veliki sistem; važnije je da odabrani domen omogućava diskusiju o odgovornostima, greškama, dozvolama, konfliktima i promeni zahteva.'),
    list([
      'Najmanje 2–3 smisleno različite korisničke uloge.',
      'Najmanje 6 domenskih pojmova ili entiteta na nivou tima, bez veštačkog usitnjavanja radi brojanja.',
      'Najmanje 5 netrivijalnih poslovnih pravila koja mogu dati pozitivan ili negativan ishod.',
      'Autentifikacija i osnovna autorizacija po ulogama kada domen to zahteva.',
      'Najmanje jedan kompleksniji use-case po članu tima, uz zajedničko razumevanje svih ključnih tokova.',
      'Validacija ulaza i eksplicitno modelovanje očekivanih poslovnih neuspeha.'
    ]),
    callout('info', 'Primer netrivijalnog pravila', '„Premium korisnik može dobiti kupon, ali kupon ne može da se kombinuje sa sezonskim popustom“ jeste poslovno pravilo. „Entitet ima Create/Read/Update/Delete“ samo po sebi nije dovoljno poslovno ponašanje.'),
  ]),
  page('4. Arhitektonski i tehnički zahtevi', [
    text('h1', '4. Arhitektonski i tehnički zahtevi'),
    text('paragraph', 'Projekat se realizuje u .NET/C# okruženju. Tačan broj projekata nije unapred propisan, ali struktura mora jasno da razdvoji poslovno jezgro od UI-a i infrastrukturnih detalja. Tim treba da ume da pokaže gde se nalazi use-case, gde domenska pravila, gde ugovori, a gde konkretne implementacije.'),
    table(['Oblast', 'Očekivanje'], [
      ['Domain / jezgro', 'Modeli, invarijante i stabilni poslovni pojmovi bez zavisnosti od UI/baze/framework detalja.'],
      ['Application / use-case', 'Orkestracija korisničkih operacija, eksplicitni rezultati i ugovori za spoljne potrebe.'],
      ['Infrastructure', 'Repozitorijumi, fajlovi, baza, spoljni API adapteri i druge promenljive implementacije.'],
      ['Presentation', 'Konzola, desktop/web/API sloj; mapiranje ulaza/izlaza bez skrivene poslovne logike.'],
      ['Composition root', 'Jedno jasno mesto koje bira konkretne implementacije i sastavlja graf zavisnosti.'],
    ]),
    callout('note', 'Clean Architecture nije folder šablon', 'Dozvoljena je struktura prilagođena temi ako tim može da obrazloži smer zavisnosti i pokaže da promene infrastrukture ne zahtevaju prepisivanje poslovnog jezgra.'),
  ]),
  page('5. SOLID i kvalitet koda', [
    text('h1', '5. SOLID i kvalitet koda'),
    text('paragraph', 'SOLID se ocenjuje kroz konkretne posledice dizajna. Student treba da može da pokaže bar nekoliko mesta na kojima je promena lokalizovana zbog dobre granice ili gde je refaktorisanje uklonilo nepotrebnu zavisnost.'),
    list([
      'Klase i servisi imaju koherentne odgovornosti i razumljive razloge za promenu.',
      'Varijabilna ponašanja se po potrebi uvode kroz zamenjive ugovore umesto rastućih `switch` grananja.',
      'Implementacije istog ugovora poštuju očekivano ponašanje klijenta.',
      'Interfejsi nisu veštački veliki; klijenti ne zavise od operacija koje ne koriste.',
      'Poslovni kod zavisi od apstrakcija prema promenljivim spoljnim detaljima.',
      'Imenovanje, formatiranje i struktura koda treba da olakšaju review i budu dosledni kroz repozitorijum.'
    ]),
    callout('info', 'Dokaz na odbrani', 'Dovoljno je pokazati nekoliko kvalitetnih primera i objasniti njihov razlog. Nije potrebno svaku klasu proglasiti primerom svih SOLID principa.'),
  ]),
  page('6. Testiranje i Code Coverage', [
    text('h1', '6. Testiranje i Code Coverage'),
    text('paragraph', 'Testovi treba da štite poslovno važna ponašanja i regresije. U fokusu su ključni use-case-ovi, negativni scenariji i granice pravila. Moq se koristi tamo gde je potrebno kontrolisati promenljivu spoljnu zavisnost.'),
    list([
      'NUnit testovi za ključne use-case-ove i domenska pravila.',
      'Pozitivni, negativni i najmanje nekoliko graničnih scenarija izvedenih iz acceptance criteria.',
      'Moq ili drugi test doubles samo za zavisnosti koje test želi da izoluje.',
      'Najmanje jedan bug ili regresija demonstrirana testom pre korekcije, kada se takav slučaj pojavi tokom rada.',
      'Coverage izveštaj pregledan uz kratak komentar najmanje jedne važne nepokrivene ili slabo pokrivene grane.'
    ]),
    callout('warning', 'Coverage procenat nije dovoljan', 'Visok procenat pokrivenosti ne garantuje dobre assert-e ni relevantne scenarije. Na odbrani student treba da objasni koje pravilo test štiti i zašto je scenario važan.'),
  ]),
  page('7. Git i dokumentacija procesa', [
    text('h1', '7. Git i dokumentacija procesa'),
    text('paragraph', 'Repozitorijum mora da omogući rekonstrukciju razvoja. Istorija treba da pokaže kako je zahtev uveden, kako se implementacija menjala i gde su nastale ključne odluke.'),
    list([
      'Redovni i smisleni commit-i tokom semestra.',
      'Issue/User Story trag za glavne funkcionalnosti.',
      'Feature grane i pull request/review trag za veće promene ili ekvivalentan uredan timski workflow.',
      'Git tag `manual-core-baseline` nakon stabilizacije jezgra i osnovnih testova.',
      'README sa opisom teme, pokretanjem i glavnim demo scenarijem.',
      '`docs/architecture.md`, `AI_INSTRUCTIONS.md` i `AI_USAGE.md` kao obavezni projektni artefakti.'
    ]),
    callout('note', 'Jedan završni commit nije razvojni proces', 'Masovno kopiranje završnog projekta u repozitorijum poslednjeg dana ne pruža dokaz kontinuiranog rada i značajno otežava procenu odluka i doprinosa.'),
  ]),
  page('8. Pravila korišćenja AI alata', [
    text('h1', '8. Pravila korišćenja AI alata'),
    text('paragraph', 'AI je dozvoljen i očekivan kao deo predmeta, ali se njegova uloga uvodi postepeno. Student ne predaje projekat koji ne razume niti sme da koristi model kao neprovereni izvor konačnih odluka.'),
    table(['Faza', 'Dozvoljena/poželjna AI uloga'], [
      ['Pre manual-core-baseline', 'Analiza zahteva, pitanja za razjašnjenje, review plana, predlog test scenarija, objašnjenje postojećeg koda.'],
      ['Posle manual-core-baseline', 'Kontrolisane izmene koda u okviru instrukcija, skills i agentnog workflow-a uz build/test/diff verifikaciju.'],
      ['Završna faza', 'MCP, hooks/guardrails i evals koji povećavaju ponovljivost i proverljivost workflow-a.'],
    ]),
    list([
      'Kompletna funkcionalnost i kompletna struktura projekta ne predaju se kao neprovereni generisani rezultat.',
      'Svaka važna AI-promena mora imati razvojni dokaz: test, build, diff review ili drugi odgovarajući mehanizam.',
      'Ne unositi credential-e, tajne ili osetljive podatke u spoljne modele.',
      'Student na odbrani mora umeti da objasni i kod i AI artefakte koje je tim koristio.'
    ]),
  ]),
  page('9. Obavezni AI artefakti', [
    text('h1', '9. Obavezni AI artefakti'),
    text('paragraph', 'Artefakti treba da podržavaju stvarni workflow, a ne da postoje samo radi checkliste. Ocenjuje se da li imaju jasnu namenu, ograničenje i način verifikacije.'),
    list([
      '`AI_INSTRUCTIONS.md` sa stabilnim arhitektonskim i radnim pravilima.',
      '`AI_USAGE.md` sa reprezentativnim zapisima: zadatak, korišćen kontekst, sažetak predloga, odluka tima i verifikacija.',
      'Najmanje dva custom skill-a ili ponovljive procedure.',
      'Najmanje dve jasno razdvojene agentne uloge ili ekvivalentan agent-as-tool/handoff workflow.',
      'Mali project-specific MCP server sa resursima/tool-ovima koji rešavaju realnu potrebu projekta.',
      'Najmanje dva deterministička hook/guardrail pravila.',
      'Najmanje tri eval scenarija, uključujući negativni ili failure slučaj.'
    ]),
    callout('info', 'Kvalitet iznad broja', 'Ako tim napravi mnogo agenata i skillova bez opravdanja, dodatna složenost ne nosi automatski više bodova. Bolji je manji workflow sa jasnim granicama i dokazima.'),
  ]),
  page('10. Projektni checkpoint-i', [
    text('h1', '10. Projektni checkpoint-i'),
    text('paragraph', 'Checkpoint-i raspoređuju rizik kroz semestar i omogućavaju povratnu informaciju pre nego što greška postane skupa za ispravljanje. Svi checkpoint-i odnose se na isti repozitorijum.'),
    table(['Checkpoint', 'Minimalni dokaz'], [
      ['P1', 'Problem, backlog, acceptance criteria, početne AI instrukcije i AI_USAGE zapis.'],
      ['P2', 'Solution/slojevi, smer zavisnosti, najmanje jedan vertikalni prolaz i architecture beleška.'],
      ['P3', 'Ključni use-case-ovi, poslovna pravila i eksplicitni rezultati.'],
      ['P4', 'NUnit/Moq testovi, coverage pregled, bug/regression test i `manual-core-baseline` tag.'],
      ['P5', 'Uređene instrukcije, structured output i proverljiv AI review/analysis workflow.'],
      ['P6', 'Custom skills + najmanji smisleni agentni tok.'],
      ['P7', 'MCP integracija sa projektnim resource/tool signalima.'],
      ['P8', 'Hooks/guardrails, evals, peer QA i spremnost za odbranu.'],
    ]),
  ]),
  page('11. Naknadni change request', [
    text('h1', '11. Naknadni change request'),
    text('paragraph', 'U završnoj fazi tim dobija dodatni zahtev ili izmenu postojećeg pravila. Cilj je da se proveri da li arhitektura i proces podržavaju promenu bez nekontrolisanog širenja diff-a i bez brisanja testova koji otkrivaju regresiju.'),
    diagram('Očekivani tok izmene zahteva', [
      ['Change request', 'razumeti novo pravilo', 'slate'],
      ['Impact analysis', 'slojevi, testovi, rizici', 'cyan'],
      ['Plan', 'mali koraci i dokaz', 'blue'],
      ['Implementation', 'ograničen diff', 'violet'],
      ['Verification', 'testovi, MCP signal, review', 'emerald'],
    ]),
    list([
      'Analizirati uticaj promene na postojeće use-case-ove i poslovna pravila.',
      'Pre implementacije navesti koje testove treba dodati ili izmeniti.',
      'AI workflow se može koristiti, ali rezultat mora biti proverljiv kroz projekat.',
      'Dokumentovati najmanje jednu odluku ili kompromis koji je change request izazvao.'
    ]),
  ]),
  page('12. Peer QA i obavezna dokumentacija', [
    text('h1', '12. Peer QA i obavezna dokumentacija'),
    text('paragraph', 'Pre odbrane projekat prolazi kratak peer QA. Drugi student ili tim pokušava da pokrene sistem i prati jedan reprezentativan tok iz dokumentacije, bez oslanjanja na dodatna objašnjenja autora.'),
    list([
      'README: problem, pokretanje, konfiguracija i glavni demo scenario.',
      '`docs/architecture.md`: slojevi/granice, smer zavisnosti i važne odluke.',
      '`AI_INSTRUCTIONS.md`: stabilna pravila AI workflow-a.',
      '`AI_USAGE.md`: reprezentativne AI sesije i način verifikacije.',
      'Po potrebi README za MCP server, hooks i eval fixtures.',
      'Peer QA zapis kao Markdown beleška, issue ili PR komentar sa konkretnim rezultatom pregleda.'
    ]),
    callout('info', 'Minimalni peer QA', 'Pregledati jedan use-case i test, pokretanje iz README-a, jednu arhitektonsku granicu i jedan AI workflow. Zabeležiti šta je provereno i najmanje jednu konkretnu sugestiju ili argumentovanu potvrdu da problem nije pronađen.'),
  ]),
  page('13. Odbrana projekta', [
    text('h1', '13. Odbrana projekta'),
    text('paragraph', 'Odbrana proverava da li studenti razumeju sistem koji predaju. Svi članovi tima treba da mogu da objasne ključne elemente arhitekture i jedan reprezentativan tok, iako je normalno da su tokom razvoja imali različite primarne odgovornosti.'),
    list([
      'Demonstrirati glavni scenario i najmanje jedan negativni poslovni ishod.',
      'Izabrati jedan User Story i pratiti ga od acceptance criteria do implementacije i testa.',
      'Objasniti smer zavisnosti i jednu odluku zbog koje je određena granica uvedena.',
      'Pokazati jedan relevantan Git/PR trag.',
      'Pokazati jedan AI workflow, stvarni tool/test signal i način na koji je student procenio rezultat.',
      'Odgovoriti na praktičnu izmenu ili pitanje koje proverava razumevanje koda, a ne memorisanje prezentacije.'
    ]),
    callout('warning', 'Nepoznavanje sopstvenog projekta', 'Ako student ne može da objasni ključni deo predatog rešenja ili AI artefakta, postojanje tog koda u repozitorijumu ne smatra se dovoljnim dokazom usvojenog ishoda.'),
  ]),
  page('14. Predlog kriterijuma ocenjivanja', [
    text('h1', '14. Predlog kriterijuma ocenjivanja'),
    text('paragraph', 'Bodovanje treba da favorizuje konzistentan inženjerski rad. Tačne težine mogu biti usklađene sa konačnim planom predmeta, ali kvalitet jezgra, procesa i AI integracije treba posmatrati odvojeno.'),
    table(['Oblast', 'Predloženi udeo'], [
      ['Softversko-inženjerska ispravnost', '40% — zahtevi, SOLID, arhitektura, poslovna logika, kvalitet implementacije.'],
      ['Testiranje i verifikacija', '20% — NUnit/Moq, negativni scenariji, coverage interpretacija, regresije.'],
      ['Git i razvojni proces', '15% — istorija, PR/review, dokumentacija odluka i checkpoint kontinuitet.'],
      ['AI engineering', '20% — instructions, skills, agents, MCP, hooks/guardrails i evals sa opravdanjem.'],
      ['Dokumentacija i odbrana', '5% — reproduktivnost projekta i sposobnost objašnjavanja odluka.'],
    ]),
    callout('note', 'Uslov kvaliteta', 'Veći broj funkcionalnosti ili agenata ne kompenzuje ozbiljne probleme u arhitekturi, testiranju ili razumevanju sopstvenog koda. Projekat se posmatra kao celina.'),
  ]),
]

export const projectSpec2026: CourseDocument = {
  version: 2,
  id: 'ers-project-spec-2026-27-current',
  title: 'Specifikacija projektnog zadatka 2026/27',
  subtitle: 'Elementi razvoja softvera',
  subject: 'Elementi razvoja softvera',
  kind: 'specifikacija',
  headerText: 'Elementi razvoja softvera · 2026/2027',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-08-25T12:00:00.000Z',
  updatedAt: '2026-08-25T14:00:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'blue', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), ...pages()],
}
