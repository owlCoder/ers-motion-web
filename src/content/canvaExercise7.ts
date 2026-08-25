import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise7 = (): DocumentPage[] => [
  page('Vežba 7 — Prompt, kontekst i projektne instrukcije', [
    text('h1', 'Vežba 7 — Prompt, kontekst i projektne instrukcije'),
    text('paragraph', 'Od ove vežbe AI alat postaje deo razvojnog okruženja, ali se i dalje posmatra kao komponenta procesa koju treba projektovati i proveravati. Najvažnija promena u odnosu na ad-hoc chat pristup jeste razdvajanje trenutnog zadatka od stabilnog konteksta projekta i očekivanog formata izlaza.'),
    image('/course-assets/context-stack.svg', 'Slojevi konteksta: zadatak, projektna pravila, relevantni artefakti, format izlaza i verifikacija.', 'Context engineering'),
    table(['Element', 'Svrha'], [
      ['Prompt / task', 'Konkretan cilj jedne interakcije.'],
      ['Instructions', 'Stabilna pravila koja treba da važe kroz više zadataka.'],
      ['Context', 'Relevantni kod, dokumentacija, issue, testovi i ograničenja.'],
      ['Structured output', 'Predvidiv format rezultata koji se lakše proverava ili dalje obrađuje.'],
      ['Verification', 'Build, test, diff, statička provera ili drugi dokaz nezavisan od same tvrdnje modela.'],
    ]),
  ]),
  page('7.1. Od nejasnog prompta do inženjerskog zadatka', [
    text('h2', '7.1. Od nejasnog prompta do inženjerskog zadatka'),
    text('paragraph', 'Prompt tipa „dodaj premium popust“ ostavlja modelu da nagađa pravila, granice slojeva i kriterijume završetka. Inženjerski zadatak treba da ograniči problem, navede kontekst koji menja odluku i jasno kaže šta model treba da vrati pre bilo kakve izmene koda.'),
    code('markdown', `# Zadatak\nAnaliziraj issue PREMIUM-42. Ne menjaj kod.\n\n# Poslovno pravilo\nPremium korisnik može dobiti kupon, ali kupon ne može da se kombinuje sa sezonskim popustom.\n\n# Kontekst\n- Business pravila su u Application/Domain sloju.\n- Controller ne sadrži poslovnu logiku.\n- Postojeći testovi za SeasonalDiscount moraju ostati zeleni.\n\n# Vrati\n1. pogođene komponente,\n2. predlog pravila i graničnih slučajeva,\n3. plan izmene po koracima,\n4. test scenarije,\n5. rizike i otvorena pitanja.`,'Primer analitičkog zadatka pre implementacije'),
    callout('info', 'Zašto prvo analiza', 'Plan smanjuje verovatnoću da model odmah izabere pogrešnu arhitektonsku putanju. Student može da odbije ili koriguje plan pre nego što diff postane veliki.'),
  ]),
  page('7.2. Stabilne projektne instrukcije', [
    text('h2', '7.2. Stabilne projektne instrukcije'),
    text('paragraph', 'Projektne instrukcije sadrže pravila koja se ponavljaju kroz veliki broj zadataka. One ne treba da budu dnevnik svih prethodnih razgovora niti duga lista nebitnih činjenica. Cilj je da model dobije kompaktan skup odluka koje utiču na skoro svaku izmenu.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Architecture\n- Domain does not depend on Infrastructure or Presentation.\n- Business rules belong in Domain/Application.\n- Controllers contain transport mapping only.\n- External dependencies are introduced through interfaces and DI.\n\n## Coding\n- Prefer small cohesive methods and explicit result types.\n- Do not introduce static service locators.\n- Reuse existing abstractions before adding a new one.\n\n## Before changing code\n1. Read the issue and relevant tests.\n2. Identify impacted layers.\n3. Produce a short plan and risks.\n4. State how the change will be verified.\n\n## Verification\n- Run targeted tests first, then the full suite when practical.\n- Review the final diff for unrelated changes.`),
    list([
      'Pravilo treba da bude dovoljno konkretno da utiče na odluku, ali dovoljno opšte da važi i za sledeći issue.',
      'Instrukcija koja se stalno krši možda je nejasna ili pripada determinističkoj proveri/hook-u umesto tekstualnom pravilu.',
      'Dokument treba verzionisati zajedno sa projektom jer predstavlja deo razvojnog okruženja.'
    ]),
  ]),
  page('7.3. Structured output i proverljiv rezultat', [
    text('h2', '7.3. Structured output i proverljiv rezultat'),
    text('paragraph', 'Što je rezultat predvidiviji, lakše ga je pregledati, porediti između pokušaja i eventualno koristiti u automatizaciji. Strukturiran izlaz ne mora uvek biti JSON; može biti stabilan Markdown obrazac sa sekcijama koje reviewer očekuje.'),
    code('markdown', `## Impact\n- Domain: ...\n- Application: ...\n- Tests: ...\n\n## Plan\n1. ...\n2. ...\n\n## Test scenarios\n- Given ... when ... then ...\n\n## Risks\n- ...\n\n## Verification\n- dotnet test ...\n- review git diff ...`),
    callout('note', 'Modelov odgovor nije dokaz', 'Čak i kada odgovor sadrži sekciju „Verification: tests passed“, student treba da vidi stvarni izlaz test runner-a ili da sam pokrene komandu. Tvrdnja modela bez spoljnog signala nije verifikacija.'),
    diagram('Tok kontrolisane AI izmene', [
      ['Issue', 'šta treba promeniti', 'slate'],
      ['Analysis', 'uticaj + otvorena pitanja', 'cyan'],
      ['Plan', 'mali koraci + testovi', 'blue'],
      ['Implementation', 'ograničen diff', 'violet'],
      ['Verification', 'test + diff + review', 'emerald'],
    ]),
  ]),
  page('7.4. AI_USAGE.md i projektni checkpoint P5', [
    text('h2', '7.4. Evidencija korišćenja AI alata'),
    text('paragraph', '`AI_USAGE.md` nije transkript privatnog chain-of-thought sadržaja niti arhiva svih poruka. Njegova svrha je da zabeleži dovoljno informacija da se razume gde je AI uticao na projekat i kako je rezultat proveravan.'),
    table(['Polje', 'Primer'], [
      ['Zadatak', 'Review acceptance criteria za PREMIUM-42.'],
      ['Alat/model', 'Naziv korišćenog AI klijenta/modela.'],
      ['Ulazni kontekst', 'Issue, AI_INSTRUCTIONS.md, dva relevantna testa.'],
      ['Sažetak predloga', 'Predložena zabrana kombinovanja kupona i sezonskog popusta + 4 edge case-a.'],
      ['Odluka tima', 'Prihvaćena 3 scenarija, odbačen predlog za novi DiscountEngine jer je prevelik za zahtev.'],
      ['Verifikacija', 'Novi NUnit testovi, kompletan `dotnet test`, pregled diff-a.'],
    ]),
    list([
      'Očistiti `AI_INSTRUCTIONS.md` od privremenih pravila i zadržati stabilne projektne smernice.',
      'Napraviti najmanje dva AI_USAGE zapisa koja pokazuju različite vrste pomoći: npr. analiza i review.',
      'Za svaku veću AI-promenu navesti spoljašnji dokaz verifikacije.'
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Uzeti isti mali issue i rešiti ga dva puta: jednom sa kratkim promptom bez projektnih instrukcija, drugi put sa jasnim kontekstom i formatom izlaza. Uporediti kvalitet plana, količinu nepotrebnih pretpostavki i potrebne korekcije.'),
  ]),
]
