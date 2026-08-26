import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise7 = (): DocumentPage[] => [
  page('Vežba 7 — Prompt, kontekst i projektne instrukcije', [
    text('h1', 'Vežba 7 — Prompt, kontekst i projektne instrukcije'),
    text('paragraph', 'Od ove vežbe AI alat postaje deo razvojnog okruženja, ali se i dalje posmatra kao komponenta procesa koju treba projektovati i proveravati. Najvažnija promena u odnosu na povremeno korišćenje razgovora sa modelom jeste razdvajanje trenutnog zadatka, stabilnog konteksta projekta, očekivanog formata rezultata i nezavisnog načina verifikacije.'),
    image('/course-assets/context-stack.svg', 'Slojevi konteksta: zadatak, projektna pravila, relevantni artefakti, format izlaza i verifikacija.', 'Organizacija konteksta za rad sa AI alatom'),
    table(['Element', 'Svrha'], [
      ['Prompt / zadatak', 'Konkretan cilj jedne interakcije.'],
      ['Projektne instrukcije', 'Stabilna pravila koja treba da važe kroz više zadataka.'],
      ['Kontekst', 'Relevantni kod, dokumentacija, issue, testovi i ograničenja.'],
      ['Strukturirani izlaz', 'Predvidiv format rezultata koji se lakše proverava ili dalje obrađuje.'],
      ['Verifikacija', 'Izgradnja projekta, test, diff, statička provera ili drugi dokaz nezavisan od tvrdnje modela.'],
    ]),
  ]),
  page('7.1. Od nejasnog prompta do inženjerskog zadatka', [
    text('h2', '7.1. Od nejasnog prompta do inženjerskog zadatka'),
    text('paragraph', 'Prompt tipa „dodaj premium popust“ ostavlja modelu da nagađa poslovna pravila, granice slojeva i kriterijume završetka. Inženjerski zadatak treba da ograniči problem, navede kontekst koji može uticati na odluku i jasno definiše šta model treba da vrati pre bilo kakve izmene koda.'),
    code('markdown', `# Zadatak\nAnaliziraj issue PREMIUM-42. Ne menjaj kod.\n\n# Poslovno pravilo\nPremium korisnik može dobiti kupon, ali kupon ne može da se kombinuje sa sezonskim popustom.\n\n# Kontekst\n- Poslovna pravila su u Application/Domain sloju.\n- Controller ne sadrži poslovnu logiku.\n- Postojeći testovi za SeasonalDiscount moraju ostati uspešni.\n\n# Vrati\n1. pogođene komponente,\n2. predlog pravila i graničnih slučajeva,\n3. plan izmene po koracima,\n4. test scenarije,\n5. rizike i otvorena pitanja.`,'Primer analitičkog zadatka pre implementacije'),
    callout('info', 'Zašto analiza prethodi implementaciji', 'Plan smanjuje verovatnoću da model odmah izabere neodgovarajuću arhitektonsku putanju. Student može da odbije ili koriguje predlog dok je promena još u fazi analize, pre nego što nastane veliki diff.'),
  ]),
  page('7.2. Stabilne projektne instrukcije', [
    text('h2', '7.2. Stabilne projektne instrukcije'),
    text('paragraph', 'Projektne instrukcije sadrže pravila koja se ponavljaju kroz veći broj zadataka. One ne treba da budu dnevnik prethodnih razgovora niti duga lista činjenica koje ne utiču na odluku. Cilj je da model dobije kompaktan skup arhitektonskih, programskih i verifikacionih pravila koja važe kroz čitav projekat.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Architecture\n- Domain does not depend on Infrastructure or Presentation.\n- Business rules belong in Domain/Application.\n- Controllers contain transport mapping only.\n- External dependencies are introduced through interfaces and DI.\n\n## Coding\n- Prefer small cohesive methods and explicit result types.\n- Do not introduce static service locators.\n- Reuse existing abstractions before adding a new one.\n\n## Before changing code\n1. Read the issue and relevant tests.\n2. Identify impacted layers.\n3. Produce a short plan and risks.\n4. State how the change will be verified.\n\n## Verification\n- Run targeted tests first, then the full suite when practical.\n- Review the final diff for unrelated changes.`),
    list([
      'Pravilo treba da bude dovoljno konkretno da utiče na odluku, ali dovoljno opšte da važi i za naredne zadatke.',
      'Pravilo koje se često krši možda je nejasno formulisano ili pripada determinističkoj proveri, a ne tekstualnoj instrukciji.',
      'Dokument sa projektnim instrukcijama treba verzionisati zajedno sa projektom jer predstavlja deo razvojnog okruženja.',
    ]),
  ]),
  page('7.3. Strukturirani izlaz i proverljiv rezultat', [
    text('h2', '7.3. Strukturirani izlaz i proverljiv rezultat'),
    text('paragraph', 'Što je rezultat predvidiviji, lakše ga je pregledati, porediti između pokušaja i eventualno koristiti u automatizaciji. Strukturirani izlaz ne mora uvek biti JSON; može biti stabilan Markdown obrazac sa sekcijama koje pregledalac očekuje.'),
    code('markdown', `## Impact\n- Domain: ...\n- Application: ...\n- Tests: ...\n\n## Plan\n1. ...\n2. ...\n\n## Test scenarios\n- Given ... when ... then ...\n\n## Risks\n- ...\n\n## Verification\n- dotnet test ...\n- review git diff ...`),
    callout('note', 'Tvrdnja modela nije dokaz', 'Čak i kada odgovor sadrži tvrdnju da su testovi uspešno izvršeni, student treba da vidi stvarni izlaz test runner-a ili da sam pokrene odgovarajuću komandu. Verifikacija mora da se oslanja na spoljašnji razvojni signal.'),
    diagram('Tok kontrolisane AI izmene', [
      ['Zahtev', 'šta treba promeniti', 'slate'],
      ['Analiza', 'uticaj i otvorena pitanja', 'cyan'],
      ['Plan', 'mali koraci i testovi', 'blue'],
      ['Implementacija', 'ograničen diff', 'violet'],
      ['Verifikacija', 'test, diff i pregled', 'emerald'],
    ]),
  ]),
  page('7.4. Ugovor alata i function calling', [
    text('h2', '7.4. Ugovor alata i pozivanje funkcija'),
    text('paragraph', 'Pre uvođenja agenata i MCP-a važno je razumeti osnovnu granicu između modela i izvršnog sistema. Model može da predloži poziv alata, ali stvarnu operaciju izvršava aplikacija. Zato alat mora imati jasno ime, opis, ulaznu šemu, definisanu semantiku rezultata i ograničenja. Ovakav ugovor je analogan dobro projektovanom programskom interfejsu.'),
    table(['Deo ugovora', 'Primer'], [
      ['Naziv', '`run_unit_tests`'],
      ['Opis', 'Pokreće testove za odabrani projekat ili filter.'],
      ['Ulaz', '`projectPath`, opciono `filter`'],
      ['Izlaz', 'Status uspeha, broj testova, trajanje i skraćeni detalji neuspeha.'],
      ['Ograničenje', 'Ne menja kod niti test fajlove.'],
    ]),
    code('json', `{
  "name": "run_unit_tests",
  "description": "Run project tests and return a structured summary.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "projectPath": { "type": "string" },
      "filter": { "type": "string" }
    },
    "required": ["projectPath"]
  }
}`,'Primer deklarativnog ugovora alata'),
    callout('info', 'Važna granica', 'Opis alata ne izvršava operaciju. Aplikacija prima strukturirani zahtev, proverava dozvole i ulaz, izvršava odgovarajući kod i modelu vraća rezultat. MCP će u narednoj oblasti standardizovati način na koji se takvi alati i resursi izlažu klijentu.'),
  ]),
  page('7.5. Evidencija korišćenja AI alata i P5', [
    text('h2', '7.5. Evidencija korišćenja AI alata'),
    text('paragraph', '`AI_USAGE.md` ne predstavlja potpuni transkript komunikacije sa AI alatom. Dokument treba da evidentira zadatak, relevantan ulazni kontekst, sažetak dobijenog predloga, odluku tima i način na koji je rezultat nezavisno proveren.'),
    table(['Polje', 'Primer'], [
      ['Zadatak', 'Pregled kriterijuma prihvatanja za PREMIUM-42.'],
      ['Alat/model', 'Naziv korišćenog AI klijenta i modela.'],
      ['Ulazni kontekst', 'Issue, AI_INSTRUCTIONS.md i dva relevantna testa.'],
      ['Sažetak predloga', 'Predložena zabrana kombinovanja kupona i sezonskog popusta i četiri granična scenarija.'],
      ['Odluka tima', 'Prihvaćena su tri scenarija; predlog za novi DiscountEngine je odbačen jer nepotrebno proširuje zahtev.'],
      ['Verifikacija', 'Novi NUnit testovi, kompletan `dotnet test` i pregled konačnog diff-a.'],
    ]),
    text('h3', 'Projektna kontrolna tačka P5 — instrukcije, strukturirani izlaz i evidencija'),
    list([
      '`AI_INSTRUCTIONS.md` sadrži samo stabilna pravila i ograničenja koja važe kroz više zadataka.',
      'Najmanje jedan analitički zadatak koristi unapred definisan strukturirani format izlaza.',
      '`AI_USAGE.md` sadrži najmanje dva zapisa različite vrste, na primer analizu zahteva i pregled promene.',
      'Za svaku značajniju AI podržanu promenu naveden je nezavisan dokaz verifikacije.',
      'Tim ume da objasni koje su AI sugestije prihvaćene, koje odbačene i zbog čega.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Isti mali issue analizirati dva puta: jednom sa kratkim promptom bez projektnih instrukcija, a drugi put sa jasnim kontekstom i formatom izlaza. Uporediti kvalitet plana, broj nepotrebnih pretpostavki i količinu naknadnih korekcija.'),
  ]),
]
