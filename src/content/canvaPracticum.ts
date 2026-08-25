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
    { id: id('quote'), type: 'text', variant: 'quote', html: 'Radni materijal za vežbe, samostalno ponavljanje i kontinuiran razvoj projektnog zadatka.', align: 'center' },
    { id: id('caption'), type: 'text', variant: 'caption', html: 'Univerzitet u Novom Sadu · Fakultet tehničkih nauka · Primenjeno softversko inženjerstvo', align: 'center' },
  ],
})

const introPages = (): DocumentPage[] => [
  page('Kako koristiti praktikum', [
    text('h1', 'Kako koristiti praktikum'),
    text('paragraph', 'Praktikum je zamišljen kao jedinstven pratilac vežbi i projektnog zadatka. Svaka oblast sadrži teorijsko objašnjenje, praktičan primer, pitanja za proveru razumevanja i zadatke koji povezuju gradivo sa projektnim repozitorijumom. Cilj je da student nakon časa može samostalno da obnovi postupak, razume razlog iza donete odluke i primeni isti princip u drugom kontekstu.'),
    table(['Faza', 'Preporučeni način rada'], [
      ['Pre vežbe', 'Pročitati uvodni deo oblasti i označiti pojmove koji nisu jasni.'],
      ['Tokom vežbe', 'Pratiti demonstraciju i razloge za odluke, ne samo konačan kod ili komande.'],
      ['Posle vežbe', 'Ponoviti isti princip na projektnom repozitorijumu i sačuvati proverljiv trag kroz commit, test, dokument ili AI_USAGE zapis.'],
      ['Pred checkpoint', 'Proći checklist-u, build/test i pregled diff-a; svaki član tima treba da ume da objasni urađeno.'],
    ]),
    callout('info', 'Nastavni primeri', 'Praktikum koristi mali domen rezervacije fakultetske opreme, kao i studije slučaja Logger–Blogger i ECommerce kada su korisne za poređenje arhitektonskih odluka. Studentski tim ne dobija gotov projektni template: principe primenjuje na sopstvenu temu i samostalno oblikuje strukturu koju može da obrazloži.'),
    callout('note', 'Jezik i alati', 'Primeri su pretežno u C#/.NET okruženju. Konfiguraciona sintaksa pojedinih AI alata može da se menja između verzija, zato se naglašavaju stabilni koncepti: kontekst, ugovori, granice alata, verifikacija i eval scenariji.'),
  ]),
  page('Tok semestra i projekta', [
    text('h1', 'Tok semestra i projekta'),
    text('paragraph', 'Prve dve vežbe služe kao osvežavanje osnova. Od treće vežbe gotovo svaka oblast ostavlja konkretan trag u istom projektnom repozitorijumu. AI se uvodi rano kroz analizu zahteva, dok samostalnije izmene koda dolaze tek nakon stabilizacije funkcionalnog jezgra i osnovnih testova.'),
    image('/course-assets/semester-map.svg', 'Teme se nadovezuju na isti projekat: zahtevi → arhitektura → poslovna logika → testovi → AI workflow → MCP → QA.', 'Mapa semestra'),
    list([
      'P1 — problem, backlog, acceptance criteria i početni AI trag.',
      'P2 — arhitektonske granice i najmanje jedan vertikalni prolaz.',
      'P3 — koherentni use-case-ovi i eksplicitni poslovni ishodi.',
      'P4 — testirano jezgro i Git tag `manual-core-baseline`.',
      'P5 — stabilne instrukcije, structured output i AI_USAGE disciplina.',
      'P6 — custom skills i najmanji smisleni agentni workflow.',
      'P7 — MCP resource/tool integracija sa stvarnim projektnim signalima.',
      'P8 — hooks/guardrails, evals, peer QA i završna odbrana.',
    ]),
  ]),
]

const summaryPages = (): DocumentPage[] => [
  page('Sažetak: od klasičnog ka AI-native softverskom inženjerstvu', [
    text('h1', 'Sažetak: isti principi, novo razvojno okruženje'),
    text('paragraph', 'Klasični principi iz predmeta ostaju osnova i kada se u razvoj uvedu agenti. Interfejs postaje tool contract, SRP pomaže da se odvoje agentne uloge, dependency injection ima analogiju u ubrizgavanju tool/MCP kapabiliteta, a testiranje se širi eval scenarijima celog workflow-a.'),
    table(['Softversko inženjerstvo', 'AI podržano softversko inženjerstvo'], [
      ['Interfejs', 'Tool/MCP ugovor sa jasnim ulazom i izlazom.'],
      ['Single Responsibility', 'Specijalizovana uloga/agent sa ograničenim zadatkom.'],
      ['Dependency Injection', 'Kontrolisano dodeljivanje alata i spoljnog konteksta.'],
      ['Unit test', 'Deterministička provera softverskog ponašanja.'],
      ['Integration test', 'Provera workflow-a kroz više komponenti.'],
      ['Code coverage', 'Signal nepokrivenog koda; analogno razmišljanje o scenario/eval coverage-u.'],
      ['Middleware / policy', 'Hook ili guardrail koji se izvršava na lifecycle granici.'],
      ['Reusable service/procedure', 'Skill koji čuva ponovljiv razvojni postupak.'],
    ]),
    callout('success', 'Odgovornost ostaje kod studenta', 'AI može da ubrza analizu, implementaciju i review, ali student mora da razume zahtev, objasni arhitekturu i pokaže nezavisan dokaz da je promena ispravna.'),
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
      'Zvanična dokumentacija AI razvojnog okruženja koje se koristi na vežbama; pratiti aktuelnu verziju sintakse za instrukcije, skills, agente i hooks.',
    ]),
    callout('note', 'Napomena o verzijama', 'AI alati i njihova konfiguraciona sintaksa menjaju se brže od osnovnih principa softverskog inženjerstva. Kada se razlikuje konkretna komanda ili naziv fajla, treba pratiti aktuelnu zvaničnu dokumentaciju, ali zadržati isti mentalni model i način verifikacije.'),
  ]),
]

const chapter = (pages: DocumentPage[], name: string) => reflowPages(pages, name)

function plain(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

function firstHeading(page: DocumentPage) {
  const block = page.blocks.find((item) => item.type === 'text' && ['h1', 'h2'].includes(item.variant))
  return block?.type === 'text' ? plain(block.html) : page.label || ''
}

function contentsPage(body: DocumentPage[]): DocumentPage {
  const wanted = [
    ['Uvod', 'Kako koristiti praktikum'],
    ['Tok semestra i projekta', 'Tok semestra i projekta'],
    ...Array.from({ length: 10 }, (_, index) => [`Vežba ${index + 1}`, `Vežba ${index + 1}`]),
    ['Sažetak', 'Sažetak: isti principi'],
    ['Literatura i dokumentacija', 'Preporučena literatura'],
  ] as Array<[string, string]>

  const rows = wanted.map(([label, needle]) => {
    const index = body.findIndex((item) => firstHeading(item).startsWith(needle))
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
  version: 2,
  id: 'ers-praktikum-2026-27-current',
  title: 'Praktikum 2026/27',
  subtitle: 'Elementi razvoja softvera',
  subject: 'Elementi razvoja softvera',
  kind: 'praktikum',
  headerText: 'Elementi razvoja softvera',
  footerText: 'Primenjeno softversko inženjerstvo',
  createdAt: '2026-08-25T12:00:00.000Z',
  updatedAt: '2026-08-25T20:35:00.000Z',
  theme: { name: 'Academic Light', font: 'System', accent: 'blue', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
  pages: [cover(), contentsPage(bodyPages), ...bodyPages],
}
