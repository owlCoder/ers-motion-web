import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise8 = (): DocumentPage[] => [
  page('Vežba 8 — Skills, agenti i subagenti', [
    text('h1', 'Vežba 8 — Skills, agenti i subagenti'),
    text('paragraph', 'Kada se isti razvojni postupak ponavlja, korisno je izdvojiti ga iz pojedinačnog prompta u ponovljivu proceduru. Skill opisuje takvu proceduru, dok agent dobija jasno definisanu ulogu, instrukcije i skup dozvoljenih alata. Cilj nije povećavanje broja agenata, već razdvajanje odgovornosti tamo gde ono smanjuje količinu nepotrebnog konteksta, rizik i broj neproverenih odluka.'),
    image('/course-assets/agents.svg', 'Primer malog razvojnog tima: koordinator, arhitekta, implementator, agent za testiranje i agent za pregled.', 'Podela odgovornosti u agentskom toku rada'),
    table(['Koncept', 'Analogija iz softverskog inženjerstva'], [
      ['Skill', 'Ponovljiva procedura koja čuva znanje o razvojnom postupku.'],
      ['Specijalizovani agent', 'Komponenta sa jednom jasno ograničenom odgovornošću.'],
      ['Dozvole alata', 'Ograničen skup operacija koje komponenta sme da izvrši.'],
      ['Predaja zadatka', 'Eksplicitan prenos zadatka, relevantnog konteksta i očekivanog izlaza između uloga.'],
      ['Evaluacija toka rada', 'Integraciona provera ponašanja celog agentskog toka.'],
    ]),
  ]),
  page('8.1. Skill kao ponovljiva procedura', [
    text('h2', '8.1. Skill kao ponovljiva procedura'),
    text('paragraph', 'Skill nije samo dugačak prompt sa imenom. Dobar skill definiše kada se koristi, šta očekuje kao ulaz, koje korake sprovodi, koji format vraća i na koji način se rezultat proverava. Time se znanje o razvojnom postupku čuva u repozitorijumu i verzioniše zajedno sa projektom.'),
    code('markdown', `# review-pull-request / SKILL.md\n\n## Purpose\nReview one pull request for correctness, scope and architecture.\n\n## Inputs\n- issue or acceptance criteria\n- git diff\n- relevant project instructions\n- test result when available\n\n## Procedure\n1. Restate the intended behavior.\n2. Inspect the diff for unrelated changes.\n3. Check layer/dependency rules.\n4. Check error paths and edge cases.\n5. Compare changed behavior with tests.\n6. Report findings by severity.\n\n## Output\n- Blocking findings\n- Non-blocking findings\n- Missing tests\n- Verification summary\n\nDo not modify code.`),
    list([
      'Skill treba da rešava ponovljiv problem, a ne jedan konkretan issue po imenu.',
      'Koraci treba da budu dovoljno jasni da dva korišćenja proizvedu sličan format i tok rada.',
      'Skill treba eksplicitno da navede šta ne radi; procedura za pregled pull request-a, na primer, ne mora da ima pravo izmene koda.',
    ]),
    callout('task', 'Rad na vežbi', 'Napraviti skill za planiranje testova, pregled pull request-a ili drugu stvarnu potrebu projekta. Primeni ga na dva različita slučaja i nakon prvog pokušaja doraditi proceduru ako je rezultat bio nejasan ili nedosledan.'),
  ]),
  page('8.2. Agent kao ograničena odgovornost', [
    text('h2', '8.2. Agent kao ograničena odgovornost'),
    text('paragraph', 'Agent dobija ulogu, cilj, kontekst i alate. Kao i kod SRP-a, granica ima smisla ako sprečava mešanje nepovezanih odgovornosti. Agent arhitekta može analizirati slojeve i rizike bez izmene koda; agent implementator može menjati kod u skladu sa odobrenim planom; agent za testiranje pokreće testove i analizira neuspehe; agent za pregled analizira diff bez pisanja nove implementacije.'),
    table(['Uloga agenta', 'Dozvoljeno', 'Namerno ograničenje'], [
      ['Arhitekta', 'Čitanje koda i dokumentacije, planiranje i arhitektonska analiza.', 'Ne menja kod.'],
      ['Implementator', 'Izmena izvornog koda u okviru odobrenog plana.', 'Ne proširuje samostalno zahtev.'],
      ['Agent za testiranje', 'Pokretanje testova, analiza pokrivenosti i neuspešnih scenarija.', 'Ne menja test da bi prikrio kvar bez obrazloženja.'],
      ['Agent za pregled', 'Čitanje issue-ja, diff-a i rezultata testova.', 'Ne menja diff koji ocenjuje.'],
    ]),
    callout('info', 'Ograničenja povećavaju proverljivost', 'Kada agent za pregled nema pravo izmene koda, njegov nalaz može se posmatrati odvojeno od implementacije. Kada agent za testiranje ne projektuje arhitekturu, rezultat testa ostaje razvojni signal, a ne nova implicitna dizajnerska odluka.'),
  ]),
  page('8.3. Minimalna konfiguracija specijalizovanog agenta', [
    text('h2', '8.3. Minimalna konfiguracija specijalizovanog agenta'),
    text('paragraph', 'Konfiguracija agenta treba da bude kratka, proverljiva i usklađena sa odgovornošću koju agent ima. Sledeći primer prikazuje agenta za pregled sa pristupom samo za čitanje. Sintaksa konkretne platforme može se menjati, ali su uloga, opis, dozvoljeni alati i eksplicitno ograničenje stabilni koncepti.'),
    code('markdown', `---\nname: reviewer\ndescription: Reviews pull request diffs for correctness, scope and architecture.\ntools: Read, Grep, Glob\n---\n\nYou are a read-only code reviewer.\n\nFor every review:\n1. Restate the intended behavior.\n2. Inspect only files relevant to the change.\n3. Check architecture and dependency rules.\n4. Identify missing negative or boundary tests.\n5. Report findings by severity.\n\nDo not edit files.\nDo not broaden the requested scope.\nFor every finding, cite the relevant file and explain how it was verified.`, 'Primer datoteke `.claude/agents/reviewer.md`'),
    callout('note', 'Konfiguracija ne zamenjuje proveru', 'Ograničene dozvole smanjuju površinu rizika, ali nalaz agenta i dalje treba proveriti u kodu, zahtevima i rezultatima testova. Konfiguraciona datoteka se verzioniše kao deo projekta.'),
  ]),
  page('8.4. Orkestracija i predaja zadatka', [
    text('h2', '8.4. Orkestracija i predaja zadatka između uloga'),
    text('paragraph', 'Koordinacioni agent ne mora da bude najsloženiji agent. Njegova osnovna uloga je da odredi sledeći korak i preda minimalan potreban kontekst specijalizovanoj ulozi. Predaja zadatka treba da prenese zahtev, relevantne odluke, ograničenja i očekivani rezultat, a ne celokupnu istoriju razgovora.'),
    diagram('Primer toka za jednu projektnu stavku', [
      ['Arhitekta', 'uticaj, granice i plan', 'cyan'],
      ['Implementator', 'mali implementacioni diff', 'blue'],
      ['Testiranje', 'ciljani i kompletni testovi', 'emerald'],
      ['Pregled', 'obim, ispravnost i nedostajući testovi', 'amber'],
      ['Završni izveštaj', 'rezultat, rizici i dokaz', 'violet'],
    ]),
    code('json', `{
  "task": "Implement PREMIUM-42 according to approved plan",
  "constraints": [
    "Do not move discount rules into controllers",
    "Keep SeasonalDiscount behavior unchanged"
  ],
  "files_to_consider": [
    "src/Application/DiscountService.cs",
    "tests/DiscountServiceTests.cs"
  ],
  "expected_output": "small diff plus verification commands"
}`,'Primer eksplicitne predaje zadatka'),
  ]),
  page('8.5. Jedan agent ili više specijalizovanih uloga?', [
    text('h2', '8.5. Više agenata nije automatski bolje'),
    text('paragraph', 'Svaka dodatna predaja zadatka uvodi trošak: deo konteksta može biti izgubljen, povećava se vreme izvršavanja i složenija je dijagnostika problema u toku rada. Zbog toga se agentska arhitektura mora opravdati. Za mali lokalni refaktoring jedan dobro ograničen agent može biti prikladniji od niza specijalizovanih uloga.'),
    table(['Kriterijum', 'Jedan agent', 'Specijalizovani agenti'], [
      ['Mali lokalni zadatak', 'Često je dovoljan i jednostavniji.', 'Mogu predstavljati nepotreban organizacioni trošak.'],
      ['Jasno odvojene faze plan → kod → pregled', 'Može mešati kontekst i uloge.', 'Granice mogu povećati disciplinu i sledljivost.'],
      ['Osetljive dozvole za izmenu', 'Teže je ograničiti pojedinačne faze.', 'Arhitekta i agent za pregled mogu imati pristup samo za čitanje.'],
      ['Trošak i vreme odziva', 'Najčešće su niži.', 'Veći su zbog više poziva i predaja zadatka.'],
      ['Dijagnostika problema', 'Jednostavniji tok.', 'Odgovorna faza se lakše locira ako su međurezultati dobro strukturirani.'],
    ]),
    callout('task', 'Eksperiment na vežbi', 'Istu malu projektnu stavku rešiti u dve varijante: A) jedan agent od analize do završnog izveštaja; B) arhitekta → implementator → testiranje → pregled. Uporediti broj pokušaja, veličinu diff-a, broj nepotrebnih promena, vreme izvršavanja i kvalitet završnog pregleda.'),
  ]),
  page('8.6. Projektna kontrolna tačka P6', [
    text('h2', '8.6. Projektna kontrolna tačka P6 — skills i agentski tok rada'),
    text('paragraph', 'Do ove kontrolne tačke tim treba da pokaže da je tok rada uz podršku AI alata deo repozitorijuma i da rešava stvaran problem projekta. Ne zahteva se veliki višeagentski sistem; traži se najmanji smisleni skup uloga i procedura koji može ponovljivo da se demonstrira.'),
    list([
      'Najmanje dva prilagođena skill-a sa jasnim ulazom, koracima, izlazom i ograničenjima.',
      'Najmanje dve agentske uloge sa različitim odgovornostima ili dozvolama.',
      'Dokumentovana predaja zadatka ili obrazac u kome jedan agent koristi drugog kao alat za jednu stvarnu projektnu stavku.',
      'Najmanje jedan eksperiment koji poredi jednostavniji i složeniji tok rada.',
      '`AI_USAGE.md` beleži gde je AI podrška bila korisna i gde je bila potrebna ručna korekcija.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Napraviti agenta ili skill za pregled koda koji nema pravo izmene datoteka i pokrenuti ga nad sopstvenim pull request diff-om. Bonus se dobija samo ako student navede najmanje jedan nalaz koji je proverio u kodu, čak i kada ga na kraju odbaci.'),
  ]),
]
