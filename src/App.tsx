import { useEffect, useMemo, useState } from 'react'
import type { Block, CourseDocument, DocumentPage, LibraryEntry } from './types'
import { bundledDocuments, duplicateAsNew, freshDocument } from './seed'
import { deleteDocumentLocal, getMeta, listDocumentsLocal, loadDocumentLocal, saveDocumentLocal, setMeta } from './db'
import { openDocumentFromDisk, saveDocumentToDisk } from './fileIO'
import { clone, emptyPage, pageLabel, touch, uid } from './utils'
import { Icon } from './components/Icon'
import { Inspector } from './components/Inspector'
import { PageCanvas } from './components/PageCanvas'
import { Presentation } from './components/Presentation'
import './styles.css'

const SEED_VERSION = 3

function kindLabel(kind: CourseDocument['kind']) {
  return ({ praktikum: 'Praktikum', specifikacija: 'Specifikacija', skripta: 'Skripta', dokument: 'Dokument' } as const)[kind]
}

export default function App() {
  const [doc, setDoc] = useState<CourseDocument | null>(null)
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [zoom, setZoom] = useState(0.82)
  const [presenting, setPresenting] = useState(false)
  const [status, setStatus] = useState('Pokretanje…')
  const [toast, setToast] = useState<string | null>(null)

  const refreshLibrary = async () => setLibrary(await listDocumentsLocal())

  useEffect(() => {
    ;(async () => {
      try {
        const seeded = await getMeta<number>('seedVersion')
        if (seeded !== SEED_VERSION) {
          for (const seed of bundledDocuments) {
            const existing = await loadDocumentLocal(seed.id)
            if (!existing || seeded == null) await saveDocumentLocal(seed)
          }
          await setMeta('seedVersion', SEED_VERSION)
        }
        await refreshLibrary()
        const lastId = await getMeta<string>('lastDocumentId')
        const initial = (lastId && await loadDocumentLocal(lastId)) || await loadDocumentLocal(bundledDocuments[0].id) || bundledDocuments[0]
        setDoc(initial)
        setStatus('Sačuvano lokalno')
      } catch (error) {
        console.error(error)
        setDoc(bundledDocuments[0])
        setStatus('Lokalna baza nije dostupna')
      }
    })()
  }, [])

  useEffect(() => {
    if (!doc) return
    setStatus('Izmene…')
    const timer = window.setTimeout(async () => {
      try {
        await saveDocumentLocal(doc)
        await setMeta('lastDocumentId', doc.id)
        setStatus('Sačuvano lokalno')
        refreshLibrary()
      } catch (e) {
        console.error(e)
        setStatus('Greška pri autosave-u')
      }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [doc])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (doc) saveDocumentToDisk(doc).then(() => showToast('Dokument je sačuvan na disk.')).catch(() => showToast('Čuvanje je otkazano.'))
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault(); window.print()
      }
    }
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler)
  }, [doc])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const currentPage = doc?.pages[pageIndex]
  const selectedBlock = useMemo(() => currentPage?.blocks.find((b) => b.id === selectedBlockId), [currentPage, selectedBlockId])

  const patchDoc = (next: CourseDocument) => setDoc(touch(next))
  const updatePage = (page: DocumentPage) => {
    if (!doc) return
    patchDoc({ ...doc, pages: doc.pages.map((p, i) => i === pageIndex ? page : p) })
  }
  const updateBlock = (block: Block) => {
    if (!currentPage) return
    updatePage({ ...currentPage, blocks: currentPage.blocks.map((b) => b.id === block.id ? block : b) })
  }

  const loadDoc = async (id: string) => {
    const loaded = await loadDocumentLocal(id)
    if (!loaded) return
    setDoc(loaded); setPageIndex(0); setSelectedBlockId(undefined); setInspectorOpen(true)
    await setMeta('lastDocumentId', id)
  }

  const newDoc = async () => {
    const next = freshDocument(); await saveDocumentLocal(next); setDoc(next); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary()
  }

  const duplicateDoc = async () => {
    if (!doc) return
    const next = duplicateAsNew(doc); await saveDocumentLocal(next); setDoc(next); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary(); showToast('Kreirana je kopija dokumenta.')
  }

  const removeDoc = async () => {
    if (!doc || !confirm(`Obrisati dokument „${doc.title}“ iz lokalne biblioteke?`)) return
    await deleteDocumentLocal(doc.id)
    await refreshLibrary()
    const remaining = (await listDocumentsLocal())[0]
    if (remaining) await loadDoc(remaining.id)
    else await newDoc()
  }

  const openFromDisk = async () => {
    try {
      const opened = await openDocumentFromDisk()
      if (!opened) return
      opened.updatedAt = new Date().toISOString()
      await saveDocumentLocal(opened)
      setDoc(opened); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary(); showToast('Dokument je otvoren i dodat u lokalnu biblioteku.')
    } catch (e) {
      console.error(e); showToast('Fajl nije validan ERS Studio dokument.')
    }
  }

  const restoreSeeds = async () => {
    for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed))
    await refreshLibrary(); showToast('Početni praktikum i projektna specifikacija su vraćeni.')
  }

  const addPage = () => {
    if (!doc) return
    const pages = [...doc.pages]; pages.splice(pageIndex + 1, 0, emptyPage()); patchDoc({ ...doc, pages }); setPageIndex(pageIndex + 1); setSelectedBlockId(undefined)
  }
  const duplicatePage = () => {
    if (!doc || !currentPage) return
    const page = clone(currentPage); page.id = uid('page'); page.blocks = page.blocks.map((b) => ({ ...b, id: uid('block') }));
    const pages = [...doc.pages]; pages.splice(pageIndex + 1, 0, page); patchDoc({ ...doc, pages }); setPageIndex(pageIndex + 1); setSelectedBlockId(undefined)
  }
  const deletePage = () => {
    if (!doc || doc.pages.length <= 1 || !confirm('Obrisati ovu stranicu?')) return
    const pages = doc.pages.filter((_, i) => i !== pageIndex); patchDoc({ ...doc, pages }); setPageIndex(Math.min(pageIndex, pages.length - 1)); setSelectedBlockId(undefined)
  }
  const movePage = (direction: -1 | 1) => {
    if (!doc) return
    const to = pageIndex + direction
    if (to < 0 || to >= doc.pages.length) return
    const pages = [...doc.pages]; [pages[pageIndex], pages[to]] = [pages[to], pages[pageIndex]]; patchDoc({ ...doc, pages }); setPageIndex(to)
  }

  if (!doc || !currentPage) return <div className="splash"><div className="brand-mark">ERS</div><p>Pokretanje ERS Studio editora…</p></div>

  return (
    <div className="app-shell">
      <header className="topbar no-print">
        <div className="topbar-left">
          <button className="icon-btn" onClick={() => setSidebarOpen((v) => !v)} title="Biblioteka"><Icon name="menu" /></button>
          <div className="brand"><span className="brand-symbol">E</span><div><b>ERS Studio</b><small>univerzalni editor materijala</small></div></div>
          <div className="document-chip"><span className={`kind-dot kind-${doc.kind}`} /> <span>{doc.title}</span></div>
        </div>
        <div className="topbar-actions">
          <button onClick={newDoc}><Icon name="plus" size={16} /> Novi</button>
          <button onClick={openFromDisk}><Icon name="open" size={16} /> Otvori</button>
          <button onClick={() => saveDocumentToDisk(doc).then(() => showToast('Dokument je sačuvan na disk.')).catch(() => {})}><Icon name="save" size={16} /> Sačuvaj</button>
          <span className="toolbar-separator" />
          <button onClick={() => window.print()}><Icon name="print" size={16} /> PDF</button>
          <button className="primary" onClick={() => setPresenting(true)}><Icon name="play" size={16} /> Prikaži</button>
          <button className={`icon-btn ${inspectorOpen ? 'active' : ''}`} onClick={() => setInspectorOpen((v) => !v)} title="Inspector"><Icon name="settings" /></button>
        </div>
      </header>

      <div className="editor-grid">
        {sidebarOpen && <aside className="sidebar no-print">
          <div className="sidebar-section library-head">
            <div><b>Dokumenti</b><span>{library.length} u biblioteci</span></div>
            <button className="icon-btn small" onClick={newDoc} title="Novi dokument"><Icon name="plus" size={15} /></button>
          </div>
          <div className="doc-list">
            {library.map((entry) => <button key={entry.id} className={`doc-list-item ${entry.id === doc.id ? 'active' : ''}`} onClick={() => loadDoc(entry.id)}>
              <span className="doc-icon"><Icon name="file" size={17} /></span>
              <span className="doc-list-text"><b>{entry.title}</b><small>{kindLabel(entry.kind)} · {new Date(entry.updatedAt).toLocaleDateString('sr-RS')}</small></span>
            </button>)}
          </div>
          <div className="library-tools">
            <button onClick={duplicateDoc}><Icon name="copy" size={14} /> Kopiraj dokument</button>
            <button onClick={restoreSeeds}><Icon name="undo" size={14} /> Vrati početne materijale</button>
            <button className="danger-text" onClick={removeDoc}><Icon name="trash" size={14} /> Obriši dokument</button>
          </div>

          <div className="sidebar-section pages-head"><div><b>Stranice</b><span>{doc.pages.length} A4</span></div><button className="icon-btn small" onClick={addPage}><Icon name="plus" size={15} /></button></div>
          <div className="page-list">
            {doc.pages.map((page, i) => <button key={page.id} className={`page-list-item ${i === pageIndex ? 'active' : ''}`} onClick={() => { setPageIndex(i); setSelectedBlockId(undefined) }}>
              <span className="page-mini"><span>{i + 1}</span></span>
              <span>{pageLabel(page, i)}</span>
            </button>)}
          </div>
          <div className="page-tools">
            <button onClick={() => movePage(-1)} disabled={pageIndex === 0}><Icon name="up" size={14} /></button>
            <button onClick={() => movePage(1)} disabled={pageIndex === doc.pages.length - 1}><Icon name="down" size={14} /></button>
            <button onClick={duplicatePage}><Icon name="copy" size={14} /></button>
            <button onClick={deletePage} disabled={doc.pages.length <= 1}><Icon name="trash" size={14} /></button>
          </div>
        </aside>}

        <main className="workspace-panel">
          <div className="workspace-toolbar no-print">
            <div className="page-breadcrumb"><span>{kindLabel(doc.kind)}</span><Icon name="chevron" size={12} /><b>{pageIndex + 1}. {pageLabel(currentPage, pageIndex)}</b></div>
            <div className="zoom-control"><button onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.08).toFixed(2)))}>−</button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom((z) => Math.min(1.1, +(z + 0.08).toFixed(2)))}>+</button></div>
          </div>
          <div className="canvas-scroller" onClick={() => { setSelectedBlockId(undefined); setInspectorOpen(true) }}>
            <div className="scaled-page" style={{ zoom }}>
              <PageCanvas doc={doc} page={currentPage} pageIndex={pageIndex} selectedBlockId={selectedBlockId} onSelectBlock={(id) => { setSelectedBlockId(id); if (id) setInspectorOpen(true) }} onUpdatePage={updatePage} onOpenDocumentSettings={() => setInspectorOpen(true)} />
            </div>
          </div>
          <div className="statusbar no-print"><span><span className="status-dot" /> {status}</span><span>A4 · {doc.theme.name} · Code: Light</span></div>
        </main>

        {inspectorOpen && <Inspector doc={doc} block={selectedBlock} onDocumentChange={patchDoc} onBlockChange={updateBlock} onClose={() => setInspectorOpen(false)} />}
      </div>

      <div className="print-only print-document">
        {doc.pages.map((page, i) => <PageCanvas key={page.id} doc={doc} page={page} pageIndex={i} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />)}
      </div>

      {presenting && <Presentation doc={doc} startPage={pageIndex} onClose={() => setPresenting(false)} />}
      {toast && <div className="toast no-print">{toast}</div>}
    </div>
  )
}
