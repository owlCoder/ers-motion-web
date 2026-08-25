import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise4 = (): DocumentPage[] => [
  page('Vežba 4 — SOLID i Clean Architecture', [
    text('h1', 'Vežba 4 — SOLID i Clean Architecture'),
    text('paragraph', 'SOLID principi nisu skup pravila koja se primenjuju radi formalnog bodovanja, već smernice koje pomažu da se promena lokalizuje, da se zavisnosti zamene i da se kod lakše proverava. Clean Architecture širi isti način razmišljanja na granice podsistema: poslovno jezgro treba da ostane nezavisno od UI-ja, baze podataka i drugih tehničkih detalja.'),
    table(['Princip', 'Pitanje koje postavljamo pri review-u'], [
      ['S — Single Responsibility', 'Da li ovaj modul ima jedan koherentan razlog za promenu?'],
      ['O — Open/Closed', 'Možemo li dodati novu varijantu bez menjanja stabilnog centralnog grananja?'],
      ['L — Liskov Substitution', 'Može li zamena implementacije da prođe bez iznenađenja za klijenta?'],
      ['I — Interface Segregation', 'Da li klijent zavisi samo od operacija koje stvarno koristi?'],
      ['D — Dependency Inversion', 'Da li poslovna logika zavisi od apstrakcije ili direktno od detalja?'],
    ]),
    image('/course-assets/clean-architecture.svg', 'Clean Architecture: poslovno jezgro ostaje nezavisno od spoljašnjih tehnoloških detalja.', 'Clean Architecture'),
  ]),
  page('4.1. Single Responsibility Principle', [
    text('h2', '4.1. Single Responsibility Principle'),
    text('paragraph', 'Canva primer polazi od servisa koji istovremeno generiše sadržaj poruke, čita korisnike i šalje e-mail. Problem nije broj linija već činjenica da se klasa menja iz više nepovezanih razloga. SRP traži da se te odgovornosti razdvoje na koherentne komponente čiji se razlog za izmenu može jasno opisati.'),
    code('csharp', `public sealed class NotificationService\n{\n    private readonly ISubscriberRepository _subscribers;\n    private readonly IMessageComposer _composer;\n    private readonly IMessageSender _sender;\n\n    public NotificationService(\n        ISubscriberRepository subscribers,\n        IMessageComposer composer,\n        IMessageSender sender)\n    {\n        _subscribers = subscribers;\n        _composer = composer;\n        _sender = sender;\n    }\n\n    public void NotifyAll(string eventName)\n    {\n        var message = _composer.Compose(eventName);\n        foreach (var subscriber in _subscribers.GetActive())\n            _sender.Send(subscriber.Contact, message);\n    }\n}`, 'Servis orkestrira saradnike umesto da preuzima njihove odgovornosti'),
    callout('note', 'SRP ne znači „jedna metoda po klasi“', 'Klasa može imati više metoda ako sve pripadaju istoj odgovornosti. Loša dekompozicija nastaje kada se kod cepa na veliki broj sitnih tipova bez jasne poslovne ili tehničke granice.'),
    callout('task', 'Rad na vežbi', 'U postojećem ili nastavnom projektu pronaći klasu koja radi najmanje dve nepovezane stvari. Napisati jednu rečenicu koja opisuje njenu trenutnu odgovornost, zatim predložiti razdvajanje i obrazložiti koje promene će ubuduće biti lokalizovane.'),
  ]),
  page('4.2. Open/Closed Principle', [
    text('h2', '4.2. Open/Closed Principle'),
    text('paragraph', 'Canva materijal koristi slanje obaveštenja: ako kontroler proverava tip poruke i grana na e-mail, SMS i svaku novu vrstu, svaka ekstenzija zahteva promenu stabilnog koda. OCP predlaže da varijabilno ponašanje bude iza ugovora, pa nova implementacija može da se doda bez izmene postojećeg klijenta.'),
    code('csharp', `public interface IMessageSender\n{\n    string Channel { get; }\n    Task SendAsync(string destination, string message);\n}\n\npublic sealed class EmailSender : IMessageSender\n{\n    public string Channel => "email";\n    public Task SendAsync(string destination, string message)\n        => Task.CompletedTask; // adapter ka realnom servisu\n}\n\npublic sealed class SmsSender : IMessageSender\n{\n    public string Channel => "sms";\n    public Task SendAsync(string destination, string message)\n        => Task.CompletedTask;\n}`),
    list([
      'Nova vrsta kanala treba da se doda novom implementacijom, bez menjanja poslovne logike slanja.',
      'Ako se stalno pojavljuje `switch` po tipu koji određuje strategiju ponašanja, proveriti da li je polimorfizam prikladniji.',
      'Ne uvoditi apstrakciju unapred za promene koje nemaju realnu verovatnoću; cilj je kontrola poznate varijabilnosti, ne maksimalan broj interfejsa.'),
  ]),
  page('4.3. Liskov, Interface Segregation i Dependency Inversion', [
    text('h2', '4.3. LSP, ISP i DIP'),
    text('paragraph', 'Liskov Substitution Principle traži da implementacija poštuje očekivanja ugovora. Klasičan primer pravougaonika i kvadrata pokazuje da sintaksno validno nasleđivanje može promeniti očekivano ponašanje setera. ISP zatim ograničava širinu ugovora, dok DIP određuje smer zavisnosti između politike višeg nivoa i tehničkog detalja.'),
    table(['Princip', 'Primer problema', 'Smer korekcije'], [
      ['LSP', 'Podtip menja postuslov ili ne podržava operaciju roditelja.', 'Redizajnirati ugovor ili koristiti zajedničku apstrakciju bez lažnog nasleđivanja.'],
      ['ISP', 'Običan korisnik mora da implementira 2FA operacije koje nikada ne koristi.', 'Podeliti veliki interfejs na manje uloge: npr. ILogin i ITwoFactorAuth.'],
      ['DIP', 'Use-case direktno kreira SQL repozitorijum ili HTTP klijent.', 'Use-case zavisi od ugovora; konkretna implementacija se ubrizgava na composition root-u.'],
    ]),
    code('csharp', `public sealed class RegisterReservationHandler\n{\n    private readonly IReservationRepository _repository;\n    private readonly IClock _clock;\n\n    public RegisterReservationHandler(IReservationRepository repository, IClock clock)\n    {\n        _repository = repository;\n        _clock = clock;\n    }\n\n    public Result Handle(RegisterReservation command)\n    {\n        if (command.From <= _clock.UtcNow)\n            return Result.Fail("ReservationMustBeInFuture");\n\n        // poslovna odluka ne zna da li je repozitorijum SQL, JSON ili in-memory\n        return Result.Ok();\n    }\n}`),
  ]),
  page('4.4. Clean Architecture i smer zavisnosti', [
    text('h2', '4.4. Clean Architecture i smer zavisnosti'),
    text('paragraph', 'Clean Architecture u predmetu posmatramo kao disciplinu granica. Domain sadrži modele, invarijante i stabilne ugovore. Application orkestrira use-case-ove. Infrastructure implementira pristup bazi, fajlovima ili spoljnim servisima, dok Presentation prevodi korisnički ili mrežni ulaz u pozive use-case sloja. Nazivi projekata mogu da variraju, ali je smer zavisnosti važniji od naziva foldera.'),
    diagram('Smer zavisnosti', [
      ['Presentation', 'UI, API ili konzola; nema domenska pravila', 'cyan'],
      ['Application', 'use-case i orkestracija', 'blue'],
      ['Domain', 'entiteti, pravila, stabilni ugovori', 'violet'],
      ['Infrastructure', 'baza, fajlovi, API adapteri', 'amber'],
    ], 'Spoljni slojevi mogu da zavise od unutrašnjih ugovora; jezgro ne zavisi od framework-a i skladišta.'),
    list([
      'Controller treba da bude tanak: mapira zahtev, poziva use-case i mapira rezultat.',
      'Domain ne referencira Entity Framework, HTTP, konzolu niti UI framework.',
      'Composition root je jedino mesto na kome se bira konkretan graf zavisnosti.',
      'Interfejs pripada sloju koji definiše potrebu/ugovor, a ne automatski sloju koji ga implementira.'),
    callout('warning', 'Broj projekata nije metrika arhitekture', 'Moguće je imati mnogo projekata i loše granice, kao i jednostavniju fizičku strukturu sa jasnim smerom zavisnosti. Ocenjuje se objašnjiv dizajn i lokalizacija promena.'),
  ]),
  page('4.5. Logger–Blogger iz postojećeg materijala', [
    text('h2', '4.5. Logger–Blogger: praktična struktura'),
    text('paragraph', 'Postojeći Canva zadatak Logger–Blogger koristi isti sistem za dve vrste ponašanja i kroz njega demonstrira Dependency Inversion. U modernizovanoj verziji zadatak se koristi kao studija slučaja, a ne kao template koji studenti prepisuju u sopstveni projekat.'),
    table(['Projekat', 'Sadržaj i odgovornost'], [
      ['Domain', 'Modeli `Korisnik`, `ZapisNaSajtu`, `Objava`, `Evidencija`; enum-i; Result tip; ugovori za servise, repozitorijume, bazu i bezbednost. Ne zavisi ni od jednog drugog projekta.'],
      ['Infrastructure', 'Implementacije servisa i bezbednosti: autentifikacija, blog/evidencija, file logger, SHA-256 hasher. Zavisi od Domain-a.'],
      ['Database', 'InMemory i JSON provider, factory i repozitorijumi. Implementira ugovore koje definiše jezgro.'],
      ['Presentation', 'Konzolni meni, `IConsoleIO`, seeder, `AppContainer` i `Program.cs`; sastavlja graf zavisnosti.'],
    ]),
    code('csharp', `public interface IZapisiServis\n{\n    Result<ZapisNaSajtu> Objavi(ZapisNaSajtu zapis);\n    Result<IReadOnlyList<ZapisNaSajtu>> PregledZapisa();\n}\n\npublic interface IBazaPodataka\n{\n    TabeleBazaPodataka Tabele { get; }\n    bool SacuvajPromene();\n}`,'Primer ugovora iz Logger–Blogger studije'),
    callout('info', 'Šta student treba da primeti', 'Važan deo primera nije konkretan naziv klase, već činjenica da se način čuvanja podataka i način logovanja menjaju bez prepisivanja centralnog poslovnog toka. Ista ideja se prenosi u studentski projekat, ali tim bira sopstvene granice i nazive.'),
  ]),
  page('4.6. Composition root i projektni checkpoint P2', [
    text('h2', '4.6. Composition root i checkpoint P2'),
    text('paragraph', 'Composition root je mesto na kome se konkretne implementacije spajaju u izvršivi graf. Poslovni kod ne treba sam da bira `JsonRepository` ili `SqlRepository`; izbor pripada spoljašnjoj konfiguraciji aplikacije.'),
    code('csharp', `var repository = new JsonReservationRepository("data/reservations.json");\nvar clock = new SystemClock();\nvar service = new ReservationService(repository, clock);\nvar app = new ConsoleApplication(service);\n\napp.Run();`,'Jedno mesto bira konkretne implementacije'),
    list([
      'Kreirati solution i početne projekte/slojeve bez starter template-a.',
      'Dokumentovati odgovornost svakog sloja i dozvoljeni smer zavisnosti.',
      'Implementirati najmanje jedan mali vertikalni prolaz kroz sistem.',
      'U `docs/architecture.md` zapisati najmanje dve odluke i razlog njihovog izbora.',
      'Proveriti da Domain/Application mogu da se testiraju bez pokretanja realne baze ili UI-ja.'),
    callout('task', 'Mini domaći — bonus 2 boda', 'Dodati alternativnu implementaciju jedne spoljne zavisnosti, npr. InMemory umesto JSON repozitorijuma. 1 bod: use-case kod ostaje neizmenjen. 1 bod: student objašnjava kako DIP/OCP omogućavaju zamenu.'),
  ]),
]
