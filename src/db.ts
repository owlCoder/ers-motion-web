import type { CourseDocument, LibraryEntry } from './types'

const DB_NAME = 'ers-studio'
const STORE = 'documents'
const META = 'meta'
const VERSION = 2

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: 'key' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDocumentLocal(doc: CourseDocument) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(doc)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

export async function loadDocumentLocal(id: string): Promise<CourseDocument | undefined> {
  const db = await openDb()
  const result = await new Promise<CourseDocument | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result as CourseDocument | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return result
}

export async function listDocumentsLocal(): Promise<LibraryEntry[]> {
  const db = await openDb()
  const docs = await new Promise<CourseDocument[]>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result as CourseDocument[])
    req.onerror = () => reject(req.error)
  })
  db.close()
  return docs
    .map((d) => ({ id: d.id, title: d.title, kind: d.kind, updatedAt: d.updatedAt }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function deleteDocumentLocal(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await openDb()
  const result = await new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(META, 'readonly')
    const req = tx.objectStore(META).get(key)
    req.onsuccess = () => resolve(req.result?.value as T | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return result
}

export async function setMeta<T>(key: string, value: T) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(META, 'readwrite')
    tx.objectStore(META).put({ key, value })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}
