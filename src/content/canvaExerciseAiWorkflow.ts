import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exerciseAiWorkflow = (): DocumentPage[] => [
  page('Vežba 6 — Kontrolisan razvoj uz AI: kontekst, instrukcije, procedure i agenti', [
    text('h1', 'Vežba 6 — Kontrolisan razvoj uz AI: kontekst, instrukcije, procedure i agenti'),
    text('paragraph', 'AI alat u okviru projekta ne posmatra se kao zamena za razvojni proces, već kao deo razvojnog okruženja koji mora imati jasna pravila, ograničen kontekst i nezavisnu proveru rezultata. Ova vežba povezuje četiri nivoa rada: konkretan zadatak, stabilne projektne instrukcije, ponovljive procedure i specijalizovane agentske uloge.'),
    diagram('Od zadatka do proverene promene', [
      ['Zadatak', 'jasan cilj i kriterijumi', 'slate'],
      ['Kontekst', 'relevantan kod, odluke i testovi', 'cyan'],
      ['Instrukcije', 'stabilna projektna pravila', 'blue'],
      ['Procedura ili agent', 'ograničen tok rada', 'violet'],
      ['Provera', 'testovi, diff i stručni pregled', 'emerald'],
    ], 'Kvalitet rada zavisi od granica i provere, a ne od količine teksta prosleđenog modelu.'),
  ]),

  page('6.1. Od nejasnog upita do inženjerskog zadatka', [
    text('h2', '6.1. Od nejasnog upita do inženjerskog zadatka'),
    text('paragraph', 'Neodređen zahtev poput „dodaj popust“ ostavlja previše prostora za nagađanje. Inženjerski zadatak treba da navede cilj, poslovno pravilo, relevantna ograničenja, očekivani izlaz i način provere. Kada se od modela najpre traži analiza i plan, tim može da koriguje smer pre nego što nastane veliki diff.'),
    code('markdown', `# Zadatak\nAnaliziraj stavku PREMIUM-42. Ne menjaj kod.\n\n# Poslovno pravilo\nPremium korisnik može dobiti kupon, ali kupon ne može da se kombinuje sa sezonskim popustom.\n\n# Ograničenja\n- Poslovna pravila ostaju u Domain/Application sloju.\n- Controller ne sadrži poslovnu logiku.\n- Postojeći testovi moraju ostati uspešni.\n\n# Vrati\n1. pogođene komponente,\n2. otvorena pitanja,\n3. plan izmene,\n4. test scenarije,\n5. rizike i način provere.`, 'Primer zadatka za analizu pre izmene koda'),
    list([
      'Kontekst treba da bude relevantan za odluku; veća količina teksta ne znači automatski bolji rezultat.',
      'Nejasne poslovne pretpostavke treba eksplicitno označiti kao otvorena pitanja.',
      'Plan treba da bude dovoljno mali da se može pregledati pre implementacije.',
      'Način provere mora biti određen pre nego što se promena proglasi završenom.',
    ]),
  ]),

  page('6.2. Projektne instrukcije i evidencija korišćenja', [
    text('h2', '6.2. Projektne instrukcije i evidencija korišćenja'),
    text('paragraph', 'Projektne instrukcije sadrže stabilna pravila koja treba da važe kroz veći broj zadataka. One nisu dnevnik prethodnih razgovora. Dobar dokument je kratak, konkretan i usmeren na arhitekturu, programske konvencije, bezbednosna ograničenja i obavezne korake provere.'),
    code('markdown', `# AI_INSTRUCTIONS.md\n\n## Arhitektura\n- Domain ne zavisi od Infrastructure ili Presentation sloja.\n- Poslovna pravila pripadaju Domain/Application sloju.\n- Spoljne zavisnosti uvode se kroz ugovore i composition root.\n\n## Pre izmene\n1. Pročitaj stavku i relevantne testove.\n2. Odredi pogođene slojeve i module.\n3. Predloži kratak plan i rizike.\n4. Navedi kako će rezultat biti proveren.\n\n## Provera\n- Pokreni ciljane testove, zatim kompletan skup kada je praktično.\n- Pregledaj konačan diff i prijavi nepovezane izmene.`),
    text('paragraph', '`AI_USAGE.md` predstavlja sažetu evidenciju značajnih korišćenja AI alata. Nije potrebno čuvati potpuni transkript. Potrebno je zabeležiti zadatak, relevantan kontekst, sažetak predloga, odluku tima i nezavisan dokaz provere.'),
    table(['Polje', 'Sadržaj'], [
      ['Zadatak', 'Koji problem ili stavka je obrađena.'],
      ['Kontekst', 'Koji kod, dokumenti i testovi su korišćeni.'],
      ['Predlog', 'Sažetak relevantnog rezultata modela.'],
      ['Odluka', 'Šta je prihvaćeno, promenjeno ili odbačeno i zbog čega.'],
      ['Provera', 'Testovi, build, diff, ručna provera ili drugi nezavisan signal.'],
    ]),
  ]),

  page('6.3. Skill kao ponovljiva procedura', [
    text('h2', '6.3. Skill kao ponovljiva procedura'),
    text('paragraph', 'Kada tim isti razvojni postupak ponavlja kroz više stavki, korisno je da postupak bude zapisan kao verzionisana procedura. Skill treba da odredi kada se koristi, koje ulaze očekuje, kojim redosledom se izvršavaju koraci, šta vraća i šta namerno ne radi.'),
    code('markdown', `# review-pull-request / SKILL.md\n\n## Svrha\nPregled jednog pull request-a u odnosu na zahtev, arhitekturu i testove.\n\n## Ulazi\n- stavka i kriterijumi prihvatanja\n- git diff\n- relevantne projektne instrukcije\n- rezultat testova kada je dostupan\n\n## Postupak\n1. Sažmi očekivano ponašanje.\n2. Proveri da li diff izlazi iz traženog obima.\n3. Proveri smer zavisnosti i granice modula.\n4. Pregledaj negativne i granične scenarije.\n5. Uporedi promenjeno ponašanje sa testovima.\n6. Prijavi nalaze po ozbiljnosti.\n\n## Ograničenje\nNe menjaj kod.`),
    callout('note', 'Procedura mora rešavati ponovljiv problem', 'Skill nema veliku vrednost ako je samo dugačak prompt vezan za jednu konkretnu stavku. Vrednost postoji kada isti postupak može da se primeni na više sličnih situacija i da daje dosledan oblik rezultata.'),
  ]),

  page('6.4. Specijalizovani agenti i dozvole', [
    text('h2', '6.4. Specijalizovani agenti i dozvole'),
    text('paragraph', 'Specijalizovani agent dobija jasno ograničenu odgovornost i skup dozvoljenih alata. Razdvajanje ima smisla kada smanjuje mešanje uloga ili rizik od neželjene izmene. Agent za arhitektonsku analizu može imati pristup samo za čitanje, dok implementacioni agent može menjati kod tek nakon usvojenog plana.'),
    table(['Uloga', 'Dozvoljeno', 'Ograničenje'], [
      ['Arhitektonska analiza', 'Čitanje koda i dokumentacije, analiza uticaja i predlog plana.', 'Ne menja kod.'],
      ['Implementacija', 'Izmena koda u okviru odobrenog plana.', 'Ne proširuje samostalno poslovni zahtev.'],
      ['Testiranje', 'Pokretanje testova i analiza neuspeha.', 'Ne menja test samo da bi prikrio problem.'],
      ['Pregled', 'Čitanje zahteva, diff-a i rezultata testova.', 'Ne menja promenu koju ocenjuje.'],
    ]),
    callout('info', 'Najmanje potrebne privilegije', 'Agent treba da dobije samo one alate koji su mu potrebni za zadatak. Ograničenje dozvola olakšava razumevanje posledica i smanjuje mogućnost da faza pregleda neprimetno postane faza implementacije.'),
  ]),

  page('6.5. Predaja zadatka i izbor složenosti toka', [
    text('h2', '6.5. Predaja zadatka i izbor složenosti toka'),
    text('paragraph', 'Više agenata nije automatski bolje rešenje. Svaka predaja zadatka uvodi dodatni trošak i mogućnost gubitka konteksta. Za mali lokalni refaktoring jedan dobro ograničen agent može biti dovoljan. Više uloga ima smisla kada postoje jasno različite odgovornosti, različite dozvole ili nezavisna faza pregleda.'),
    code('json', `{
  "task": "Implement PREMIUM-42 according to approved plan",
  "constraints": [
    "Do not move discount rules into controllers",
    "Keep SeasonalDiscount behavior unchanged"
  ],
  "filesToConsider": [
    "src/Application/DiscountService.cs",
    "tests/DiscountServiceTests.cs"
  ],
  "expectedOutput": "small diff plus verification commands"
}`, 'Primer strukturirane predaje zadatka između uloga'),
    table(['Situacija', 'Prikladniji pristup'], [
      ['Mala lokalna izmena', 'Jedan agent sa jasnim planom i proverom.'],
      ['Odvojene faze analiza → implementacija → pregled', 'Više uloga može povećati disciplinu i sledljivost.'],
      ['Rizične dozvole za izmenu', 'Uloge samo za čitanje odvojiti od implementacije.'],
      ['Nejasan ili promenljiv zahtev', 'Najpre ljudska odluka i razjašnjenje zahteva; ne povećavati broj agenata.'],
    ]),
  ]),

  page('6.6. Projektna kontrolna tačka P5', [
    text('h2', '6.6. Projektna kontrolna tačka P5 — instrukcije i proverljiv izlaz'),
    list([
      '`AI_INSTRUCTIONS.md` sadrži stabilna projektna pravila i ograničenja.',
      'Najmanje jedan zadatak koristi unapred definisan strukturirani oblik izlaza.',
      '`AI_USAGE.md` sadrži reprezentativne zapise sa odlukom tima i dokazom provere.',
      'Tim ume da objasni koje su sugestije prihvaćene, koje su odbačene i zbog čega.',
      'Rezultat AI alata se ne prihvata kao dokaz bez stvarnog razvojnog signala.'
    ]),
  ]),

  page('6.7. Projektna kontrolna tačka P6', [
    text('h2', '6.7. Projektna kontrolna tačka P6 — procedure i agentski tok'),
    list([
      'Najmanje dve ponovljive procedure imaju jasan ulaz, korake, izlaz i ograničenja.',
      'Najmanje dve agentske uloge imaju različite odgovornosti ili različite dozvole.',
      'Najmanje jedan stvarni projektni zadatak prolazi kroz dokumentovan tok predaje između uloga kada je takva podela opravdana.',
      'Tim je uporedio jednostavniji i složeniji tok rada i može da obrazloži izbor.',
      'Konačna odluka o prihvatanju promene ostaje na timu i zasniva se na proverljivim rezultatima.'
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da projektuje kontrolisan tok rada sa AI podrškom tako da su odgovornosti, dozvole, trag odluka i nezavisna provera jasno razdvojeni.'),
  ]),
]
