export type PresentationSlide = {
  title: string
  lead?: string
  points?: string[]
  example?: string
  question?: string
  note?: never
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
    goal: 'Povezati zahtev, planiranje rada, Git istoriju, pregled koda i proveru u jedan sledljiv razvojni proces.',
    slides: [
      {
        title: 'Od ideje do proverene promene',
        lead: 'Razvoj softvera nije niz nepovezanih aktivnosti. Zahtev, backlog, Git i pregled koda čine jedan tok rada.',
        points: [
          'poslovna potreba određuje cilj promene',
          'backlog čuva prioritet i dogovoreni obim',
          'Git čuva sledljivu istoriju razvoja',
          'pull request povezuje implementaciju i proveru',
        ],
      },
      {
        title: 'User Story opisuje potrebu',
        lead: 'User Story ne propisuje tehničko rešenje, već opisuje kome je funkcionalnost potrebna i koju vrednost donosi.',
        points: [
          'uloga ili korisnik',
          'cilj koji želi da ostvari',
          'vrednost očekivanog rezultata',
          'osnova za razgovor i razradu',
        ],
        example: 'Kao nastavnik laboratorije, želim da rezervišem slobodnu opremu za termin, kako bih sprečio dvostruku rezervaciju.',
      },
      {
        title: 'Kriterijumi prihvatanja čine zahtev proverljivim',
        lead: 'Dobar kriterijum opisuje ponašanje koje može jasno da se potvrdi testom ili demonstracijom.',
        points: [
          'uspešan scenario',
          'negativan scenario',
          'granični slučaj',
          'očekivani ishod',
        ],
        example: 'Sistem odbija rezervaciju ako se termin preklapa sa postojećom aktivnom rezervacijom iste opreme.',
      },
      {
        title: 'Backlog je uređena lista rada',
        lead: 'Backlog nije arhiva ideja. Stavke treba da budu dovoljno jasne da tim može da odredi prioritet i započne rad bez nagađanja.',
        points: [
          'Backlog — stavka postoji, ali nije spremna',
          'Ready — cilj i kriterijumi su dovoljno jasni',
          'In Progress — implementacija je u toku',
          'Done — promena je proverena i integrisana',
        ],
      },
      {
        title: 'Git čuva razvojni trag',
        lead: 'Git istorija treba da omogući rekonstrukciju razvoja i razloga zbog kojih je promena nastala.',
        points: [
          'working tree sadrži trenutne izmene',
          'staging bira sadržaj narednog commit-a',
          'commit predstavlja koherentan razvojni korak',
          'grana izdvaja jednu promenu od stabilne linije razvoja',
        ],
      },
      {
        title: 'Kvalitetan commit ima jasnu nameru',
        lead: 'Commit poruka treba da objasni šta je promenjeno i zbog čega ta promena postoji.',
        points: [
          'pregledati diff pre commit-a',
          'ne mešati nepovezane izmene',
          'izbegavati poruke kao što su „changes“ ili „fix“',
          'ostaviti projekat u proverljivom stanju',
        ],
        example: '„Add reservation overlap rule“ jasnije opisuje nameru od poruke „update“.',
      },
      {
        title: 'Pull request je mesto stručnog pregleda',
        lead: 'Pre spajanja promene tim proverava obim, ispravnost, arhitekturu i rezultate testova.',
        points: [
          'šta promena rešava',
          'koje datoteke i slojeve menja',
          'kako je ponašanje provereno',
          'koji rizici ili otvorena pitanja postoje',
        ],
      },
      {
        title: 'Konflikt zahteva inženjersku odluku',
        lead: 'Git konflikt nije samo tehnički problem. Potrebno je razumeti dve konkurentne promene i izabrati ispravno konačno ponašanje.',
        points: [
          'pročitati obe strane konflikta',
          'razumeti očekivano ponašanje sistema',
          'spojiti promene bez gubitka poslovnog smisla',
          'nakon rešavanja pokrenuti odgovarajuću proveru',
        ],
      },
      {
        title: 'Definition of Done završava tok',
        lead: 'Stavka nije završena samo zato što je kod napisan.',
        points: [
          'kriterijumi prihvatanja su ispunjeni',
          'izgradnja projekta je uspešna',
          'potrebni testovi prolaze',
          'pregled koda je završen i promena je integrisana',
        ],
      },
      {
        title: 'P1 — prvi dokaz uređenog razvoja',
        lead: 'Na prvoj kontrolnoj tački tim pokazuje da razume problem i da ume da vodi promenu kroz ceo razvojni tok.',
        points: [
          'zajednički repozitorijum i početni README',
          'uređen backlog u Tapiz Boards-u',
          'najmanje jedna stavka sa kriterijumima prihvatanja',
          'pull request sa pregledom i dokazom provere',
        ],
        question: 'Možete li za jednu stavku projekta da pokažete ceo put od zahteva do integrisane promene?',
      },
    ],
  },
  {
    id: 'vezba-2',
    exercise: 2,
    title: 'OOP, Clean Code, SOLID i Clean Architecture',
    subtitle: 'Granice odgovornosti od klase do arhitekture sistema',
    duration: '90 minuta',
    goal: 'Razumeti kako ugovori, odgovornosti i smer zavisnosti smanjuju posledice budućih promena.',
    slides: [
      {
        title: 'Dobar dizajn lokalizuje promenu',
        lead: 'Kvalitet dizajna se vidi kada novi zahtev ne zahteva nepredvidivu izmenu velikog broja nepovezanih delova sistema.',
        points: [
          'OOP daje osnovne mehanizme',
          'Clean Code čini nameru jasnom',
          'SOLID usmerava odgovornosti',
          'Clean Architecture štiti poslovno jezgro',
        ],
      },
      {
        title: 'Interfejs predstavlja ugovor',
        lead: 'Interfejs odvaja ono što klijent očekuje od načina na koji je ponašanje realizovano.',
        points: [
          'jasan skup operacija',
          'stabilna očekivanja klijenta',
          'zamenjive implementacije',
          'lakše testiranje i zamena tehničkog detalja',
        ],
      },
      {
        title: 'Enkapsulacija čuva validno stanje',
        lead: 'Objekat treba da kontroliše promene sopstvenog stanja umesto da dozvoli nekontrolisano menjanje polja.',
        points: [
          'invarijante ostaju na jednom mestu',
          'metode izražavaju poslovno značenje',
          'nevažeće stanje se sprečava što ranije',
          'seteri nisu zamena za ponašanje',
        ],
      },
      {
        title: 'Clean Code otkriva nameru',
        lead: 'Čitljiv kod smanjuje vreme potrebno da drugi član tima razume razlog i posledice promene.',
        points: [
          'jasna imena klasa i metoda',
          'male i koherentne odgovornosti',
          'bez nepotrebnog dupliranja',
          'komentar objašnjava razlog, ne ono što kod već govori',
        ],
      },
      {
        title: 'SRP — jedan koherentan razlog za promenu',
        lead: 'Single Responsibility Principle ne znači jedna metoda po klasi, već jedna smislena odgovornost.',
        points: [
          'razdvojiti poslovno pravilo od slanja poruke',
          'razdvojiti pristup podacima od prezentacije',
          'ne deliti klasu samo zbog broja linija',
          'granica treba da prati razlog buduće promene',
        ],
      },
      {
        title: 'OCP — proširenje bez stalne izmene centralnog toka',
        lead: 'Kada postoje poznate varijante ponašanja, promenljivost se može smestiti iza odgovarajućeg ugovora.',
        points: [
          'nova varijanta dolazi kao nova implementacija',
          'stabilni klijent ostaje nepromenjen',
          'polimorfizam zamenjuje nepotrebno grananje po tipu',
          'apstrakcije se uvode za realnu, a ne izmišljenu promenljivost',
        ],
      },
      {
        title: 'LSP, ISP i DIP',
        lead: 'Zamenjivost, uski ugovori i zavisnost od apstrakcija čuvaju stabilnost sistema.',
        points: [
          'LSP — implementacija poštuje očekivanja ugovora',
          'ISP — klijent zavisi samo od onoga što koristi',
          'DIP — poslovni kod zavisi od apstrakcije',
          'konkretna implementacija se bira na spoljašnjoj granici',
        ],
      },
      {
        title: 'Clean Architecture uređuje smer zavisnosti',
        lead: 'Broj projekata i foldera nije cilj. Važno je da poslovno jezgro ne zavisi od promenljivih tehničkih detalja.',
        points: [
          'Domain — entiteti i stabilna pravila',
          'Application — slučajevi upotrebe i orkestracija',
          'Infrastructure — baza i spoljni adapteri',
          'prezentacioni sloj — API, UI ili konzola',
        ],
      },
      {
        title: 'Composition root povezuje konkretne zavisnosti',
        lead: 'Unutrašnji slojevi definišu potrebe, a composition root bira konkretne implementacije.',
        points: [
          'registracija repozitorijuma',
          'registracija spoljnih servisa',
          'konfiguracija infrastrukture',
          'poslovni kod ne kreira sopstvene tehničke zavisnosti',
        ],
      },
      {
        title: 'P2 — arhitektura mora biti objašnjiva',
        lead: 'Do druge kontrolne tačke tim pokazuje najmanje jedan vertikalni prolaz kroz sistem sa jasnim granicama odgovornosti.',
        points: [
          'tanak ulazni sloj',
          'poslovna pravila van kontrolera',
          'ugovori prema promenljivim zavisnostima',
          'smer zavisnosti koji tim može da obrazloži',
        ],
        question: 'Koji deo vašeg projekta bi najviše patio kada bi Domain neposredno zavisio od baze podataka?',
      },
    ],
  },
  {
    id: 'vezba-3',
    exercise: 3,
    title: 'Poslovna logika i use-case sloj',
    subtitle: 'Od zahteva do eksplicitnog poslovnog ishoda',
    duration: '90 minuta',
    goal: 'Razlikovati odgovornost domena, slučaja upotrebe, ugovora i očekivanog poslovnog neuspeha.',
    slides: [
      {
        title: 'Poslovna pravila moraju imati jasno mesto',
        lead: 'Kada su pravila rasuta kroz kontrolere, forme i repozitorijume, promena postaje skupa i teško proverljiva.',
        points: [
          'pravilo ima poslovnog vlasnika',
          'domen čuva stabilne invarijante',
          'use-case orkestrira tok',
          'infrastruktura ne određuje poslovno ponašanje',
        ],
      },
      {
        title: 'Use-case predstavlja smislen korisnički tok',
        lead: 'Slučaj upotrebe počinje jasnim ulazom i završava se eksplicitnim rezultatom.',
        points: [
          'prima komandu ili zahtev',
          'učitava potrebne podatke preko ugovora',
          'primenjuje poslovna pravila',
          'vraća uspeh ili očekivani neuspeh',
        ],
      },
      {
        title: 'Entitet čuva sopstvene invarijante',
        lead: 'Domenski objekat nije samo skup svojstava. Njegova uloga je da spreči nevažeće stanje i izrazi poslovno ponašanje.',
        points: [
          'validacija pri kreiranju',
          'metode sa poslovnim značenjem',
          'ograničen pristup promeni stanja',
          'pravilo se ne ponavlja u više slojeva',
        ],
      },
      {
        title: 'Aplikacioni sloj orkestrira saradnju',
        lead: 'Application povezuje domen sa potrebnim spoljnim informacijama, ali ne treba da preuzima odgovornost infrastrukture.',
        points: [
          'poziva repozitorijum preko ugovora',
          'poziva domenski objekat',
          'upravlja tokom slučaja upotrebe',
          'mapira rezultat prema spoljašnjoj granici',
        ],
      },
      {
        title: 'Očekivani poslovni neuspeh nije kvar sistema',
        lead: 'Sistem može potpuno ispravno da odbije zahtev zato što poslovni uslov nije ispunjen.',
        points: [
          'konflikt termina',
          'nedovoljna količina',
          'nedozvoljen prelaz stanja',
          'nepostojeći poslovni objekat',
        ],
        example: 'Rezultat sa kodom „OverlappingReservation“ je jasniji od generičkog izuzetka bez poslovnog značenja.',
      },
      {
        title: 'Validacija ima više nivoa',
        lead: 'Nije svaka validacija ista. Tehnička ispravnost ulaza i poslovno pravilo pripadaju različitim odgovornostima.',
        points: [
          'format i obavezna polja na ulazu',
          'poslovni uslovi u domenu ili slučaju upotrebe',
          'invarijante u objektu koji ih poseduje',
          'ne duplirati isto pravilo u više slojeva',
        ],
      },
      {
        title: 'Dependency Injection čini use-case proverljivim',
        lead: 'Slučaj upotrebe dobija saradnike spolja i zato ne mora da zna kako se oni kreiraju.',
        points: [
          'repozitorijum kao ugovor',
          'sat kao zavisnost kada vreme utiče na pravilo',
          'spoljni servis kao adapter',
          'test može zameniti zavisnost kontrolisanim dvojnikom',
        ],
      },
      {
        title: 'Transakcija prati poslovnu celinu',
        lead: 'Promene koje moraju zajedno uspeti treba posmatrati kao jednu poslovnu operaciju.',
        points: [
          'jasna početna i završna granica',
          'ne ostavljati parcijalno stanje',
          'infrastruktura sprovodi tehničku transakciju',
          'poslovni tok određuje šta mora biti atomsko',
        ],
      },
      {
        title: 'Najčešće arhitektonske greške',
        lead: 'Brza rešenja često zaobilaze granicu slojeva i dugoročno povećavaju cenu promene.',
        points: [
          'poslovna logika u kontroleru',
          'direktan DbContext u domenu',
          'generički Service sa mnogo nepovezanih odgovornosti',
          'false ili null kao nejasan poslovni rezultat',
        ],
      },
      {
        title: 'P3 — koherentni slučajevi upotrebe',
        lead: 'Do treće kontrolne tačke projekat treba da pokaže da poslovno ponašanje ima jasne granice i eksplicitne ishode.',
        points: [
          'jasan ulaz i rezultat',
          'pravila na odgovarajućem mestu',
          'očekivani neuspeh sa stabilnim značenjem',
          'zavisnosti prema infrastrukturi iza ugovora',
        ],
        question: 'Možete li za jedan use-case da pokažete gde se nalazi svako poslovno pravilo i zbog čega?',
      },
    ],
  },
  {
    id: 'vezba-4',
    exercise: 4,
    title: 'Testabilni dizajn i automatizovano testiranje',
    subtitle: 'NUnit, Moq, granice testa i pouzdana regresiona zaštita',
    duration: '90 minuta',
    goal: 'Razumeti kako se testovima proverava ponašanje i kako dizajn utiče na kvalitet i jednostavnost testiranja.',
    slides: [
      {
        title: 'Test je dokaz ponašanja',
        lead: 'Automatizovani test treba da potvrdi jasno očekivanje sistema, a ne samo da izvrši linije koda.',
        points: [
          'test ima konkretan scenario',
          'očekivanje je nedvosmisleno',
          'ne zavisi od slučajnog redosleda izvršavanja',
          'pad testa treba da pomogne dijagnostici',
        ],
      },
      {
        title: 'Arrange — Act — Assert',
        lead: 'Jasna struktura testa razdvaja pripremu, izvršenje i proveru rezultata.',
        points: [
          'Arrange — pripremiti stanje i zavisnosti',
          'Act — izvršiti jednu ciljanu operaciju',
          'Assert — proveriti očekivani ishod',
          'jedan test treba da ima jasan razlog pada',
        ],
      },
      {
        title: 'Pozitivni, negativni i granični testovi',
        lead: 'Samo uspešan scenario ne pokazuje da poslovno pravilo zaista štiti sistem.',
        points: [
          'pozitivan slučaj potvrđuje dozvoljeno ponašanje',
          'negativan slučaj potvrđuje odbijanje',
          'granični slučaj proverava tačnu ivicu pravila',
          'regresioni test čuva ranije ispravljeno ponašanje',
        ],
      },
      {
        title: 'Testabilan dizajn smanjuje potrebu za trikovima',
        lead: 'Kod koji ima jasne granice zavisnosti lakše se testira bez baze, mreže i drugih sporih detalja.',
        points: [
          'zavisnosti se prosleđuju spolja',
          'poslovna logika nije skrivena u statičkim pomoćnim metodama',
          'vreme i slučajnost mogu biti kontrolisani',
          'spoljni sistemi su iza uskih ugovora',
        ],
      },
      {
        title: 'Test double zamenjuje zavisnost u kontrolisanom scenariju',
        lead: 'Moq i slični alati služe da se izoluju zavisnosti kada je cilj testa ponašanje konkretne jedinice.',
        points: [
          'stub vraća unapred pripremljen podatak',
          'mock može proveriti važnu interakciju',
          'ne simulirati detalje koji nisu deo cilja testa',
          'previše mock-ova često ukazuje na preširoku odgovornost',
        ],
      },
      {
        title: 'Ne testiramo implementacione detalje bez razloga',
        lead: 'Test koji je čvrsto vezan za unutrašnju strukturu puca pri bezbednom refaktorisanju.',
        points: [
          'preferirati spolja vidljivo ponašanje',
          'ne proveravati redosled internih poziva ako nije poslovno važan',
          'ne testirati privatne metode neposredno',
          'test treba da preživi promenu implementacije uz isto ponašanje',
        ],
      },
      {
        title: 'Integracioni test proverava saradnju stvarnih delova',
        lead: 'Kada je rizik u mapiranju, bazi, konfiguraciji ili granici između komponenti, jedinični test nije dovoljan.',
        points: [
          'stvarno mapiranje i registracija zavisnosti',
          'realna infrastruktura u kontrolisanom okruženju',
          'provera ugovora između komponenti',
          'manji broj sporijih, ali vrednih scenarija',
        ],
      },
      {
        title: 'Pokrivenost koda je signal, ne cilj',
        lead: 'Visok procenat pokrivenosti ne garantuje da su najvažnija poslovna pravila dobro proverena.',
        points: [
          'pronaći nepokrivene rizične grane',
          'ne pisati besmislene testove samo radi procenta',
          'prioritet dati poslovnim pravilima',
          'posmatrati pokrivenost zajedno sa kvalitetom scenarija',
        ],
      },
      {
        title: 'Dobar test je deterministički',
        lead: 'Isti kod i isti ulaz treba da daju isti rezultat bez zavisnosti od slučajnog vremena ili spoljnog sistema.',
        points: [
          'kontrolisati vreme',
          'kontrolisati generator slučajnih vrednosti kada je relevantno',
          'ne zavisiti od javnog interneta',
          'očistiti stanje između integracionih testova',
        ],
      },
      {
        title: 'P4 — testirano funkcionalno jezgro',
        lead: 'Do četvrte kontrolne tačke tim treba da ima pouzdanu regresionu zaštitu ključnog poslovnog ponašanja.',
        points: [
          'testovi ključnih uspešnih tokova',
          'negativni i granični scenariji',
          'kontrolisane spoljne zavisnosti',
          'Git tag `manual-core-baseline` nakon provere jezgra',
        ],
        question: 'Koji kvar u vašem projektu bi bio najskuplji ako bi ostao bez automatizovanog testa?',
      },
    ],
  },
  {
    id: 'vezba-5',
    exercise: 5,
    title: 'Integracija modula, ugovori i podaci',
    subtitle: 'Saradnja više timova unutar jednog zajedničkog proizvoda',
    duration: '90 minuta',
    goal: 'Razumeti kako moduli sarađuju bez narušavanja granica odgovornosti i vlasništva nad podacima.',
    slides: [
      {
        title: 'Više timova, jedan proizvod',
        lead: 'Kada različiti timovi razvijaju različite module, lokalno dobar kod nije dovoljan. Potrebne su stabilne granice saradnje.',
        points: [
          'svaki modul ima jasnu poslovnu odgovornost',
          'svaki modul poseduje svoja pravila',
          'zavisnosti između modula su eksplicitne',
          'promena ugovora ima poznat uticaj',
        ],
      },
      {
        title: 'Modul je poslovna granica',
        lead: 'Granica modula treba da prati koherentnu poslovnu oblast, a ne samo raspored foldera.',
        points: [
          'sopstveni slučajevi upotrebe',
          'sopstvena poslovna pravila',
          'jasan javni ugovor',
          'unutrašnji detalji nisu javni API',
        ],
      },
      {
        title: 'Vlasništvo nad podacima mora biti jasno',
        lead: 'Podatak treba da menja modul koji poseduje poslovno pravilo nad tim podatkom.',
        points: [
          'drugi modul ne menja tuđe interne tabele',
          'čitanje ide preko ugovora ili projekcije',
          'poslovna odluka ostaje kod vlasničkog modula',
          'promena modela ne sme tiho da razbije zavisne module',
        ],
      },
      {
        title: 'Ugovor između modula mora biti eksplicitan',
        lead: 'Klijent treba da zna ulaz, izlaz i moguće ishode, ali ne i unutrašnju strukturu drugog modula.',
        points: [
          'poslovno razumljivi nazivi',
          'stabilni kodovi neuspeha',
          'uski skup potrebnih operacija',
          'bez izlaganja ORM entiteta i DbContext-a',
        ],
      },
      {
        title: 'Sinhroni poziv koristi se kada je rezultat potreban odmah',
        lead: 'Ako trenutna operacija ne može da odluči bez odgovora drugog modula, sinhrona saradnja može biti opravdana.',
        points: [
          'jasan zahtev i rezultat',
          'poznata greška ili odbijanje',
          'kontrolisana zavisnost',
          'izbegavati dugačke lance sinhronih poziva',
        ],
        example: 'Porudžbina ne može biti potvrđena dok modul zaliha ne potvrdi rezervaciju potrebne količine.',
      },
      {
        title: 'Poslovni događaj objavljuje činjenicu',
        lead: 'Događaj opisuje nešto što se već dogodilo, a drugi moduli mogu da reaguju u skladu sa sopstvenim pravilima.',
        points: [
          'naziv u prošlom vremenu',
          'bez skrivene naredbe drugom modulu',
          'više potrošača može reagovati',
          'izvorni modul ne zavisi od njihove implementacije',
        ],
        example: 'OrderConfirmed opisuje završenu poslovnu činjenicu; analitika zatim može da ažurira svoje projekcije.',
      },
      {
        title: 'Transakciona granica mora pratiti poslovnu celinu',
        lead: 'Skup promena koji mora zajedno da uspe ili bude poništen treba da ima jasnu transakcionu granicu.',
        points: [
          'izbegavati parcijalno stanje',
          'odrediti šta pripada jednoj poslovnoj operaciji',
          'ne širiti transakciju preko nepotrebno velikog dela sistema',
          'spoljni efekti zahtevaju poseban oprez',
        ],
      },
      {
        title: 'Konkurentnost i idempotentnost štite sistem',
        lead: 'Dva zahteva mogu istovremeno pokušati da promene isti podatak, a isti zahtev može biti poslat više puta.',
        points: [
          'optimistička konkurentnost otkriva zastarelo stanje',
          'idempotentni zahtev sprečava dvostruki efekat',
          'retry nije bezbedan za svaku operaciju',
          'poslovno pravilo određuje prihvatljiv ishod konflikta',
        ],
      },
      {
        title: 'Integracioni i ugovorni testovi štite granicu',
        lead: 'Kada dva modula sarađuju, potrebno je proveriti da imaju isto razumevanje ugovora i da stvarna integracija radi.',
        points: [
          'mapiranje ulaza i izlaza',
          'kodovi poslovnog neuspeha',
          'registracija zavisnosti',
          'reprezentativan tok kroz dva modula',
        ],
      },
      {
        title: 'Međumodulska promena zahteva širi pregled',
        lead: 'Promena ugovora ili vlasništva nad podacima utiče na više timova i ne sme proći kao lokalni detalj.',
        points: [
          'navesti zavisne module',
          'objasniti izabrani način saradnje',
          'dodati odgovarajuće integracione testove',
          'važnu odluku sačuvati u ADR-u kada je potrebno',
        ],
        question: 'Koji modul u vašem projektu poseduje podatak koji najviše drugih modula želi da koristi?',
      },
    ],
  },
  {
    id: 'vezba-6',
    exercise: 6,
    title: 'Kontrolisan razvoj uz AI',
    subtitle: 'Kontekst, projektne instrukcije, procedure i agentske uloge',
    duration: '90 minuta',
    goal: 'Koristiti AI alate kroz ograničen, ponovljiv i proverljiv razvojni postupak umesto kroz niz nepovezanih upita.',
    slides: [
      {
        title: 'AI alat nije zamena za razvojni proces',
        lead: 'AI može ubrzati analizu i implementaciju, ali zahtev, arhitektura, testovi i odgovornost za rezultat ostaju deo inženjerskog rada.',
        points: [
          'najpre razumeti zadatak',
          'ograničiti kontekst na relevantne informacije',
          'pregledati svaku predloženu promenu',
          'potvrditi rezultat nezavisnim proverama',
        ],
      },
      {
        title: 'Kontekst određuje kvalitet odgovora',
        lead: 'Model ne zna automatski strukturu projekta, poslovna pravila i odluke tima. Potrebno je dati dovoljno relevantnog konteksta.',
        points: [
          'zahtev i kriterijumi prihvatanja',
          'relevantni delovi koda',
          'arhitektonska pravila',
          'ograničenja obima promene',
        ],
      },
      {
        title: 'Previše konteksta takođe predstavlja problem',
        lead: 'Velika količina nepovezanog sadržaja otežava fokus i povećava mogućnost pogrešnog zaključka.',
        points: [
          'ne slati ceo repozitorijum bez potrebe',
          'izdvojiti datoteke relevantne za zadatak',
          'navesti stabilne odluke odvojeno od privremenih detalja',
          'proveriti da li nedostaje ključni poslovni kontekst',
        ],
      },
      {
        title: 'Projektne instrukcije čuvaju stabilna pravila',
        lead: 'Pravila koja se ponavljaju kroz veliki broj zadataka treba čuvati u repozitorijumu, a ne ponavljati ručno u svakom razgovoru.',
        points: [
          'arhitektonske granice',
          'komande za izgradnju i testiranje',
          'pravila o tajnama i rizičnim operacijama',
          'očekivani način dokumentovanja i provere',
        ],
      },
      {
        title: 'Dobar zahtev prema AI alatu ima jasan izlaz',
        lead: 'Neodređen zahtev daje neodređen rezultat. Korisno je unapred definisati šta tačno očekujemo.',
        points: [
          'analiza bez izmene koda',
          'plan promene po datotekama',
          'mali diff u odobrenom obimu',
          'rezime izvršenih provera',
        ],
      },
      {
        title: 'Procedura pretvara ponovljiv zadatak u standardni tok',
        lead: 'Skill ili druga projektna procedura ima smisla kada se isti razvojni postupak redovno ponavlja.',
        points: [
          'jasan ulaz',
          'redosled koraka',
          'očekivani izlaz',
          'ograničenja i način provere',
        ],
      },
      {
        title: 'Agentska uloga ima ograničenu odgovornost',
        lead: 'Specijalizovana uloga treba da dobije samo cilj, kontekst i alate koji su joj potrebni.',
        points: [
          'arhitekta analizira granice i plan',
          'implementator menja kod u odobrenom obimu',
          'agent za testiranje proverava ponašanje',
          'agent za pregled analizira diff bez menjanja koda',
        ],
      },
      {
        title: 'Više agenata nije automatski bolje',
        lead: 'Svaka dodatna predaja zadatka uvodi trošak, mogućnost gubitka konteksta i složeniju dijagnostiku.',
        points: [
          'mali lokalni zadatak često ne zahteva više uloga',
          'razdvajanje ima smisla kada odgovornosti zaista jesu različite',
          'dozvole treba ograničiti po ulozi',
          'birati najmanji tok koji rešava stvarni problem',
        ],
      },
      {
        title: 'AI rezultat mora imati nezavisan dokaz',
        lead: 'Uverljiv tekst modela nije dokaz da je promena ispravna.',
        points: [
          'pregled diff-a',
          'izgradnja projekta',
          'ciljani i kompletni testovi',
          'ručna provera poslovnog smisla kada je potrebna',
        ],
      },
      {
        title: 'P5 i P6 — ponovljiv i proverljiv tok',
        lead: 'Kontrolne tačke traže da tim pokaže da AI podrška ima jasna pravila, ponovljive procedure i ograničene uloge.',
        points: [
          'projektne instrukcije u repozitorijumu',
          'evidencija reprezentativne upotrebe',
          'najmanje jedna stvarno korisna procedura',
          'agentska uloga sa jasno ograničenom odgovornošću',
        ],
        question: 'Koji deo vašeg razvojnog procesa se dovoljno često ponavlja da bi opravdao sopstvenu proceduru?',
      },
    ],
  },
  {
    id: 'vezba-7',
    exercise: 7,
    title: 'MCP i povezivanje sa projektom',
    subtitle: 'Kontrolisan pristup projektnim resursima i operacijama',
    duration: '90 minuta',
    goal: 'Razumeti kako MCP izlaže projektni kontekst i alate kroz jasno definisanu i bezbednu granicu.',
    slides: [
      {
        title: 'Zašto MCP postoji',
        lead: 'Model Context Protocol standardizuje način na koji AI klijent pristupa spoljnim podacima i operacijama.',
        points: [
          'manje ručnog kopiranja konteksta',
          'jasno definisani resursi i alati',
          'kontrolisana granica pristupa',
          'strukturirani rezultati za dalju obradu',
        ],
      },
      {
        title: 'Resurs predstavlja podatak za čitanje',
        lead: 'Resurs je prikladan kada klijent treba da dobije postojeći kontekst bez izvršavanja rizične operacije.',
        points: [
          'projektne instrukcije',
          'arhitektonska dokumentacija',
          'README i pravila rada',
          'drugi kontrolisani podaci samo za čitanje',
        ],
      },
      {
        title: 'Alat predstavlja operaciju',
        lead: 'Alat se koristi kada je potrebno izvršiti konkretnu radnju i vratiti strukturiran rezultat.',
        points: [
          'pokretanje testova',
          'dobijanje git diff-a',
          'pretraga dokumentacije',
          'provera strukture projekta',
        ],
      },
      {
        title: 'MCP server je kontrolisana granica',
        lead: 'Server određuje šta klijent sme da vidi i koje operacije sme da zatraži.',
        points: [
          'ne izlagati ceo računar bez potrebe',
          'ograničiti dozvoljene putanje',
          'ograničiti skup operacija',
          'vratiti dovoljno podataka za proverljiv rezultat',
        ],
      },
      {
        title: 'Dobar alat vraća strukturiran rezultat',
        lead: 'Hiljade linija terminalskog izlaza teže se pouzdano koriste od kratkog i jasno strukturiranog rezultata.',
        points: [
          'status uspeha',
          'broj uspešnih i neuspešnih testova',
          'kratak opis neuspeha',
          'ograničen detalj kada je potreban',
        ],
      },
      {
        title: 'Princip najmanjih privilegija',
        lead: 'AI klijent treba da dobije samo pristup koji mu je potreban za konkretan tok rada.',
        points: [
          'čitanje umesto izmene kada je dovoljno',
          'uzak skup dozvoljenih komandi',
          'ograničene putanje datoteka',
          'posebna zaštita za operacije sa trajnim posledicama',
        ],
      },
      {
        title: 'Tajne ne pripadaju projektnom kontekstu',
        lead: 'Pristup projektu ne znači da model treba da vidi privatne tokene, ključeve i lokalne pristupne podatke.',
        points: [
          'ne izlagati `.env`',
          'ne vraćati API ključeve kroz generičke alate',
          'validirati dozvoljene putanje',
          'odvojiti konfiguraciju od tajnih vrednosti',
        ],
      },
      {
        title: 'Nepouzdan sadržaj ostaje podatak',
        lead: 'Dokument, issue ili rezultat alata može sadržati tekst koji pokušava da promeni ponašanje modela.',
        points: [
          'navesti poreklo sadržaja',
          'ne tretirati sadržaj dokumenta kao sistemsko pravilo',
          'zadržati autoritet projektnih instrukcija',
          'rizične operacije dodatno proveravati',
        ],
      },
      {
        title: 'MCP treba da rešava stvarnu projektnu potrebu',
        lead: 'Cilj nije napraviti server radi demonstracije tehnologije, već ukloniti stvarno ručno kopiranje ili omogućiti proverljiv razvojni signal.',
        points: [
          'dohvatanje strukture projekta',
          'pokretanje ciljane provere',
          'čitanje arhitektonskih pravila',
          'dobijanje diff-a za pregled promene',
        ],
      },
      {
        title: 'P7 — mala i korisna MCP integracija',
        lead: 'Za projekat je dovoljno nekoliko pažljivo izabranih funkcionalnosti koje tim ume da objasni i demonstrira.',
        points: [
          'najmanje jedan resurs ili ekvivalentan kontekst',
          'najmanje dva korisna alata ili slične funkcionalnosti',
          'jedan alat vraća stvarni razvojni signal',
          'dokumentovana ograničenja i zabranjeni podaci',
        ],
        question: 'Koji podatak trenutno najčešće ručno kopirate u AI alat i mogao bi bezbedno da postane MCP resurs ili alat?',
      },
    ],
  },
  {
    id: 'vezba-8',
    exercise: 8,
    title: 'Hooks, guardrails, evaluacije i završna provera kvaliteta',
    subtitle: 'Deterministička zaštita oko razvoja uz podršku AI alata',
    duration: '90 minuta',
    goal: 'Razlikovati preporuku modelu od pravila koje mora pouzdano da sprovede izvršivi mehanizam.',
    slides: [
      {
        title: 'Važno pravilo ne treba da zavisi od pamćenja modela',
        lead: 'Ako određena provera mora uvek da se izvrši, tekstualna instrukcija nije dovoljna garancija.',
        points: [
          'instrukcija usmerava ponašanje',
          'hook izvršava proveru na određenom događaju',
          'guardrail može blokirati nedozvoljenu operaciju',
          'test ili build daju nezavisan signal',
        ],
      },
      {
        title: 'Hook se vezuje za događaj u toku rada',
        lead: 'Hook je izvršivi mehanizam koji se pokreće pre ili posle određene aktivnosti.',
        points: [
          'pre pokretanja komande',
          'nakon izmene datoteke',
          'pre završetka agentskog toka',
          'nakon generisanja ili promene artefakta',
        ],
      },
      {
        title: 'Dobar kandidat za hook je deterministička provera',
        lead: 'Ono što se može pouzdano proveriti kodom ne treba ostaviti samo kao preporuku.',
        points: [
          'pokrenuti testove',
          'pokrenuti formatiranje ili lint',
          'proveriti zabranjenu putanju',
          'blokirati poznatu destruktivnu komandu',
        ],
      },
      {
        title: 'Guardrail ograničava dozvoljeno ponašanje',
        lead: 'Guardrail proverava ulaz, izlaz ili poziv alata i može zaustaviti tok rada kada je prekršeno pravilo.',
        points: [
          'dozvoljene putanje',
          'zabranjene komande',
          'zaštita tajnih podataka',
          'ljudsko odobrenje za operacije sa većim posledicama',
        ],
      },
      {
        title: 'Zaštitno pravilo mora i samo biti provereno',
        lead: 'Preširok guardrail može blokirati legitimnu aktivnost, a preuzak može propustiti opasan slučaj.',
        points: [
          'testirati dozvoljene scenarije',
          'testirati zabranjene scenarije',
          'održavati pravila zajedno sa projektom',
          'beležiti razlog blokiranja kada je korisno',
        ],
      },
      {
        title: 'Evaluacioni scenario proverava agentsko ponašanje',
        lead: 'Evaluacija proverava da li tok rada u reprezentativnom slučaju daje prihvatljiv rezultat.',
        points: [
          'tipičan uspešan scenario',
          'negativan ili bezbednosni scenario',
          'granični scenario',
          'regresioni scenario nakon promene procedure',
        ],
      },
      {
        title: 'Očekivanje evaluacije mora biti jasno',
        lead: 'Nije dovoljno reći da je odgovor „dobar“. Potrebno je unapred odrediti šta rezultat mora ili ne sme da sadrži.',
        points: [
          'mora prijaviti ključni problem',
          'ne sme predložiti rizičnu radnju',
          'mora poštovati arhitektonsko ograničenje',
          'mora zatražiti dodatni kontekst kada je ulaz nedovoljan',
        ],
      },
      {
        title: 'Peer QA uvodi spoljašnji pogled',
        lead: 'Drugi tim ili student može otkriti nejasnoće koje autori više ne primećuju zato što poznaju projekat iznutra.',
        points: [
          'pokrenuti projekat prema README-u',
          'proći jedan reprezentativan korisnički tok',
          'pregledati jedan pull request',
          'zabeležiti konkretan nalaz ili obrazloženu potvrdu',
        ],
      },
      {
        title: 'Završni kvalitet je skup nezavisnih signala',
        lead: 'Pouzdan razvoj kombinuje ljudsko razumevanje, automatizovane provere i jasno ograničene AI alate.',
        points: [
          'zahtev i kriterijumi prihvatanja',
          'arhitektonske granice',
          'testovi i build',
          'hooks, guardrails i evaluacije',
        ],
      },
      {
        title: 'P8 — sistem mora biti objašnjiv i proverljiv',
        lead: 'Završni cilj nije projekat koji „radi zbog AI-a“, već sistem koji tim razume, ume da proveri i može da odbrani.',
        points: [
          'najmanje dve determinističke zaštite',
          'najmanje tri evaluaciona scenarija',
          'zabeležena vršnjačka provera',
          'svaki član tima može da objasni ključni tok bez automatski generisanog odgovora',
        ],
        question: 'Koji deo vašeg razvojnog toka mora biti garantovan kodom, a ne samo napisan kao instrukcija?',
      },
    ],
  },
]
