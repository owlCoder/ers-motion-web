export type PresentationSlide = {
  title: string
  lead?: string
  points?: string[]
  example?: string
  question?: string
  note?: string
}

export type PresentationDeck = {
  id: string
  exercise: number
  title: string
  subtitle: string
  duration: string
  goal: string
  slides: PresentationSlide[]
}

export const presentationDecks: PresentationDeck[] = [
  {
    id: 'vezba-1',
    exercise: 1,
    title: 'Zahtevi, backlog, Git i timski razvoj',
    subtitle: 'Od poslovne potrebe do proverene promene u glavnoj grani',
    duration: '90 minuta',
    goal: 'Student razume da zahtev, backlog, grana, commit, pull request i provera čine jedan sledljiv razvojni proces.',
    slides: [
      {
        title: 'Zašto ova vežba postoji',
        lead: 'Razvoj ne počinje pisanjem koda, već razumevanjem promene koju kod treba da omogući.',
        points: [
          'zahtev mora imati poslovni smisao',
          'backlog čuva prioritet i dogovoreni obim',
          'Git čuva istoriju odluka, ne samo kopiju datoteka',
          'pull request je mesto za stručni pregled i proveru',
        ],
        note: 'Naglasiti studentima da se ne ocenjuje broj kartica ili commit-a sam po sebi, već veza između zahteva, promene i dokaza provere.',
      },
      {
        title: 'User Story kao početak razgovora',
        lead: 'User Story opisuje potrebu, očekivani rezultat i vrednost za korisnika.',
        points: [
          'ko ima potrebu',
          'šta želi da postigne',
          'zašto je rezultat vredan',
          'šta mora biti proverljivo',
        ],
        example: 'Kao nastavnik laboratorije, želim da rezervišem opremu za termin, kako bih sprečio dvostruku rezervaciju.',
        question: 'Koji deo ovog zahteva je poslovni cilj, a šta bi bila prerana tehnička odluka?',
      },
      {
        title: 'Kriterijumi prihvatanja',
        lead: 'Kriterijum prihvatanja pretvara opšti zahtev u proverljivo ponašanje sistema.',
        points: [
          'uspešan tok',
          'negativan scenario',
          'granični slučaj',
          'jasan dokaz provere',
        ],
        example: 'Sistem odbija rezervaciju ako se termin preklapa sa postojećom aktivnom rezervacijom iste opreme.',
        note: 'Dobar trenutak da se od studenata traži da sami dodaju bar jedan granični slučaj.',
      },
      {
        title: 'Backlog nije spisak želja',
        lead: 'Backlog je uređena lista rada nad proizvodom.',
        points: [
          'prioritet pokazuje šta je važnije',
          'opis čuva poslovni kontekst',
          'status pokazuje stvarno stanje rada',
          'Ready znači da se može početi bez nagađanja',
        ],
        question: 'Kada kartica zaista sme da pređe iz Ready u In Progress?',
      },
      {
        title: 'Git kao razvojni trag',
        lead: 'Svaki commit treba da predstavlja koherentan korak razvoja.',
        points: [
          'pregledati diff pre commit-a',
          'odvojiti refaktorisanje od nove funkcionalnosti kada je moguće',
          'ne ubacivati nepovezane promene u isti pull request',
          'glavna grana mora ostati stabilna',
        ],
        example: 'Commit poruka „Add reservation overlap rule“ je bolja od „changes“ jer opisuje nameru.',
      },
      {
        title: 'Pull request kao kontrolna tačka',
        lead: 'Pull request povezuje zahtev, implementaciju, testove i pregled koda.',
        points: [
          'da li je obim promene jasan',
          'da li postoje potrebni testovi',
          'da li je poštovana arhitektura',
          'da li je izvršena provera pre spajanja',
        ],
        question: 'Šta dobar opis pull request-a mora da kaže pregledalcu?',
      },
      {
        title: 'Konflikt je inženjerska odluka',
        lead: 'Rešavanje konflikta nije samo uklanjanje Git markera.',
        points: [
          'razumeti obe paralelne promene',
          'sačuvati ispravno konačno ponašanje',
          'pokrenuti odgovarajuću proveru',
          'objasniti odluku u commit-u ili PR-u',
        ],
        note: 'Ako postoji vreme, kratko demonstrirati konflikt na jednoj maloj datoteci.',
      },
      {
        title: 'Kontrolna tačka P1',
        lead: 'Cilj P1 je da projekat ima razumljiv problem, početni backlog i uredan razvojni tok.',
        points: [
          'README sa temom i članovima tima',
          'početni backlog u Tapiz Boards-u',
          'najmanje jedna proverljiva stavka',
          'bar jedan pull request sa pregledom i dokazom provere',
        ],
        note: 'Završiti vežbu jasnim očekivanjem: studenti treba da pokažu kako zahtev putuje do promene, a ne samo da pokažu kod.',
      },
    ],
  },
  {
    id: 'vezba-2',
    exercise: 2,
    title: 'OOP, Clean Code, SOLID i Clean Architecture',
    subtitle: 'Granice odgovornosti od klase do arhitekture sistema',
    duration: '90 minuta',
    goal: 'Student ume da objasni odgovornost, ugovor, zavisnost i smer zavisnosti kroz kod i arhitekturu projekta.',
    slides: [
      {
        title: 'Glavna ideja vežbe',
        lead: 'Kvalitet dizajna meri se time koliko je promena lokalizovana, objašnjiva i proverljiva.',
        points: [
          'OOP daje osnovne mehanizme',
          'Clean Code čini nameru čitljivom',
          'SOLID usmerava dizajn odgovornosti',
          'Clean Architecture čuva poslovno jezgro',
        ],
      },
      {
        title: 'Interfejs kao ugovor',
        lead: 'Interfejs nije ukras u kodu, već granica između klijenta i implementacije.',
        points: [
          'opisuje očekivano ponašanje',
          'sakriva promenljiv tehnički detalj',
          'omogućava zamenu implementacije',
          'olakšava testiranje',
        ],
        question: 'Kada je interfejs opravdan, a kada je samo dodatna složenost?',
      },
      {
        title: 'Clean Code pre SOLID-a',
        lead: 'Nejasan kod otežava svaku raspravu o principima dizajna.',
        points: [
          'naziv treba da otkriva nameru',
          'metoda treba da ima jasan razlog postojanja',
          'dupliranje se uklanja kada postoji zajednički koncept',
          'komentar ne sme da prikriva loše imenovanje',
        ],
      },
      {
        title: 'SRP i OCP',
        lead: 'SRP pita zašto se deo koda menja, a OCP kako dodajemo novu varijantu ponašanja.',
        points: [
          'jedna koherentna odgovornost',
          'poznata promenljivost ide iza ugovora',
          'centralni tok ne treba stalno menjati',
          'ne uvoditi apstrakcije za potpuno hipotetičke promene',
        ],
      },
      {
        title: 'LSP, ISP i DIP',
        lead: 'Zamenjivost, uski ugovori i zavisnost od apstrakcija čuvaju stabilnost sistema.',
        points: [
          'podtip mora poštovati očekivanja ugovora',
          'klijent ne treba da zavisi od operacija koje ne koristi',
          'poslovna logika ne treba da kreira tehničke detalje',
          'composition root povezuje konkretne implementacije',
        ],
      },
      {
        title: 'Clean Architecture',
        lead: 'Smer zavisnosti je važniji od samog broja projekata i foldera.',
        points: [
          'Domain čuva poslovna pravila',
          'Application orkestrira slučajeve upotrebe',
          'Infrastructure implementira tehničke adaptere',
          'Presentation prevodi spoljašnji zahtev u poziv aplikacije',
        ],
        question: 'Zašto Domain ne treba da zna za bazu podataka ili HTTP?',
      },
      {
        title: 'Logger–Blogger kao studija slučaja',
        lead: 'Nastavni primer služi za poređenje odluka, ne za slepo prepisivanje u projekat.',
        points: [
          'razlikovati poslovno jezgro od infrastrukture',
          'prepoznati gde pripada ugovor',
          'objasniti composition root',
          'povezati dizajn sa budućom promenom',
        ],
      },
      {
        title: 'Kontrolna tačka P2',
        lead: 'Do P2 projekat treba da ima jasne arhitektonske granice i jedan vertikalni prolaz.',
        points: [
          'tanak ulazni sloj',
          'poslovno pravilo izvan kontrolera',
          'ugovori za spoljne zavisnosti',
          'objašnjiv smer zavisnosti',
        ],
      },
    ],
  },
  {
    id: 'vezba-3',
    exercise: 3,
    title: 'Poslovna logika i use-case sloj',
    subtitle: 'Od zahteva do eksplicitnog poslovnog ishoda',
    duration: '90 minuta',
    goal: 'Student ume da razlikuje entitet, slučaj upotrebe, servis, repozitorijum i očekivani poslovni neuspeh.',
    slides: [
      {
        title: 'Zašto poslovna logika mora imati mesto',
        lead: 'Ako se pravila rasprše kroz kontrolere, menije i repozitorijume, sistem postaje teško razumljiv i krhak.',
        points: [
          'pravilo mora imati vlasnika',
          'slučaj upotrebe orkestrira operaciju',
          'entitet čuva sopstvene invarijante',
          'spoljni detalji ostaju iza ugovora',
        ],
      },
      {
        title: 'Use-case kao korisnički smislen tok',
        lead: 'Use-case nije samo metoda u servisu, već jasno određen tok od ulaza do rezultata.',
        points: [
          'prima komandu ili zahtev',
          'proverava osnovne i poslovne uslove',
          'poziva domenske objekte i ugovore',
          'vraća eksplicitan ishod',
        ],
      },
      {
        title: 'Entitet nije DTO',
        lead: 'Domenski objekat treba da štiti sopstveno validno stanje.',
        points: [
          'konstruktor ili factory sprečava očigledno nevalidno stanje',
          'metode imaju poslovno značenje',
          'seteri nisu zamena za ponašanje',
          'invarijante se ne ponavljaju na više mesta',
        ],
        question: 'Koje pravilo treba da bude u entitetu, a koje u use-case servisu?',
      },
      {
        title: 'Očekivani neuspeh nije izuzetak sistema',
        lead: 'Kada korisnik pošalje poslovno nevažeći zahtev, sistem može raditi potpuno ispravno i vratiti odbijanje.',
        points: [
          'konflikt termina',
          'nedovoljna količina zalihe',
          'nepostojeći entitet',
          'neovlašćen poslovni postupak',
        ],
        example: 'Result.Fail("OverlappingReservation") je jasniji od null vrednosti ili generičkog izuzetka.',
      },
      {
        title: 'Dependency Injection u use-case sloju',
        lead: 'Slučaj upotrebe dobija saradnike spolja i zato ne mora da zna kako se oni kreiraju.',
        points: [
          'repozitorijum kao ugovor',
          'sat kao promenljiva zavisnost',
          'servis spoljnog sistema kao adapter',
          'lakša zamena u testu i produkciji',
        ],
      },
      {
        title: 'Šta ne treba raditi',
        lead: 'Najčešće greške nastaju kada se arhitektonska granica zaobiđe radi brzog rešenja.',
        points: [
          'poslovna logika u controller-u',
          'direktno korišćenje DbContext-a iz domena',
          'generički Service sa previše odgovornosti',
          'skrivanje poslovnog neuspeha iza false ili null',
        ],
      },
      {
        title: 'Kontrolna tačka P3',
        lead: 'Do P3 projekat treba da ima najmanje dva koherentna slučaja upotrebe.',
        points: [
          'jasni ulazi i rezultati',
          'poslovna pravila na odgovarajućem mestu',
          'stabilni kodovi očekivanih neuspeha',
          'vidljiv trag arhitektonske odluke',
        ],
      },
    ],
  },
  {
    id: 'vezba-4',
    exercise: 4,
    title: 'Testabilni dizajn i automatizovano testiranje',
    subtitle: 'Testovi kao povratna informacija o kvalitetu granica sistema',
    duration: '90 minuta',
    goal: 'Student razume jedinični test, test dvojnike, negativne scenarije i pokrivenost koda kao razvojni signal.',
    slides: [
      {
        title: 'Testiranje nije završna formalnost',
        lead: 'Ako je sistem teško testirati, to često znači da su granice odgovornosti nejasne.',
        points: [
          'testabilnost se projektuje unapred',
          'zavisnosti treba kontrolisati',
          'test proverava ponašanje',
          'pokrivenost je signal, ne cilj sama po sebi',
        ],
      },
      {
        title: 'Arrange – Act – Assert',
        lead: 'Dobar test ima jedan jasan razlog postojanja.',
        points: [
          'Arrange priprema ulaz i saradnike',
          'Act izvršava jednu relevantnu operaciju',
          'Assert proverava ishod',
          'naziv testa opisuje ponašanje',
        ],
        example: 'Reserve_WhenPeriodOverlaps_ReturnsConflict',
      },
      {
        title: 'Moq i test dvojnici',
        lead: 'Mock koristimo kada test namerno izoluje promenljivu spoljnu zavisnost.',
        points: [
          'repozitorijum',
          'sat ili generator identifikatora',
          'HTTP klijent ili spoljni servis',
          'ne mock-ovati domensku klasu koju testiramo',
        ],
        question: 'Zašto previše Verify provera može učiniti test krhkim?',
      },
      {
        title: 'Pozitivni, negativni i granični scenariji',
        lead: 'Vredni testovi nastaju iz poslovnih pravila, ne iz nasumičnog obilaska metoda.',
        points: [
          'uspešan tok',
          'očekivan poslovni neuspeh',
          'granična vrednost',
          'infrastrukturni kvar',
        ],
      },
      {
        title: 'Test ne sme biti vezan za privatni detalj',
        lead: 'Refaktorisanje ne treba da ruši test ako se spolja vidljivo ponašanje nije promenilo.',
        points: [
          'proveravati rezultat ili značajnu interakciju',
          'ne proveravati svaku privatnu pomoćnu metodu',
          'ne zaključavati redosled internih poziva bez potrebe',
          'test mora pomoći dijagnostiku kvara',
        ],
      },
      {
        title: 'Pokrivenost koda kao signal',
        lead: 'Visok procenat pokrivenosti ne dokazuje da su testovi smisleni.',
        points: [
          'tražiti nepokrivene rizične grane',
          'posebno proveriti novac, dozvole, rezervacije i stanje',
          'ne testirati trivijalne getter-e samo radi procenta',
          'pitati koji test daje najviše novih informacija',
        ],
      },
      {
        title: 'Kontrolna tačka P4',
        lead: 'P4 označava stabilizaciju funkcionalnog jezgra pre intenzivnije AI podrške u kodu.',
        points: [
          'ključni use-case-ovi imaju testove',
          'najmanje jedan bug je reprodukovan testom',
          'pokrivenost je pregledana i obrazložena',
          'postoji tag manual-core-baseline',
        ],
      },
    ],
  },
  {
    id: 'vezba-5',
    exercise: 5,
    title: 'Integracija modula, ugovori i podaci',
    subtitle: 'Kako više timova razvija jedan proizvod bez rušenja granica modula',
    duration: '90 minuta',
    goal: 'Student ume da objasni granice modula, vlasništvo nad podacima, integracioni ugovor i proveru međumodulske saradnje.',
    slides: [
      {
        title: 'Zašto je integracija posebna tema',
        lead: 'Kada više timova radi na istom proizvodu, lokalno ispravan kod nije dovoljan.',
        points: [
          'moduli moraju imati jasne granice',
          'podatak mora imati vlasnika',
          'saradnja mora ići preko ugovora',
          'integracija mora biti proverljiva',
        ],
      },
      {
        title: 'Modul kao poslovna odgovornost',
        lead: 'Modul nije samo folder, već koherentna poslovna oblast sa pravilima i podacima.',
        points: [
          'ko menja podatak',
          'ko definiše pravilo',
          'ko odobrava promenu ugovora',
          'ko snosi posledice promene',
        ],
        question: 'Zašto je direktan pristup tuđoj tabeli loš integracioni obrazac?',
      },
      {
        title: 'Ugovor između modula',
        lead: 'Ugovor opisuje ulaz, izlaz, semantiku i moguće poslovne neuspehe.',
        points: [
          'koristiti poslovno razumljive pojmove',
          'ne izlagati ORM entitete kao javni ugovor',
          'definisati stabilne kodove ishoda',
          'promenu ugovora pregledati kao rizičnu promenu',
        ],
      },
      {
        title: 'Sinhroni poziv ili događaj',
        lead: 'Oblik saradnje zavisi od toga da li je rezultat potreban odmah.',
        points: [
          'sinhroni poziv kada trenutna operacija zavisi od odgovora',
          'događaj kada je činjenica već nastala',
          'događaj nije skrivena komanda',
          'analitika često reaguje naknadno',
        ],
        example: 'OrderConfirmed opisuje činjenicu; ne naređuje drugim modulima šta moraju da urade.',
      },
      {
        title: 'Transakcije i konkurentnost',
        lead: 'Sistem mora jasno definisati šta se dešava kada dve operacije menjaju isto stanje.',
        points: [
          'transakciona granica',
          'optimistička konkurentnost',
          'stabilan odgovor na konflikt',
          'ponovni pokušaj samo kada je bezbedan',
        ],
      },
      {
        title: 'Idempotentnost',
        lead: 'Ponavljanje istog zahteva ne sme proizvesti neželjeni dodatni efekat.',
        points: [
          'naplata novca',
          'slanje poruka',
          'kreiranje jedinstvenog zapisa',
          'obrada događaja više puta',
        ],
        question: 'Koji zahtev u studentskom projektu mora imati idempotentni ključ?',
      },
      {
        title: 'Integracioni i ugovorni testovi',
        lead: 'Mock ne može dokazati da dva modula zaista sarađuju u izvršivom sistemu.',
        points: [
          'mapiranje podataka',
          'registracija zavisnosti',
          'kodovi neuspeha',
          'granice transakcije',
        ],
      },
      {
        title: 'Pregled međumodulske promene',
        lead: 'Pull request koji menja ugovor mora pokazati uticaj na zavisne module.',
        points: [
          'koji modul uvodi ili menja ugovor',
          'koji moduli zavise od promene',
          'da li se koristi poziv ili događaj',
          'koji test potvrđuje saradnju',
        ],
      },
    ],
  },
  {
    id: 'vezba-6',
    exercise: 6,
    title: 'Kontrolisan razvoj uz AI: kontekst, instrukcije, procedure i agenti',
    subtitle: 'Od pojedinačnog upita do ponovljivog i proverljivog razvojnog toka',
    duration: '90 minuta',
    goal: 'Student ume da pripremi kvalitetan kontekst, projektne instrukcije, ponovljivu proceduru i ograničenu agentsku ulogu.',
    slides: [
      {
        title: 'AI kao deo procesa, ne zamena za proces',
        lead: 'AI alat može pomoći, ali ne sme preuzeti odgovornost za zahtev, arhitekturu i proveru.',
        points: [
          'zadatak mora biti jasan',
          'kontekst mora biti relevantan',
          'izlaz mora biti proverljiv',
          'odluka ostaje na timu',
        ],
      },
      {
        title: 'Dobar zadatak pre implementacije',
        lead: 'Pre izmene koda tražimo analizu uticaja, plan i test scenarije.',
        points: [
          'opis problema',
          'relevantna pravila projekta',
          'ograničenja slojeva',
          'očekivani format rezultata',
        ],
        question: 'Zašto je bolje tražiti plan pre nego što alat počne da menja kod?',
      },
      {
        title: 'Projektne instrukcije',
        lead: 'Stabilna pravila projekta treba da budu kratka, konkretna i verzionisana.',
        points: [
          'pravila arhitekture',
          'pravila kodiranja',
          'pravila pre izmene koda',
          'pravila provere rezultata',
        ],
        note: 'Naglasiti da projektne instrukcije nisu dnevnik razgovora i ne treba da sadrže sve što se ikada dogodilo.',
      },
      {
        title: 'Strukturirani izlaz',
        lead: 'Predvidiv format olakšava pregled, poređenje i automatizaciju.',
        points: [
          'uticaj po slojevima',
          'plan koraka',
          'test scenariji',
          'rizici i otvorena pitanja',
          'način verifikacije',
        ],
      },
      {
        title: 'AI_USAGE.md',
        lead: 'Evidencija ne mora biti transkript, ali mora pokazati zadatak, odluku i proveru.',
        points: [
          'koji alat je korišćen',
          'koji kontekst je dat',
          'šta je predloženo',
          'šta je prihvaćeno ili odbačeno',
          'kako je rezultat proveren',
        ],
      },
      {
        title: 'Procedura kao ponovljiv razvojni postupak',
        lead: 'Skill ili slična procedura čuva korake koji se ponavljaju kroz više zadataka.',
        points: [
          'kada se koristi',
          'koji ulaz očekuje',
          'koje korake sprovodi',
          'šta vraća',
          'koja ograničenja poštuje',
        ],
      },
      {
        title: 'Agent kao ograničena odgovornost',
        lead: 'Agent ima ulogu, cilj, kontekst i dozvoljene alate.',
        points: [
          'arhitekta čita i planira',
          'implementator menja kod u okviru plana',
          'agent za testiranje pokreće i tumači testove',
          'pregledalac analizira diff bez izmene koda',
        ],
      },
      {
        title: 'Kontrolna tačka P5/P6',
        lead: 'Tim treba da pokaže da je AI podrška uredno uvedena u razvojni tok.',
        points: [
          'stabilne projektne instrukcije',
          'strukturirani izlaz za najmanje jedan zadatak',
          'uredan AI_USAGE.md',
          'najmanje jedna ponovljiva procedura',
          'najmanji smisleni agentski tok rada',
        ],
      },
    ],
  },
  {
    id: 'vezba-7',
    exercise: 7,
    title: 'MCP i povezivanje sa projektom',
    subtitle: 'Kontrolisana granica između AI klijenta i projektnih resursa',
    duration: '90 minuta',
    goal: 'Student razume razliku između resursa i alata, zna zašto se MCP koristi i kako da mali MCP server veže za stvarni projekat.',
    slides: [
      {
        title: 'Problem koji MCP rešava',
        lead: 'Umesto ručnog kopiranja konteksta, projekat može kontrolisano izložiti resurse i alate.',
        points: [
          'dokumentacija kao resurs',
          'test komanda kao alat',
          'diff kao razvojni signal',
          'dozvole kao granica rizika',
        ],
      },
      {
        title: 'Resurs ili alat',
        lead: 'Resurs se čita, alat izvršava operaciju.',
        points: [
          'project://instructions kao resurs',
          'run_unit_tests kao alat',
          'get_git_diff kao alat ili dinamički resurs',
          'brisanje datoteka nije studentski minimum',
        ],
        question: 'Zašto pokretanje testova nije običan tekstualni resurs?',
      },
      {
        title: 'Minimalni MCP server',
        lead: 'Prvi server treba da bude mali i vezan za stvaran softversko-inženjerski problem.',
        points: [
          'jasno izdvojen projekat u repozitorijumu',
          'uputstvo za pokretanje',
          'jedan čitljiv resurs ili alat',
          'proširenje tek nakon razumevanja osnovnog toka',
        ],
      },
      {
        title: 'Projektni signali',
        lead: 'Najkorisniji alati vraćaju podatke koje tim već koristi za proveru razvoja.',
        points: [
          'struktura projekta',
          'otvorene stavke',
          'git diff',
          'rezultat testova',
          'pokrivenost koda',
        ],
      },
      {
        title: 'Strukturirani rezultat alata',
        lead: 'Alat treba da vrati kratak i pouzdan rezultat, ne nekontrolisanu količinu terminalskog izlaza.',
        points: [
          'komanda koja je izvršena',
          'status uspeha',
          'broj testova',
          'sažetak neuspeha',
          'ograničen detalj za dijagnostiku',
        ],
      },
      {
        title: 'Nepouzdan sadržaj',
        lead: 'Tekst koji dolazi iz issue-ja, dokumenta ili spoljnog sistema nije automatski instrukcija.',
        points: [
          'razlikovati podatak od pravila',
          'navesti poreklo kada je važno',
          'ne dozvoliti čitanje tajni',
          'testirati prompt-injection scenario',
        ],
      },
      {
        title: 'Kontrolna tačka P7',
        lead: 'MCP deo treba da bude mali, razumljiv i demonstrabilan.',
        points: [
          'najmanje tri smisleno izabrane MCP funkcionalnosti',
          'najmanje jedan stvarni razvojni signal',
          'jasno opisane dozvoljene putanje',
          'demonstracija korišćenja u agentskom toku rada',
        ],
      },
    ],
  },
  {
    id: 'vezba-8',
    exercise: 8,
    title: 'Hooks, guardrails, evaluacije i završna provera kvaliteta',
    subtitle: 'Determinističke zaštite oko razvojnog toka uz AI podršku',
    duration: '90 minuta',
    goal: 'Student ume da razlikuje instrukciju, izvršivu proveru, bezbednosno ograničenje, evaluacioni scenario i završni QA.',
    slides: [
      {
        title: 'Zašto instrukcija nije dovoljna',
        lead: 'Ako pravilo mora uvek da važi, ne treba ga prepustiti sećanju ili proceni modela.',
        points: [
          'testovi se mogu pokrenuti automatski',
          'rizične komande se mogu blokirati',
          'putanje se mogu validirati',
          'format izlaza se može proveriti',
        ],
      },
      {
        title: 'Hook kao izvršna tačka kontrole',
        lead: 'Hook se izvršava pre ili posle određene aktivnosti u toku rada.',
        points: [
          'pre pokretanja komande',
          'posle izmene datoteke',
          'pre završnog izveštaja',
          'nakon generisanja artefakta',
        ],
      },
      {
        title: 'Guardrail i dozvole',
        lead: 'Guardrail zaustavlja tok rada kada je prekršeno jasno pravilo.',
        points: [
          'zabrana čitanja tajni',
          'blokiranje destruktivnih komandi',
          'ograničenje dozvoljenih putanja',
          'ljudsko odobrenje za rizične operacije',
        ],
      },
      {
        title: 'Evaluacioni scenariji',
        lead: 'Evaluacija proverava ponašanje agentskog toka u reprezentativnom slučaju.',
        points: [
          'tipičan zadatak',
          'granični slučaj',
          'regresioni slučaj',
          'bezbednosni slučaj',
          'nepotpun ulaz',
        ],
      },
      {
        title: 'Peer QA',
        lead: 'Spoljašnji pregled proverava da li projekat može da se razume i pokrene bez autora.',
        points: [
          'pokretanje po README-u',
          'jedan reprezentativan scenario',
          'jedan pull request ili diff',
          'jedan agentski tok ili procedura',
          'konkretna sugestija ili obrazložena potvrda',
        ],
      },
      {
        title: 'Završna odbrana',
        lead: 'Student ne brani generisani odgovor, već sistem koji razume i može da objasni.',
        points: [
          'zahtev i kriterijumi prihvatanja',
          'arhitektonske granice',
          'poslovna pravila i testovi',
          'AI podrška i njena provera',
          'odluke koje je tim doneo',
        ],
      },
      {
        title: 'Kontrolna tačka P8',
        lead: 'P8 zaokružuje kurs kroz proverljiv razvoj, kvalitet i odgovornost tima.',
        points: [
          'najmanje dva hook ili guardrail mehanizma',
          'najmanje tri evaluaciona scenarija',
          'zabeležen peer QA',
          'uredan AI_USAGE.md',
          'svaki član ume da objasni odabrani tok',
        ],
      },
    ],
  },
]
