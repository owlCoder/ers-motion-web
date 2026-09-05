import type { DocumentPage } from '../types'
import { text, list, callout, code, table, diagram, page } from './canvaPracticumShared'

export const exerciseIntegration = (): DocumentPage[] => [
  page('Vežba 5 — Integracija modula, ugovori i podaci', [
    text('h1', 'Vežba 5 — Integracija modula, ugovori i podaci'),
    text('paragraph', 'Kada više timova razvija različite delove istog proizvoda, najveći rizik više nije samo kvalitet pojedinačne klase. Potrebno je jasno odrediti granice modula, odgovornost za podatke i način na koji jedan deo sistema koristi mogućnosti drugog. Ova vežba uvodi principe koji omogućavaju da modularni monolit ostane razumljiv, testabilan i pogodan za paralelan razvoj.'),
    diagram('Integracija u modularnom monolitu', [
      ['Modul A', 'poseduje svoja pravila i podatke', 'cyan'],
      ['Ugovor', 'jasan ulaz, izlaz i semantika', 'blue'],
      ['Modul B', 'koristi ugovor, ne tuđe detalje', 'violet'],
      ['Događaj', 'obaveštenje o završenoj promeni', 'amber'],
      ['Provera', 'integracioni i ugovorni testovi', 'emerald'],
    ], 'Moduli sarađuju preko eksplicitnih ugovora; unutrašnji detalji jednog modula ne postaju prečica za drugi modul.'),
  ]),

  page('5.1. Granice modula i vlasništvo nad odgovornošću', [
    text('h2', '5.1. Granice modula i vlasništvo nad odgovornošću'),
    text('paragraph', 'Modul predstavlja koherentnu poslovnu oblast sa sopstvenim pravilima, slučajevima upotrebe i podacima. Granica nije dobra ako se svaka promena u jednom modulu neposredno preliva u više drugih modula ili ako se zajednička tabela koristi kao neformalni interfejs između timova.'),
    table(['Pitanje', 'Poželjna odluka'], [
      ['Ko menja podatak?', 'Modul koji poseduje poslovno pravilo nad tim podatkom.'],
      ['Ko čita podatak?', 'Drugi modul preko ugovora, projekcije ili odobrenog modela za čitanje.'],
      ['Ko definiše pravilo?', 'Modul kome pravilo poslovno pripada.'],
      ['Ko odobrava promenu ugovora?', 'Vlasnički tim uz pregled uticaja na zavisne module.'],
    ]),
    list([
      'Granica modula treba da se zasniva na poslovnoj odgovornosti, a ne samo na rasporedu foldera.',
      'Jedan modul ne treba neposredno da menja unutrašnje tabele, entitete ili privatne servise drugog modula.',
      'Zajedničke biblioteke treba da sadrže samo zaista zajedničke tehničke ili ugovorne elemente, a ne da postanu mesto u koje se premešta sve što je teško smestiti.',
      'Promena javnog ugovora modula mora biti vidljiva i pregledana kao promena koja može uticati na druge timove.',
    ]),
    callout('warning', 'Shared nije zamena za granice', 'Veliki zajednički projekat sa desetinama modela i pomoćnih servisa često prikriva stvarne zavisnosti. Zajednički kod treba da bude mali, stabilan i opravdan stvarnom potrebom više modula.'),
  ]),

  page('5.2. Ugovori između modula', [
    text('h2', '5.2. Ugovori između modula'),
    text('paragraph', 'Saradnja modula treba da bude opisana eksplicitnim ugovorom. Ugovor određuje koje podatke pozivalac šalje, koji rezultat može da očekuje i koji poslovni neuspeh može da nastane. Klijent ne treba da zna kako drugi modul čuva podatke niti koje interne klase koristi.'),
    code('csharp', `public sealed record ReserveStockRequest(\n    Guid ProductId,\n    int Quantity,\n    Guid OrderId);\n\npublic sealed record ReserveStockResult(\n    bool Success,\n    string? ErrorCode);\n\npublic interface IInventoryModule\n{\n    Task<ReserveStockResult> ReserveAsync(\n        ReserveStockRequest request,\n        CancellationToken cancellationToken);\n}`, 'Primer ugovora između dva poslovna modula'),
    list([
      'Ugovor treba da koristi poslovno razumljive pojmove i stabilne kodove ishoda.',
      'Interni ORM entitet, DbContext ili tabela ne predstavljaju javni ugovor modula.',
      'Ugovor treba da bude dovoljno uzak da klijent ne dobije mogućnosti koje mu nisu potrebne.',
      'Promena ugovora zahteva procenu kompatibilnosti i pregled zavisnih pozivalaca.',
    ]),
  ]),

  page('5.3. Sinhroni poziv ili poslovni događaj', [
    text('h2', '5.3. Sinhroni poziv ili poslovni događaj'),
    text('paragraph', 'Nije svaka saradnja modula ista. Sinhroni poziv je prikladan kada rezultat drugog modula neposredno određuje da li trenutna operacija može da se nastavi. Poslovni događaj je prikladan kada modul objavljuje činjenicu koja se već dogodila, a drugi delovi sistema mogu naknadno da reaguju bez uticaja na ishod prvobitne operacije.'),
    table(['Situacija', 'Prikladniji oblik'], [
      ['Porudžbina ne može biti potvrđena bez rezervacije zalihe', 'Sinhroni poziv, jer je rezultat potreban odmah.'],
      ['Nakon potvrde porudžbine analitika osvežava zbirne podatke', 'Poslovni događaj, jer analiza ne određuje uspeh porudžbine.'],
      ['CRM treba da proveri trenutno stanje korisničkog naloga', 'Sinhroni upit preko ugovora ili projekcije.'],
      ['HR objavljuje da je zaposleni promenio organizacionu jedinicu', 'Događaj koji zainteresovani moduli obrađuju u skladu sa sopstvenim pravilima.'],
    ]),
    code('csharp', `public sealed record OrderConfirmed(\n    Guid OrderId,\n    Guid CustomerId,\n    decimal TotalAmount,\n    DateTime OccurredAtUtc);`, 'Poslovni događaj opisuje činjenicu koja se već dogodila'),
    callout('note', 'Događaj nije skrivena komanda', 'Naziv događaja treba da opisuje završenu poslovnu činjenicu, na primer OrderConfirmed, a ne naredbu drugom modulu šta mora da uradi.'),
  ]),

  page('5.4. Transakcione granice, konkurentnost i idempotentnost', [
    text('h2', '5.4. Transakcione granice, konkurentnost i idempotentnost'),
    text('paragraph', 'U sistemu sa više korisnika i više modula dve operacije mogu pokušati da promene isto stanje u kratkom vremenskom razmaku. Poslovno pravilo zato mora da odredi koja promena ima prednost, kako se konflikt otkriva i da li se operacija bezbedno može ponoviti.'),
    table(['Pojam', 'Praktično značenje'], [
      ['Transakciona granica', 'Skup promena koje moraju uspeti ili biti poništene kao jedna celina.'],
      ['Optimistička konkurentnost', 'Promena se prihvata samo ako stanje nije izmenjeno od trenutka kada je pročitano.'],
      ['Idempotentnost', 'Ponavljanje istog zahteva ne proizvodi dodatni neželjeni efekat.'],
      ['Retry', 'Ponovni pokušaj je dozvoljen samo kada semantika operacije ostaje bezbedna.'],
    ]),
    code('csharp', `public sealed class InventoryItem\n{\n    public Guid Id { get; init; }\n    public int Available { get; private set; }\n    public byte[] RowVersion { get; private set; } = Array.Empty<byte>();\n\n    public Result Reserve(int quantity)\n    {\n        if (quantity <= 0)\n            return Result.Fail("InvalidQuantity");\n        if (Available < quantity)\n            return Result.Fail("InsufficientStock");\n\n        Available -= quantity;\n        return Result.Ok();\n    }\n}`, 'Poslovno pravilo i konkurentna izmena zahtevaju jasnu granicu odgovornosti'),
    callout('warning', 'Ponovni pokušaj nije uvek bezbedan', 'Ako zahtev naplaćuje novac, šalje poruku ili kreira jedinstveni poslovni zapis, automatski retry bez idempotentnog ključa može proizvesti dvostruki efekat.'),
  ]),

  page('5.5. Integracioni i ugovorni testovi', [
    text('h2', '5.5. Integracioni i ugovorni testovi'),
    text('paragraph', 'Jedinični test potvrđuje ponašanje jedne komponente u kontrolisanim uslovima. Kada dva modula sarađuju, potrebno je dodatno proveriti da li ugovor zaista funkcioniše u izvršivom sistemu: mapiranje podataka, kodovi neuspeha, registracija zavisnosti, transakcije i druga ponašanja koja ne mogu pouzdano da se potvrde samo test dvojnicima.'),
    table(['Vrsta provere', 'Šta potvrđuje'], [
      ['Jedinični test', 'Poslovno pravilo ili orkestraciju jedne komponente.'],
      ['Integracioni test', 'Saradnju više stvarnih komponenti i infrastrukture.'],
      ['Ugovorni test', 'Da davalac i korisnik modula imaju isto razumevanje ulaza, izlaza i neuspeha.'],
      ['End-to-end scenario', 'Reprezentativan poslovni tok kroz više modula i spoljašnju granicu sistema.'],
    ]),
    callout('task', 'Rad na vežbi', 'Izabrati jednu stvarnu zavisnost između dva projektna modula. Dokumentovati ugovor, odrediti vlasnika podatka, izabrati sinhroni poziv ili događaj i napisati najmanje jedan integracioni test koji potvrđuje saradnju bez neposrednog pristupa internim detaljima drugog modula.'),
  ]),

  page('5.6. Pregled međumodulske promene', [
    text('h2', '5.6. Pregled međumodulske promene'),
    text('paragraph', 'Promena koja prelazi granicu dva modula zahteva širi pregled od lokalnog refaktorisanja. Pored ispravnosti koda potrebno je proveriti da li su vlasništvo nad podacima, kompatibilnost ugovora i posledice po zavisne timove jasno obrađene.'),
    list([
      'U pull request-u navesti koji modul uvodi ili menja ugovor i koji moduli zavise od te promene.',
      'Objasniti da li se koristi sinhroni poziv ili događaj i zbog čega je taj izbor prikladan.',
      'Navesti transakcionu granicu i ponašanje u slučaju konkurentne izmene ili ponovljenog zahteva kada je to relevantno.',
      'Dodati ili prilagoditi integracione testove koji štite novu međumodulsku saradnju.',
      'Ako promena utiče na više timova, odluku evidentirati u odgovarajućem ADR-u ili drugom trajnom projektnom zapisu.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da objasni kako dva modula sarađuju bez narušavanja njihovih granica i kako se ispravnost te saradnje nezavisno proverava.'),
  ]),
]
