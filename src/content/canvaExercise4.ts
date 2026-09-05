import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise4 = (): DocumentPage[] => [
  page('Vežba 4 — SOLID i Clean Architecture', [
    text('h1', 'Vežba 4 — SOLID i Clean Architecture'),
    text('paragraph', 'SOLID principi nisu skup formalnih pravila koja se primenjuju radi bodovanja, već smernice za oblikovanje sistema u kome su promene lokalizovane, zavisnosti zamenjive, a ponašanje lakše proverljivo. Pre njihove primene potrebno je jasno razumeti osnovne objektno orijentisane pojmove: ugovor, enkapsulaciju, polimorfizam i odgovornost. Clean Architecture isti način razmišljanja primenjuje na granice podsistema: poslovno jezgro treba da ostane nezavisno od korisničkog interfejsa, skladišta podataka i drugih promenljivih tehničkih detalja.'),
    table(['Princip', 'Pitanje pri pregledu koda'], [
      ['S — Single Responsibility', 'Da li ovaj modul ima jedan koherentan razlog za promenu?'],
      ['O — Open/Closed', 'Može li se nova varijanta ponašanja dodati bez izmene stabilnog centralnog toka?'],
      ['L — Liskov Substitution', 'Može li jedna implementacija biti zamenjena drugom bez narušavanja očekivanja klijenta?'],
      ['I — Interface Segregation', 'Da li klijent zavisi samo od operacija koje zaista koristi?'],
      ['D — Dependency Inversion', 'Da li poslovna logika zavisi od apstrakcije ili neposredno od tehničkog detalja?'],
    ]),
    image('/course-assets/clean-architecture.svg', 'Clean Architecture: poslovno jezgro ostaje nezavisno od spoljašnjih tehnoloških detalja.', 'Clean Architecture'),
  ]),

  page('4.1. OOP i Clean Code kao osnova', [
    text('h2', '4.1. OOP i Clean Code kao osnova'),
    text('paragraph', 'Interfejs opisuje ugovor koji klijentski kod može da koristi bez poznavanja konkretne implementacije. Enkapsulacija čuva validno stanje objekta i usmerava promene kroz dozvoljene operacije. Polimorfizam omogućava da različite implementacije istog ugovora budu zamenjive bez grananja po konkretnom tipu. Apstraktna klasa ima smisla kada više tipova zaista deli zajedničko stanje ili ponašanje; nije potrebna samo zato što postoji hijerarhija.'),
    table(['Pojam', 'Praktično značenje u dizajnu'], [
      ['Interfejs', 'Definiše očekivano ponašanje i granicu između klijenta i implementacije.'],
      ['Enkapsulacija', 'Čuva invarijante i sprečava nekontrolisanu izmenu stanja.'],
      ['Polimorfizam', 'Omogućava zamenu implementacije bez promene klijentskog koda.'],
      ['Apstraktna klasa', 'Čuva stvarno zajedničku osnovu kada više tipova deli stanje ili ponašanje.'],
      ['Clean Code', 'Čini nameru, odgovornost i tok promene lakšim za razumevanje i proveru.'],
    ]),
    code('csharp', `public interface IPretrazivac\n{\n    int Prebroj(string pojam, IReadOnlyList<string> vrednosti);\n}\n\npublic sealed class LinearniPretrazivac : IPretrazivac\n{\n    public int Prebroj(string pojam, IReadOnlyList<string> vrednosti)\n        => vrednosti.Count(v => v == pojam);\n}\n\npublic static int PronadjiBrojPogodaka(\n    IPretrazivac pretrazivac,\n    string pojam,\n    IReadOnlyList<string> vrednosti)\n    => pretrazivac.Prebroj(pojam, vrednosti);`, 'Klijent zavisi od ugovora, a ne od konkretne implementacije'),
    list([
      'Ugovor mora precizno da odredi značenje ulaza, izlaza i graničnih slučajeva.',
      'Zamenjive implementacije moraju da poštuju ista očekivanja klijenta.',
      'Nazivi klasa i metoda treba da opisuju nameru, a ne tehnički detalj bez poslovnog značenja.',
      'Metoda ili klasa koja istovremeno rešava više nepovezanih problema verovatno ima nejasnu odgovornost.',
      'Dupliranje se uklanja kada postoji zajednički koncept, a ne samo zato što dva dela koda trenutno izgledaju slično.',
    ]),
    image('/course-assets/oop-refactor.svg', 'Razdvajanje pristupa podacima, poslovnog pravila i evidentiranja aktivnosti iz preopterećenog servisa.', 'Od nejasne odgovornosti ka jasnim granicama'),
    callout('info', 'Veza sa SOLID principima', 'Ovi pojmovi nisu posebna tema odvojena od SOLID-a. SRP precizira odgovornost, OCP i LSP se oslanjaju na zamenjivo ponašanje, ISP na dobro oblikovane ugovore, a DIP na zavisnost od apstrakcija umesto od promenljivih tehničkih detalja.'),
  ]),

  page('4.2. Single Responsibility Principle', [
    text('h2', '4.2. Single Responsibility Principle'),
    text('paragraph', 'Posmatrajmo servis koji istovremeno generiše sadržaj poruke, čita korisnike i šalje e-mail. Problem nije broj linija koda, već činjenica da se ista klasa menja iz više međusobno nezavisnih razloga. SRP usmerava dizajn ka koherentnim komponentama čija se odgovornost i razlog za izmenu mogu jasno opisati.'),
    code('csharp', `public sealed class NotificationService\n{\n    private readonly ISubscriberRepository _subscribers;\n    private readonly IMessageComposer _composer;\n    private readonly IMessageSender _sender;\n\n    public NotificationService(\n        ISubscriberRepository subscribers,\n        IMessageComposer composer,\n        IMessageSender sender)\n    {\n        _subscribers = subscribers;\n        _composer = composer;\n        _sender = sender;\n    }\n\n    public void NotifyAll(string eventName)\n    {\n        var message = _composer.Compose(eventName);\n        foreach (var subscriber in _subscribers.GetActive())\n            _sender.Send(subscriber.Contact, message);\n    }\n}`, 'Servis orkestrira saradnike umesto da preuzima njihove odgovornosti'),
    callout('note', 'SRP ne znači „jedna metoda po klasi“', 'Klasa može imati više metoda kada sve pripadaju istoj odgovornosti. Neprimerena dekompozicija nastaje kada se jedna koherentna odgovornost nepotrebno raspodeli na veliki broj sitnih tipova bez jasne poslovne ili tehničke granice.'),
    callout('task', 'Rad na vežbi', 'U nastavnom ili projektnom kodu pronaći klasu koja obavlja najmanje dve nepovezane odgovornosti. Napisati jednu rečenicu koja opisuje njenu trenutnu ulogu, zatim predložiti razdvajanje i obrazložiti koje će buduće promene takvim dizajnom biti lokalizovane.'),
  ]),

  page('4.3. Open/Closed Principle', [
    text('h2', '4.3. Open/Closed Principle'),
    text('paragraph', 'Primer sa slanjem obaveštenja pokazuje tipičan OCP problem: ako centralni servis proverava tip poruke i grananjem bira e-mail, SMS i svaku novu vrstu, svako proširenje zahteva izmenu stabilnog koda. Promenljivo ponašanje je prikladnije smestiti iza ugovora, tako da se nova implementacija dodaje bez izmene postojećeg klijenta.'),
    code('csharp', `public interface IMessageSender\n{\n    string Channel { get; }\n    Task SendAsync(string destination, string message);\n}\n\npublic sealed class EmailSender : IMessageSender\n{\n    public string Channel => "email";\n    public Task SendAsync(string destination, string message)\n        => Task.CompletedTask; // adapter ka realnom servisu\n}\n\npublic sealed class SmsSender : IMessageSender\n{\n    public string Channel => "sms";\n    public Task SendAsync(string destination, string message)\n        => Task.CompletedTask;\n}`, 'Zamenjive implementacije istog ugovora'),
    list([
      'Nova vrsta kanala treba da se doda novom implementacijom, bez izmene poslovne logike slanja.',
      'Ako se u stabilnom delu sistema često pojavljuje `switch` po tipu koji određuje strategiju ponašanja, treba razmotriti da li je polimorfizam prikladniji.',
      'Apstrakciju ne treba uvoditi unapred za hipotetičke promene. Cilj je kontrolisati poznatu ili verovatnu varijabilnost, a ne maksimalno povećati broj interfejsa.',
    ]),
  ]),

  page('4.4. Liskov, Interface Segregation i Dependency Inversion', [
    text('h2', '4.4. LSP, ISP i DIP'),
    text('paragraph', 'Liskov Substitution Principle zahteva da implementacija poštuje očekivanja ugovora. Sintaksno ispravno nasleđivanje nije dovoljno ako podtip menja značenje operacije ili narušava postuslove. Interface Segregation Principle ograničava širinu ugovora, dok Dependency Inversion Principle usmerava zavisnost od politike višeg nivoa ka apstrakcijama, a ne ka promenljivim tehničkim detaljima.'),
    table(['Princip', 'Primer problema', 'Smer korekcije'], [
      ['LSP', 'Podtip menja postuslov ili ne podržava operaciju roditelja.', 'Redizajnirati ugovor ili koristiti zajedničku apstrakciju bez neprirodnog nasleđivanja.'],
      ['ISP', 'Običan korisnik mora da implementira 2FA operacije koje nikada ne koristi.', 'Podeliti veliki interfejs na manje uloge, na primer `ILogin` i `ITwoFactorAuth`.'],
      ['DIP', 'Use-case neposredno kreira SQL repozitorijum ili HTTP klijent.', 'Use-case zavisi od ugovora; konkretna implementacija se bira u composition root-u.'],
    ]),
    code('csharp', `public sealed class RegisterReservationHandler\n{\n    private readonly IReservationRepository _repository;\n    private readonly IClock _clock;\n\n    public RegisterReservationHandler(\n        IReservationRepository repository,\n        IClock clock)\n    {\n        _repository = repository;\n        _clock = clock;\n    }\n\n    public Result Handle(RegisterReservation command)\n    {\n        if (command.From <= _clock.UtcNow)\n            return Result.Fail("ReservationMustBeInFuture");\n\n        if (_repository.HasOverlap(command.EquipmentId, command.From, command.To))\n            return Result.Fail("OverlappingReservation");\n\n        _repository.Add(new Reservation(\n            Guid.NewGuid(), command.EquipmentId, command.From, command.To));\n\n        return Result.Ok();\n    }\n}`, 'Poslovna politika koristi ugovor repozitorijuma, a ne njegovu konkretnu implementaciju'),
  ]),

  page('4.5. Clean Architecture i smer zavisnosti', [
    text('h2', '4.5. Clean Architecture i smer zavisnosti'),
    text('paragraph', 'Clean Architecture posmatramo kao disciplinu granica. Domain sadrži modele, invarijante i stabilna poslovna pravila. Application orkestrira use-case-ove i definiše ugovore potrebne tim slučajevima upotrebe. Infrastructure implementira pristup bazi, datotekama ili spoljnim servisima, dok Presentation prevodi korisnički ili mrežni ulaz u pozive aplikacionog sloja. Nazivi projekata mogu da se razlikuju, ali je smer zavisnosti važniji od fizičkog rasporeda foldera.'),
    diagram('Smer zavisnosti', [
      ['Presentation', 'UI, API ili konzola; bez poslovnih pravila', 'cyan'],
      ['Application', 'slučajevi upotrebe i orkestracija', 'blue'],
      ['Domain', 'entiteti, invarijante i stabilna pravila', 'violet'],
      ['Infrastructure', 'baza, datoteke i spoljni adapteri', 'amber'],
    ], 'Spoljni slojevi mogu da zavise od ugovora unutrašnjih slojeva; poslovno jezgro ne zavisi od framework-a i skladišta.'),
    list([
      'Controller treba da bude tanak: mapira zahtev, poziva use-case i mapira rezultat.',
      'Domain ne referencira Entity Framework, HTTP, konzolu niti UI framework.',
      'Composition root je mesto na kome se bira konkretan graf zavisnosti.',
      'Interfejs pripada sloju koji definiše potrebu ili ugovor, a ne automatski sloju koji ga implementira.',
    ]),
    callout('warning', 'Broj projekata nije metrika kvaliteta arhitekture', 'Moguće je imati veliki broj projekata i nejasne granice, kao i jednostavniju fizičku strukturu sa ispravnim smerom zavisnosti. Ocenjuju se objašnjiv dizajn, odgovornosti slojeva i lokalizacija promena.'),
  ]),

  page('4.6. Studija slučaja: Logger–Blogger', [
    text('h2', '4.6. Studija slučaja: Logger–Blogger'),
    text('paragraph', 'Logger–Blogger služi kao studija slučaja za razdvajanje poslovnog jezgra, infrastrukturnih detalja i composition root-a. Njegova svrha nije da bude šablon koji se prepisuje u projekat, već da omogući poređenje odgovornosti slojeva i načina na koji Dependency Inversion štiti unutrašnji kod od promena skladišta, logovanja ili korisničkog interfejsa.'),
    table(['Projekat', 'Sadržaj i odgovornost'], [
      ['Domain', 'Modeli `Korisnik`, `ZapisNaSajtu`, `Objava`, `Evidencija`; nabrajanja; Result tip; ugovori za servise, repozitorijume, bazu i bezbednost. Ne zavisi ni od jednog drugog projekta.'],
      ['Infrastructure', 'Implementacije servisa i bezbednosti: autentifikacija, blog/evidencija, file logger i SHA-256 hasher. Zavisi od Domain-a.'],
      ['Database', 'InMemory i JSON provider, factory i repozitorijumi. Implementira ugovore koje definiše jezgro.'],
      ['Presentation', 'Konzolni meni, `IConsoleIO`, seeder, `AppContainer` i `Program.cs`; sastavlja graf zavisnosti.'],
    ]),
    code('csharp', `public interface IZapisiServis\n{\n    Result<ZapisNaSajtu> Objavi(ZapisNaSajtu zapis);\n    Result<IReadOnlyList<ZapisNaSajtu>> PregledZapisa();\n}\n\npublic interface IBazaPodataka\n{\n    TabeleBazaPodataka Tabele { get; }\n    bool SacuvajPromene();\n}`, 'Ugovori poslovnog jezgra'),
    callout('info', 'Ključna ideja', 'Način čuvanja podataka i način logovanja mogu da se promene bez izmene centralnog poslovnog toka. Ista ideja se prenosi u studentski projekat, ali tim bira sopstvene granice i nazive u skladu sa domenom.'),
  ]),

  page('4.7. Composition root i projektna kontrolna tačka P2', [
    text('h2', '4.7. Composition root i projektna kontrolna tačka P2'),
    text('paragraph', 'Composition root je mesto na kome se konkretne implementacije povezuju u izvršivi graf objekata. Poslovni kod ne treba sam da bira `JsonRepository` ili `SqlRepository`; taj izbor pripada spoljašnjoj konfiguraciji aplikacije.'),
    code('csharp', `var repository = new JsonReservationRepository("data/reservations.json");\nvar clock = new SystemClock();\nvar service = new ReservationService(repository, clock);\nvar app = new ConsoleApplication(service);\n\napp.Run();`, 'Jedno mesto bira konkretne implementacije'),
    list([
      'Kreirati solution i početne projekte ili slojeve bez unapred pripremljenog projektnog šablona.',
      'Dokumentovati odgovornost svakog sloja i dozvoljeni smer zavisnosti.',
      'Implementirati najmanje jedan mali vertikalni prolaz kroz sistem.',
      'U `docs/architecture.md` zapisati najmanje dve odluke i obrazloženje njihovog izbora.',
      'Proveriti da Domain/Application mogu da se testiraju bez pokretanja realne baze podataka ili korisničkog interfejsa.',
    ]),
    callout('task', 'Mini domaći — bonus 2 boda', 'Dodati alternativnu implementaciju jedne spoljne zavisnosti, na primer InMemory umesto JSON repozitorijuma. Prvi bod se dobija ako use-case kod ostane neizmenjen; drugi bod za jasno obrazloženje kako DIP/OCP omogućavaju zamenu.'),
  ]),
]
