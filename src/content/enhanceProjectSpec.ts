import type { Block, CourseDocument, DocumentPage } from '../types'
import { clone, textFromHtml } from '../utils'

function clean(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function id(page: DocumentPage, suffix: string) {
  return `${page.id}-spec-${suffix}`
}

function text(page: DocumentPage) {
  return page.blocks.map((block) => {
    if (block.type === 'text') return textFromHtml(block.html)
    if (block.type === 'list') return block.items.map(textFromHtml).join(' ')
    if (block.type === 'callout') return `${block.title} ${block.text}`
    if (block.type === 'table') return [...block.headers, ...block.rows.flat()].join(' ')
    if (block.type === 'diagram') return [block.title || '', ...block.items.flatMap((item) => [item.title, item.subtitle || '']), block.footer || ''].join(' ')
    if (block.type === 'code') return block.code
    return ''
  }).join(' ')
}

function weight(page: DocumentPage) {
  return page.blocks.reduce((total, block) => {
    if (block.type === 'text') return total + (block.variant === 'paragraph' ? Math.min(440, clean(block.html).length * 1.25) : 60)
    if (block.type === 'list') return total + 90 + block.items.reduce((sum, item) => sum + Math.min(135, clean(item).length * 1.1), 0)
    if (block.type === 'table') return total + 160 + block.rows.length * 115
    if (block.type === 'diagram') return total + 150 + block.items.length * 95
    if (block.type === 'callout') return total + 155 + clean(block.text).length * 0.55
    if (block.type === 'code') return total + Math.min(600, block.code.length * 0.7)
    if (block.type === 'institution') return total + 180
    if (block.type === 'image') return total + 350
    return total + 30
  }, 0)
}

function paragraph(page: DocumentPage, suffix: string, html: string): Block {
  return { id: id(page, suffix), type: 'text', variant: 'paragraph', html }
}

function heading(page: DocumentPage, suffix: string, html: string): Block {
  return { id: id(page, suffix), type: 'text', variant: 'h2', html }
}

function list(page: DocumentPage, suffix: string, items: string[]): Block {
  return { id: id(page, suffix), type: 'list', ordered: false, items }
}

function callout(page: DocumentPage, suffix: string, title: string, body: string, tone: 'info' | 'note' | 'task' | 'warning' | 'success' = 'info'): Block {
  return { id: id(page, suffix), type: 'callout', tone, title, text: body }
}

function diagram(page: DocumentPage, suffix: string, title: string, items: Array<[string, string, 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate']>, footer?: string): Block {
  return {
    id: id(page, suffix),
    type: 'diagram',
    variant: 'flow',
    columns: Math.min(5, Math.max(2, items.length)) as 2 | 3 | 4 | 5,
    title,
    items: items.map(([itemTitle, subtitle, accent], index) => ({ id: `${id(page, suffix)}-${index}`, title: itemTitle, subtitle, accent })),
    footer,
  }
}

function detectSection(page: DocumentPage, fallback: number) {
  const source = `${page.label || ''} ${text(page)}`
  const match = source.match(/(?:^|\s)(1[0-9]|[1-9])\.(?:\s|[0-9])/)
  return match ? Number(match[1]) : fallback
}

const additions: Record<number, (page: DocumentPage) => Block[]> = {
  1: (page) => [
    callout(page, 'evidence', 'Projekt se ocenjuje kroz dokaze', 'Funkcionalnost sama po sebi nije dovoljna. Za ključne odluke tim treba da može da pokaže odgovarajući issue ili zahtev, relevantan commit/diff, test ili drugi dokaz verifikacije i kratko obrazloženje arhitektonske odluke.'),
  ],
  2: (page) => [
    heading(page, 'outcomes-h', 'Kako se ishodi dokazuju na odbrani'),
    diagram(page, 'outcomes-d', 'Od ishoda do dokaza', [
      ['Zahtev', 'User Story i acceptance criteria', 'blue'],
      ['Dizajn', 'arhitektonska odluka i smer zavisnosti', 'cyan'],
      ['Kod', 'use-case i poslovno pravilo', 'violet'],
      ['Test', 'pozitivni, negativni i granični scenariji', 'amber'],
      ['Obrazloženje', 'student objašnjava odluku i kompromis', 'emerald'],
    ]),
  ],
  3: (page) => [
    callout(page, 'scope', 'Obim treba da bude dovoljno mali za kvalitetnu realizaciju', 'Bolji je manji sistem sa nekoliko dobro oblikovanih poslovnih pravila, jasnim testovima i kvalitetnom istorijom razvoja nego širok skup CRUD ekrana bez jasnih procesa i invarijanti.', 'note'),
  ],
  4: (page) => [
    heading(page, 'testing-h', 'Minimalna strategija testiranja'),
    list(page, 'testing-l', [
      'Svaki netrivijalan use-case treba da ima test glavnog uspešnog scenarija.',
      'Svako eksplicitno poslovno pravilo treba da ima najmanje jedan scenario u kome se pravilo aktivira.',
      'Spoljne zavisnosti izoluju se samo kada je to potrebno da bi test ostao brz, determinističan i fokusiran.',
      'Coverage izveštaj se tumači: tim navodi koje važne grane nisu pokrivene i zašto.',
    ]),
  ],
  5: (page) => [
    diagram(page, 'trace-d', 'Trag jedne funkcionalnosti', [
      ['Issue', 'opis problema i kriterijumi', 'blue'],
      ['Branch', 'izolovana implementacija', 'cyan'],
      ['Commits', 'koherentni koraci', 'violet'],
      ['PR / Review', 'provera koda i testova', 'amber'],
      ['Tag / Release', 'stabilna tačka razvoja', 'emerald'],
    ], 'Istorija repozitorijuma treba da omogući rekonstrukciju razvoja funkcionalnosti bez oslanjanja na usmeno objašnjenje.'),
  ],
  6: (page) => [
    callout(page, 'ai-proof', 'AI pomoć ne menja odgovornost autora', 'Student na odbrani mora da razume kod, konfiguraciju i ograničenja AI workflow-a. Obrazloženje „model je tako predložio“ nije tehničko obrazloženje odluke.', 'warning'),
  ],
  7: (page) => [
    paragraph(page, 'artifacts-p', 'AI artefakti se ocenjuju prema tome da li rešavaju stvaran problem u projektu. Skill, agent ili MCP alat koji postoji samo radi ispunjavanja forme, a ne učestvuje u demonstriranom workflow-u, ne smatra se kvalitetnom integracijom.'),
  ],
  8: (page) => [
    heading(page, 'checkpoint-h', 'Svrha checkpoint-a'),
    paragraph(page, 'checkpoint-p', 'Checkpoint-i služe da se rizik rasporedi kroz semestar. Svaki checkpoint treba da ostavi stanje projekta koje je moguće demonstrirati i nastaviti razvijati. Nedovršeni osnovni slojevi ne treba da se odlažu do završne nedelje kako bi se „nadoknadili“ generisanjem velike količine koda.'),
  ],
  9: (page) => [
    diagram(page, 'change-d', 'Naknadni change request', [
      ['Analiza', 'razumevanje uticaja na postojeća pravila', 'blue'],
      ['Plan', 'promene po slojevima i rizici', 'cyan'],
      ['Implementacija', 'kontrolisane izmene', 'violet'],
      ['Verifikacija', 'test, build i review diff-a', 'amber'],
      ['Izveštaj', 'šta je promenjeno i kako je provereno', 'emerald'],
    ]),
  ],
  10: (page) => [
    heading(page, 'qa-h', 'Peer QA nije formalnost'),
    list(page, 'qa-l', [
      'Reviewer pokušava da reprodukuje jedan važan use-case iz README uputstva.',
      'Pregleda najmanje jedno poslovno pravilo i odgovarajući test.',
      'Proverava da li arhitektonske zavisnosti odgovaraju dokumentovanom dizajnu.',
      'Prijavljuje najmanje jednu konkretnu zapaženu slabost ili eksplicitno obrazlaže zašto nije pronađena.',
    ]),
  ],
  11: (page) => [
    callout(page, 'docs', 'Dokumentacija treba da podrži održavanje projekta', 'README objašnjava pokretanje i demo scenario; architecture dokument objašnjava granice i smer zavisnosti; AI dokumenti objašnjavaju pravila i proverljive workflow-e. Dokumentacija ne treba da ponavlja izvorni kod red po red.', 'note'),
  ],
  12: (page) => [
    heading(page, 'defense-h', 'Šta student treba da može da uradi uživo'),
    list(page, 'defense-l', [
      'Objasni jedan use-case od zahteva do perzistencije i nazad.',
      'Pokaže test koji štiti konkretno poslovno pravilo i objasni zašto je test relevantan.',
      'Objasni jednu SOLID/arhitektonsku odluku i alternativu koja je razmatrana.',
      'Pokrene demonstrirani AI workflow i pokaže na koji način se rezultat proverava.',
      'Izvede malu izmenu zadatu na odbrani bez oslanjanja na unapred pripremljen generisani odgovor.',
    ]),
  ],
  13: (page) => [
    paragraph(page, 'grading-p', 'Bodovi treba da odražavaju kvalitet inženjerskog rada, ne samo broj implementiranih stavki. Posebno se vrednuje konzistentnost između zahteva, arhitekture, koda, testova i načina na koji je AI uveden u proces.'),
  ],
  14: (page) => [
    callout(page, 'integrity', 'Akademska odgovornost', 'Dozvoljena upotreba AI alata ne znači da je dozvoljeno predati nerazumljiv ili neproveren rezultat. Tim je autor predatog rešenja i odgovoran je za tačnost, bezbednost, licencne obaveze i sposobnost da objasni sopstveni rad.', 'warning'),
  ],
}

export function enhanceProjectSpec(source: CourseDocument): CourseDocument {
  const document = clone(source)
  const cover = document.pages[0]
  if (cover) {
    cover.layout = 'cover'
    cover.blocks = cover.blocks.filter((block) => !(block.type === 'callout' && clean(block.title).toLowerCase().includes('primenjeno softversko')))
    if (!cover.blocks.some((block) => block.type === 'institution')) {
      cover.blocks.unshift({
        id: `${cover.id}-institution`,
        type: 'institution',
        university: 'Univerzitet u Novom Sadu',
        faculty: 'Fakultet tehničkih nauka',
        department: 'Primenjeno softversko inženjerstvo · 2026/2027',
        leftLogoSrc: '/brand/university.svg',
        rightLogoSrc: '/brand/ftn.svg',
      })
    }
  }

  let section = 0
  document.pages.forEach((page, index) => {
    if (index === 0) return
    section = detectSection(page, section)
    if (weight(page) >= 900) return
    const factory = additions[section]
    if (!factory) return
    for (const block of factory(page)) {
      if (!page.blocks.some((candidate) => candidate.id === block.id)) page.blocks.push(block)
      if (weight(page) >= 1030) break
    }
  })

  document.updatedAt = '2026-08-25T13:18:00+02:00'
  return document
}
