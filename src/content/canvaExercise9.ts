import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise9 = (): DocumentPage[] => [
  page('Vežba 9 — MCP: povezivanje agenata sa projektom', [
    text('h1', 'Vežba 9 — Model Context Protocol (MCP)'),
    text('paragraph', 'MCP standardizuje način na koji AI klijent dobija pristup spoljnim podacima i operacijama. Umesto ručnog kopiranja diff-a, dokumentacije ili rezultata testova u razgovor, projekat može izložiti kontrolisan skup resource-a i tool-ova. Fokus vežbe nije „napraviti bilo kakav MCP server“, već projektovati mali server koji rešava stvarnu potrebu softversko-inženjerskog workflow-a.'),
    image('/course-assets/mcp.svg', 'MCP server kao kontrolisana granica između agentnog klijenta, projektnih resursa i operacija.', 'MCP arhitektura'),
    table(['MCP primitiva', 'Uloga u projektu'], [
      ['Resource', 'Čitljivi kontekst: dokumentacija, šema, projektna pravila ili drugi podatak.'],
      ['Tool', 'Operacija koju model može da pozove: test, diff, pretraga, analiza strukture.'],
      ['Prompt', 'Serverom ponuđen obrazac interakcije za ponovljive zadatke, kada je prikladno.'],
      ['Server', 'Granica koja kontroliše šta se iz projekta izlaže klijentu i na koji način.'],
    ]),
  ]),
  page('9.1. Resource ili tool?', [
    text('h2', '9.1. Resource ili tool?'),
    text('paragraph', 'Dobra podela počinje pitanjem: da li klijent treba da pročita postojeći podatak ili da zatraži izvršenje operacije? Projektna dokumentacija ili arhitektonska pravila prirodno se modeluju kao resource, dok pokretanje testova, generisanje diff-a ili provera zavisnosti predstavljaju tool.'),
    table(['Potreba', 'Predlog'], [
      ['Pročitati `docs/architecture.md`', 'Resource — statički ili dinamički tekstualni kontekst.'],
      ['Dobiti listu aktivnih issue-a', 'Resource ako je read-only kolekcija ili tool ako operacija zahteva upit sa parametrima.'],
      ['Pokrenuti `dotnet test`', 'Tool — izvršava proces i vraća strukturiran rezultat.'],
      ['Dobiti trenutni `git diff`', 'Tool ili dinamički resource; za nastavu je korisno kao read-only tool sa jasnim ulazom/izlazom.'],
      ['Izmeniti ili obrisati datoteke', 'High-risk tool; u studentskom minimumu ga izbegavati ili strogo ograničiti.'],
    ]),
    callout('note', 'Najmanje privilegije', 'MCP server ne treba automatski da izloži čitav računar. Definisati uzak skup podataka i operacija koji su potrebni za konkretan workflow, posebno kada agent dobija write mogućnosti.'),
  ]),
  page('9.2. SoftwareEngineeringMCP — predlog alata', [
    text('h2', '9.2. SoftwareEngineeringMCP'),
    text('paragraph', 'Za predmet je korisniji project-specific server od generičkog weather primera. Server može da izloži projektne signale koje student ionako koristi prilikom razvoja i review-a. Time se agent uči da traži dokaz umesto da nagađa stanje repozitorijuma.'),
    code('text', `resources:\n  project://instructions\n  project://architecture\n  project://readme\n\ntools:\n  get_project_structure()\n  get_git_diff(base = "main")\n  run_unit_tests(filter?)\n  get_code_coverage()\n  get_open_issues()\n  get_issue(id)\n  search_project_documentation(query)\n  find_architecture_violations()`,'Predlog minimalnog project-specific MCP interfejsa'),
    diagram('Primer agentnog toka sa MCP-om', [
      ['get_issue', 'pročitaj zahtev', 'slate'],
      ['project structure', 'lociraj relevantne granice', 'cyan'],
      ['docs/resource', 'učitaj odluke i pravila', 'blue'],
      ['implementation', 'izmena u okviru plana', 'violet'],
      ['tests + diff', 'prikupi nezavisni razvojni signal', 'emerald'],
    ]),
    callout('warning', 'Ne izlagati tajne', '`.env`, API ključevi, privatni tokeni i lokalni credential-i ne smeju postati resource niti se vraćati kroz generičke file-read tool-ove. Granice servera treba projektovati eksplicitno.'),
  ]),
  page('9.3. Strukturiran rezultat tool-a', [
    text('h2', '9.3. Tool treba da vraća mašinski i ljudski razumljiv rezultat'),
    text('paragraph', 'Ako `run_unit_tests` vrati samo hiljade linija terminalskog izlaza, agent ponovo mora da izvodi zaključke iz buke. Korisnije je vratiti strukturiran rezime i, po potrebi, skraćeni detalj failure-a.'),
    code('json', `{
  "command": "dotnet test tests/Project.Tests.csproj",
  "success": false,
  "total": 42,
  "passed": 41,
  "failed": 1,
  "durationMs": 1830,
  "failures": [
    {
      "test": "Reserve_WhenCouponAndSeasonalDiscount_ReturnsConflict",
      "message": "Expected Success=False but was True"
    }
  ]
}`,'Primer izlaza koji agent može pouzdano da koristi'),
    list([
      'Jasno razdvojiti stdout, status uspeha i strukturirane metrike.',
      'Ograničiti dužinu poruka i failure logova da MCP ne preplavi kontekst.',
      'Ne dozvoliti modelu da sam proglasi test prolaznim bez statusa procesa.',
      'Za rizične tool-ove definisati validaciju ulaza i dozvoljene putanje/komande.'
    ]),
  ]),
  page('9.4. Projektni checkpoint P7', [
    text('h2', '9.4. Projektni checkpoint P7 — MCP integracija'),
    text('paragraph', 'MCP deo projekta treba da bude mali, razumljiv i demonstrabilan. Dovoljna su dva ili tri dobro izabrana project-specific capability-ja koja uklanjaju ručno kopiranje i daju agentu proverljiv signal.'),
    list([
      'MCP server se nalazi u jasno izdvojenom delu repozitorijuma i ima uputstvo za pokretanje.',
      'Izložen je najmanje jedan resource i najmanje dva tool-a, ili najmanje tri smisleno odabrane MCP funkcionalnosti.',
      'Najmanje jedan tool vraća razvojni signal: test rezultat, git diff, strukturu projekta ili sličan proverljiv podatak.',
      'AI workflow demonstrira korišćenje MCP-a umesto ručnog copy/paste-a istog konteksta.',
      'Dokumentovana su ograničenja i podaci koje server namerno ne izlaže.'
    ]),
    callout('task', 'Mini domaći — bonus 2 boda', 'Dodati jedan read-only resource za projektna pravila i jedan tool koji izvršava test ili vraća diff. 1 bod za ispravnu integraciju; 1 bod za obrazloženje zašto je jedan element resource, a drugi tool.'),
  ]),
]
