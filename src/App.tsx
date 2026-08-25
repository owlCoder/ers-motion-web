import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  Caption1,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Divider,
  makeStyles,
  mergeClasses,
  Text,
  Toaster,
  Toast,
  ToastTitle,
  tokens,
  Tooltip,
  useId,
  useToastController,
} from '@fluentui/react-components'
import type { Block, CourseDocument, DocumentPage, LibraryEntry } from './types'
import { bundledDocuments, duplicateAsNew, freshDocument } from './seed'
import { deleteDocumentLocal, getMeta, listDocumentsLocal, loadDocumentLocal, saveDocumentLocal, setMeta } from './db'
import { openDocumentFromDisk, saveDocumentToDisk } from './fileIO'
import { clone, emptyPage, pageLabel, textFromHtml, touch, uid } from './utils'
import { Icon } from './components/Icon'
import { Inspector } from './components/Inspector'
import { PageCanvas } from './components/PageCanvas'
import { Presentation } from './components/Presentation'

const SEED_VERSION = 4

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  topbar: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
    position: 'relative',
    zIndex: 20,
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM, minWidth: 0 },
  topbarActions: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  brand: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, minWidth: '150px' },
  brandMark: {
    width: '32px', height: '32px', borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand,
    display: 'grid', placeItems: 'center', fontWeight: 700,
  },
  brandCopy: { display: 'flex', flexDirection: 'column', lineHeight: 1.15 },
  docIdentity: {
    display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS,
    minWidth: 0, maxWidth: '360px', paddingLeft: tokens.spacingHorizontalM,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  docTitle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  editorGrid: { height: 'calc(100vh - 64px)', display: 'grid', minWidth: 0 },
  sidebar: {
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarHeader: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  sidebarTitleBlock: { display: 'flex', flexDirection: 'column', gap: '2px' },
  libraryList: { display: 'flex', flexDirection: 'column', gap: '2px', padding: `0 ${tokens.spacingHorizontalS}` },
  libraryItem: {
    width: '100%', justifyContent: 'flex-start', textAlign: 'left', height: 'auto', minHeight: '52px',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
  },
  libraryItemActive: { backgroundColor: tokens.colorBrandBackground2 },
  libraryItemText: { display: 'flex', flexDirection: 'column', minWidth: 0, alignItems: 'flex-start' },
  truncated: { maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sidebarActions: { display: 'flex', flexDirection: 'column', padding: tokens.spacingHorizontalS, gap: '2px' },
  sidebarAction: { justifyContent: 'flex-start' },
  dangerAction: { color: tokens.colorPaletteRedForeground1 },
  outline: { display: 'flex', flexDirection: 'column', gap: '2px', padding: `0 ${tokens.spacingHorizontalS} ${tokens.spacingVerticalL}` },
  outlineItem: { width: '100%', justifyContent: 'flex-start', textAlign: 'left', height: 'auto', minHeight: '34px' },
  outlineItemActive: { backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 },
  outlineNumber: { width: '24px', flexShrink: 0, color: tokens.colorNeutralForeground3, fontVariantNumeric: 'tabular-nums' },
  workspace: { minWidth: 0, minHeight: 0, display: 'grid', gridTemplateRows: '48px minmax(0, 1fr) 28px', backgroundColor: tokens.colorNeutralBackground3 },
  workspaceToolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: `0 ${tokens.spacingHorizontalM}`, backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, minWidth: 0 },
  toolbarGroup: { display: 'flex', alignItems: 'center', gap: '2px' },
  zoomLabel: { minWidth: '48px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  canvas: { minHeight: 0, overflow: 'auto', scrollBehavior: 'smooth', backgroundColor: '#6b6f74' },
  documentStack: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', padding: '28px 32px 64px' },
  pageItem: { flex: '0 0 auto', outline: '2px solid transparent', outlineOffset: '4px', borderRadius: tokens.borderRadiusSmall },
  activePage: { outlineColor: tokens.colorBrandStroke2 },
  statusbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${tokens.spacingHorizontalM}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`, backgroundColor: tokens.colorNeutralBackground1,
  },
  statusLeft: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#107c10' },
  printOnly: { display: 'none' },
  noPrint: { '@media print': { display: 'none !important' } },
  printDocument: { '@media print': { display: 'block' } },
  dialogText: { color: tokens.colorNeutralForeground2 },
})

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
  const styles = useStyles()
  const [doc, setDoc] = useState<CourseDocument | null>(null)
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [zoom, setZoom] = useState(0.82)
  const [presenting, setPresenting] = useState(false)
  const [status, setStatus] = useState('Pokretanje…')
  const [deleteTarget, setDeleteTarget] = useState<'document' | 'page' | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])
  const toasterId = useId('ers-toaster')
  const { dispatchToast } = useToastController(toasterId)

  const notify = (message: string, intent: 'success' | 'error' | 'info' = 'success') => {
    dispatchToast(<Toast><ToastTitle>{message}</ToastTitle></Toast>, { intent })
  }

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
      } catch (error) {
        console.error(error)
        setStatus('Greška pri čuvanju')
      }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [doc])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (doc) saveDocumentToDisk(doc).then(() => notify('Dokument je sačuvan.')).catch(() => notify('Čuvanje je otkazano.', 'info'))
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        window.print()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doc])

  useEffect(() => {
    if (!doc || !canvasRef.current) return
    const root = canvasRef.current
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      const next = Number((visible.target as HTMLElement).dataset.pageIndex)
      if (Number.isFinite(next)) setPageIndex(next)
    }, { root, threshold: [0.22, 0.4, 0.6, 0.8] })

    pageRefs.current.slice(0, doc.pages.length).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [doc?.id, doc?.pages.length, zoom])

  const currentPage = doc?.pages[pageIndex]
  const selectedBlock = useMemo(() => currentPage?.blocks.find((b) => b.id === selectedBlockId), [currentPage, selectedBlockId])
  const outline = useMemo(() => {
    if (!doc) return []
    return doc.pages.map((page, index) => ({ page, index, title: pageOutlineTitle(page, index) })).filter(({ page, index }) => index === 0 || page.blocks.some((b) => b.type === 'text' && b.variant === 'h1'))
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
    setDoc(loaded)
    setPageIndex(0)
    setSelectedBlockId(undefined)
    setInspectorOpen(true)
    await setMeta('lastDocumentId', id)
    window.requestAnimationFrame(() => canvasRef.current?.scrollTo({ top: 0, behavior: 'auto' }))
  }

  const newDoc = async () => {
    const next = freshDocument()
    await saveDocumentLocal(next)
    setDoc(next)
    setPageIndex(0)
    setSelectedBlockId(undefined)
    await refreshLibrary()
  }

  const duplicateDoc = async () => {
    if (!doc) return
    const next = duplicateAsNew(doc)
    await saveDocumentLocal(next)
    setDoc(next)
    setPageIndex(0)
    setSelectedBlockId(undefined)
    await refreshLibrary()
    notify('Kreirana je kopija dokumenta.')
  }

  const confirmRemoveDoc = async () => {
    if (!doc) return
    await deleteDocumentLocal(doc.id)
    await refreshLibrary()
    const remaining = (await listDocumentsLocal())[0]
    if (remaining) await loadDoc(remaining.id)
    else await newDoc()
    setDeleteTarget(null)
    notify('Dokument je obrisan.', 'info')
  }

  const openFromDisk = async () => {
    try {
      const opened = await openDocumentFromDisk()
      if (!opened) return
      opened.updatedAt = new Date().toISOString()
      await saveDocumentLocal(opened)
      setDoc(opened)
      setPageIndex(0)
      setSelectedBlockId(undefined)
      await refreshLibrary()
      notify('Dokument je otvoren.')
    } catch (error) {
      console.error(error)
      notify('Izabrani fajl nije validan dokument.', 'error')
    }
  }

  const restoreSeeds = async () => {
    for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed))
    await refreshLibrary()
    const restored = bundledDocuments.find((seed) => seed.id === doc?.id)
    if (restored) setDoc(clone(restored))
    notify('Početni materijali su vraćeni.', 'info')
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
    const page = clone(currentPage)
    page.id = uid('page')
    page.blocks = page.blocks.map((b) => ({ ...b, id: uid('block') }))
    const pages = [...doc.pages]
    pages.splice(pageIndex + 1, 0, page)
    patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(pageIndex + 1), 20)
  }
  const confirmDeletePage = () => {
    if (!doc || doc.pages.length <= 1) return
    const nextIndex = Math.min(pageIndex, doc.pages.length - 2)
    const pages = doc.pages.filter((_, i) => i !== pageIndex)
    patchDoc({ ...doc, pages })
    setSelectedBlockId(undefined)
    setDeleteTarget(null)
    window.setTimeout(() => scrollToPage(nextIndex, 'auto'), 20)
  }
  const movePage = (direction: -1 | 1) => {
    if (!doc) return
    const to = pageIndex + direction
    if (to < 0 || to >= doc.pages.length) return
    const pages = [...doc.pages]
    ;[pages[pageIndex], pages[to]] = [pages[to], pages[pageIndex]]
    patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(to, 'auto'), 20)
  }

  if (!doc || !currentPage) {
    return <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}><Text size={400}>Otvaranje editora…</Text></div>
  }

  const columns = `${sidebarOpen ? '280px' : '0px'} minmax(0,1fr) ${inspectorOpen ? '340px' : '0px'}`

  return (
    <div className={styles.root}>
      <header className={mergeClasses(styles.topbar, styles.noPrint)}>
        <div className={styles.topbarLeft}>
          <Tooltip content={sidebarOpen ? 'Sakrij navigaciju' : 'Prikaži navigaciju'} relationship="label">
            <Button appearance="subtle" icon={<Icon name="menu" />} onClick={() => setSidebarOpen((v) => !v)} />
          </Tooltip>
          <div className={styles.brand}>
            <span className={styles.brandMark}>E</span>
            <span className={styles.brandCopy}><Text weight="semibold">ERS Studio</Text><Caption1>Nastavni materijali</Caption1></span>
          </div>
          <div className={styles.docIdentity}>
            <Badge appearance="tint" color="brand">{kindLabel(doc.kind)}</Badge>
            <Text className={styles.docTitle} weight="semibold">{doc.title}</Text>
          </div>
        </div>
        <div className={styles.topbarActions}>
          <Button appearance="subtle" icon={<Icon name="plus" size={16} />} onClick={newDoc}>Novi</Button>
          <Button appearance="subtle" icon={<Icon name="open" size={16} />} onClick={openFromDisk}>Otvori</Button>
          <Button appearance="subtle" icon={<Icon name="save" size={16} />} onClick={() => saveDocumentToDisk(doc).then(() => notify('Dokument je sačuvan.')).catch(() => notify('Čuvanje je otkazano.', 'info'))}>Sačuvaj</Button>
          <Divider vertical />
          <Button appearance="subtle" icon={<Icon name="print" size={16} />} onClick={() => window.print()}>Izvezi PDF</Button>
          <Button appearance="primary" icon={<Icon name="play" size={16} />} onClick={() => setPresenting(true)}>Režim prikaza</Button>
          <Tooltip content={inspectorOpen ? 'Sakrij podešavanja' : 'Prikaži podešavanja'} relationship="label">
            <Button appearance={inspectorOpen ? 'secondary' : 'subtle'} icon={<Icon name="settings" />} onClick={() => setInspectorOpen((v) => !v)} />
          </Tooltip>
        </div>
      </header>

      <div className={styles.editorGrid} style={{ gridTemplateColumns: columns }}>
        {sidebarOpen && <aside className={mergeClasses(styles.sidebar, styles.noPrint)}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitleBlock}><Text weight="semibold">Dokumenti</Text><Caption1>{library.length} sačuvano lokalno</Caption1></span>
            <Tooltip content="Novi dokument" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="plus" size={15} />} onClick={newDoc} /></Tooltip>
          </div>
          <div className={styles.libraryList}>
            {library.map((entry) => (
              <Button key={entry.id} appearance="subtle" className={mergeClasses(styles.libraryItem, entry.id === doc.id && styles.libraryItemActive)} onClick={() => loadDoc(entry.id)} icon={<Icon name="file" size={17} />}>
                <span className={styles.libraryItemText}><Text className={styles.truncated} weight="semibold">{entry.title}</Text><Caption1>{kindLabel(entry.kind)} · {new Date(entry.updatedAt).toLocaleDateString('sr-RS')}</Caption1></span>
              </Button>
            ))}
          </div>
          <div className={styles.sidebarActions}>
            <Button appearance="subtle" className={styles.sidebarAction} icon={<Icon name="copy" size={14} />} onClick={duplicateDoc}>Napravi kopiju</Button>
            <Button appearance="subtle" className={styles.sidebarAction} icon={<Icon name="undo" size={14} />} onClick={restoreSeeds}>Vrati početnu verziju</Button>
            <Button appearance="subtle" className={mergeClasses(styles.sidebarAction, styles.dangerAction)} icon={<Icon name="trash" size={14} />} onClick={() => setDeleteTarget('document')}>Obriši dokument</Button>
          </div>
          <Divider />
          <div className={styles.sidebarHeader}><span className={styles.sidebarTitleBlock}><Text weight="semibold">Sadržaj</Text><Caption1>Navigacija kroz dokument</Caption1></span></div>
          <nav className={styles.outline}>
            {outline.map(({ page, index, title }) => (
              <Button key={page.id} appearance="subtle" className={mergeClasses(styles.outlineItem, index === pageIndex && styles.outlineItemActive)} onClick={() => scrollToPage(index)}>
                <span className={styles.outlineNumber}>{index + 1}</span><span className={styles.truncated}>{title}</span>
              </Button>
            ))}
          </nav>
        </aside>}

        <main className={styles.workspace}>
          <div className={mergeClasses(styles.workspaceToolbar, styles.noPrint)}>
            <div className={styles.breadcrumb}>
              <Text size={200}>{kindLabel(doc.kind)}</Text><Icon name="chevron" size={12} /><Text weight="semibold">Strana {pageIndex + 1} od {doc.pages.length}</Text><Caption1>{pageLabel(currentPage, pageIndex)}</Caption1>
            </div>
            <div className={styles.toolbarGroup}>
              <Tooltip content="Pomeri stranicu gore" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="up" size={14} />} disabled={pageIndex === 0} onClick={() => movePage(-1)} /></Tooltip>
              <Tooltip content="Pomeri stranicu dole" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="down" size={14} />} disabled={pageIndex === doc.pages.length - 1} onClick={() => movePage(1)} /></Tooltip>
              <Tooltip content="Dodaj stranicu" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="plus" size={14} />} onClick={addPage} /></Tooltip>
              <Tooltip content="Kopiraj stranicu" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="copy" size={14} />} onClick={duplicatePage} /></Tooltip>
              <Tooltip content="Obriši stranicu" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="trash" size={14} />} disabled={doc.pages.length <= 1} onClick={() => setDeleteTarget('page')} /></Tooltip>
              <Divider vertical />
              <Button appearance="subtle" size="small" onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.08).toFixed(2)))}>−</Button>
              <Caption1 className={styles.zoomLabel}>{Math.round(zoom * 100)}%</Caption1>
              <Button appearance="subtle" size="small" onClick={() => setZoom((z) => Math.min(1.1, +(z + 0.08).toFixed(2)))}>+</Button>
            </div>
          </div>

          <div ref={canvasRef} className={styles.canvas} onClick={() => { setSelectedBlockId(undefined); setInspectorOpen(true) }}>
            <div className={styles.documentStack}>
              {doc.pages.map((page, index) => (
                <div key={page.id} ref={(el) => { pageRefs.current[index] = el }} data-page-index={index} className={mergeClasses(styles.pageItem, index === pageIndex && styles.activePage)} onMouseDown={() => setPageIndex(index)}>
                  <div style={{ zoom }}>
                    <PageCanvas doc={doc} page={page} pageIndex={index} selectedBlockId={index === pageIndex ? selectedBlockId : undefined} onSelectBlock={(id) => { setPageIndex(index); setSelectedBlockId(id); if (id) setInspectorOpen(true) }} onUpdatePage={(next) => updatePageAt(index, next)} onOpenDocumentSettings={() => { setPageIndex(index); setInspectorOpen(true) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={mergeClasses(styles.statusbar, styles.noPrint)}><span className={styles.statusLeft}><span className={styles.statusDot} /><Caption1>{status}</Caption1></span><Caption1>A4 · {Math.round(zoom * 100)}% · Strana {pageIndex + 1}/{doc.pages.length}</Caption1></div>
        </main>

        {inspectorOpen && <Inspector doc={doc} block={selectedBlock} onDocumentChange={patchDoc} onBlockChange={updateBlock} onClose={() => setInspectorOpen(false)} />}
      </div>

      <div className={mergeClasses(styles.printOnly, styles.printDocument)}>
        {doc.pages.map((page, i) => <PageCanvas key={page.id} doc={doc} page={page} pageIndex={i} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />)}
      </div>

      {presenting && <Presentation doc={doc} startPage={pageIndex} onClose={() => setPresenting(false)} />}
      <Toaster toasterId={toasterId} position="top-end" />

      <Dialog open={deleteTarget !== null} onOpenChange={(_, data) => { if (!data.open) setDeleteTarget(null) }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{deleteTarget === 'document' ? 'Obriši dokument' : 'Obriši stranicu'}</DialogTitle>
            <DialogContent>
              <Text className={styles.dialogText}>{deleteTarget === 'document' ? `Dokument „${doc.title}“ biće uklonjen iz lokalne biblioteke. Ova radnja se ne može opozvati.` : `Strana ${pageIndex + 1} biće trajno uklonjena iz dokumenta.`}</Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDeleteTarget(null)}>Otkaži</Button>
              <Button appearance="primary" onClick={() => deleteTarget === 'document' ? confirmRemoveDoc() : confirmDeletePage()}>Obriši</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
