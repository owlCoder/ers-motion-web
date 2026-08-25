import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exercise5 = (): DocumentPage[] => [
  page('Vežba 5 — Poslovna logika i use-case sloj', [
    text('h1', 'Vežba 5 — Poslovna logika i use-case sloj'),
    text('paragraph', 'Nakon postavljanja arhitektonskih granica, sledeći korak je da se poslovno ponašanje smesti na pravo mesto. Use-case predstavlja jednu korisnički smislenu operaciju sistema. On orkestrira domenske objekte i ugovore, ali ne treba da bude vezan za konkretan UI, bazu ili transportni protokol.'),
    diagram('Tok jednog use-case-a', [
      ['Input', 'komanda ili zahtev', 'cyan'],
      ['Validation', 'osnovna i poslovna pravila', 'blue'],
      ['Domain', 'promena stanja i invarijante', 'violet'],
      ['Persistence', 'ugovor repozitorijuma', 'amber'],
      ['Result', 'eksplicitan ishod za klijenta', 'emerald'],
    ]),
    callout('info', 'Veza sa ECommerce primerom', 'U postojećem materijalu ECommerce razdvaja Domain, podatke/repozitorijume, Application i BusinessImplementation. Taj primer pokazuje istu ideju: upiti i komande pripadaju aplikacionom sloju, dok konkretna baza ili web servis ostaju spoljašnji detalji.'),
  ]),
  page('5.1. Entiteti, invarijante i ponašanje', [
    text('h2', '5.1. Entitet nije samo DTO'),
    text('paragraph', 'Ako domenski objekat sadrži samo javne setere, a sva pravila se nalaze u servisima, objekat lako ulazi u nevažeće stanje. Enkapsulacija omogućava da se invarijanta čuva na mestu koje poseduje podatke. Use-case i dalje koordinira operaciju, ali ne mora da ponavlja pravilo pri svakom pozivu.'),
    code('csharp', `public sealed class Reservation\n{\n    public Guid Id { get; }\n    public DateTime From { get; private set; }\n    public DateTime To { get; private set; }\n    public bool Cancelled { get; private set; }\n\n    public Reservation(Guid id, DateTime from, DateTime to)\n    {\n        if (from >= to) throw new ArgumentException("Invalid period");\n        Id = id;\n        From = from;\n        To = to;\n    }\n\n    public Result Cancel(DateTime now)\n    {\n        if (Cancelled) return Result.Fail("AlreadyCancelled");\n        if (From <= now) return Result.Fail("ReservationAlreadyStarted");\n        Cancelled = true;\n        return Result.Ok();\n    }\n}`,'Entitet čuva pravila sopstvenog validnog stanja'),
    list([
      'Konstruktor ili factory treba da spreče nastanak očigledno nevalidnog stanja.',
      'Metode entiteta treba da imaju poslovno značenje, a ne da budu samo generički seteri.',
      'Pravilo koje zavisi od više agregata ili spoljnog izvora može pripadati domenskom/application servisu umesto jednom entitetu.'),
  ]),
  page('5.2. Eksplicitni poslovni ishodi', [
    text('h2', '5.2. `Result` i očekivani neuspeh'),
    text('paragraph', 'Očekivani poslovni neuspeh nije isto što i neočekivana greška sistema. Ako korisnik pokuša da rezerviše zauzet termin, sistem je radio ispravno kada odbije zahtev. Takav ishod treba da bude eksplicitan i testabilan, umesto da se sakrije iza `null`, `false` ili generičkog izuzetka.'),
    code('csharp', `public sealed record Result(bool Success, string? Error)\n{\n    public static Result Ok() => new(true, null);\n    public static Result Fail(string error) => new(false, error);\n}\n\npublic Result Reserve(ReservationRequest request)\n{\n    if (_repository.HasOverlap(request.EquipmentId, request.From, request.To))\n        return Result.Fail("OverlappingReservation");\n\n    // kreiranje i čuvanje rezervacije\n    return Result.Ok();\n}`),
    table(['Situacija', 'Preporučeni model'], [
      ['Nevažeći poslovni zahtev', 'Eksplicitan Result / error code.'],
      ['Entitet nije pronađen', 'Result sa stabilnim kodom ili domenom definisan NotFound ishod.'],
      ['Baza privremeno nedostupna', 'Infrastrukturna greška/izuzetak koji se obrađuje na odgovarajućoj granici.'],
      ['Programerska greška / narušena pretpostavka', 'Fail-fast ili izuzetak; ne predstavljati je kao regularan poslovni rezultat.'],
    ]),
  ]),
  page('5.3. Use-case servis i dependency injection', [
    text('h2', '5.3. Use-case servis i dependency injection'),
    text('paragraph', 'Dependency Injection nije samo framework funkcija. To je način da objekat dobije saradnike spolja, pa centralna logika ne mora da zna kako se ti saradnici kreiraju. Time se promenljive zavisnosti mogu zameniti u testu ili drugom runtime okruženju.'),
    code('csharp', `public sealed class ReservationService\n{\n    private readonly IReservationRepository _repository;\n    private readonly IClock _clock;\n\n    public ReservationService(IReservationRepository repository, IClock clock)\n    {\n        _repository = repository;\n        _clock = clock;\n    }\n\n    public Result Reserve(ReservationRequest request)\n    {\n        if (request.From <= _clock.UtcNow)\n            return Result.Fail("ReservationMustBeInFuture");\n\n        if (_repository.HasOverlap(request.EquipmentId, request.From, request.To))\n            return Result.Fail("OverlappingReservation");\n\n        _repository.Add(new Reservation(Guid.NewGuid(), request.From, request.To));\n        return Result.Ok();\n    }\n}`),
    callout('note', 'Testabilnost se projektuje unapred', 'IClock i IReservationRepository nisu uvedeni „zbog testova“, već zato što vreme i skladište predstavljaju promenljive spoljne zavisnosti. Testiranje samo koristi činjenicu da su granice već dobro postavljene.'),
  ]),
  page('5.4. Projektni checkpoint P3', [
    text('h2', '5.4. Projektni checkpoint P3 — funkcionalno jezgro'),
    text('paragraph', 'Do ovog checkpoint-a projekat treba da ima najmanje jedan koherentan use-case čije je ponašanje moguće objasniti od zahteva do poslovnog rezultata. Nije cilj da svi ekrani budu završeni; važnije je da je centralni tok pravilno modelovan.'),
    list([
      'Implementirati najmanje dva ključna use-case-a sa eksplicitnim ulazima i rezultatima.',
      'Poslovna pravila ne smeju biti raspoređena po controller-u, konzolnom meniju i repozitorijumu bez jasne granice.',
      'Za očekivane neuspehe definisati stabilne kodove ili tipove rezultata.',
      'Spoljne zavisnosti uvoditi kroz ugovore i composition root.',
      'U PR-u opisati najmanje jednu arhitektonsku odluku koja je promenjena nakon implementacije i zašto.'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Izabrati metodu koja vraća `bool`, `null` ili generički `Exception` za očekivani poslovni neuspeh. Preoblikovati je u eksplicitan rezultat i dodati dva mala testa ili demonstraciona scenarija.'),
  ]),
]
