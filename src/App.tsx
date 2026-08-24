import { useEffect, useMemo, useRef, useState } from 'react'
import type { Block, CourseDocument, DocumentPage, LibraryEntry } from './types'
import { bundledDocuments, duplicateAsNew, freshDocument } from './seed'
import { deleteDocumentLocal, getMeta, listDocumentsLocal, loadDocumentLocal, saveDocumentLocal, setMeta } from './db'
import { openDocumentFromDisk, saveDocumentToDisk } from './fileIO'
import { clone, emptyPage, pageLabel, textFromHtml, touch, uid } from './utils'
import { Icon } from './components/Icon'
import { Inspector } from './components/Inspector'
import { PageCanvas } from './components/PageCanvas'
import { Presentation } from './components/Presentation'
import './styles.css'
import './professional.css'

const SEED_VERSION = 4

function kindLabel(kind: CourseDocument['kind']) {
  return ({ praktikum: 'Praktikum', specifikacija: 'Specifikacija', skripta: 'Skripta', dokument: 'Dokument' } as const)[kind]
}

function pageOutlineTitle(page: DocumentPage, index: number) {
  const h1 = page.blocks.find((b) => b.type === 'text' && (b.variant === 'title' || b.variant === 'h1'))
  if (h1?.type === 'text') return textFromHtml(h1.html)
  if (page.layout === 'cover') return page.label || 'Naslovna'
  return page.label || `Strana ${index + 1}`
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
  const canvasRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])

  const refreshLibrary = async () => setLibrary(await listDocumentsLocal())

  useEffect(() => {
    ;(async () => {
      try {
        const seeded = await getMeta<number>('seedVersion')
        if (seeded !== SEED_VERSION) {
          for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed))
          await setMeta('seedVersion', SEED_VERSION)
        }
        await refreshLibrary()
        const lastId = await getMeta<string>('lastDocumentId')
        const initial = (lastId && await loadDocumentLocal(lastId)) || await loadDocumentLocal(bundledDocuments[0].id) || bundledDocuments[0]
        setDoc(initial)
        setStatus('Sačuvano')
      } catch (error) {
        console.error(error)
        setDoc(bundledDocuments[0])
        setStatus('Lokalno čuvanje nije dostupno')
      }
    })()
  }, [])

  useEffect(() => {
    if (!doc) return
    setStatus('Čuvanje…')
    const timer = window.setTimeout(async () => {
      try {
        await saveDocumentLocal(doc)
        await setMeta('lastDocumentId', doc.id)
        setStatus('Sačuvano')
        refreshLibrary()
      } catch (e) {
        console.error(e)
        setStatus('Greška pri čuvanju')
      }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [doc])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (doc) saveDocumentToDisk(doc).then(() => showToast('Dokument je sačuvan.')).catch(() => showToast('Čuvanje je otkazano.'))
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault(); window.print()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doc])

  useEffect(() => {
    if (!doc || !canvasRef.current) return
    const root = canvasRef.current
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      const next = Number((visible.target as HTMLElement).dataset.pageIndex)
      if (Number.isFinite(next)) setPageIndex(next)
    }, { root, threshold: [0.22, 0.4, 0.6, 0.8] })

    pageRefs.current.slice(0, doc.pages.length).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [doc?.id, doc?.pages.length, zoom])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const currentPage = doc?.pages[pageIndex]
  const selectedBlock = useMemo(() => currentPage?.blocks.find((b) => b.id === selectedBlockId), [currentPage, selectedBlockId])
  const outline = useMemo(() => {
    if (!doc) return []
    return doc.pages.map((page, index) => ({ page, index, title: pageOutlineTitle(page, index) })).filter(({ page, index }) => {
      if (index === 0) return true
      return page.blocks.some((b) => b.type === 'text' && b.variant === 'h1')
    })
  }, [doc])

  const patchDoc = (next: CourseDocument) => setDoc(touch(next))
  const updatePageAt = (index: number, page: DocumentPage) => {
    if (!doc) return
    patchDoc({ ...doc, pages: doc.pages.map((p, i) => i === index ? page : p) })
  }
  const updateBlock = (block: Block) => {
    if (!currentPage) return
    updatePageAt(pageIndex, { ...currentPage, blocks: currentPage.blocks.map((b) => b.id === block.id ? block : b) })
  }

  const scrollToPage = (index: number, behavior: ScrollBehavior = 'smooth') => {
    setPageIndex(index)
    setSelectedBlockId(undefined)
    window.requestAnimationFrame(() => pageRefs.current[index]?.scrollIntoView({ behavior, block: 'start' }))
  }

  const loadDoc = async (id: string) => {
    const loaded = await loadDocumentLocal(id)
    if (!loaded) return
    setDoc(loaded); setPageIndex(0); setSelectedBlockId(undefined); setInspectorOpen(true)
    await setMeta('lastDocumentId', id)
    window.requestAnimationFrame(() => canvasRef.current?.scrollTo({ top: 0, behavior: 'auto' }))
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
      setDoc(opened); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary(); showToast('Dokument je otvoren.')
    } catch (e) {
      console.error(e); showToast('Izabrani fajl nije validan dokument.')
    }
  }

  const restoreSeeds = async () => {
    for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed))
    await refreshLibrary()
    const restored = bundledDocuments.find((seed) => seed.id === doc?.id)
    if (restored) setDoc(clone(restored))
    showToast('Početni materijali su vraćeni.')
  }

  const addPage = () => {
    if (!doc) return
    const pages = [...doc.pages]
    pages.splice(pageIndex + 1, 0, emptyPage())
    patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(pageIndex + 1), 20)
  }
  const duplicatePage = () => {
    if (!doc || !currentPage) return
    const page = clone(currentPage); page.id = uid('page'); page.blocks = page.blocks.map((b) => ({ ...b, id: uid('block') }))
    const pages = [...doc.pages]; pages.splice(pageIndex + 1, 0, page); patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(pageIndex + 1), 20)
  }
  const deletePage = () => {
    if (!doc || doc.pages.length <= 1 || !confirm('Obrisati ovu stranicu?')) return
    const nextIndex = Math.min(pageIndex, doc.pages.length - 2)
    const pages = doc.pages.filter((_, i) => i !== pageIndex); patchDoc({ ...doc, pages }); setSelectedBlockId(undefined)
    window.setTimeout(() => scrollToPage(nextIndex, 'auto'), 20)
  }
  const movePage = (direction: -1 | 1) => {
    if (!doc) return
    const to = pageIndex + direction
    if (to < 0 || to >= doc.pages.length) return
    const pages = [...doc.pages]; [pages[pageIndex], pages[to]] = [pages[to], pages[pageIndex]]; patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(to, 'auto'), 20)
  }

  if (!doc || !currentPage) return <div className="splash"><div className="brand-mark">ERS</div><p>Otvaranje editora…</p></div>

  return (
    <div className="app-shell">
      <header className="topbar no-print">
        <div className="topbar-left">
          <button className="icon-btn" onClick={() => setSidebarOpen((v) => !v)} title="Dokumenti i sadržaj"><Icon name="menu" /></button>
          <div className="brand"><span className="brand-symbol">E</span><div><b>ERS Studio</b><small>Nastavni materijali</small></div></div>
          <div className="document-chip"><span className={`kind-dot kind-${doc.kind}`} /> <span>{doc.title}</span></div>
        </div>
        <div className="topbar-actions">
          <button onClick={newDoc}><Icon name="plus" size={16} /> Novi</button>
          <button onClick={openFromDisk}><Icon name="open" size={16} /> Otvori</button>
          <button onClick={() => saveDocumentToDisk(doc).then(() => showToast('Dokument je sačuvan.')).catch(() => {})}><Icon name="save" size={16} /> Sačuvaj</button>
          <span className="toolbar-separator" />
          <button onClick={() => window.print()}><Icon name="print" size={16} /> Izvezi PDF</button>
          <button className="primary" onClick={() => setPresenting(true)}><Icon name="play" size={16} /> Režim prikaza</button>
          <button className={`icon-btn ${inspectorOpen ? 'active' : ''}`} onClick={() => setInspectorOpen((v) => !v)} title="Podešavanja"><Icon name="settings" /></button>
        </div>
      </header>

      <div className="editor-grid">
        {sidebarOpen && <aside className="sidebar no-print">
          <div className="sidebar-section library-head">
            <div><b>Dokumenti</b><span>{library.length} sačuvano lokalno</span></div>
            <button className="icon-btn small" onClick={newDoc} title="Novi dokument"><Icon name="plus" size={15} /></button>
          </div>
          <div className="doc-list">
            {library.map((entry) => <button key={entry.id} className={`doc-list-item ${entry.id === doc.id ? 'active' : ''}`} onClick={() => loadDoc(entry.id)}>
              <span className="doc-icon"><Icon name="file" size={17} /></span>
              <span className="doc-list-text"><b>{entry.title}</b><small>{kindLabel(entry.kind)} · {new Date(entry.updatedAt).toLocaleDateString('sr-RS')}</small></span>
            </button>)}
          </div>
          <div className="library-tools">
            <button onClick={duplicateDoc}><Icon name="copy" size={14} /> Napravi kopiju</button>
            <button onClick={restoreSeeds}><Icon name="undo" size={14} /> Vrati početnu verziju</button>
            <button className="danger-text" onClick={removeDoc}><Icon name="trash" size={14} /> Obriši dokument</button>
          </div>

          <div className="sidebar-section outline-head"><div><b>Sadržaj</b><span>Navigacija kroz dokument</span></div></div>
          <nav className="outline-list">
            {outline.map(({ page, index, title }) => <button key={page.id} className={index === pageIndex ? 'active' : ''} onClick={() => scrollToPage(index)}>
              <span className="outline-number">{index + 1}</span><span>{title}</span>
            </button>)}
          </nav>
        </aside>}

        <main className="workspace-panel">
          <div className="workspace-toolbar no-print">
            <div className="page-breadcrumb"><span>{kindLabel(doc.kind)}</span><Icon name="chevron" size={12} /><b>Strana {pageIndex + 1} od {doc.pages.length}</b><span className="breadcrumb-title">{pageLabel(currentPage, pageIndex)}</span></div>
            <div className="workspace-actions">
              <div className="page-inline-actions">
                <button onClick={() => movePage(-1)} disabled={pageIndex === 0} title="Pomeri stranicu gore"><Icon name="up" size={14} /></button>
                <button onClick={() => movePage(1)} disabled={pageIndex === doc.pages.length - 1} title="Pomeri stranicu dole"><Icon name="down" size={14} /></button>
                <button onClick={addPage} title="Dodaj stranicu"><Icon name="plus" size={14} /></button>
                <button onClick={duplicatePage} title="Kopiraj stranicu"><Icon name="copy" size={14} /></button>
                <button onClick={deletePage} disabled={doc.pages.length <= 1} title="Obriši stranicu"><Icon name="trash" size={14} /></button>
              </div>
              <div className="zoom-control"><button onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.08).toFixed(2)))}>−</button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom((z) => Math.min(1.1, +(z + 0.08).toFixed(2)))}>+</button></div>
            </div>
          </div>

          <div ref={canvasRef} className="canvas-scroller" onClick={() => { setSelectedBlockId(undefined); setInspectorOpen(true) }}>
            <div className="document-stack">
              {doc.pages.map((page, index) => (
                <div
                  key={page.id}
                  ref={(el) => { pageRefs.current[index] = el }}
                  data-page-index={index}
                  className={`page-stack-item ${index === pageIndex ? 'active' : ''}`}
                  onMouseDown={() => setPageIndex(index)}
                >
                  <div className="scaled-page" style={{ zoom }}>
                    <PageCanvas
                      doc={doc}
                      page={page}
                      pageIndex={index}
                      selectedBlockId={index === pageIndex ? selectedBlockId : undefined}
                      onSelectBlock={(id) => { setPageIndex(index); setSelectedBlockId(id); if (id) setInspectorOpen(true) }}
                      onUpdatePage={(next) => updatePageAt(index, next)}
                      onOpenDocumentSettings={() => { setPageIndex(index); setInspectorOpen(true) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="statusbar no-print"><span><span className="status-dot" /> {status}</span><span>A4 · {Math.round(zoom * 100)}% · Strana {pageIndex + 1}/{doc.pages.length}</span></div>
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
