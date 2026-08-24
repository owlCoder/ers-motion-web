import type { CourseDocument } from './types'

function safeName(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9čćžšđČĆŽŠĐ_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 90) || 'ers-dokument'
}

export async function openDocumentFromDisk(): Promise<CourseDocument | null> {
  const w = window as Window & { showOpenFilePicker?: Function }
  if (w.showOpenFilePicker) {
    const [handle] = await w.showOpenFilePicker({
      types: [{ description: 'ERS Studio dokument', accept: { 'application/json': ['.ersdoc.json', '.json'] } }],
      multiple: false,
    })
    const file = await handle.getFile()
    return validate(JSON.parse(await file.text()))
  }

  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.ersdoc.json,application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      try {
        resolve(validate(JSON.parse(await file.text())))
      } catch {
        resolve(null)
      }
    }
    input.click()
  })
}

function validate(value: unknown): CourseDocument {
  const doc = value as CourseDocument
  if (!doc || doc.version !== 2 || !Array.isArray(doc.pages) || typeof doc.title !== 'string') {
    throw new Error('Fajl nije validan ERS Studio dokument.')
  }
  return doc
}

export async function saveDocumentToDisk(doc: CourseDocument) {
  const data = JSON.stringify(doc, null, 2)
  const w = window as Window & { showSaveFilePicker?: Function }
  if (w.showSaveFilePicker) {
    const handle = await w.showSaveFilePicker({
      suggestedName: `${safeName(doc.title)}.ersdoc.json`,
      types: [{ description: 'ERS Studio dokument', accept: { 'application/json': ['.ersdoc.json'] } }],
    })
    const writable = await handle.createWritable()
    await writable.write(data)
    await writable.close()
    return
  }
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName(doc.title)}.ersdoc.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportHtmlSnapshot(doc: CourseDocument, html: string) {
  const blob = new Blob([`<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>${doc.title}</title></head><body>${html}</body></html>`], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeName(doc.title)}.html`
  a.click()
  URL.revokeObjectURL(url)
}
