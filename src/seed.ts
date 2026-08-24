import practicumJson from './seeds/praktikum.json'
import projectSpecJson from './seeds/project-spec.json'
import type { CourseDocument } from './types'
import { clone, uid } from './utils'

export const bundledDocuments: CourseDocument[] = [practicumJson as CourseDocument, projectSpecJson as CourseDocument]

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
