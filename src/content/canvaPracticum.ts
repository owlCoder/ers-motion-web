import type { Block, CourseDocument, DocumentPage } from '../types'
import { exercise1 } from './canvaExercise1'
import { exercise2 } from './canvaExercise2'
import { exercise3 } from './canvaExercise3'
import { exercise4 } from './canvaExercise4'
import { exercise5 } from './canvaExercise5'
import { exercise6 } from './canvaExercise6'
import { exercise7 } from './canvaExercise7'
import { exercise8 } from './canvaExercise8'
import { exercise9 } from './canvaExercise9'
import { exercise10 } from './canvaExercise10'
import { reflowPages } from './contentLayout'
import { text, list, callout, table, image, page } from './canvaPracticumShared'

let metaSequence = 0
const id = (prefix: string) => `praktikum-${prefix}-${String(++metaSequence).padStart(3, '0')}`

const institution = (): Block => ({
  id: id('institution'),
  type: 'institution',
  university: 'Univerzitet u Novom Sadu',
  faculty: 'Fakultet tehničkih nauka',
  department: 'Primenjeno softversko inženjerstvo · 2026/2027',
  leftLogoSrc: '/brand/university.svg',
  rightLogoSrc: '/brand/ftn.svg',
})

const cover = (): DocumentPage => ({
  id: id('page'),
  label: 'Naslovna',
  layout: 'cover',
  blocks: [
    institution(),
    { id: id('title'), type: 'text', variant: 'title', html: 'Praktikum iz predmeta Elementi razvoja softvera', align: 'center' },
    { id: id('subtitle'), type: 'text', variant: 'subtitle', html: 'Studijska 2026/2027. godina', align: 'center' },
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Radni materijal za vežbe, samostalno ponavljanje i kontinuiran razvoj zajedničkog timskog projekta.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Univerzitet u Novom Sadu · Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const introPages = (): DocumentPage[] => [
  page('0.1. Kako koristiti praktikum', [
    text('h1', '0.1. Kako koristiti praktikum'),
    text('paragraph', 'Praktikum je zamišljen kao jedinstven pratilac vežbi i projektnog zadatka. Svaka oblast sadrži teorijsko objašnjenje, praktičan primer, pitanja za proveru razumevanja i zadatke koji povezuju gradivo sa projektnim repozitorijumom. Cilj je da student nakon časa može samostalno da obnovi postupak, razume razloge koji stoje iza donetih odluka i primeni isti princip u drugom kontekstu.'),
    text('paragraph', 'Projektni rad se tokom semestra organizuje kao simulacija male softverske firme: više timova razvija jedan zajednički proizvod u istom repozitorijumu, dok svaki tim ima jasno vlasništvo nad svojim poslovnim domenom i sopstveni Tapiz backlog. Detaljna pravila organizacije nalaze se u tabu Projekat; ona ne zamenjuju gradivo praktikuma, već određuju kontekst u kome se gradivo primenjuje.'),
    table(['Faza', 'Preporučeni način rada'], [
      ['Pre vežbe', 'Pročitati uvodni deo oblasti i označiti pojmove koji zahtevaju dodatno razjašnjenje.'],
      ['Tokom vežbe', 'Pratiti demonstraciju i obrazloženje odluka, a ne samo konačan kod ili niz komandi.'],
      ['Posle vežbe', 'Primeniti isti princip na zajedničkom projektnom repozitorijumu u okviru domena svog tima i sačuvati proverljiv razvojni trag kroz backlog stavku, commit, Pull Request, test, dokument ili zapis o upotrebi AI alata.'],
      ['Pre projektne kontrolne tačke', 'Proći kontrolnu listu, proveriti izgradnju projekta i testove, pregledati konačni diff i proveriti uticaj na druge timove. Svaki član tima treba da ume da obrazloži urađeno.'],
    ]),
    callout('info', 'Nastavni primeri', 'Praktikum koristi mali domen rezervacije fakultetske opreme, kao i studije slučaja Logger–Blogger i ECommerce kada su korisne za poređenje arhitektonskih odluka. Studentski tim ne dobija unapred pripremljen projektni šablon: principe primenjuje na dodeljeni domen zajedničkog proizvoda i samostalno oblikuje strukturu koju može da obrazloži.'),
    callout('note', 'Jezik i alati', 'Primeri su pretežno u C#/.NET okruženju. Konfiguraciona sintaksa pojedinih AI alata može se menjati između verzija, zato se u praktikumu naglašavaju stabilni koncepti: kontekst, ugovori, granice alata, verifikacija i evaluacioni scenariji.'),
  ]),
  page('0.2. Tok semestra i projekta', [
    text('h1', '0.2. Tok semestra i projekta'),
    text('paragraph', 'Prve dve vežbe služe za obnovu i ujednačavanje osnova. Od treće vežbe gotovo svaka oblast ostavlja konkretan trag u istom zajedničkom projektnom repozitorijumu. Studenti rade u timovima od približno 6 do 10 članova; svaki tim razvija svoj poslovni domen, ali se rezultat kontinuirano integriše u jedan proizvod. AI podrška se uvodi rano kroz analizu zahteva, dok samostalnije izmene koda dolaze tek nakon stabilizacije funkcionalnog jezgra i osnovnih testova.'),
    image('/course-assets/semester-map.svg', 'Teme se nadovezuju na isti projekat: zahtevi → arhitektura → poslovna logika → testovi → tok rada uz podršku AI alata → MCP → završna provera kvaliteta.', 'Mapa semestra'),
    callout('task', 'Projektni način rada', 'Svaki tim vodi backlog i praćenje rada u Tapiz Boards, radi kroz kratkotrajne Git grane i Pull Request-ove, poštuje vlasništvo nad modulima i zajednički Definition of Done. SOLID, Clean Code, Clean Architecture, testiranje i pravila AI usage-a iz praktikuma ostaju obavezni kroz ceo projekat.'),
    list([
      'P1 — tim definiše problem svog domena, backlog, kriterijume prihvatanja i početni trag upotrebe AI podrške.',
      'P2 — tim definiše arhitektonske granice svog modula, cross-team ugovore i najmanje jedan vertikalni prolaz kroz sistem.',
      'P3 — koherentni use-case-ovi i eksplicitni poslovni ishodi moraju da funkcionišu u okviru zajedničkog proizvoda.',
      'P4 — testirano funkcionalno jezgro, provera integracije i Git tag `manual-core-baseline`.',
      'P5 — stabilne projektne instrukcije, strukturirani izlaz i uredna evidencija u `AI_USAGE.md`.',
      'P6 — prilagođeni skills kao ponovljive procedure i najmanji smisleni agentski tok rada vezan za realan timski proces.',
      'P7 — MCP resursi i alati povezani sa stvarnim projektnim signalima i jasnim granicama odgovornosti.',
      'P8 — hook i guardrail mehanizmi, evaluacioni scenariji, cross-team vršnjačka provera kvaliteta i završna odbrana integrisanog proizvoda.',
    ]),
  ]),
]

const summaryPages = (): DocumentPage[] => [
  page('Sažetak: isti principi u novom razvojnom okruženju', [
    text('h1', 'Sažetak: isti principi u novom razvojnom okruženju'),
    text('paragraph', 'Klasični principi iz predmeta ostaju osnova i kada se u razvoj uvedu AI agenti. Jasan interfejs odgovara dobro definisanom ugovoru alata, SRP pomaže pri razdvajanju agentskih uloga, dependency injection ima analogiju u kontrolisanom dodeljivanju alata i spoljnog konteksta, a testiranje se proširuje evaluacionim scenarijima celog toka rada.'),
    table(['Softversko inženjerstvo', 'Razvoj uz podršku AI alata'], [
      ['Interfejs', 'Ugovor alata ili MCP funkcionalnosti sa jasnim ulazom, izlazom i ograničenjima.'],
      ['Single Responsibility', 'Specijalizovana agentska uloga sa ograničenom odgovornošću.'],
      ['Dependency Injection', 'Kontrolisano dodeljivanje alata i spoljnog konteksta.'],
      ['Unit test', 'Deterministička provera softverskog ponašanja.'],
      ['Integracioni test', 'Provera toka rada kroz više komponenti.'],
      ['Pokrivenost koda', 'Signal nepokrivenog koda; sličan način razmišljanja koristi se pri izboru skupa evaluacionih scenarija.'],
      ['Middleware / policy', 'Hook ili guardrail koji se izvršava na definisanoj granici životnog ciklusa.'],
      ['Ponovljiva procedura', 'Skill koji čuva i verzioniše razvojni postupak.'],
    ]),
    callout('success', 'Odgovornost ostaje kod studenta', 'AI može da ubrza analizu, implementaciju i pregled, ali student mora da razume zahtev, objasni arhitekturu i pokaže nezavisan dokaz da je promena ispravna.'),
  ]),
]

const literaturePages = (): DocumentPage[] => [
  page('Preporučena literatura i dokumentacija', [
    text('h1', 'Preporučena literatura i dokumentacija'),
    text('paragraph', 'Literatura služi za produbljivanje tema iz praktikuma. Preporuka je da se čita uz konkretan primer iz projekta, jer se principi najbrže usvajaju kada student može da poveže definiciju sa sopstvenim diff-om, testom ili arhitektonskom odlukom.'),
    list([
      'Robert C. Martin — <i>Clean Code: A Handbook of Agile Software Craftsmanship</i>.',
      'Robert C. Martin — <i>Clean Architecture: A Craftsman’s Guide to Software Structure and Design</i>.',
      'Scott Chacon i Ben Straub — <i>Pro Git</i>; zvanična Git dokumentacija: <a href="https://git-scm.com/doc">git-scm.com/doc</a>.',
      'Ken Schwaber i Jeff Sutherland — <i>The Scrum Guide</i>: <a href="https://scrumguides.org">scrumguides.org</a>.',
      'NUnit dokumentacija: <a href="https://docs.nunit.org">docs.nunit.org</a>; Moq projekat i dokumentacija: <a href="https://github.com/devlooped/moq">github.com/devlooped/moq</a>.',
      'Microsoft Learn — .NET dependency injection, testing i arhitektura aplikacija: <a href="https://learn.microsoft.com/dotnet/">learn.microsoft.com/dotnet</a>.',
      'Model Context Protocol — specifikacija i koncepti resources/tools/prompts: <a href="https://modelcontextprotocol.io">modelcontextprotocol.io</a>.',
      'Zvanična dokumentacija AI razvojnog okruženja koje se koristi na vežbama; pratiti aktuelnu verziju sintakse za projektne instrukcije, skills, agente i hooks.',
    ]),
    callout('note', 'Napomena o verzijama', 'AI alati i njihova konfiguraciona sintaksa menjaju se brže od osnovnih principa softverskog inženjerstva. Kada se razlikuje konkretna komanda ili naziv konfiguracione datoteke, treba pratiti aktuelnu zvaničnu dokumentaciju, ali zadržati isti mentalni model, granice odgovornosti i način verifikacije.'),
  ]),
]

const chapter = (pages: DocumentPage[], name: string) => reflowPages(pages, name)

function plain(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

function pageContainsHeading(page: DocumentPage, needle: string) {
  return page.blocks.some((item) => item.type === 'text' && ['h1', 'h2'].includes(item.variant) && plain(item.html).startsWith(needle))
}

function contentsPage(body: DocumentPage[]): DocumentPage {
  const wanted = [
    ['Uvod i način rada', '0.1. Kako koristiti praktikum'],
    ['Tok semestra i projekta', '0.2. Tok semestra i projekta'],
    ...Array.from({ length: 10 }, (_, index) => [`Vežba ${index + 1}`, `Vežba ${index + 1}`]),
    ['Sažetak', 'Sažetak: isti principi'],
    ['Literatura i dokumentacija', 'Preporučena literatura'],
  ] as Array<[string, string]>

  const rows = wanted.map(([label, needle]) => {
    const index = body.findIndex((item) => pageContainsHeading(item, needle))
    if (index < 0) return [label, '—']
    const target = body[index]
    const pageNumber = index + 3
    return [`<a class="toc-link" href="#page-${target.id}">${label}</a>`, String(pageNumber)]
  })

  return page('Sadržaj', [
    text('h1', 'Sadržaj'),
    text('paragraph', 'Pregled oblasti i početnih strana. Naslovi u elektronskoj verziji vode direktno na odgovarajuće poglavlje.'),
    table(['Oblast', 'Strana'], rows),
  ])
}

const bodyPages = [
  ...chapter(introPages(), 'Uvod'),
  ...chapter(exercise1(), 'Vežba 1'),
  ...chapter(exercise2(), 'Vežba 2'),
  ...chapter(exercise3(), 'Vežba 3'),
  ...chapter(exercise4(), 'Vežba 4'),
  ...chapter(exercise5(), 'Vežba 5'),
  ...chapter(exercise6(), 'Vežba 6'),
  ...chapter(exercise7(), 'Vežba 7'),
  ...chapter(exercise8(), 'Vežba 8'),
  ...chapter(exercise9(), 'Vežba 9'),
  ...chapter(exercise10(), 'Vežba 10'),
  ...chapter(summaryPages(), 'Zaključak'),
  ...chapter(literaturePages(), 'Literatura'),
]

export const practicum2026: CourseDocument = {
  version: 5,
  id: 'ers-praktikum-2026-27-current',
  title: 'Praktikum 2026/27',
  subtitle: 'Elementi razvoja softvera',
  subject: 'Elementi razvoja softvera',
  kind: 'praktikum',
  headerText: 'Elementi razvoja softvera',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-08-25T12:00:00.000Z',
  updatedAt: '2026-09-05T12:00:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'blue', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), contentsPage(bodyPages), ...bodyPages],
}
