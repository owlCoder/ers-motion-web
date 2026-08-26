import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise10 = (): DocumentPage[] => [
  page('Vežba 10 — Hooks, guardrails, evaluacije i završni QA', [
    text('h1', 'Vežba 10 — Hooks, guardrails, evaluacije i završni QA'),
    text('paragraph', 'Poslednja vežba uvodi mehanizme koji smanjuju oslanjanje na odluku modela da li će izvršiti obaveznu proveru. Ako određeno pravilo mora uvek da važi, tekstualna instrukcija nije dovoljna. Hook, guardrail ili druga deterministička provera treba da sprovede pravilo nezavisno od toga da li je agent odlučio da ga primeni.'),
    image('/course-assets/hooks-evals.svg', 'Determinističke provere oko agentskog toka: pre akcije, posle izmene i pre završnog izveštaja.', 'Hooks, guardrails i evaluacioni scenariji'),
    callout('info', 'Osnovni princip', 'Ono što može pouzdano da se proveri kodom ne treba prepuštati proceni modela. AI predlog ostaje heuristički, dok izgradnja projekta, testovi, zabrana rizične komande i validacija šeme mogu biti deterministički provereni.'),
  ]),
  page('10.1. Instrukcija naspram hook-a', [
    text('h2', '10.1. Instrukcija naspram hook-a'),
    text('paragraph', 'Instrukcija utiče na ponašanje modela, ali nema istu garanciju kao kod koji se izvršava na određenoj tački životnog ciklusa alata. Hook se koristi kada želimo obaveznu proveru pre ili posle aktivnosti, na primer pre pokretanja komande, nakon izmene datoteke ili pre završetka agentskog toka.'),
    table(['Zahtev', 'Tekstualna instrukcija', 'Hook ili guardrail'], [
      ['„Pokreni testove pre završetka“', 'Model može da zaboravi proveru ili pogrešno prenese rezultat.', 'Stop ili post-change hook može stvarno izvršiti `dotnet test` i blokirati završetak.'],
      ['„Ne čitaj .env“', 'Tekstualno ograničenje.', 'Pre-tool provera može odbiti pristup putanji `.env` i drugim zaštićenim datotekama.'],
      ['„Ne koristi force push“', 'Smernica za model.', 'Pre-command provera može blokirati `git push --force`.'],
      ['„Formatiraj C# posle izmene“', 'Model može izvršiti proveru ili je preskočiti.', 'Post-edit hook može automatski pozvati formatter nad izmenjenim fajlom.'],
    ]),
  ]),
  page('10.2. Izvršivi hook u projektu', [
    text('h2', '10.2. Izvršivi hook u projektu'),
    text('paragraph', 'Sledeći primer koristi projektni `.claude/settings.json` i `PostToolUse` događaj. Nakon izmene ili upisa datoteke pokreće se deterministička komanda. Isti princip može se primeniti na formatiranje, ciljane testove ili druge obavezne provere. Konkretne nazive događaja i ulaznu šemu treba proveriti u aktuelnoj dokumentaciji alata.'),
    code('json', `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs dotnet format --include"
          }
        ]
      }
    ]
  }
}`,'Primer `.claude/settings.json` konfiguracije za automatsku proveru nakon izmene'),
    callout('note', 'Hook je deo izvršnog sistema', 'Hook nije dodatna molba modelu. On se izvršava na definisanom događaju i zbog toga predstavlja pogodnu granicu za pravila koja treba mehanički sprovoditi.'),
  ]),
  page('10.3. Guardrails, dozvole i ljudsko odobrenje', [
    text('h2', '10.3. Guardrails, dozvole i ljudsko odobrenje'),
    text('paragraph', 'Guardrail proverava ulaz, izlaz ili poziv alata i može zaustaviti tok rada kada je uslov prekršen. Potrebno je razlikovati bezbednosnu zabranu od kvalitativnog saveta. Zabrana čitanja tajni ili destruktivne komande je dobar kandidat za determinističku proveru; zahtev da kod bude „elegantan“ nije.'),
    list([
      'Validirati putanje koje alat sme da čita ili menja.',
      'Ograničiti shell komande na dozvoljen skup ili proveravati poznate rizične obrasce.',
      'Za operacije koje menjaju podatke, objavljuju kod ili utiču na udaljeni sistem zahtevati eksplicitno ljudsko odobrenje kada posledice nisu lako reverzibilne.',
      'Ne vraćati tajne i pristupne podatke u kontekst modela čak i ako lokalni proces ima pristup njima.',
      'Voditi dovoljan audit trag da se može rekonstruisati zbog čega je guardrail blokirao operaciju.',
    ]),
    code('bash', `#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat)"
COMMAND="$(echo "$INPUT" | jq -r '.tool_input.command // empty')"

if [[ "$COMMAND" == *"git push --force"* ]] || \
   [[ "$COMMAND" == *"cat .env"* ]] || \
   [[ "$COMMAND" == *"rm -rf"* ]]; then
  echo "Blocked by project safety policy" >&2
  exit 2
fi

exit 0`,'Primer determinističke provere rizičnih komandi'),
    callout('warning', 'Guardrail ne rešava sve slučajeve', 'Preširoka zabrana može blokirati legitimnu aktivnost, dok preuska provera može propustiti drugu formulaciju iste rizične operacije. Guardrails zato treba testirati i održavati kao i svaki drugi deo razvojnog sistema.'),
  ]),
  page('10.4. Evaluacioni scenariji za agentsko ponašanje', [
    text('h2', '10.4. Evaluacioni scenariji kao testovi agentskog ponašanja'),
    text('paragraph', 'Unit test proverava determinističku softversku jedinicu, dok evaluacioni scenario proverava da li agentski tok u reprezentativnom slučaju daje prihvatljiv rezultat. Skup evaluacija treba da obuhvati tipične, granične, regresione i bezbednosne slučajeve sa jasno definisanim očekivanjima.'),
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
}`,'Primer evaluacionog scenarija za agenta za pregled'),
    table(['Vrsta evaluacije', 'Primer'], [
      ['Uspešan scenario', 'Agent pravilno locira sloj i predlaže mali, obrazložen plan.'],
      ['Negativni scenario', 'Agent odbija zahtev za čitanje tajne ili destruktivnu operaciju.'],
      ['Regresioni scenario', 'Nakon izmene skill-a raniji fixture-i i dalje proizvode ključne nalaze.'],
      ['Otpornost na nepotpun ulaz', 'Nepotpuni issue dovodi do pitanja i eksplicitnih pretpostavki, a ne do izmišljene implementacije.'],
      ['Prompt-injection scenario', 'Nepouzdani tool rezultat pokušava da promeni projektna pravila, ali agent zadržava originalna ograničenja.'],
    ]),
    callout('note', 'Pokrivenost scenarijima', 'Nije korisno govoriti o jednoj brojci koja bi predstavljala „100% pokrivenost agenta“. Važnije je da skup evaluacija obuhvati glavne vrste zadataka, rizične granice i poznate načine na koje agentski tok može da pogreši.'),
  ]),
  page('10.5. Peer QA i završni pregled', [
    text('h2', '10.5. Peer QA i završni pregled'),
    text('paragraph', 'Pre odbrane drugi tim ili student prolazi kroz jedan reprezentativan razvojni tok projekta. Peer QA nije detaljna revizija cele baze koda; cilj je da spoljašnja osoba proveri da li dokumentacija, arhitektura i demonstracioni tok rada imaju smisla bez dodatnog usmenog objašnjavanja autora.'),
    list([
      'Pokrenuti projekat prema README-u i proći glavni demonstracioni scenario.',
      'Izabrati jedan User Story i pratiti ga od kriterijuma prihvatanja do koda i testova.',
      'Pregledati jedan pull request ili diff i proveriti da li je obim izmene koherentan.',
      'Pokrenuti jedan skill ili agentski tok i proveriti stvarne logove i rezultate testova.',
      'Zabeležiti najmanje jednu konkretnu sugestiju ili obrazloženu potvrdu da ozbiljan problem nije pronađen.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Napraviti negativni evaluacioni scenario u kome agent treba da odbije rizičnu operaciju ili da prijavi nedovoljan kontekst. Prikazati očekivani i stvarni ishod i objasniti eventualnu razliku.'),
  ]),
  page('10.6. Završna projektna kontrolna tačka P8', [
    text('h2', '10.6. Završna projektna kontrolna tačka P8 — proverljiv razvoj uz podršku AI alata'),
    text('paragraph', 'Završni rezultat kursa nije projekat čiju implementaciju student ne razume, već softverski sistem čiji tim može da objasni zahteve, arhitekturu, testove i način na koji je AI uključen u razvoj. AI deo se vrednuje kroz dizajn toka rada, ograničenja, ponovljivost i način verifikacije.'),
    diagram('Završni razvojni tok', [
      ['Zahtev', 'User Story i kriterijumi', 'slate'],
      ['Plan', 'kontekst i projektne instrukcije', 'cyan'],
      ['Agent ili skill', 'ograničena procedura', 'blue'],
      ['MCP i alati', 'stvarni projektni signal', 'violet'],
      ['Hooks i evaluacije', 'deterministička zaštita i QA', 'amber'],
    ], 'Nakon automatizovanih provera student donosi konačnu odluku i obrazlaže rezultat.'),
    list([
      'Hook ili guardrail mehanizmi pokrivaju najmanje dve stvarne rizične ili obavezne provere.',
      'Postoje najmanje tri evaluaciona scenarija, uključujući negativni ili bezbednosni slučaj.',
      'Peer QA je zabeležen i relevantne sugestije su obrađene.',
      '`AI_USAGE.md` pokazuje reprezentativne sesije, odluke i proveru rezultata.',
      'Na odbrani svaki član tima može da objasni odabrani use-case i agentski tok bez oslanjanja na automatski generisan odgovor.',
    ]),
    callout('success', 'Završni cilj', 'Student razume klasične principe softverskog inženjerstva i ume da ih primeni na razvojno okruženje sa AI agentima: jasne granice, ugovore, testove, sledljivost i odgovornost za konačan rezultat.'),
  ]),
]
