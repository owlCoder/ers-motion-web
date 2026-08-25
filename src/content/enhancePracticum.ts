import type { Block, CourseDocument, DocumentPage } from '../types'
import { clone, textFromHtml } from '../utils'

const COVER_UNIVERSITY_LOGO = '/brand/university.svg'
const COVER_FTN_LOGO = '/brand/ftn.svg'

function clean(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function pageText(page: DocumentPage) {
  return page.blocks.map((block) => {
    if (block.type === 'text') return textFromHtml(block.html)
    if (block.type === 'list') return block.items.map(textFromHtml).join(' ')
    if (block.type === 'code') return block.code
    if (block.type === 'callout') return `${textFromHtml(block.title)} ${textFromHtml(block.text)}`
    if (block.type === 'table') return [...block.headers, ...block.rows.flat()].map(textFromHtml).join(' ')
    if (block.type === 'diagram') return [block.title || '', ...block.items.flatMap((item) => [item.title, item.subtitle || '']), block.footer || ''].join(' ')
    if (block.type === 'image') return `${block.alt || ''} ${block.caption || ''}`
    if (block.type === 'institution') return `${block.university} ${block.faculty} ${block.department || ''}`
    return ''
  }).join(' ')
}

function pageWeight(page: DocumentPage) {
  return page.blocks.reduce((score, block) => {
    if (block.type === 'text') {
      const length = clean(block.html).length
      return score + (block.variant === 'paragraph' || block.variant === 'quote' ? Math.min(420, length * 1.25) : 55)
    }
    if (block.type === 'list') return score + block.items.reduce((sum, item) => sum + Math.min(150, clean(item).length * 1.35), 80)
    if (block.type === 'code') return score + Math.min(620, block.code.length * 0.72)
    if (block.type === 'table') return score + 120 + block.rows.length * 115
    if (block.type === 'diagram') return score + 130 + block.items.length * 92
    if (block.type === 'callout') return score + 145 + clean(block.text).length * 0.55
    if (block.type === 'institution') return score + 180
    if (block.type === 'image') return score + 360
    return score + 30
  }, 0)
}

function id(page: DocumentPage, suffix: string) {
  return `${page.id}-academic-${suffix}`
}

function paragraph(page: DocumentPage, suffix: string, html: string): Block {
  return { id: id(page, suffix), type: 'text', variant: 'paragraph', html }
}

function heading(page: DocumentPage, suffix: string, html: string): Block {
  return { id: id(page, suffix), type: 'text', variant: 'h2', html }
}

function list(page: DocumentPage, suffix: string, items: string[], ordered = false): Block {
  return { id: id(page, suffix), type: 'list', ordered, items }
}

function callout(page: DocumentPage, suffix: string, title: string, text: string, tone: 'info' | 'note' | 'task' | 'warning' | 'success' = 'note'): Block {
  return { id: id(page, suffix), type: 'callout', tone, title, text }
}

function diagram(page: DocumentPage, suffix: string, title: string, items: Array<[string, string, 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate']>, footer?: string): Block {
  return {
    id: id(page, suffix),
    type: 'diagram',
    variant: 'flow',
    title,
    columns: Math.min(5, Math.max(2, items.length)) as 2 | 3 | 4 | 5,
    items: items.map(([itemTitle, subtitle, accent], index) => ({ id: `${id(page, suffix)}-${index}`, title: itemTitle, subtitle, accent })),
    footer,
  }
}

type SupplementFactory = (page: DocumentPage, index: number) => Block[]

const supplements: Record<number, SupplementFactory[]> = {
  0: [
    (page) => [
      heading(page, 'workflow-h', 'Kako je organizovan rad na svakoj vežbi'),
      diagram(page, 'workflow-d', 'Radni ciklus', [
        ['Razumevanje', 'pojam, problem i očekivano ponašanje', 'blue'],
        ['Demonstracija', 'kratak primer na nastavnom projektu', 'cyan'],
        ['Primena', 'isti princip u studentskom repozitorijumu', 'violet'],
        ['Verifikacija', 'build, test, diff ili drugi dokaz', 'emerald'],
      ], 'Cilj praktikuma je da svaka tema ostavi proverljiv inženjerski artefakt, a ne samo belešku sa časa.'),
    ],
    (page) => [
      heading(page, 'reading-h', 'Preporučeni način rada sa praktikumom'),
      list(page, 'reading-l', [
        'Pre časa pročitati uvodni deo vežbe i označiti pojmove koji nisu jasni.',
        'Tokom demonstracije pratiti razlog za svaku odluku, a ne samo konačan kod.',
        'Nakon vežbe ponoviti isti postupak na projektnom repozitorijumu i sačuvati rezultat kroz smislen commit.',
        'Pre predaje proveriti da li član tima može da obrazloži odluku bez oslanjanja na tekst generisan alatima.',
      ], true),
    ],
  ],
  1: [
    (page) => [
      heading(page, 'smells-h', 'Česti indikatori narušene odgovornosti'),
      list(page, 'smells-l', [
        'Metoda istovremeno obrađuje poslovno pravilo, pristup podacima i prikaz rezultata.',
        'Klasa ima veliki broj razloga za izmenu i zavisi od detalja koji pripadaju različitim slojevima sistema.',
        'Promena jednog zahteva zahteva izmene na više nepovezanih mesta ili dupliranje istog pravila.',
        'Nazivi metoda i promenljivih ne opisuju nameru već tehničke korake implementacije.',
      ]),
    ],
    (page) => [
      callout(page, 'review-c', 'Provera nakon refaktorisanja', 'Dobar refaktoring čuva spolja vidljivo ponašanje. Pre i posle izmene proveriti isti skup ulaza, a zatim pregledati diff i utvrditi da li je promena zaista lokalizovala odgovornost umesto da je samo premestila u drugu veliku klasu.', 'info'),
      paragraph(page, 'review-p', 'Kada se uvodi interfejs, treba moći da se objasni koja promenljiva zavisnost ili granica sistema se njime modeluje. Interfejs koji postoji samo zato što „svaka klasa treba da ima interfejs“ povećava broj elemenata bez jasne arhitektonske koristi.'),
    ],
  ],
  2: [
    (page) => [
      heading(page, 'commit-h', 'Karakteristike kvalitetnog commita'),
      list(page, 'commit-l', [
        'Obuhvata jednu koherentnu nameru i može samostalno da se opiše jednom rečenicom.',
        'Repozitorijum nakon commita ostaje u stanju koje može da se build-uje i, kada je primenljivo, testira.',
        'Poruka objašnjava šta je promenjeno i zašto, a ne samo koje su datoteke dodirnute.',
        'Ne kombinuje refaktorisanje, novu funkcionalnost i masovno formatiranje kada se te promene mogu razdvojiti.',
      ]),
    ],
    (page) => [
      diagram(page, 'pr-d', 'Od promene do pull request-a', [
        ['Issue', 'jasan cilj i kriterijumi prihvatanja', 'blue'],
        ['Branch', 'izolovana promena kratkog životnog veka', 'cyan'],
        ['Commits', 'mali i proverljivi koraci', 'violet'],
        ['Review', 'diff, testovi i arhitektonske posledice', 'amber'],
        ['Merge', 'integracija tek nakon provere', 'emerald'],
      ]),
    ],
  ],
  3: [
    (page) => [
      heading(page, 'req-h', 'Od zahteva ka proverljivom ponašanju'),
      paragraph(page, 'req-p', 'Zahtev postaje dovoljno precizan tek kada tim može da navede uslove pod kojima se ponašanje smatra ispravnim. Kriterijumi prihvatanja zato treba da opisuju posmatrano ponašanje sistema, uključujući barem jedan granični ili negativni scenario. Tek nakon toga ima smisla razmatrati tehničko rešenje.'),
      callout(page, 'req-c', 'Primer pitanja za razjašnjenje', 'Ko sme da izvrši radnju? Koje stanje mora da postoji pre poziva? Šta se dešava kada podaci nisu validni? Da li postoji konflikt sa već postojećim pravilom? Koji rezultat može automatski da se proveri testom?', 'info'),
    ],
    (page) => [
      heading(page, 'ctx-h', 'Kontekst za AI alat nije isto što i dugačak prompt'),
      list(page, 'ctx-l', [
        'Problem: konkretan zahtev koji se rešava.',
        'Projektna pravila: arhitektonske granice, konvencije i zabrane koje važe stalno.',
        'Relevantni artefakti: interfejsi, modeli, testovi i dokumentacija koji utiču na odluku.',
        'Očekivani izlaz: plan, analiza rizika, predlog testa ili drugi jasno definisan rezultat.',
        'Verifikacija: način na koji će student proveriti da je predlog tačan i usklađen sa projektom.',
      ], true),
    ],
  ],
  4: [
    (page) => [
      heading(page, 'arch-h', 'Arhitektura kao upravljanje smerom zavisnosti'),
      paragraph(page, 'arch-p', 'Clean Architecture se ne svodi na određeni broj projekata ili direktorijuma. Suština je da centralna poslovna pravila ne zavise od tehnologije skladištenja, korisničkog interfejsa ili eksternih servisa. Spoljni slojevi poznaju unutrašnje ugovore, dok unutrašnji slojevi ostaju upotrebljivi i testabilni bez konkretne infrastrukture.'),
      diagram(page, 'arch-d', 'Tipičan smer zavisnosti', [
        ['Presentation', 'ulaz/izlaz i transportni modeli', 'cyan'],
        ['Application', 'use-case i orkestracija', 'blue'],
        ['Domain', 'pravila i invarijante', 'violet'],
        ['Infrastructure', 'implementacije spoljnih detalja', 'amber'],
      ], 'Fizički raspored može da varira; dozvoljeni smer zavisnosti mora ostati jasan.'),
    ],
    (page) => [
      callout(page, 'adr-c', 'Mala arhitektonska odluka', 'Za jednu važnu odluku u projektu zabeležiti: kontekst problema, razmatrane alternative, izabrano rešenje i posledice. Takva beleška je korisnija od samog dijagrama jer objašnjava zašto je struktura nastala baš tako.', 'task'),
    ],
  ],
  5: [
    (page) => [
      heading(page, 'usecase-h', 'Use-case kao granica poslovne operacije'),
      paragraph(page, 'usecase-p', 'Use-case treba da objedini korake jedne korisnički smislene operacije: proveru ulaza, učitavanje potrebnog stanja, primenu poslovnih pravila, čuvanje rezultata i vraćanje ishoda. Controller ili UI sloj prosleđuju zahtev, ali ne bi trebalo da dupliraju pravila koja pripadaju aplikacionom ili domenskom sloju.'),
      callout(page, 'usecase-c', 'Praktična provera', 'Ako istu operaciju sutra pozove konzolna aplikacija, REST endpoint ili test, poslovno pravilo treba da ostane na istom mestu. Promena transportnog mehanizma ne sme da zahteva prepisivanje jezgra use-case-a.', 'info'),
    ],
    (page) => [
      heading(page, 'result-h', 'Eksplicitni ishodi umesto nekontrolisanih izuzetaka'),
      list(page, 'result-l', [
        'Očekivane poslovne greške predstavljaju deo ugovora operacije i treba ih modelovati dosledno.',
        'Izuzeci su prikladni za neočekivana ili infrastrukturna stanja koja se ne obrađuju kao regularan tok.',
        'Kod greške treba da bude stabilan za testiranje i mapiranje na različite prezentacione slojeve.',
        'Poruka namenjena korisniku i tehnički detalj za logovanje nisu ista informacija.',
      ]),
    ],
  ],
  6: [
    (page) => [
      heading(page, 'aaa-h', 'Struktura testa: Arrange – Act – Assert'),
      diagram(page, 'aaa-d', 'Jedan test, jedno ponašanje', [
        ['Arrange', 'pripremi ulaz i saradnike', 'cyan'],
        ['Act', 'izvrši tačno jednu relevantnu operaciju', 'blue'],
        ['Assert', 'proveri rezultat ili značajnu interakciju', 'emerald'],
      ], 'Naziv testa treba da opisuje očekivano ponašanje, a ne internu implementaciju metode.'),
    ],
    (page) => [
      heading(page, 'mock-h', 'Kada koristiti mock'),
      paragraph(page, 'mock-p', 'Mock je koristan kada test proverava interakciju sa promenljivom spoljnom zavisnošću, na primer da se repozitorijum ne poziva kada poslovna validacija padne. Nije potrebno mock-ovati male čiste objekte i domenske vrednosti samo zato što su zavisnosti klase.'),
      callout(page, 'coverage-c', 'Coverage nije cilj sam po sebi', 'Visok procenat pokrivenosti ne dokazuje da su testirani važni scenariji. Coverage se koristi kao signal za pronalaženje neproverenih grana; kvalitet testa se procenjuje prema ponašanju koje štiti od regresije.', 'warning'),
    ],
  ],
  7: [
    (page) => [
      heading(page, 'skill-h', 'Skill kao ponovljiva inženjerska procedura'),
      paragraph(page, 'skill-p', 'Dobar skill ne sadrži samo jednu naredbu tipa „napiši testove“. On definiše redosled koraka, potrebni kontekst, kriterijume zaustavljanja i očekivani izlaz. Na taj način postupak koji tim inače ponavlja ručno postaje konzistentan i prenosiv između zadataka.'),
      diagram(page, 'skill-d', 'Anatomija skill-a', [
        ['Ulaz', 'problem i relevantni artefakti', 'blue'],
        ['Procedura', 'jasan niz koraka', 'violet'],
        ['Provera', 'test, build, diff ili pravilo', 'amber'],
        ['Izlaz', 'strukturisan rezultat', 'emerald'],
      ]),
    ],
    (page) => [
      callout(page, 'skill-c', 'Kriterijum za izdvajanje skill-a', 'Postupak je dobar kandidat za skill kada se ponavlja na više zadataka i kada tim može jasno da opiše šta znači uspešno izvršenje. Jednokratna instrukcija specifična za jednu funkcionalnost obično ne zahteva poseban skill.', 'info'),
    ],
  ],
  8: [
    (page) => [
      heading(page, 'agent-h', 'Specijalizacija agenata prati podelu odgovornosti'),
      paragraph(page, 'agent-p', 'Agent dobija smisao kada ima jasnu odgovornost, ograničen skup alata i izlaz koji drugi korak može da proveri. Podela na Architect, Developer, Tester i Reviewer nije obavezna šema, već primer kako se princip odvajanja odgovornosti može primeniti na agentni workflow.'),
      diagram(page, 'agent-d', 'Primer toka sa proverljivim granicama', [
        ['Architect', 'analizira zahtev i predlaže plan', 'violet'],
        ['Developer', 'menja dozvoljene datoteke', 'blue'],
        ['Tester', 'izvršava i dopunjava testove', 'amber'],
        ['Reviewer', 'pregleda diff bez menjanja koda', 'emerald'],
      ], 'Više agenata ima smisla samo kada granice smanjuju rizik ili povećavaju proverljivost.'),
    ],
    (page) => [
      callout(page, 'agent-c', 'Handoff mora da prenese artefakt, ne pretpostavku', 'Sledeći agent treba da dobije konkretan plan, diff, rezultat testova ili drugi proverljiv artefakt. Nejasna poruka „nastavi gde sam stao“ stvara zavisnost od implicitnog konteksta i otežava reprodukciju workflow-a.', 'warning'),
    ],
  ],
  9: [
    (page) => [
      heading(page, 'mcp-h', 'MCP server izlaže sposobnosti, ne poslovnu magiju'),
      paragraph(page, 'mcp-p', 'Alat izložen agentu treba da ima jasno ime, stabilan ugovor ulaza i izlaza i ograničenu odgovornost. Umesto jednog alata „solve_project“, korisnije je imati proverljive operacije kao što su čitanje issue-a, pokretanje testova, čitanje diff-a ili pretraga projektne dokumentacije.'),
      diagram(page, 'mcp-d', 'Kontekst i alati preko MCP-a', [
        ['Resources', 'čitanje dokumentacije i projektnih podataka', 'cyan'],
        ['Tools', 'kontrolisane operacije nad sistemom', 'blue'],
        ['Prompts', 'ponovljivi ulazni obrasci', 'violet'],
        ['Agent', 'bira korake unutar dozvoljenih granica', 'emerald'],
      ]),
    ],
    (page) => [
      callout(page, 'mcp-c', 'Projektovanje bezbednog alata', 'Svaki alat treba da definiše šta sme da promeni, kako prijavljuje grešku i koje informacije vraća agentu. Destruktivne operacije zahtevaju strože granice od read-only operacija poput get_git_diff ili get_project_structure.', 'warning'),
    ],
  ],
  10: [
    (page) => [
      heading(page, 'hooks-h', 'Deterministička kontrola oko nedeterminističkog modela'),
      paragraph(page, 'hooks-p', 'Instrukcija modelu izražava očekivanje, ali ne garantuje izvršenje. Hook ili druga programska provera koristi se za pravila koja moraju važiti svaki put: zabranu opasne komande, formatiranje nakon izmene, pokretanje testa ili proveru da workflow ne završava sa neuspešnim build-om.'),
      diagram(page, 'hooks-d', 'Primer kontrolisanog agentnog ciklusa', [
        ['Pre uslova', 'dozvole i validacija komande', 'amber'],
        ['Agent korak', 'analiza ili izmena', 'blue'],
        ['Post uslovi', 'formatiranje, test i statičke provere', 'cyan'],
        ['Eval', 'da li rezultat zadovoljava scenario', 'violet'],
        ['Izveštaj', 'dokazi, ograničenja i sledeći korak', 'emerald'],
      ]),
    ],
    (page) => [
      heading(page, 'eval-h', 'Eval proverava sistem kroz scenarije'),
      list(page, 'eval-l', [
        'Definisati reprezentativan skup zadataka, uključujući negativne i granične slučajeve.',
        'Za svaki scenario odvojiti objektivne provere od subjektivne procene kvaliteta rešenja.',
        'Meriti ne samo krajnji rezultat već i nepotrebne izmene, neuspešne pokušaje i kršenje projektnih granica.',
        'Kada se promeni instrukcija, skill ili agent, ponoviti isti skup scenarija radi poređenja.',
      ]),
    ],
  ],
}

function detectExercise(page: DocumentPage, fallback: number) {
  const text = `${page.label || ''} ${pageText(page)}`
  const direct = text.match(/Vežba\s+(10|[1-9])/i)
  if (direct) return Number(direct[1])
  const numbered = text.match(/(?:^|\s)(10|[1-9])\.[0-9]+\./)
  if (numbered) return Number(numbered[1])
  return fallback
}

function applyCover(document: CourseDocument) {
  const cover = document.pages[0]
  if (!cover) return
  cover.layout = 'cover'
  cover.label = 'Naslovna'
  cover.blocks = cover.blocks.filter((block) => !(block.type === 'callout' && clean(block.title).toLowerCase().includes('primenjeno softversko')))
  if (!cover.blocks.some((block) => block.type === 'institution')) {
    cover.blocks.unshift({
      id: `${cover.id}-institution`,
      type: 'institution',
      university: 'Univerzitet u Novom Sadu',
      faculty: 'Fakultet tehničkih nauka',
      department: 'Primenjeno softversko inženjerstvo · 2026/2027',
      leftLogoSrc: COVER_UNIVERSITY_LOGO,
      rightLogoSrc: COVER_FTN_LOGO,
    })
  }
}

export function enhancePracticum(source: CourseDocument): CourseDocument {
  const document = clone(source)
  applyCover(document)

  let exercise = 0
  const useCounter = new Map<number, number>()

  document.pages.forEach((page, pageIndex) => {
    if (pageIndex === 0) return
    exercise = detectExercise(page, exercise)
    const weight = pageWeight(page)
    if (weight >= 900) return

    const candidates = supplements[exercise] || supplements[0]
    if (!candidates.length) return
    const used = useCounter.get(exercise) || 0
    const factory = candidates[used % candidates.length]
    useCounter.set(exercise, used + 1)

    const extra = factory(page, pageIndex)
    let nextWeight = weight
    for (const block of extra) {
      if (page.blocks.some((candidate) => candidate.id === block.id)) continue
      page.blocks.push(block)
      nextWeight = pageWeight(page)
      if (nextWeight >= 1020) break
    }
  })

  document.updatedAt = '2026-08-25T13:18:00+02:00'
  return document
}
