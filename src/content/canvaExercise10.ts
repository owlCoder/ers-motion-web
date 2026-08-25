import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise10 = (): DocumentPage[] => [
  page('Vežba 10 — Hooks, guardrails, evals i završni QA', [
    text('h1', 'Vežba 10 — Hooks, guardrails, evals i završni QA'),
    text('paragraph', 'Poslednja vežba uvodi mehanizme koji smanjuju oslanjanje na dobru volju modela. Ako je nešto dovoljno važno da mora uvek da se proveri, nije dovoljno napisati „molim te pokreni testove“. Hook, guardrail ili druga deterministička provera treba da sprovede pravilo nezavisno od toga da li je agent odlučio da ga poštuje.'),
    image('/course-assets/hooks-evals.svg', 'Determinističke provere oko agentnog toka: pre akcije, posle izmene i pre završnog izveštaja.', 'Hooks, guardrails i evals'),
    callout('info', 'Osnovni princip', 'Ne treba verovati agentu za ono što možemo deterministički garantovati kodom. AI predlog ostaje heuristički; build, test, zabrana rizične komande ili schema validacija mogu biti mehanički provereni.'),
  ]),
  page('10.1. Instrukcija naspram hook-a', [
    text('h2', '10.1. Instrukcija naspram hook-a'),
    text('paragraph', 'Instrukcija utiče na ponašanje modela, ali nema istu garanciju kao kod koji se izvršava na određenoj lifecycle tački. Hook se koristi kada želimo obaveznu proveru pre ili posle aktivnosti, na primer pre pokretanja komande, nakon izmene datoteke ili pre završetka workflow-a.'),
    table(['Zahtev', 'Instrukcija', 'Hook / guardrail'], [
      ['„Pokreni testove pre završetka“', 'Model može da zaboravi ili pogrešno prijavi rezultat.', 'Stop/post-change hook može stvarno izvršiti `dotnet test` i blokirati završetak.'],
      ['„Ne čitaj .env“', 'Tekstualno ograničenje.', 'Pre-tool provera može odbiti putanju `.env` i slične tajne.'],
      ['„Ne koristi force push“', 'Smernica za model.', 'Pre-command provera može blokirati `git push --force`.'],
      ['„Formatiraj C# posle izmene“', 'Model može ručno uraditi ili preskočiti.', 'Post-edit hook može pozvati formatter na izmenjenom fajlu.'],
    ]),
    code('text', `PreToolUse:\n  block: rm -rf\n  block: git push --force\n  block: cat .env\n  block: destructive database commands\n\nPostEdit:\n  run: dotnet format --include <changed-file>\n  run: targeted tests when practical\n\nStop:\n  require: build success\n  require: tests pass\n  require: final diff summary`,'Konceptualni lifecycle hook plan'),
  ]),
  page('10.2. Guardrails i dozvole', [
    text('h2', '10.2. Guardrails i dozvole'),
    text('paragraph', 'Guardrail proverava ulaz, izlaz ili tool poziv i može zaustaviti workflow kada je uslov prekršen. Važno je razlikovati bezbednosnu zabranu od kvalitativnog saveta. Zabrana čitanja tajni ili destruktivne komande je dobar kandidat za determinističku proveru; „napiši elegantan kod“ nije.'),
    list([
      'Validirati putanje koje tool sme da čita ili menja.',
      'Ograničiti shell komande na dozvoljen skup ili proveravati poznate rizične obrasce.',
      'Za write operacije po mogućnosti zahtevati eksplicitnu fazu odobrenja ili usko definisan scope.',
      'Ne vraćati tajne i credential-e u model kontekst čak i ako proces lokalno ima pristup njima.',
      'Logovati dovoljno podataka da student može da rekonstruiše zašto je guardrail blokirao akciju.'
    ]),
    callout('warning', 'Guardrail ne rešava sve', 'Previše široka zabrana može blokirati legitiman rad, a previše uska provera može propustiti varijantu iste rizične akcije. Zato se guardrails testiraju kao i svaki drugi deo sistema.'),
  ]),
  page('10.3. Evals kao testovi agentnog ponašanja', [
    text('h2', '10.3. Evals kao testovi agentnog ponašanja'),
    text('paragraph', 'Unit test proverava determinističku softversku jedinicu, dok eval proverava da li agentni workflow u reprezentativnom scenariju daje prihvatljiv rezultat. Evals treba da obuhvate tipične, granične i negativne slučajeve i da imaju jasno definisan kriterijum uspeha.'),
    code('json', `{
  "id": "review-architecture-01",
  "input": {
    "issue": "Add CSV export",
    "diffFixture": "fixtures/export-controller-business-logic.diff"
  },
  "expected": {
    "mustFlag": [
      "business logic in controller",
      "missing unit test"
    ],
    "mustNotSuggest": [
      "rewrite entire application"
    ]
  }
}`,'Primer eval scenarija za reviewer workflow'),
    table(['Eval vrsta', 'Primer'], [
      ['Happy path', 'Agent pravilno locira sloj i predlaže mali plan.'],
      ['Negative', 'Agent treba da odbije zahtev za čitanje tajne ili destruktivnu akciju.'],
      ['Regression', 'Nakon izmene skill-a stari review fixture-i i dalje daju ključne nalaze.'],
      ['Robustness', 'Nepotpuni issue dovodi do pitanja/pretpostavki, ne do izmišljene implementacije.'],
    ]),
    callout('note', 'Scenario coverage', 'Nema smisla govoriti o „100% agent coverage-u“ kao jednoj brojci. Važnije je da eval skup pokriva glavne vrste zadataka, rizične granice i poznate načine na koje workflow greši.'),
  ]),
  page('10.4. Peer QA i završni review', [
    text('h2', '10.4. Peer QA i završni review'),
    text('paragraph', 'Pre odbrane, drugi tim ili student prolazi kroz jedan reprezentativan tok projekta. Peer QA nije detaljna revizija cele baze koda; cilj je da spoljašnja osoba proveri da li dokumentacija, arhitektura i demonstracioni workflow zaista imaju smisla bez dodatnog usmenog objašnjavanja autora.'),
    list([
      'Pokrenuti projekat prema README-u i proći glavni demo scenario.',
      'Izabrati jedan User Story i pratiti ga od acceptance criteria do koda i testova.',
      'Pregledati jedan PR/diff i proveriti da li je scope koherentan.',
      'Pokrenuti jedan AI skill/agent workflow i proveriti stvarne logove/test rezultate.',
      'Zabeležiti najmanje jednu konkretnu sugestiju ili potvrdu da ozbiljan problem nije pronađen, uz obrazloženje.'
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Napraviti negativni eval u kome agent treba da odbije rizičnu akciju ili da prijavi nedovoljan kontekst. Prikazati očekivani i stvarni ishod i objasniti eventualnu razliku.'),
  ]),
  page('10.5. Završni checkpoint P8', [
    text('h2', '10.5. Završni checkpoint P8 — proverljiv AI-assisted razvoj'),
    text('paragraph', 'Završni rezultat kursa nije „projekat koji je napisao AI“, već softverski sistem čiji tim može da objasni zahteve, arhitekturu, testove i način na koji je AI uključen u razvoj. AI deo se vrednuje kroz dizajn workflow-a, ograničenja, ponovljivost i način verifikacije.'),
    diagram('Završni razvojni tok', [
      ['Issue', 'zahtev + criteria', 'slate'],
      ['Plan', 'context + instructions', 'cyan'],
      ['Agent/skill', 'ograničena procedura', 'blue'],
      ['MCP/tools', 'stvarni projektni signal', 'violet'],
      ['Hooks/evals', 'deterministička zaštita i QA', 'amber'],
      ['Student review', 'odluka + objašnjenje', 'emerald'],
    ]),
    list([
      'Hook/guardrail mehanizmi pokrivaju najmanje dve stvarne rizične ili obavezne provere.',
      'Postoje najmanje tri eval scenarija, uključujući negativni slučaj.',
      'Peer QA je zabeležen i relevantne sugestije su obrađene.',
      'AI_USAGE pokazuje reprezentativne sesije, odluke i proveru rezultata.',
      'Na odbrani svaki član tima može da objasni odabrani use-case i AI workflow bez oslanjanja na automatski generisan odgovor.'
    ]),
    callout('success', 'Završni cilj', 'Student razume klasične principe softverskog inženjerstva i ume da ih primeni na AI-native razvojno okruženje: granice, ugovore, testove, observability i odgovornost za konačan rezultat.'),
  ]),
]
