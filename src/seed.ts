import type { CourseDocument } from './types'
import { practicum2026 } from './content/canvaPracticum'
import { projectSpec2026Reflowed } from './content/projectSpecReflow'
import { clone, uid } from './utils'

export const bundledDocuments: CourseDocument[] = [
  practicum2026,
  projectSpec2026Reflowed,
]

export const CURRENT_BUNDLED_IDS = new Set(bundledDocuments.map((document) => document.id))

export function freshDocument(): CourseDocument {
  const now = new Date().toISOString()
  return {
    version: 2,
    id: uid('doc'),
    title: 'New document',
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
      label: 'Cover',
      blocks: [
        { id: uid('block'), type: 'text', variant: 'title', html: 'New document', align: 'center' },
        { id: uid('block'), type: 'text', variant: 'subtitle', html: 'Elementi razvoja softvera', align: 'center' },
        { id: uid('block'), type: 'text', variant: 'paragraph', html: 'Add content from the Insert tab.' },
      ],
    }],
  }
}

export function duplicateAsNew(doc: CourseDocument): CourseDocument {
  const copy = clone(doc)
  const now = new Date().toISOString()
  copy.id = uid('doc')
  copy.kind = 'dokument'
  copy.title = `${copy.title} — copy`
  copy.createdAt = now
  copy.updatedAt = now
  copy.pages = copy.pages.map((p) => ({ ...p, id: uid('page'), blocks: p.blocks.map((b) => ({ ...b, id: uid('block') })) }))
  return copy
}
