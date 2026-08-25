import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise6 = (): DocumentPage[] => [
  page('Vežba 6 — Testabilni dizajn, NUnit, Moq i Coverage', [
    text('h1', 'Vežba 6 — Testabilni dizajn, NUnit, Moq i Coverage'),
    text('paragraph', 'Testabilni dizajn znači da se komponente mogu proveriti izolovano i deterministički. Razdvajanje odgovornosti, jasni ugovori i dependency injection omogućavaju da se promenljive zavisnosti kontrolišu u testu. Unit testiranje zato nije završna aktivnost koja se naknadno dodaje gotovom kodu, već povratna informacija o kvalitetu granica sistema.'),
    image('/course-assets/testing.svg', 'Veza između testabilnog dizajna, test slučajeva, mock objekata i coverage signala.', 'Testiranje i coverage'),
    table(['Element', 'Uloga'], [
      ['NUnit', 'Framework za organizaciju i izvršavanje testova.'],
      ['Microsoft.NET.Test.Sdk', 'Infrastruktura koja omogućava .NET test runner-u da pronađe i izvrši testove.'],
      ['NUnit3TestAdapter', 'Adapter za integraciju NUnit testova sa IDE/test runner okruženjem.'],
      ['Moq', 'Biblioteka za kreiranje test dvojnika i proveru saradnje sa zavisnostima.'],
      ['Coverage alat', 'Signal koji pokazuje koje linije ili grane nisu izvršene testovima; nije ocena kvaliteta testa.'],
    ]),
  ]),
  page('6.1. AAA i ponašanje koje testiramo', [
    text('h2', '6.1. Arrange – Act – Assert'),
    text('paragraph', 'Jedan unit test treba da ima jasan razlog postojanja. Arrange priprema ulaz i saradnike, Act izvršava jednu relevantnu operaciju, a Assert proverava posmatrani rezultat. Naziv testa treba da kaže koje ponašanje štiti, a ne samo koju metodu poziva.'),
    diagram('Struktura jednog testa', [
      ['Arrange', 'ulazi + kontrolisani saradnici', 'cyan'],
      ['Act', 'jedna relevantna operacija', 'blue'],
      ['Assert', 'rezultat ili značajna interakcija', 'emerald'],
    ], 'Jasno razdvojene faze čine test lakšim za čitanje i dijagnostiku.'),
    code('csharp', `[Test]\npublic void Reserve_WhenPeriodOverlaps_ReturnsConflict()\n{\n    // Arrange\n    var repository = new Mock<IReservationRepository>();\n    repository\n        .Setup(r => r.HasOverlap(It.IsAny<Guid>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))\n        .Returns(true);\n    var clock = new Mock<IClock>();\n    clock.SetupGet(c => c.UtcNow).Returns(new DateTime(2026, 10, 1));\n    var service = new ReservationService(repository.Object, clock.Object);\n\n    // Act\n    var result = service.Reserve(TestRequests.ValidFutureReservation());\n\n    // Assert\n    Assert.That(result.Success, Is.False);\n    Assert.That(result.Error, Is.EqualTo("OverlappingReservation"));\n    repository.Verify(r => r.Add(It.IsAny<Reservation>()), Times.Never);\n}`, 'Negativni scenario izveden iz kriterijuma prihvatanja'),
    callout('note', 'Test proverava ponašanje, ne privatne detalje', 'Ako test puca svaki put kada se privatna metoda preimenuje ili se kod refaktoriše bez promene ponašanja, verovatno je previše vezan za implementacione detalje.'),
  ]),
  page('6.2. Moq i test dvojnici', [
    text('h2', '6.2. Moq i test dvojnici'),
    text('paragraph', 'Moq omogućava kreiranje kontrolisanih test dvojnika za zavisnosti koje test ne želi stvarno da pozove. Time se mogu simulirati različiti povratni ishodi, izuzeci ili specifične interakcije bez pokretanja realne baze ili spoljnog servisa. Mock nije zamena za svaki stvarni objekat; koristi se na granici koju test namerno izoluje.'),
    table(['Situacija', 'Mock?'], [
      ['Repozitorijum ili HTTP klijent koji test ne želi stvarno da pozove', 'Da — kontrolisati povratnu vrednost ili izuzetak.'],
      ['IClock / generator ID-a kada test zavisi od vremena ili slučajnosti', 'Da — obezbediti deterministički test.'],
      ['Mali immutable value object', 'Najčešće ne — koristiti stvarni objekat.'],
      ['Domenska klasa čije ponašanje je predmet testa', 'Ne — testirati stvarni objekat.'],
    ]),
    code('csharp', `var repository = new Mock<IReservationRepository>();\nrepository\n    .Setup(r => r.FindById(reservationId))\n    .Returns(existingReservation);\n\nvar result = service.Cancel(reservationId);\n\nrepository.Verify(r => r.Save(existingReservation), Times.Once);`, 'Setup kontroliše saradnika, a Verify proverava značajnu interakciju'),
    callout('warning', 'Previše Verify poziva je signal', 'Ako test proverava redosled i broj gotovo svakog internog poziva, lako postaje krhak. Interakciju treba proveriti kada ona predstavlja deo ugovora ponašanja, na primer da se podatak ne čuva nakon neuspešne validacije.'),
  ]),
  page('6.3. Pozitivni, negativni i granični scenariji', [
    text('h2', '6.3. Iz zahteva u test plan'),
    text('paragraph', 'Najvredniji testovi nastaju iz poslovnih pravila i kriterijuma prihvatanja, ne iz nasumičnog obilaska metoda. Za ključni use-case treba identifikovati normalan tok, očekivane negativne ishode i granične vrednosti koje menjaju ponašanje.'),
    table(['Scenario', 'Primer za rezervaciju'], [
      ['Happy path', 'Oprema slobodna, korisnik ovlašćen, termin validan.'],
      ['Negativni scenario', 'Termin se preklapa sa postojećom rezervacijom.'],
      ['Negativni scenario', 'Oprema je označena kao neaktivna.'],
      ['Granica', 'Rezervacija počinje tačno u trenutku kada se prethodna završava — očekivano pravilo mora biti definisano.'],
      ['Infrastrukturni kvar', 'Repozitorijum baca grešku; kvar se ne predstavlja kao regularna poslovna odbijenica.'],
    ]),
    callout('task', 'Rad na vežbi', 'Za jedan projektni use-case napisati test plan od najmanje šest scenarija pre pisanja test koda. Svaki scenario povezati sa pravilom ili kriterijumom prihvatanja koji štiti.'),
  ]),
  page('6.4. Code Coverage kao signal', [
    text('h2', '6.4. Code Coverage kao signal, ne cilj'),
    text('paragraph', 'Code Coverage pokazuje koji delovi koda jesu izvršeni tokom testova, ali ne govori da li su assert-i smisleni niti da li su testirani najvažniji rizici. Zbog toga se coverage koristi kao dijagnostički signal za pronalaženje slepih tačaka, a ne kao samostalna ocena kvaliteta.'),
    code('bash', `dotnet test\n# primer sa collector-om, ako je paket/podešavanje dostupno\ndotnet test --collect:"XPlat Code Coverage"`, 'Pokretanje testova i prikupljanje coverage podataka'),
    list([
      'Prvo definisati poslovno važne scenarije, pa tek onda posmatrati coverage.',
      'Ne pokrivati trivijalne getter-e samo da bi procenat porastao ako važna grana ostaje neproverena.',
      'Posebno pregledati uslovne grane, error-handling i kod koji menja novac, dozvole, rezervacije ili drugo kritično stanje.',
      'Nizak coverage može ukazati na propust; visok coverage ne dokazuje odsustvo propusta.',
    ]),
    callout('info', 'Pitanje za review', 'Koji deo nepokrivenog koda nosi najveći rizik i koji test bi dao najviše nove informacije? Ovo pitanje je korisnije od pitanja kako dostići unapred zadat procenat.'),
  ]),
  page('6.5. Projektni checkpoint P4 — manual-core-baseline', [
    text('h2', '6.5. Projektni checkpoint P4 — manual-core-baseline'),
    text('paragraph', 'Ovaj checkpoint razdvaja dve faze kursa. Do njega tim samostalno projektuje funkcionalno jezgro, arhitektonske granice i osnovne testove. Nakon toga AI dobija veću ulogu u radu sa kodom, ali sistem već ima dovoljno testova i strukture da se svaki predlog može proveriti.'),
    list([
      'Ključni use-case-ovi imaju NUnit testove za pozitivne i negativne scenarije.',
      'Moq se koristi samo za promenljive spoljne zavisnosti koje test treba da izoluje.',
      'Coverage izveštaj je pregledan i najmanje jedna nepokrivena rizična grana je komentarisana ili pokrivena dodatnim testom.',
      'Najmanje jedan bug je prvo reprodukovan testom, pa zatim ispravljen.',
      'Stabilna verzija jezgra označena je Git tag-om `manual-core-baseline`.',
    ]),
    callout('task', 'Mini domaći — bonus 2 boda', 'AI alatu dati opis use-case-a i postojeće testove, ali tražiti samo predlog nedostajućih scenarija. 1 bod za novi smisleni edge-case test; 1 bod za obrazloženje zašto je predlog prihvaćen ili odbačen.'),
  ]),
]