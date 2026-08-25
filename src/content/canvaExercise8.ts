import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise8 = (): DocumentPage[] => [
  page('Vežba 8 — Skills, agenti i subagenti', [
    text('h1', 'Vežba 8 — Skills, agenti i subagenti'),
    text('paragraph', 'Kada se isti razvojni postupak ponavlja, korisno je izdvojiti ga iz pojedinačnog prompta u ponovljivu proceduru. Skill opisuje takvu proceduru, dok agent dobija jasnu ulogu, instrukcije i skup dozvoljenih alata. Cilj nije da se napravi što više agenata, već da se odgovornosti razdvoje tamo gde to smanjuje kontekst, rizik i broj neproverenih odluka.'),
    image('/course-assets/agents.svg', 'Primer malog razvojnog tima: orchestrator, architect, developer, tester i reviewer.', 'Agentna arhitektura'),
    table(['Koncept', 'Analogija iz softverskog inženjerstva'], [
      ['Skill', 'Ponovljiva procedura ili reusable service/workflow.'],
      ['Specialized agent', 'Komponenta sa jednom jasno ograničenom odgovornošću.'],
      ['Tool permission', 'Ograničen interfejs/kapabilitet komponente.'],
      ['Agent handoff', 'Eksplicitan prenos zadatka i konteksta između uloga.'],
      ['Workflow eval', 'Integracioni test ponašanja celog agentnog toka.'],
    ]),
  ]),
  page('8.1. Skill kao ponovljiva procedura', [
    text('h2', '8.1. Skill kao ponovljiva procedura'),
    text('paragraph', 'Skill nije samo „dugačak prompt sa imenom“. Dobar skill definiše kada se koristi, šta očekuje kao ulaz, koje korake sprovodi, koji format vraća i na koji način se rezultat proverava. Time se znanje o procesu čuva u repozitorijumu i može da se verzioniše.'),
    code('markdown', `# review-pull-request / SKILL.md\n\n## Purpose\nReview one pull request for correctness, scope and architecture.\n\n## Inputs\n- issue or acceptance criteria\n- git diff\n- relevant project instructions\n- test result when available\n\n## Procedure\n1. Restate the intended behavior.\n2. Inspect the diff for unrelated changes.\n3. Check layer/dependency rules.\n4. Check error paths and edge cases.\n5. Compare changed behavior with tests.\n6. Report findings by severity.\n\n## Output\n- Blocking findings\n- Non-blocking findings\n- Missing tests\n- Verification summary\n\nDo not modify code.`),
    list([
      'Skill treba da rešava ponovljiv problem, ne jedan konkretan issue po imenu.',
      'Koraci treba da budu dovoljno jasni da dva korišćenja daju sličan format i tok rada.',
      'Skill treba da navede šta ne radi; review skill, na primer, ne mora da dobije pravo da uređuje kod.'
    ]),
    callout('task', 'Rad na vežbi', 'Napraviti skill za `write-test-plan`, `review-pull-request` ili sličnu stvarnu potrebu projekta. Primeni ga na dva različita slučaja i nakon prvog pokušaja doradi proceduru ako je izlaz bio nejasan ili nedosledan.'),
  ]),
  page('8.2. Agent kao ograničena odgovornost', [
    text('h2', '8.2. Agent kao ograničena odgovornost'),
    text('paragraph', 'Agent dobija ulogu, cilj, kontekst i alate. Kao i kod SRP-a, granica ima smisla ako sprečava mešanje nepovezanih odgovornosti. Architect agent može analizirati slojeve i rizike bez izmene koda; Developer može menjati kod u skladu sa planom; Tester može pokretati testove i analizirati kvarove; Reviewer može pregledati diff bez pisanja nove implementacije.'),
    table(['Agent', 'Dozvoljeno', 'Namerno ograničenje'], [
      ['Architect', 'Čitanje koda/dokumentacije, plan, arhitektonska analiza.', 'Ne menja kod.'],
      ['Developer', 'Izmena source fajlova u okviru odobrenog plana.', 'Ne odlučuje sam da proširi zahtev.'],
      ['Tester', 'Pokretanje testova, coverage i analiza failure-a.', 'Ne „popravlja“ test da sakrije kvar bez objašnjenja.'],
      ['Reviewer', 'Čitanje issue-ja, diff-a i test rezultata.', 'Ne menja diff koji ocenjuje.'],
    ]),
    callout('info', 'Granice povećavaju proverljivost', 'Kada reviewer nema write pristup, njegov nalaz se može posmatrati odvojeno od implementacije. Kada tester ne projektuje arhitekturu, rezultat testa ostaje razvojni signal, a ne nova nevidljiva dizajnerska odluka.'),
  ]),
  page('8.3. Orkestracija i handoff', [
    text('h2', '8.3. Orkestracija i handoff između uloga'),
    text('paragraph', 'Orchestrator ne mora da bude „najpametniji agent“; njegova osnovna uloga je da odredi sledeći korak i preda minimalan potreban kontekst specijalizovanoj ulozi. Handoff treba da prenese zadatak, relevantne odluke i očekivani rezultat, umesto cele istorije razgovora.'),
    diagram('Primer toka za jedan issue', [
      ['Architect', 'uticaj, granice i plan', 'cyan'],
      ['Developer', 'mali implementacioni diff', 'blue'],
      ['Tester', 'targeted + full test signal', 'emerald'],
      ['Reviewer', 'scope, correctness, missing tests', 'amber'],
      ['Final report', 'rezultat + rizici + dokaz', 'violet'],
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
}`,'Primer eksplicitnog handoff-a'),
  ]),
  page('8.4. Jedan veliki agent ili više specijalizovanih?', [
    text('h2', '8.4. Više agenata nije automatski bolje'),
    text('paragraph', 'Svaki dodatni handoff uvodi trošak: kontekst se može izgubiti, vreme i tokeni rastu, a debugging workflow-a postaje složeniji. Zbog toga se agentna arhitektura mora opravdati. Za mali lokalni refaktoring jedan dobro ograničen agent može biti bolji od pet uloga.'),
    table(['Kriterijum', 'Jedan agent', 'Specijalizovani agenti'], [
      ['Mali lokalni zadatak', 'Često dovoljan i jednostavniji.', 'Može biti nepotreban overhead.'],
      ['Jasno odvojene faze plan → kod → review', 'Može mešati kontekst i uloge.', 'Granice mogu povećati disciplinu i auditabilnost.'],
      ['Osetljive write dozvole', 'Teže ograničiti različite faze.', 'Reviewer/architect mogu ostati read-only.'],
      ['Trošak i latency', 'Najčešće niži.', 'Veći zbog više poziva i handoff-a.'],
      ['Debugging', 'Jednostavniji tok.', 'Lakše locirati odgovornu fazu ako su izlazi dobro strukturirani.'],
    ]),
    callout('task', 'Eksperiment na vežbi', 'Isti mali issue rešiti u dve varijante: A) jedan agent od analize do završnog izveštaja; B) architect → developer → tester → reviewer. Uporediti broj pokušaja, veličinu diff-a, broj nepotrebnih promena, vreme i kvalitet završnog review-a.'),
  ]),
  page('8.5. Projektni checkpoint P6', [
    text('h2', '8.5. Projektni checkpoint P6 — skills i agentni tok'),
    text('paragraph', 'Do checkpoint-a tim treba da pokaže da je AI workflow deo repozitorijuma i da rešava stvaran problem projekta. Ne traži se veliki multi-agent sistem; traži se najmanji smisleni skup uloga i procedura koji može ponovljivo da se demonstrira.'),
    list([
      'Najmanje dva custom skill-a sa jasnim ulazom, koracima, izlazom i ograničenjima.',
      'Najmanje dve agentne uloge sa različitim odgovornostima ili dozvolama.',
      'Dokumentovan handoff ili agents-as-tools tok za jedan realan issue.',
      'Najmanje jedan eksperiment koji poredi jednostavniji i složeniji workflow.',
      'AI_USAGE beleži gde je workflow pomogao i gde je zahtevao ručnu korekciju.'
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Napraviti read-only reviewer agenta ili skill i pokrenuti ga nad sopstvenim PR diff-om. Bonus se dobija samo ako student navede najmanje jedan nalaz koji je proverio u kodu, čak i kada ga na kraju odbaci.'),
  ]),
]
