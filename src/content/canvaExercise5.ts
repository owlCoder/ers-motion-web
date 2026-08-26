import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exercise5 = (): DocumentPage[] => [
  page('Vežba 5 — Poslovna logika i use-case sloj', [
    text('h1', 'Vežba 5 — Poslovna logika i use-case sloj'),
    text('paragraph', 'Nakon postavljanja arhitektonskih granica, sledeći korak je da se poslovno ponašanje smesti na odgovarajuće mesto. Use-case predstavlja jednu korisnički smislenu operaciju sistema. On orkestrira domenske objekte i ugovore, ali ne treba da bude vezan za konkretan korisnički interfejs, bazu podataka ili transportni protokol.'),
    diagram('Tok jednog use-case-a', [
      ['Ulaz', 'komanda ili zahtev', 'cyan'],
      ['Validacija', 'osnovna i poslovna pravila', 'blue'],
      ['Domen', 'promena stanja i invarijante', 'violet'],
      ['Čuvanje', 'ugovor repozitorijuma', 'amber'],
      ['Rezultat', 'eksplicitan ishod za klijenta', 'emerald'],
    ], 'Use-case povezuje poslovni zahtev sa domenskim ponašanjem i jasno definisanim ishodom.'),
    callout('info', 'Studija slučaja: ECommerce', 'Primer ECommerce razdvaja Domain, podatke i repozitorijume, Application i implementaciju poslovnih servisa. Upiti i komande pripadaju aplikacionom sloju, dok konkretna baza podataka ili spoljni web servis ostaju infrastrukturni detalji.'),
  ]),
  page('5.1. Entiteti, invarijante i ponašanje', [
    text('h2', '5.1. Entitet nije samo DTO'),
    text('paragraph', 'Ako domenski objekat sadrži samo javne setere, a sva pravila se nalaze u servisima, objekat lako može preći u nevažeće stanje. Enkapsulacija omogućava da se invarijanta čuva na mestu koje poseduje podatke. Use-case i dalje koordinira operaciju, ali ne mora da ponavlja isto pravilo pri svakom pozivu.'),
    code('csharp', `public sealed class Reservation\n{\n    public Guid Id { get; }\n    public Guid EquipmentId { get; }\n    public DateTime From { get; private set; }\n    public DateTime To { get; private set; }\n    public bool Cancelled { get; private set; }\n\n    public Reservation(\n        Guid id,\n        Guid equipmentId,\n        DateTime from,\n        DateTime to)\n    {\n        if (from >= to)\n            throw new ArgumentException("Invalid period");\n\n        Id = id;\n        EquipmentId = equipmentId;\n        From = from;\n        To = to;\n    }\n\n    public Result Cancel(DateTime now)\n    {\n        if (Cancelled)\n            return Result.Fail("AlreadyCancelled");\n        if (From <= now)\n            return Result.Fail("ReservationAlreadyStarted");\n\n        Cancelled = true;\n        return Result.Ok();\n    }\n}`, 'Entitet čuva pravila sopstvenog validnog stanja'),
    list([
      'Konstruktor ili factory treba da spreče nastanak očigledno nevalidnog stanja.',
      'Metode entiteta treba da imaju poslovno značenje, a ne da budu samo generički seteri.',
      'Pravilo koje zavisi od više agregata ili spoljnog izvora može pripadati domenskom ili application servisu umesto jednom entitetu.',
    ]),
  ]),
  page('5.2. Eksplicitni poslovni ishodi', [
    text('h2', '5.2. `Result` i očekivani neuspeh'),
    text('paragraph', 'Očekivani poslovni neuspeh nije isto što i neočekivana greška sistema. Kada korisnik pokuša da rezerviše zauzet termin, sistem radi ispravno ako zahtev odbije i vrati stabilan i razumljiv ishod. Takvo ponašanje treba da bude eksplicitno i testabilno, umesto da se prikrije vrednostima `null`, `false` ili generičkim izuzetkom.'),
    code('csharp', `public sealed record Result(bool Success, string? Error)\n{\n    public static Result Ok() => new(true, null);\n    public static Result Fail(string error) => new(false, error);\n}\n\npublic sealed class ReservationService\n{\n    private readonly IReservationRepository _repository;\n\n    public ReservationService(IReservationRepository repository)\n        => _repository = repository;\n\n    public Result Reserve(ReservationRequest request)\n    {\n        if (_repository.HasOverlap(\n            request.EquipmentId, request.From, request.To))\n        {\n            return Result.Fail("OverlappingReservation");\n        }\n\n        _repository.Add(new Reservation(\n            Guid.NewGuid(),\n            request.EquipmentId,\n            request.From,\n            request.To));\n\n        return Result.Ok();\n    }\n}`, 'Eksplicitan rezultat poslovne operacije u okviru use-case servisa'),
    table(['Situacija', 'Preporučeni model'], [
      ['Nevažeći poslovni zahtev', 'Eksplicitan Result i stabilan kod poslovnog neuspeha.'],
      ['Entitet nije pronađen', 'Result sa stabilnim kodom ili domenom definisan NotFound ishod.'],
      ['Baza privremeno nedostupna', 'Infrastrukturna greška ili izuzetak koji se obrađuje na odgovarajućoj granici.'],
      ['Programerska greška ili narušena pretpostavka', 'Fail-fast ili izuzetak; ne predstavljati je kao regularan poslovni rezultat.'],
    ]),
  ]),
  page('5.3. Use-case servis i dependency injection', [
    text('h2', '5.3. Use-case servis i dependency injection'),
    text('paragraph', 'Dependency Injection nije samo mogućnost framework-a. To je način da objekat dobije saradnike spolja, tako da centralna logika ne mora da zna kako se ti saradnici kreiraju. Time se promenljive zavisnosti mogu zameniti u testu ili drugom izvršnom okruženju.'),
    code('csharp', `public sealed class ReservationService\n{\n    private readonly IReservationRepository _repository;\n    private readonly IClock _clock;\n\n    public ReservationService(\n        IReservationRepository repository,\n        IClock clock)\n    {\n        _repository = repository;\n        _clock = clock;\n    }\n\n    public Result Reserve(ReservationRequest request)\n    {\n        if (request.From <= _clock.UtcNow)\n            return Result.Fail("ReservationMustBeInFuture");\n\n        if (_repository.HasOverlap(\n            request.EquipmentId, request.From, request.To))\n        {\n            return Result.Fail("OverlappingReservation");\n        }\n\n        _repository.Add(new Reservation(\n            Guid.NewGuid(),\n            request.EquipmentId,\n            request.From,\n            request.To));\n\n        return Result.Ok();\n    }\n}`, 'Use-case servis sa ubrizganim zavisnostima'),
    callout('note', 'Testabilnost se projektuje unapred', '`IClock` i `IReservationRepository` nisu uvedeni samo radi testova, već zato što vreme i skladište predstavljaju promenljive spoljne zavisnosti. Testiranje koristi činjenicu da su granice sistema već jasno postavljene.'),
  ]),
  page('5.4. Projektna kontrolna tačka P3', [
    text('h2', '5.4. Projektna kontrolna tačka P3 — funkcionalno jezgro'),
    text('paragraph', 'Do ove projektne kontrolne tačke projekat treba da ima najmanje jedan koherentan use-case čije je ponašanje moguće objasniti od zahteva do poslovnog rezultata. Nije cilj da svi ekrani budu završeni; važnije je da je centralni tok pravilno modelovan.'),
    list([
      'Implementirati najmanje dva ključna use-case-a sa eksplicitnim ulazima i rezultatima.',
      'Poslovna pravila ne smeju biti raspoređena po controller-u, konzolnom meniju i repozitorijumu bez jasne granice odgovornosti.',
      'Za očekivane neuspehe definisati stabilne kodove ili tipove rezultata.',
      'Spoljne zavisnosti uvoditi kroz ugovore i composition root.',
      'U pull request-u opisati najmanje jednu arhitektonsku odluku koja je promenjena nakon implementacije i obrazložiti razlog promene.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati metodu koja za očekivani poslovni neuspeh vraća `bool`, `null` ili generički `Exception`. Preoblikovati je u eksplicitan rezultat i dodati dva mala testa ili demonstraciona scenarija.'),
  ]),
]
