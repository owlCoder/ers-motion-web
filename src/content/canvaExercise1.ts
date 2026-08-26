import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, page } from './canvaPracticumShared'

export const exercise1 = (): DocumentPage[] => [
  page('Vežba 1 — OOP i Clean Code: osvežavanje', [
    text('h1', 'Vežba 1 — OOP i Clean Code: osvežavanje'),
    text('paragraph', 'Objektno orijentisani koncepti predstavljaju osnovni jezik kojim ćemo kasnije opisivati SOLID principe, granice slojeva i testabilan dizajn. Na ovoj vežbi se ne proverava samo poznavanje sintakse, već sposobnost da se prepoznaju ugovor, odgovornost i razlog zbog kog se određeni deo sistema menja.'),
    table(['Pojam', 'Uloga u dizajnu'], [
      ['Klasa i objekat', 'Modeluju stanje i ponašanje jednog pojma iz problema.'],
      ['Interfejs', 'Definiše ugovor koji može imati više zamenjivih implementacija.'],
      ['Apstraktna klasa', 'Čuva zajedničko stanje ili ponašanje kada postoji stvarna zajednička osnova.'],
      ['Enkapsulacija', 'Čuva invarijante i usmerava izmene kroz kontrolisane operacije.'],
      ['Polimorfizam', 'Omogućava klijentu da koristi ugovor bez grananja prema konkretnim tipovima.'],
    ]),
    callout('info', 'Zašto je ovo važno', 'Dependency Inversion, repozitorijumi, dependency injection, test dvojnici i agentske uloge kasnije se oslanjaju na istu ideju: klijent treba da zavisi od jasnog ugovora, a ne od nepotrebnog konkretnog detalja.'),
  ]),
  page('1.1. Interfejs, apstrakcija i polimorfizam', [
    text('h2', '1.1. Interfejs, apstrakcija i polimorfizam'),
    text('paragraph', 'Prvi primer koristi domen putovanja kako bi jasno razdvojio ugovor od zajedničke implementacione osnove. Interfejs `IPutovanje` opisuje ponašanje, apstraktna klasa `Putovanje` čuva zajedničke podatke, a konkretne vrste putovanja implementiraju specifično ponašanje. Klijentski kod radi preko ugovora `IPutovanje` i ne mora da proverava konkretan tip objekta.'),
    code('csharp', `public interface IPutovanje\n{\n    void Putuj();\n}\n\npublic abstract class Putovanje : IPutovanje\n{\n    public decimal Cena { get; }\n    public int BrojDana { get; }\n\n    protected Putovanje(decimal cena, int brojDana)\n    {\n        Cena = cena;\n        BrojDana = brojDana;\n    }\n\n    public abstract void Putuj();\n}`, 'Ugovor i zajednička osnova'),
    callout('task', 'Rad na vežbi', 'Implementirati `PutovanjeHavaji` i `PutovanjeAljaska`, zatim napraviti kolekciju objekata tipa `IPutovanje` i pozvati `Putuj()` bez provere njihovog konkretnog tipa.'),
    callout('note', 'Pitanje za razmišljanje', 'Da li je apstraktna klasa i dalje potrebna ako konkretne vrste putovanja više ne dele stanje ili zajedničko ponašanje? U tom slučaju interfejs može predstavljati dovoljnu apstrakciju.'),
  ]),
  page('1.2. Zamenjive implementacije', [
    text('h2', '1.2. Zamenjive implementacije: primer pretraživača'),
    text('paragraph', 'Drugi primer demonstrira zamenjive strategije pretrage preko ugovora `IPretrazivac`. Dve implementacije mogu da obilaze listu različitim redosledom, ali moraju poštovati isto značenje ulaza i rezultata. Primer neposredno priprema teren za Liskov Substitution Principle: zamena implementacije ne sme da promeni očekivanja klijentskog koda.'),
    code('csharp', `public interface IPretrazivac\n{\n    int Pretraga(string pojam, string[] lista);\n}\n\npublic static class PrimerPretrage\n{\n    public static int Prebroj(\n        IPretrazivac pretrazivac,\n        string pojam,\n        string[] lista)\n        => pretrazivac.Pretraga(pojam, lista);\n}`, 'Klijent zavisi od ugovora'),
    list([
      'Precizno definisati značenje rezultata metode: da li predstavlja broj tačnih pogodaka, da li se razlikuju velika i mala slova i kakvo je ponašanje nad praznom listom.',
      'Napisati najmanje tri mala scenarija koji moraju dati isti rezultat za obe implementacije.',
      'Razmotriti koje bi ponašanje jedne implementacije prekršilo očekivanja klijenta iako bi program i dalje uspešno prošao kompajliranje.',
    ]),
    callout('success', 'Ishod', 'Student ume da objasni razliku između zajedničkog ugovora i konkretne implementacije, što je važnije od samog poznavanja ključne reči `interface`.'),
  ]),
  page('1.3. Clean Code i razdvajanje odgovornosti', [
    text('h2', '1.3. Clean Code kao podrška promenama'),
    text('paragraph', 'Čist kod je pre svega kod u kome je namera vidljiva. Dosledno imenovanje, razumne veličine metoda, izbegavanje nepotrebnog dupliranja i jasne granice odgovornosti smanjuju količinu konteksta koju programer mora istovremeno da razume prilikom izmene. To nije samo estetsko pitanje: direktno utiče na cenu održavanja i rizik od regresije.'),
    image('/course-assets/oop-refactor.svg', 'Primer izdvajanja pristupa podacima, poslovnog pravila i evidentiranja aktivnosti iz jednog preopterećenog servisa.', 'Razdvajanje odgovornosti'),
    list([
      'Efektivnost: implementacija rešava traženi problem.',
      'Efikasnost: nakon potvrđene ispravnosti procenjuju se razumna potrošnja resursa i složenost.',
      'Jednostavnost: naredna izmena treba da zahteva razumevanje što manjeg dela sistema.',
      'Doslednost: format, imenovanje i struktura projekta treba da budu predvidljivi.',
      'Ponovna upotrebljivost: zajedničko ponašanje se izdvaja kada postoji realna potreba, a ne samo radi formalnog uklanjanja svake sličnosti u kodu.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Refaktorisati kratku klasu u kojoj su uočena najmanje tri problema u dizajnu ili čitljivosti (code smell). Predati diff pre i posle izmene i do 150 reči obrazloženja najvažnijih odluka.'),
  ]),
]
