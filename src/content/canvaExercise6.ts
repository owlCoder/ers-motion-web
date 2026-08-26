import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise6 = (): DocumentPage[] => [
  page('Vežba 6 — Testabilni dizajn, NUnit, Moq i pokrivenost koda', [
    text('h1', 'Vežba 6 — Testabilni dizajn, NUnit, Moq i pokrivenost koda'),
    text('paragraph', 'Testabilni dizajn znači da se komponente mogu proveravati izolovano i deterministički. Razdvajanje odgovornosti, jasni ugovori i dependency injection omogućavaju da se promenljive zavisnosti kontrolišu u testu. Unit testiranje zato nije završna aktivnost koja se naknadno dodaje gotovom kodu, već povratna informacija o kvalitetu granica sistema.'),
    image('/course-assets/testing.svg', 'Veza između testabilnog dizajna, test scenarija, test dvojnika i signala o pokrivenosti koda.', 'Testiranje i pokrivenost koda'),
    table(['Element', 'Uloga'], [
      ['NUnit', 'Framework za organizaciju i izvršavanje testova.'],
      ['Microsoft.NET.Test.Sdk', 'Infrastruktura koja omogućava .NET test runner-u da pronađe i izvrši testove.'],
      ['NUnit3TestAdapter', 'Adapter za integraciju NUnit testova sa IDE i test runner okruženjem.'],
      ['Moq', 'Biblioteka za kreiranje test dvojnika i proveru saradnje sa zavisnostima.'],
      ['Alat za pokrivenost koda', 'Signal koji pokazuje koje linije ili grane nisu izvršene testovima; ne predstavlja ocenu kvaliteta testova.'],
    ]),
  ]),
  page('6.1. AAA i ponašanje koje testiramo', [
    text('h2', '6.1. Arrange – Act – Assert'),
    text('paragraph', 'Jedan unit test treba da ima jasan razlog postojanja. Arrange priprema ulaz i saradnike, Act izvršava jednu relevantnu operaciju, a Assert proverava posmatrani rezultat. Naziv testa treba da opisuje ponašanje koje štiti, a ne samo metodu koju poziva.'),
    diagram('Struktura jednog testa', [
      ['Arrange', 'ulazi i kontrolisani saradnici', 'cyan'],
      ['Act', 'jedna relevantna operacija', 'blue'],
      ['Assert', 'rezultat ili značajna interakcija', 'emerald'],
    ], 'Jasno razdvojene faze čine test lakšim za čitanje i dijagnostiku.'),
    code('csharp', `[Test]\npublic void Reserve_WhenPeriodOverlaps_ReturnsConflict()\n{\n    // Arrange\n    var repository = new Mock<IReservationRepository>();\n    repository\n        .Setup(r => r.HasOverlap(\n            It.IsAny<Guid>(),\n            It.IsAny<DateTime>(),\n            It.IsAny<DateTime>()))\n        .Returns(true);\n\n    var clock = new Mock<IClock>();\n    clock.SetupGet(c => c.UtcNow)\n        .Returns(new DateTime(2026, 10, 1));\n\n    var service = new ReservationService(\n        repository.Object, clock.Object);\n\n    // Act\n    var result = service.Reserve(\n        TestRequests.ValidFutureReservation());\n\n    // Assert\n    Assert.That(result.Success, Is.False);\n    Assert.That(result.Error, Is.EqualTo("OverlappingReservation"));\n    repository.Verify(\n        r => r.Add(It.IsAny<Reservation>()), Times.Never);\n}`, 'Negativni scenario izveden iz kriterijuma prihvatanja'),
    image('/course-assets/test-explorer.svg', 'Test Explorer omogućava pregled uspešnih i neuspešnih testova, trajanja izvršavanja i poruke koja vodi ka uzroku neuspeha.', 'Test Explorer i rezultat izvršavanja'),
    callout('note', 'Test proverava ponašanje, a ne privatne detalje implementacije', 'Ako test prestaje da prolazi svaki put kada se privatna metoda preimenuje ili se kod refaktoriše bez promene spolja vidljivog ponašanja, test je verovatno previše vezan za implementacione detalje.'),
  ]),
  page('6.2. Moq i test dvojnici', [
    text('h2', '6.2. Moq i test dvojnici'),
    text('paragraph', 'Moq omogućava kreiranje kontrolisanih test dvojnika za zavisnosti koje test ne želi stvarno da pozove. Time se mogu simulirati različiti povratni ishodi, izuzeci ili značajne interakcije bez pokretanja realne baze podataka ili spoljnog servisa. Mock nije zamena za svaki stvarni objekat; koristi se na granici koju test namerno izoluje.'),
    table(['Situacija', 'Da li koristiti mock?'], [
      ['Repozitorijum ili HTTP klijent koji test ne želi stvarno da pozove', 'Da — kontrolisati povratnu vrednost ili izuzetak.'],
      ['`IClock` ili generator identifikatora kada test zavisi od vremena ili slučajnosti', 'Da — obezbediti deterministički test.'],
      ['Mali nepromenljivi value object', 'Najčešće ne — koristiti stvarni objekat.'],
      ['Domenska klasa čije ponašanje je predmet testa', 'Ne — testirati stvarni objekat.'],
    ]),
    code('csharp', `var repository = new Mock<IReservationRepository>();\nrepository\n    .Setup(r => r.FindById(reservationId))\n    .Returns(existingReservation);\n\nvar result = service.Cancel(reservationId);\n\nrepository.Verify(\n    r => r.Save(existingReservation), Times.Once);`, 'Setup kontroliše saradnika, a Verify proverava značajnu interakciju'),
    callout('warning', 'Veliki broj Verify provera može ukazivati na krhak test', 'Ako test proverava redosled i broj gotovo svakog internog poziva, lako postaje zavisan od detalja implementacije. Interakciju treba proveravati kada ona predstavlja deo ugovora ponašanja, na primer da se podatak ne čuva nakon neuspešne validacije.'),
  ]),
  page('6.3. Pozitivni, negativni i granični scenariji', [
    text('h2', '6.3. Iz zahteva u plan testiranja'),
    text('paragraph', 'Najvredniji testovi nastaju iz poslovnih pravila i kriterijuma prihvatanja, a ne iz nasumičnog obilaska metoda. Za ključni use-case treba identifikovati uspešan tok, očekivane negativne ishode i granične vrednosti koje menjaju ponašanje.'),
    table(['Vrsta scenarija', 'Primer za rezervaciju'], [
      ['Uspešan scenario', 'Oprema je slobodna, korisnik ovlašćen, a termin validan.'],
      ['Negativni scenario', 'Termin se preklapa sa postojećom rezervacijom.'],
      ['Negativni scenario', 'Oprema je označena kao neaktivna.'],
      ['Granični scenario', 'Rezervacija počinje tačno u trenutku kada se prethodna završava — očekivano pravilo mora biti eksplicitno definisano.'],
      ['Infrastrukturni kvar', 'Repozitorijum prijavljuje grešku; infrastrukturni kvar se ne predstavlja kao regularna poslovna odbijenica.'],
    ]),
    callout('task', 'Rad na vežbi', 'Za jedan projektni use-case napisati plan testiranja od najmanje šest scenarija pre pisanja test koda. Svaki scenario povezati sa pravilom ili kriterijumom prihvatanja koji štiti.'),
  ]),
  page('6.4. Pokrivenost koda kao signal', [
    text('h2', '6.4. Pokrivenost koda kao signal, ne cilj'),
    text('paragraph', 'Pokrivenost koda pokazuje koji su delovi programa izvršeni tokom testova, ali ne govori da li su provere smisleno napisane niti da li su obuhvaćeni najvažniji rizici. Zato se izveštaj o pokrivenosti koristi kao dijagnostički signal za pronalaženje nepokrivenih grana, a ne kao samostalna ocena kvaliteta.'),
    code('bash', `dotnet test\n# primer sa collector-om, ako je odgovarajuće podešavanje dostupno\ndotnet test --collect:"XPlat Code Coverage"`, 'Pokretanje testova i prikupljanje podataka o pokrivenosti'),
    image('/course-assets/coverage-report.svg', 'Izveštaj o pokrivenosti treba tumačiti prema linijama i granama koje nose poslovni rizik, a ne samo prema ukupnom procentu.', 'Primer interpretacije izveštaja o pokrivenosti koda'),
    list([
      'Najpre definisati poslovno važne scenarije, a tek zatim analizirati pokrivenost koda.',
      'Ne dodavati testove trivijalnih getter-a samo radi povećanja procenta ako važna grana ostaje neproverena.',
      'Posebno pregledati uslovne grane, obradu grešaka i kod koji menja novac, dozvole, rezervacije ili drugo kritično stanje.',
      'Niska pokrivenost može ukazivati na propust; visoka pokrivenost ne dokazuje odsustvo grešaka.',
    ]),
    callout('info', 'Pitanje za pregled', 'Koji deo nepokrivenog koda nosi najveći rizik i koji test bi dao najviše novih informacija? To je korisnije pitanje od zahteva da se dostigne unapred zadat procenat.'),
  ]),
  page('6.5. Projektna kontrolna tačka P4 — manual-core-baseline', [
    text('h2', '6.5. Projektna kontrolna tačka P4 — manual-core-baseline'),
    text('paragraph', 'Ova kontrolna tačka razdvaja dve faze kursa. Do nje tim samostalno projektuje funkcionalno jezgro, arhitektonske granice i osnovne testove. Nakon toga AI dobija veću ulogu u radu sa kodom, ali sistem već poseduje dovoljno testova i strukture da se svaki predlog može nezavisno proveriti.'),
    list([
      'Ključni use-case-ovi imaju NUnit testove za uspešne i negativne scenarije.',
      'Moq se koristi samo za promenljive spoljne zavisnosti koje test treba da izoluje.',
      'Izveštaj o pokrivenosti je pregledan i najmanje jedna nepokrivena rizična grana je obrazložena ili pokrivena dodatnim testom.',
      'Najmanje jedan bug je najpre reprodukovan testom, a zatim ispravljen.',
      'Stabilna verzija jezgra označena je Git tag-om `manual-core-baseline`.',
    ]),
    callout('task', 'Mini domaći — bonus 2 boda', 'AI alatu dati opis use-case-a i postojeće testove, ali tražiti isključivo predlog nedostajućih scenarija. Prvi bod se dobija za novi smisleni granični test; drugi za obrazloženje zbog čega je predlog prihvaćen ili odbačen.'),
  ]),
]
