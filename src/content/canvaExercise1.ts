import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, page } from './canvaPracticumShared'

export const exercise1 = (): DocumentPage[] => [
  page('Vežba 1 — OOP i Clean Code: osvežavanje', [
    text('h1', 'Vežba 1 — OOP i Clean Code: osvežavanje'),
    text('paragraph', 'Objektno orijentisani koncepti predstavljaju jezik kojim ćemo kasnije govoriti o SOLID principima, granicama slojeva i testabilnom dizajnu. Na ovoj vežbi se ne proverava pamćenje sintakse već sposobnost da se prepozna ugovor, odgovornost i razlog zbog kog se određeni deo sistema menja.'),
    table(['Pojam', 'Uloga u dizajnu'], [
      ['Klasa i objekat', 'Modeluju stanje i ponašanje jednog pojma iz problema.'],
      ['Interfejs', 'Definiše ugovor koji može imati više zamenjivih implementacija.'],
      ['Apstraktna klasa', 'Čuva zajedničko stanje ili ponašanje kada postoji stvarna zajednička osnova.'],
      ['Enkapsulacija', 'Čuva invarijante i usmerava izmene kroz kontrolisane operacije.'],
      ['Polimorfizam', 'Omogućava klijentu da koristi ugovor bez grananja po konkretnim tipovima.'],
    ]),
    callout('info', 'Zašto je ovo važno', 'Dependency Inversion, repozitorijumi, dependency injection, mock objekti i agentne uloge kasnije se oslanjaju na istu ideju: klijent treba da zavisi od jasnog ugovora, a ne od nepotrebnog konkretnog detalja.'),
  ]),
  page('1.1. Interfejs, apstrakcija i polimorfizam', [
    text('h2', '1.1. Interfejs, apstrakcija i polimorfizam'),
    text('paragraph', 'Prvi primer koristi domen putovanja kako bi jasno razdvojio ugovor od zajedničke implementacione osnove. Interfejs `IPutovanje` opisuje ponašanje, apstraktna klasa `Putovanje` čuva zajedničke podatke, a konkretne vrste putovanja implementiraju specifično ponašanje. Klijentski kod radi preko `IPutovanje` i ne mora da proverava konkretan tip objekta.'),
    code('csharp', `public interface IPutovanje\n{\n    void Putuj();\n}\n\npublic abstract class Putovanje : IPutovanje\n{\n    public decimal Cena { get; }\n    public int BrojDana { get; }\n\n    protected Putovanje(decimal cena, int brojDana)\n    {\n        Cena = cena;\n        BrojDana = brojDana;\n    }\n\n    public abstract void Putuj();\n}`, 'Ugovor i zajednička osnova'),
    callout('task', 'Rad na vežbi', 'Implementirati `PutovanjeHavaji` i `PutovanjeAljaska`, zatim napraviti kolekciju `IPutovanje` objekata i pozvati `Putuj()` bez provere konkretnog tipa.'),
    callout('note', 'Pitanje za razmišljanje', 'Da li nam je apstraktna klasa zaista potrebna ako konkretne vrste putovanja više ne dele stanje i ponašanje? U tom slučaju interfejs može biti dovoljna apstrakcija.'),
  ]),
  page('1.2. Zamenjive implementacije', [
    text('h2', '1.2. Zamenjive implementacije: primer pretraživača'),
    text('paragraph', 'Drugi primer demonstrira zamenjive strategije pretrage preko ugovora `IPretrazivac`. Dve implementacije mogu da obilaze listu različitim redosledom, ali moraju poštovati isto značenje ulaza i rezultata. Primer direktno priprema teren za Liskov Substitution Principle: zamena implementacije ne sme da promeni očekivanja klijentskog koda.'),
    code('csharp', `public interface IPretrazivac\n{\n    int Pretraga(string pojam, string[] lista);\n}\n\npublic static int Prebroj(IPretrazivac pretrazivac, string pojam, string[] lista)\n    => pretrazivac.Pretraga(pojam, lista);`, 'Klijent zavisi od ugovora'),
    list([
      'Definisati precizno šta znači rezultat metode: broj tačnih pogodaka, case-sensitive ili case-insensitive poređenje i ponašanje za praznu listu.',
      'Napisati najmanje tri mala primera koji moraju dati isti rezultat za obe implementacije.',
      'Razmotriti koje bi ponašanje jedne implementacije prekršilo očekivanja klijenta iako bi kod i dalje kompajlirao.',
    ]),
    callout('success', 'Ishod', 'Student ume da objasni razliku između zajedničkog ugovora i konkretne implementacije, što je važnije od samog korišćenja ključne reči `interface`.'),
  ]),
  page('1.3. Clean Code i razdvajanje odgovornosti', [
    text('h2', '1.3. Clean Code kao podrška promenama'),
    text('paragraph', 'Čist kod je pre svega kod u kome je namera vidljiva. Dosledno imenovanje, razumne veličine metoda, izbegavanje dupliranja i jasne granice odgovornosti smanjuju količinu koda koju programer mora da drži u glavi prilikom izmene. To nije estetsko pitanje: direktno utiče na cenu održavanja i rizik od regresije.'),
    image('/course-assets/oop-refactor.svg', 'Primer izdvajanja podataka, poslovnog pravila i logovanja iz jednog servisa.', 'Razdvajanje odgovornosti'),
    list([
      'Efektivnost: implementacija rešava traženi problem.',
      'Efikasnost: nakon ispravnosti procenjuje se razumna potrošnja resursa i složenost.',
      'Jednostavnost: sledeća izmena treba da zahteva razumevanje što manjeg dela sistema.',
      'Doslednost: format, imenovanje i struktura projekta treba da budu predvidljivi.',
      'Ponovna upotrebljivost: zajedničko ponašanje se izdvaja kada za to postoji realna potreba, a ne radi formalnog „DRY“ rezultata.',
    ]),
    callout('task', 'Mini domaći — bonus 1 bod', 'Refaktorisati kratku klasu sa najmanje tri code smell-a. Predati pre/posle diff i do 150 reči objašnjenja najvažnijih odluka.'),
  ]),
]