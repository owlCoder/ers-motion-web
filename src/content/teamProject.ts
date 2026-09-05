import type { CourseDocument, DocumentPage } from '../types'
import { callout, code, diagram, image, list, page, table, text } from './canvaPracticumShared'

const projectPages = (): DocumentPage[] => [
  page('1. Projekat kao simulacija softverske firme', [
    text('h1', '1. Projekat kao simulacija softverske firme'),
    text('paragraph', 'Semestralni projekat se organizuje kao razvoj jednog zajedničkog softverskog proizvoda. Studenti rade u timovima od približno 6 do 10 članova. Svaki tim preuzima odgovornost za jedan poslovni domen, ali svi timovi rade nad istim repozitorijumom, istim skupom razvojnih pravila i zajedničkom arhitekturom.'),
    callout('info', 'Jedan proizvod, više timova', 'Cilj nije da svaki tim napravi zasebnu aplikaciju. Cilj je da više timova zajedno izgradi jedan koherentan sistem i pritom nauči kako se u stvarnom razvoju upravlja granicama modula, zavisnostima, code review-om, integracijom i zajedničkim standardima.'),
    diagram('Organizacija projekta', [
      ['Zajednički proizvod', 'Jedan repozitorijum i jedan integrisani sistem', 'blue'],
      ['Domenski timovi', 'Svaki tim poseduje svoj modul i backlog', 'violet'],
      ['Platforma', 'Zajednički auth, permissions, audit, CI i shared kod', 'cyan'],
      ['Integracija', 'Timovi ugovaraju granice i proveravaju međusobne zavisnosti', 'emerald'],
    ], 'Organizacioni model treba da liči na malu softversku firmu, a ne na skup nepovezanih studentskih projekata.'),
  ]),

  page('2. Predlog domena i timova', [
    text('h1', '2. Predlog domena i timova'),
    text('paragraph', 'Konkretni domeni mogu se prilagoditi broju studenata, ali svaki tim treba da ima dovoljno samostalnog posla i bar jednu realnu zavisnost prema drugom timu. Time projekat dobija potrebu za saradnjom, a ne samo podelu fajlova.'),
    table(['Tim / domen', 'Primer odgovornosti'], [
      ['Accounting', 'Fakture, prihodi, rashodi, knjiženja, obračuni i finansijski izveštaji.'],
      ['Ticketing', 'Korisnički zahtevi, komentari, statusi, prioriteti, SLA i eskalacije.'],
      ['CRM', 'Klijenti, kontakti, lead-ovi, poslovne prilike i istorija komunikacije.'],
      ['Inventory', 'Artikli, skladišta, stanje zaliha, ulaz/izlaz i rezervacije.'],
      ['HR', 'Zaposleni, organizacione jedinice, odsustva i osnovni radni podaci.'],
      ['Projects', 'Projekti, zadaci, članovi, evidencija rada i rokovi.'],
      ['Platform', 'Autentifikacija, autorizacija, audit log, notifikacije, shared infrastruktura i razvojni standardi.'],
      ['Analytics', 'Dashboard-i, KPI, agregacije i izveštavanje nad podacima više domena.'],
    ]),
    callout('note', 'Broj timova nije fiksan', 'Ako grupa nema dovoljno studenata za sve domene, domeni se spajaju. Ako je grupa velika, domen se može podeliti na dva koherentna poddomena. Bitno je da granice budu eksplicitne i obrazložene.'),
  ]),

  page('3. Uloge i odgovornost članova tima', [
    text('h1', '3. Uloge i odgovornost članova tima'),
    text('paragraph', 'Tim treba da organizuje posao kao razvojna jedinica, ali uloge nisu trajne etikete. Tokom semestra studenti treba da rotiraju odgovornosti kako bi svaki član prošao kroz analizu zahteva, implementaciju, testiranje, code review i bar jedan zadatak vezan za automatizaciju ili razvojni proces.'),
    table(['Uloga / odgovornost', 'Šta se očekuje'], [
      ['Tech lead / koordinator', 'Pomaže da se tehničke odluke usaglase i prati zavisnosti, ali nije jedina osoba koja razume sistem.'],
      ['Feature developer', 'Implementira vertikalni deo funkcionalnosti uz testove i poštovanje projektnih granica.'],
      ['Reviewer', 'Pregleda dizajn i diff, traži dokaz ispravnosti i proverava čitljivost i održivost.'],
      ['QA / verification owner', 'Priprema scenarije, proverava acceptance criteria i regresije.'],
      ['Automation owner', 'Prepoznaje ručni korak koji se može pouzdano automatizovati kroz CI, skriptu, hook ili drugi mehanizam.'],
      ['AI usage owner', 'Pazi da tim vodi proverljiv trag upotrebe AI alata i da se generisani rezultat nezavisno verifikuje.'],
    ]),
    callout('warning', 'Nema trajnog „QA studenta“ ili „DevOps studenta“', 'Rotacija sprečava da pojedinac završi semestar bez dovoljno razvoja ili bez razumevanja ostatka procesa. Odbrana je individualna čak i kada je rezultat timski.'),
  ]),

  page('4. Tapiz Boards: backlog po timu', [
    text('h1', '4. Tapiz Boards: backlog po timu'),
    text('paragraph', 'Svaki tim vodi svoj operativni backlog u Tapiz Boards. Board nije dekoracija za kraj sprinta, već primarni trag planiranja i praćenja rada. User Story treba da opisuje poslovnu vrednost, a taskovi konkretne tehničke korake i verifikaciju.'),
    image('/course-assets/tapiz-team-backlog.svg', 'Primer timskog backlog-a. Ista pravila iz praktikuma o User Story-jima, acceptance criteria, prioritetima i procenama ostaju obavezna.', 'Tapiz Boards timski backlog'),
    table(['Status', 'Značenje'], [
      ['Backlog', 'Ideja ili zahtev postoji, ali još nije spreman za implementaciju.'],
      ['Ready', 'Zahtev je dovoljno jasan, ima acceptance criteria i može da se preuzme.'],
      ['In Progress', 'Rad je aktivno u toku i postoji odgovorna osoba.'],
      ['Code Review', 'Implementacija je spremna za tehničku proveru drugog člana.'],
      ['QA / Verify', 'Proveravaju se kriterijumi prihvatanja, testovi i integracija.'],
      ['Done', 'Promena je integrisana, proverena i ispunjava Definition of Done.'],
    ]),
    callout('task', 'Obavezna veza', 'Naziv grane, commit ili Pull Request treba da može da se poveže sa odgovarajućom stavkom na Tapiz board-u. Backlog mora da odražava stvarno stanje razvoja.'),
  ]),

  page('5. Jedan repozitorijum i vlasništvo nad modulima', [
    text('h1', '5. Jedan repozitorijum i vlasništvo nad modulima'),
    text('paragraph', 'Svi timovi rade nad jednim repozitorijumom. Preporučeni arhitektonski pravac je modularni monolit: domeni su jasno odvojeni, ali se sistem razvija i isporučuje kao jedna celina. Mikroservisi nisu cilj predmeta i ne uvode se samo zato što postoji više timova.'),
    code('text', `src/
  modules/
    accounting/
    ticketing/
    crm/
    inventory/
  platform/
    auth/
    permissions/
    notifications/
    audit/
  shared/
    contracts/
    validation/
    common/`, 'Ilustrativna struktura; konkretna struktura zavisi od tehnologije i arhitektonskih odluka tima.'),
    list([
      'Tim ima primarno vlasništvo nad svojim domenom i odgovara za njegov kvalitet.',
      'Izmena shared/platform koda mora da bude opravdana i pregledana od odgovarajućeg vlasnika.',
      'Tim ne sme da duplira tuđi domenski model samo da bi izbegao koordinaciju.',
      'Zavisnosti između domena treba da prolaze kroz jasne ugovore, use-case granice ili druge eksplicitne interfejse.',
      'SOLID, Clean Code i Clean Architecture principi iz praktikuma ostaju kriterijum svake tehničke odluke.'
    ]),
  ]),

  page('6. Git workflow i Pull Request kao ugovor', [
    text('h1', '6. Git workflow i Pull Request kao ugovor'),
    text('paragraph', 'Direktan rad na glavnoj grani nije prihvatljiv razvojni tok. Svaka promena treba da prolazi kroz kratkotrajnu granu, proveru i Pull Request. Cilj nije birokratija, već proverljiv razvojni trag i zaštita zajedničkog proizvoda od neproverenih promena.'),
    code('bash', `git switch main
git pull
git switch -c feature/ACC-123-create-invoice
# rad + lokalna provera
git add .
git commit -m "ACC-123 implement invoice creation"
git push -u origin feature/ACC-123-create-invoice`, 'Primer toka za zadatak povezan sa backlog stavkom.'),
    table(['Pull Request mora da pokaže', 'Minimalno očekivanje'], [
      ['Zašto', 'Koji zahtev ili problem se rešava.'],
      ['Šta', 'Sažetak promene i pogođeni moduli.'],
      ['Kako je provereno', 'Testovi, build, scenariji ili drugi dokaz.'],
      ['Rizik', 'Mogući uticaj na druge timove ili shared delove sistema.'],
      ['AI trag', 'Kada je AI korišćen na relevantan način, evidentirati ga prema pravilima praktikuma i `AI_USAGE.md`.'],
    ]),
    callout('success', 'Main treba da ostane stabilan', 'Promena se ne smatra završenom kada „radi kod autora“. Završena je kada je pregledana, proverena i bezbedno integrisana.'),
  ]),

  page('7. Definition of Done i kvalitet', [
    text('h1', '7. Definition of Done i kvalitet'),
    text('paragraph', 'Svaki tim koristi zajednički Definition of Done. Tim može dodati strože uslove za svoj domen, ali ne može ukloniti zajedničke kriterijume.'),
    list([
      'Acceptance criteria su ispunjeni i mogu da se demonstriraju.',
      'Kod poštuje dogovorene granice modula, SOLID i Clean Code principe.',
      'Postoje odgovarajući unit, integracioni ili drugi testovi u skladu sa rizikom promene.',
      'Lokalni build i obavezne automatizovane provere prolaze.',
      'Pull Request je pregledao najmanje jedan drugi član, a cross-team promena i vlasnik pogođenog domena.',
      'Tapiz stavka je ažurirana i povezana sa stvarnim razvojnim tragom.',
      'Dokumentacija, ADR ili ugovor su ažurirani kada promena utiče na arhitekturu ili druge timove.',
      'Upotreba AI alata je evidentirana kada to zahtevaju pravila praktikuma; student može da objasni i verifikuje rezultat.',
    ]),
    callout('warning', 'Done nije „kod postoji“', 'Neproveren feature, nejasan diff, neprolazeći testovi ili promena koju autor ne ume da objasni nisu završena stavka.'),
  ]),

  page('8. Cross-team zavisnosti i arhitektonske odluke', [
    text('h1', '8. Cross-team zavisnosti i arhitektonske odluke'),
    text('paragraph', 'Najvredniji deo zajedničkog projekta nastaje kada jedan domen zavisi od drugog. Na primer, Accounting može koristiti klijenta koji pripada CRM domenu, dok Ticketing može koristiti identitet korisnika iz Platform dela sistema. Takve zavisnosti se ne rešavaju kopiranjem podataka bez dogovora.'),
    diagram('Primer zavisnosti', [
      ['CRM', 'Poseduje Customer podatke', 'violet'],
      ['Accounting', 'Koristi Customer za fakture', 'blue'],
      ['Platform', 'Pruža identitet i permissions', 'cyan'],
      ['Ticketing', 'Koristi korisnika i klijenta', 'emerald'],
    ], 'Granica vlasništva mora biti poznata timu koji koristi podatke i timu koji ih poseduje.'),
    text('h2', '8.1. Architecture Council'),
    text('paragraph', 'Jedan predstavnik svakog tima učestvuje u kratkom periodičnom tehničkom usaglašavanju. Teme su shared modeli, breaking changes, API/contract pravila, nove biblioteke, permissions, migracije i druge odluke koje utiču na više domena.'),
    text('h2', '8.2. ADR za važne odluke'),
    code('markdown', `# ADR-004: Real-time notifications

## Context
Zašto postoji potreba?

## Options
1. Polling
2. Server-Sent Events
3. WebSockets

## Decision
Izabrana opcija i obrazloženje.

## Consequences
Dobici, ograničenja i budući troškovi.`, 'Minimalni oblik Architecture Decision Record-a.'),
  ]),

  page('9. Automatizacija kao deo projekta', [
    text('h1', '9. Automatizacija kao deo projekta'),
    text('paragraph', 'Od svakog tima se očekuje da tokom semestra prepozna najmanje jedan ponavljajući ručni korak i pretvori ga u pouzdanu automatizaciju. Automatizacija mora rešavati stvaran problem projekta, a ne postojati samo radi demonstracije alata.'),
    diagram('Od ručnog koraka do guardrail-a', [
      ['Ručni problem', 'Tim ponavlja istu proveru ili postupak', 'amber'],
      ['Pravilo', 'Definiše se šta tačno znači uspeh ili greška', 'blue'],
      ['Automatizacija', 'CI, skripta, hook, skill ili agent izvršava postupak', 'violet'],
      ['Signal', 'Rezultat je vidljiv timu i utiče na odluku o merge-u ili isporuci', 'emerald'],
    ]),
    list([
      'lint, format, build i test pipeline za Pull Request;',
      'provera naming konvencije grane ili povezanosti sa backlog stavkom;',
      'test coverage ili quality gate;',
      'automatska provera migracija, ugovora ili generated artefakata;',
      'release notes, changelog ili verzionisanje;',
      'security/dependency provera;',
      'AI skill, hook ili guardrail zasnovan na realnoj potrebi projekta.'
    ]),
    callout('note', 'Automatizuj tek kada razumeš ručni proces', 'Loša automatizacija samo brže ponavlja loš ili nejasan postupak. Student treba da ume da objasni ulaz, izlaz, failure mode i način verifikacije automatizacije.'),
  ]),

  page('10. AI usage kao kontrolisan razvojni alat', [
    text('h1', '10. AI usage kao kontrolisan razvojni alat'),
    text('paragraph', 'Pravila iz praktikuma za razvoj uz podršku AI alata važe u punom obimu i na zajedničkom projektu. AI se može koristiti za analizu zahteva, predlog rešenja, refaktorisanje, testove, dokumentaciju, review i automatizaciju, ali generisani rezultat nije dokaz ispravnosti.'),
    table(['Dozvoljena i korisna upotreba', 'Obavezna odgovornost studenta'], [
      ['Razlaganje zahteva i acceptance criteria', 'Proveriti da zahtev odgovara stvarnom backlog-u i domenu.'],
      ['Predlog arhitekture ili refaktorisanja', 'Uporediti alternative i obrazložiti konačnu odluku.'],
      ['Generisanje ili izmena koda', 'Pregledati diff, pokrenuti testove i razumeti svaku relevantnu promenu.'],
      ['Generisanje testova', 'Proveriti da test stvarno dokazuje ponašanje i da ne testira samo sopstvenu implementaciju.'],
      ['Code review pomoć', 'Ne prihvatiti nalaz bez reprodukcije ili tehničkog obrazloženja.'],
      ['Skills / agents / MCP / hooks', 'Koristiti ih kao ponovljive procedure sa jasnim granicama, a ne kao neprovereni autopilot.'],
    ]),
    callout('task', '`AI_USAGE.md` ostaje obavezan trag', 'Za relevantne AI sesije evidentirati cilj, korišćeni kontekst, šta je prihvaćeno ili odbačeno i kako je rezultat verifikovan. Na odbrani student mora biti sposoban da objasni konačno rešenje bez oslanjanja na istoriju razgovora sa AI alatom.'),
  ]),

  page('11. Incident i regresija kao nastavna situacija', [
    text('h1', '11. Incident i regresija kao nastavna situacija'),
    text('paragraph', 'Zajednički repozitorijum omogućava realistične vežbe regresije i incidenta. Nastavnik ili asistent može zadati scenario u kome promena jednog tima neočekivano utiče na drugi domen. Cilj nije traženje krivca, nego rekonstrukcija tehničkog uzroka i poboljšanje sistema provera.'),
    table(['Korak', 'Pitanje'], [
      ['Impact', 'Šta korisnik više ne može da uradi i koji domeni su pogođeni?'],
      ['Timeline', 'Koja promena i koji trenutak su povezani sa pojavom problema?'],
      ['Root cause', 'Koja konkretna tehnička pretpostavka ili promena je izazvala regresiju?'],
      ['Detection gap', 'Zašto testovi, review ili CI nisu otkrili problem pre integracije?'],
      ['Recovery', 'Kako se sistem vraća u stabilno stanje?'],
      ['Prevention', 'Koji novi test, ugovor, guardrail ili proces umanjuje verovatnoću ponavljanja?'],
    ]),
    callout('success', 'Postmortem je artefakt učenja', 'Kvalitet odgovora se meri dubinom tehničke analize i konkretnim poboljšanjem, ne time da li tim može da pokaže na osobu koja je napravila grešku.'),
  ]),

  page('12. Veza sa kontrolnim tačkama praktikuma', [
    text('h1', '12. Veza sa kontrolnim tačkama praktikuma'),
    text('paragraph', 'Novi organizacioni model ne zamenjuje P1–P8 iz praktikuma. On definiše kontekst u kome ih svaki tim primenjuje i način na koji se rezultati integrišu u zajednički proizvod.'),
    table(['Kontrolna tačka', 'Primena u timskom projektu'], [
      ['P1', 'Tim definiše svoj poslovni problem, backlog, acceptance criteria i početni AI trag u okviru dodeljenog domena.'],
      ['P2', 'Tim definiše granice svog modula i najmanje jedan vertikalni prolaz, uz eksplicitne cross-team ugovore gde su potrebni.'],
      ['P3', 'Use-case-ovi i poslovni ishodi moraju biti koherentni unutar domena i kompatibilni sa zajedničkim sistemom.'],
      ['P4', 'Funkcionalno jezgro se testira i stabilizuje; tim zna šta čini njegovu manual-core baseline tačku.'],
      ['P5', 'Projektne instrukcije i `AI_USAGE.md` primenjuju se dosledno u zajedničkom repozitorijumu.'],
      ['P6', 'Skills i agentski tokovi rešavaju ponovljiv postupak konkretnog tima ili shared procesa.'],
      ['P7', 'MCP resursi i alati koriste stvarne signale projekta i poštuju granice odgovornosti.'],
      ['P8', 'Hooks, guardrails, evaluacioni scenariji, vršnjačka provera i završna odbrana obuhvataju i integraciju sa drugim timovima.'],
    ]),
  ]),

  page('13. Minimalni projektni artefakti', [
    text('h1', '13. Minimalni projektni artefakti'),
    text('paragraph', 'Pored funkcionalnog koda, projekat mora da ostavi dovoljno tragova da se može rekonstruisati kako je tim radio i kako je donosio odluke.'),
    list([
      'Tapiz board sa stvarnim backlog-om, prioritetima, acceptance criteria i statusima;',
      'Git istorija sa smislenim granama, commit-ima i Pull Request-ovima;',
      'README i lokalne instrukcije za pokretanje/proveru relevantnog dela sistema;',
      'testovi i automatizovane provere koje odgovaraju riziku domena;',
      '`AI_USAGE.md` i ostali artefakti razvoja uz podršku AI alata zahtevani praktikumom;',
      'ADR zapisi za odluke koje imaju dugoročan ili cross-team uticaj;',
      'jasni ugovori između domena kada jedan tim koristi podatke ili ponašanje drugog;',
      'najmanje jedna korisna automatizacija ili guardrail po timu;',
      'završna demonstracija integrisanog proizvoda, ne izolovanog modula.'
    ]),
    callout('info', 'Glavno merilo', 'Dobar projekat nije samo zbir feature-a. Dobar projekat pokazuje da tim ume da razvija održiv softver u okruženju u kome postoje drugi timovi, zajednički standardi, zavisnosti i potreba za proverljivim procesom.'),
  ]),
]

export const teamProject2026: CourseDocument = {
  version: 1,
  id: 'ers-team-project-2026-27',
  title: 'Projekat 2026/27',
  subtitle: 'Timski razvoj jednog zajedničkog softverskog proizvoda',
  subject: 'Elementi razvoja softvera',
  kind: 'dokument',
  headerText: 'Elementi razvoja softvera',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-09-05T12:00:00.000Z',
  updatedAt: '2026-09-05T12:00:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'violet', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: projectPages(),
}
