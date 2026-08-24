import practicumPart1 from './seeds/praktikum.part1.txt?raw'
import practicumChunk02 from './seeds/praktikum.chunk02.txt?raw'
import practicumChunk03 from './seeds/praktikum.chunk03.txt?raw'
import practicumChunk04 from './seeds/praktikum.chunk04.txt?raw'
import practicumChunk05 from './seeds/praktikum.chunk05.txt?raw'
import practicumChunk06 from './seeds/praktikum.chunk06.txt?raw'
import practicumChunk07 from './seeds/praktikum.chunk07.txt?raw'
import practicumChunk08 from './seeds/praktikum.chunk08.txt?raw'
import practicumChunk09 from './seeds/praktikum.chunk09.txt?raw'
import practicumChunk10 from './seeds/praktikum.chunk10.txt?raw'
import projectSpecJson from './seeds/project-spec.json'
import type { CourseDocument } from './types'
import { clone, uid } from './utils'

const practicumJson = JSON.parse(
  practicumPart1 +
  practicumChunk02 +
  practicumChunk03 +
  practicumChunk04 +
  practicumChunk05 +
  practicumChunk06 +
  practicumChunk07 +
  practicumChunk08 +
  practicumChunk09 +
  practicumChunk10,
) as CourseDocument

export const bundledDocuments: CourseDocument[] = [
  practicumJson,
  projectSpecJson as CourseDocument,
]

export function freshDocument(): CourseDocument {
  const now = new Date().toISOString()
  return {
    version: 2,
    id: uid('doc'),
    title: 'Novi dokument',
    subtitle: 'Elementi razvoja softvera',
    subject: 'Elementi razvoja softvera',
    kind: 'dokument',
    headerText: 'Elementi razvoja softvera',
    footerText: 'Primenjeno softversko inženjerstvo',
    createdAt: now,
    updatedAt: now,
    theme: { name: 'Academic Light', font: 'System', accent: 'blue', density: 'comfortable', codeTheme: 'light', pageSize: 'A4' },
    pages: [{
      id: uid('page'),
      label: 'Naslovna',
      blocks: [
        { id: uid('block'), type: 'text', variant: 'title', html: 'Novi dokument', align: 'center' },
        { id: uid('block'), type: 'text', variant: 'subtitle', html: 'Elementi razvoja softvera', align: 'center' },
        { id: uid('block'), type: 'text', variant: 'paragraph', html: 'Dodajte sadržaj koristeći blokove iz donje alatne trake.' },
      ],
    }],
  }
}

export function duplicateAsNew(doc: CourseDocument): CourseDocument {
  const copy = clone(doc)
  const now = new Date().toISOString()
  copy.id = uid('doc')
  copy.title = `${copy.title} — kopija`
  copy.createdAt = now
  copy.updatedAt = now
  copy.pages = copy.pages.map((p) => ({ ...p, id: uid('page'), blocks: p.blocks.map((b) => ({ ...b, id: uid('block') })) }))
  return copy
}
