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
  Select,
  Tab,
  TabList,
  Text,
  Toaster,
  Toast,
  ToastTitle,
  tokens,
  Tooltip,
  useId,
  useToastController,
} from '@fluentui/react-components'
import type { Block, CourseDocument, DocumentPage, LibraryEntry, TextBlock } from './types'
import { bundledDocuments, duplicateAsNew, freshDocument } from './seed'
import { deleteDocumentLocal, getMeta, listDocumentsLocal, loadDocumentLocal, saveDocumentLocal, setMeta } from './db'
import { openDocumentFromDisk, saveDocumentToDisk } from './fileIO'
import { clone, createBlock, emptyPage, pageLabel, textFromHtml, touch, uid } from './utils'
import { Icon } from './components/Icon'
import { Inspector } from './components/Inspector'
import { PageCanvas } from './components/PageCanvas'
import { Presentation } from './components/Presentation'

const SEED_VERSION = 4

type RibbonTab = 'file' | 'home' | 'insert' | 'layout' | 'review' | 'view'

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vh',
    minWidth: '1100px',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: '46px 38px 104px minmax(0, 1fr) 30px',
    backgroundColor: '#f3f3f3',
    color: tokens.colorNeutralForeground1,
  },
  titlebar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px 0 10px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ececec',
    position: 'relative',
    zIndex: 40,
  },
  titleLeft: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 },
  titleRight: { display: 'flex', alignItems: 'center', gap: '3px' },
  appIcon: {
    width: '28px',
    height: '28px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '4px',
    backgroundColor: '#185abd',
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.04)',
  },
  appName: { color: '#174ea6', fontWeight: 600, whiteSpace: 'nowrap', marginRight: '14px' },
  docTitleTop: {
    minWidth: 0,
    maxWidth: '520px',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    paddingLeft: '14px',
    borderLeft: '1px solid #e7e7e7',
  },
  docTitleText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  savedState: { display: 'flex', alignItems: 'center', gap: '6px', color: '#4d4d4d', marginRight: '8px' },
  savedDot: { width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #2e7d32', color: '#2e7d32', display: 'grid', placeItems: 'center', fontSize: '10px', lineHeight: 1 },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#0f6cbd', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, marginLeft: '5px' },

  tabsBar: {
    display: 'flex',
    alignItems: 'end',
    padding: '0 12px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e5e5',
    position: 'relative',
    zIndex: 35,
  },
  tabs: { minHeight: '37px' },

  ribbon: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 0,
    padding: '7px 10px 6px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dcdcdc',
    boxShadow: '0 2px 4px rgba(0,0,0,.04)',
    overflowX: 'auto',
    overflowY: 'hidden',
    position: 'relative',
    zIndex: 30,
  },
  ribbonGroup: {
    minWidth: '112px',
    height: '88px',
    display: 'grid',
    gridTemplateRows: '1fr 18px',
    padding: '0 9px',
    borderRight: '1px solid #e8e8e8',
    animationDuration: '120ms',
  },
  ribbonGroupWide: { minWidth: '220px' },
  ribbonGroupBody: { display: 'flex', alignItems: 'center', gap: '4px', minHeight: 0 },
  ribbonGroupBodyWrap: { display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: '3px', minHeight: 0 },
  ribbonGroupLabel: { textAlign: 'center', color: '#777', fontSize: '10px', alignSelf: 'end' },
  ribbonBigButton: { minWidth: '58px', height: '60px', display: 'flex', flexDirection: 'column', gap: '4px', padding: '6px 7px' },
  ribbonSmallButton: { minWidth: '32px', height: '30px', padding: '0 8px' },
  ribbonSelect: { width: '112px' },
  styleCard: {
    height: '54px',
    minWidth: '92px',
    border: '1px solid #d8d8d8',
    borderRadius: '2px',
    background: '#fff',
    padding: '6px 10px',
    textAlign: 'left',
    cursor: 'pointer',
    transitionProperty: 'background, border-color, box-shadow, transform',
    transitionDuration: '120ms',
    ':hover': { background: '#f5f9ff', borderColor: '#aac7e9', boxShadow: '0 1px 2px rgba(0,0,0,.06)' },
    ':active': { transform: 'translateY(1px)' },
  },
  styleCardTitle: { display: 'block', color: '#222', fontSize: '15px', lineHeight: 1.15 },
  styleCardMeta: { display: 'block', color: '#777', fontSize: '9px', marginTop: '3px' },

  editorGrid: {
    minHeight: 0,
    display: 'grid',
    transitionProperty: 'grid-template-columns',
    transitionDuration: '180ms',
    transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
  },
  sidebar: {
    minWidth: 0,
    overflow: 'hidden auto',
    backgroundColor: '#fff',
    borderRight: '1px solid #dddddd',
    transitionProperty: 'opacity, transform',
    transitionDuration: '160ms',
  },
  sidebarHidden: { opacity: 0, transform: 'translateX(-8px)', pointerEvents: 'none' },
  paneHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 7px' },
  paneHeaderStack: { display: 'flex', flexDirection: 'column', gap: '1px' },
  paneSectionTitle: { fontWeight: 600, color: '#242424' },
  paneSubtle: { color: '#777' },
  library: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px 10px' },
  libraryItem: { width: '100%', justifyContent: 'flex-start', minHeight: '48px', height: 'auto', textAlign: 'left', borderRadius: '4px' },
  libraryItemActive: { width: '100%', justifyContent: 'flex-start', minHeight: '48px', height: 'auto', textAlign: 'left', borderRadius: '4px', backgroundColor: '#e8f1fb' },
  libraryText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 },
  truncate: { maxWidth: '198px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docTools: { display: 'flex', flexDirection: 'column', gap: '1px', padding: '4px 8px 9px' },
  leftAction: { justifyContent: 'flex-start' },
  destructive: { color: tokens.colorPaletteRedForeground1 },
  outline: { display: 'flex', flexDirection: 'column', gap: '1px', padding: '0 8px 20px' },
  outlineItem: { width: '100%', justifyContent: 'flex-start', textAlign: 'left', minHeight: '32px', height: 'auto', borderRadius: '4px' },
  outlineItemActive: { width: '100%', justifyContent: 'flex-start', textAlign: 'left', minHeight: '32px', height: 'auto', borderRadius: '4px', backgroundColor: '#e8f1fb', color: '#0f548c' },
  outlineNumber: { width: '22px', flex: '0 0 22px', color: '#8a8a8a', fontVariantNumeric: 'tabular-nums' },

  workspace: { minWidth: 0, minHeight: 0, display: 'grid', gridTemplateRows: '24px minmax(0,1fr)', backgroundColor: '#e9e9e9', position: 'relative' },
  rulerTop: {
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #d6d6d6',
    overflow: 'hidden',
  },
  rulerTrack: {
    width: '794px',
    height: '100%',
    margin: '0 auto',
    position: 'relative',
    backgroundImage: 'repeating-linear-gradient(to right, transparent 0, transparent 37px, #bdbdbd 38px, transparent 39px)',
    backgroundSize: 'auto 100%',
    color: '#777',
    fontSize: '8px',
  },
  rulerNumbers: { display: 'flex', justifyContent: 'space-between', padding: '2px 4px 0', opacity: .8 },
  canvas: { minHeight: 0, overflow: 'auto', scrollBehavior: 'smooth', backgroundColor: '#d9d9d9', position: 'relative' },
  verticalRuler: {
    position: 'sticky',
    left: 0,
    top: 0,
    float: 'left',
    width: '24px',
    height: '1123px',
    marginTop: '28px',
    marginRight: '-24px',
    zIndex: 3,
    backgroundColor: '#f9f9f9',
    borderRight: '1px solid #d6d6d6',
    backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 37px, #bdbdbd 38px, transparent 39px)',
    pointerEvents: 'none',
  },
  documentStack: { width: 'max-content', minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px', padding: '28px 44px 70px' },
  pageItem: { flex: '0 0 auto', borderRadius: '2px', transitionProperty: 'filter, transform', transitionDuration: '140ms' },
  activePage: { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },

  inspectorWrap: {
    minWidth: 0,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderLeft: '1px solid #dddddd',
    transitionProperty: 'opacity, transform',
    transitionDuration: '160ms',
  },
  inspectorHidden: { opacity: 0, transform: 'translateX(8px)', pointerEvents: 'none' },

  statusbar: {
    display: 'grid',
    gridTemplateColumns: '280px minmax(0,1fr) 340px',
    alignItems: 'center',
    height: '30px',
    backgroundColor: '#fff',
    borderTop: '1px solid #dddddd',
    fontSize: '11px',
    color: '#555',
  },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '14px', minWidth: 0 },
  statusCenter: { display: 'flex', alignItems: 'center', gap: '18px', paddingLeft: '16px', minWidth: 0 },
  statusRight: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingRight: '12px' },
  statusSaved: { display: 'flex', alignItems: 'center', gap: '5px' },
  greenDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2e7d32' },
  zoomRange: { width: '110px', accentColor: '#0f6cbd' },

  printOnly: { display: 'none' },
  noPrint: { '@media print': { display: 'none !important' } },
  printDocument: { '@media print': { display: 'block' } },
  dialogText: { color: tokens.colorNeutralForeground2 },
})

function kindLabel(kind: CourseDocument['kind']) {
  return ({ praktikum: 'Practicum', specifikacija: 'Specification', skripta: 'Notes', dokument: 'Document' } as const)[kind]
}

function pageOutlineTitle(page: DocumentPage, index: number) {
  const heading = page.blocks.find((block) => block.type === 'text' && (block.variant === 'title' || block.variant === 'h1'))
  if (heading?.type === 'text') return textFromHtml(heading.html)
  if (page.layout === 'cover') return page.label || 'Cover'
  return page.label || `Page ${index + 1}`
}

function plainBlockText(block: Block): string {
  if (block.type === 'text') return textFromHtml(block.html)
  if (block.type === 'list') return block.items.map(textFromHtml).join(' ')
  if (block.type === 'code') return block.code
  if (block.type === 'callout') return `${textFromHtml(block.title)} ${textFromHtml(block.text)}`
  if (block.type === 'table') return [...block.headers, ...block.rows.flat()].map(textFromHtml).join(' ')
  if (block.type === 'diagram') return [block.title || '', ...block.items.flatMap((item) => [item.title, item.subtitle || '']), block.footer || ''].join(' ')
  if (block.type === 'image') return block.caption || block.alt || ''
  if (block.type === 'institution') return `${textFromHtml(block.university)} ${textFromHtml(block.faculty)} ${textFromHtml(block.department || '')}`
  return ''
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
  const [status, setStatus] = useState('Opening…')
  const [deleteTarget, setDeleteTarget] = useState<'document' | 'page' | null>(null)
  const [ribbonTab, setRibbonTab] = useState<RibbonTab>('home')
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
        setStatus('Saved locally')
      } catch (error) {
        console.error(error)
        setDoc(bundledDocuments[0])
        setStatus('Local storage unavailable')
      }
    })()
  }, [])

  useEffect(() => {
    if (!doc) return
    setStatus('Saving…')
    const timer = window.setTimeout(async () => {
      try {
        await saveDocumentLocal(doc)
        await setMeta('lastDocumentId', doc.id)
        setStatus('Saved locally')
        refreshLibrary()
      } catch (error) {
        console.error(error)
        setStatus('Save error')
      }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [doc])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (doc) saveDocumentToDisk(doc).then(() => notify('Document saved.')).catch(() => notify('Save cancelled.', 'info'))
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault()
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
    pageRefs.current.slice(0, doc.pages.length).forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [doc?.id, doc?.pages.length, zoom])

  const currentPage = doc?.pages[pageIndex]
  const selectedBlock = useMemo(() => currentPage?.blocks.find((block) => block.id === selectedBlockId), [currentPage, selectedBlockId])
  const outline = useMemo(() => {
    if (!doc) return []
    return doc.pages
      .map((page, index) => ({ page, index, title: pageOutlineTitle(page, index) }))
      .filter(({ page, index }) => index === 0 || page.blocks.some((block) => block.type === 'text' && block.variant === 'h1'))
  }, [doc])
  const wordCount = useMemo(() => {
    if (!doc) return 0
    const text = doc.pages.flatMap((page) => page.blocks.map(plainBlockText)).join(' ').trim()
    return text ? text.split(/\s+/u).filter(Boolean).length : 0
  }, [doc])

  const patchDoc = (next: CourseDocument) => setDoc(touch(next))
  const updatePageAt = (index: number, page: DocumentPage) => {
    if (!doc) return
    patchDoc({ ...doc, pages: doc.pages.map((current, i) => i === index ? page : current) })
  }
  const updateBlock = (block: Block) => {
    if (!currentPage) return
    updatePageAt(pageIndex, { ...currentPage, blocks: currentPage.blocks.map((current) => current.id === block.id ? block : current) })
  }
  const patchSelectedText = (patch: Partial<TextBlock>) => {
    if (selectedBlock?.type !== 'text') return
    updateBlock({ ...selectedBlock, ...patch })
  }
  const insertBlock = (type: Block['type']) => {
    if (!currentPage) return
    const block = createBlock(type)
    updatePageAt(pageIndex, { ...currentPage, blocks: [...currentPage.blocks, block] })
    setSelectedBlockId(block.id)
    setInspectorOpen(true)
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
    notify('Document duplicated.')
  }
  const confirmRemoveDoc = async () => {
    if (!doc) return
    await deleteDocumentLocal(doc.id)
    await refreshLibrary()
    const remaining = (await listDocumentsLocal())[0]
    if (remaining) await loadDoc(remaining.id)
    else await newDoc()
    setDeleteTarget(null)
    notify('Document deleted.', 'info')
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
      notify('Document opened.')
    } catch (error) {
      console.error(error)
      notify('The selected file is not a valid ERS document.', 'error')
    }
  }
  const restoreSeeds = async () => {
    for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed))
    await refreshLibrary()
    const restored = bundledDocuments.find((seed) => seed.id === doc?.id)
    if (restored) setDoc(clone(restored))
    notify('Bundled materials restored.', 'info')
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
    page.blocks = page.blocks.map((block) => ({ ...block, id: uid('block') }))
    const pages = [...doc.pages]
    pages.splice(pageIndex + 1, 0, page)
    patchDoc({ ...doc, pages })
    window.setTimeout(() => scrollToPage(pageIndex + 1), 20)
  }
  const confirmDeletePage = () => {
    if (!doc || doc.pages.length <= 1) return
    const nextIndex = Math.min(pageIndex, doc.pages.length - 2)
    patchDoc({ ...doc, pages: doc.pages.filter((_, index) => index !== pageIndex) })
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
    return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#f3f3f3' }}><Text size={400}>Opening ERS Studio…</Text></div>
  }

  const editorColumns = `${sidebarOpen ? '270px' : '0px'} minmax(0,1fr) ${inspectorOpen ? '310px' : '0px'}`
  const statusColumns = `${sidebarOpen ? '270px' : '0px'} minmax(0,1fr) ${inspectorOpen ? '310px' : '0px'}`

  const ribbonHome = <>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBody}>
        <Button appearance="subtle" className={mergeClasses(styles.ribbonBigButton)} icon={<Icon name="save" size={22} />} onClick={() => saveDocumentToDisk(doc)}>Paste</Button>
        <div className={styles.ribbonGroupBodyWrap}>
          <Button appearance="subtle" size="small" className={mergeClasses(styles.ribbonSmallButton)} onClick={() => document.execCommand('cut')}>Cut</Button>
          <Button appearance="subtle" size="small" className={mergeClasses(styles.ribbonSmallButton)} onClick={() => document.execCommand('copy')}>Copy</Button>
        </div>
      </div>
      <span className={styles.ribbonGroupLabel}>Clipboard</span>
    </div>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Select className={styles.ribbonSelect} value={doc.theme.font} onChange={(event) => patchDoc({ ...doc, theme: { ...doc.theme, font: event.target.value as CourseDocument['theme']['font'] } })}>
          <option value="System">Segoe UI</option><option value="Serif">Georgia</option><option value="Humanist">Trebuchet MS</option>
        </Select>
        <Select style={{ width: 62 }} defaultValue="11"><option>9</option><option>10</option><option>11</option><option>12</option><option>14</option><option>16</option></Select>
        <Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="bold" size={17} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('bold') }} />
        <Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="italic" size={17} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('italic') }} />
        <Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="underline" size={17} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('underline') }} />
        <Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); document.execCommand('removeFormat') }}>Aa</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Font</span>
    </div>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => insertBlock('list')}>• List</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => { const block = createBlock('list'); if (block.type === 'list') block.ordered = true; updatePageAt(pageIndex, { ...currentPage, blocks: [...currentPage.blocks, block] }); setSelectedBlockId(block.id) }}>1. List</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'left' })}>≡</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'center' })}>≣</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'right' })}>≡</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Paragraph</span>
    </div>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}>
      <div className={styles.ribbonGroupBody}>
        <button className={styles.styleCard} onClick={() => patchSelectedText({ variant: 'paragraph' })}><span className={styles.styleCardTitle}>Normal</span><span className={styles.styleCardMeta}>Body text</span></button>
        <button className={styles.styleCard} onClick={() => patchSelectedText({ variant: 'h1' })}><span className={styles.styleCardTitle} style={{ color: '#185abd' }}>Heading 1</span><span className={styles.styleCardMeta}>Section</span></button>
        <button className={styles.styleCard} onClick={() => patchSelectedText({ variant: 'h2' })}><span className={styles.styleCardTitle}>Heading 2</span><span className={styles.styleCardMeta}>Subsection</span></button>
      </div>
      <span className={styles.ribbonGroupLabel}>Styles</span>
    </div>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" className={styles.ribbonSmallButton}>Find</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton}>Replace</Button>
        <Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => setInspectorOpen(true)}>Select</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Editing</span>
    </div>
  </>

  const ribbonInsert = <>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}>
      <div className={styles.ribbonGroupBodyWrap}>
        {([
          ['text', 'Text'], ['list', 'List'], ['code', 'Code'], ['callout', 'Callout'], ['table', 'Table'], ['diagram', 'Diagram'], ['image', 'Image'], ['institution', 'Institution'], ['divider', 'Divider'],
        ] as Array<[Block['type'], string]>).map(([type, label]) => <Button key={type} appearance="subtle" className={styles.ribbonSmallButton} onClick={() => insertBlock(type)}>{label}</Button>)}
      </div>
      <span className={styles.ribbonGroupLabel}>Content blocks</span>
    </div>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" onClick={addPage}>New page</Button>
        <Button appearance="subtle" onClick={duplicatePage}>Duplicate</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Pages</span>
    </div>
  </>

  const ribbonFile = <>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}>
      <div className={styles.ribbonGroupBody}>
        <Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="plus" size={22} />} onClick={newDoc}>New</Button>
        <Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="open" size={22} />} onClick={openFromDisk}>Open</Button>
        <Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="save" size={22} />} onClick={() => saveDocumentToDisk(doc)}>Save as</Button>
        <Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="print" size={22} />} onClick={() => window.print()}>PDF</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Document</span>
    </div>
  </>

  const ribbonLayout = <>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" onClick={() => movePage(-1)} disabled={pageIndex === 0}>Move up</Button>
        <Button appearance="subtle" onClick={() => movePage(1)} disabled={pageIndex === doc.pages.length - 1}>Move down</Button>
        <Button appearance="subtle" onClick={() => setDeleteTarget('page')} disabled={doc.pages.length <= 1}>Delete page</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Page order</span>
    </div>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" onClick={() => setZoom(.75)}>75%</Button>
        <Button appearance="subtle" onClick={() => setZoom(1)}>100%</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Scale</span>
    </div>
  </>

  const ribbonReview = <>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" onClick={() => setInspectorOpen(true)}>Properties</Button>
        <Button appearance="subtle" onClick={() => setPresenting(true)}>Preview</Button>
        <Button appearance="subtle" onClick={() => window.print()}>Print preview</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Review</span>
    </div>
  </>

  const ribbonView = <>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance={sidebarOpen ? 'secondary' : 'subtle'} onClick={() => setSidebarOpen((value) => !value)}>Navigation</Button>
        <Button appearance={inspectorOpen ? 'secondary' : 'subtle'} onClick={() => setInspectorOpen((value) => !value)}>Inspector</Button>
        <Button appearance="subtle" onClick={() => setPresenting(true)}>Focus</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Show</span>
    </div>
    <div className={styles.ribbonGroup}>
      <div className={styles.ribbonGroupBodyWrap}>
        <Button appearance="subtle" onClick={() => setZoom((value) => Math.max(.55, +(value - .08).toFixed(2)))}>Zoom out</Button>
        <Button appearance="subtle" onClick={() => setZoom((value) => Math.min(1.1, +(value + .08).toFixed(2)))}>Zoom in</Button>
      </div>
      <span className={styles.ribbonGroupLabel}>Zoom</span>
    </div>
  </>

  const ribbonContent = ribbonTab === 'file' ? ribbonFile : ribbonTab === 'insert' ? ribbonInsert : ribbonTab === 'layout' ? ribbonLayout : ribbonTab === 'review' ? ribbonReview : ribbonTab === 'view' ? ribbonView : ribbonHome

  return (
    <div className={styles.root}>
      <header className={mergeClasses(styles.titlebar, styles.noPrint)}>
        <div className={styles.titleLeft}>
          <Tooltip content={sidebarOpen ? 'Hide navigation' : 'Show navigation'} relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="menu" size={17} />} onClick={() => setSidebarOpen((value) => !value)} /></Tooltip>
          <span className={styles.appIcon}>E</span>
          <Text className={styles.appName}>ERS Studio</Text>
          <div className={styles.docTitleTop}>
            <Badge appearance="tint" color="brand">{kindLabel(doc.kind)}</Badge>
            <Text className={styles.docTitleText} weight="semibold">{doc.title}</Text>
            <Icon name="down" size={13} />
          </div>
        </div>
        <div className={styles.titleRight}>
          <span className={styles.savedState}><span className={styles.savedDot}>✓</span><Caption1>{status}</Caption1></span>
          <Tooltip content="Undo" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="undo" size={16} />} onClick={() => document.execCommand('undo')} /></Tooltip>
          <Tooltip content="Redo" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="redo" size={16} />} onClick={() => document.execCommand('redo')} /></Tooltip>
          <Button appearance="secondary" size="small" onClick={() => saveDocumentToDisk(doc)}>Save</Button>
          <Button appearance="secondary" size="small" icon={<Icon name="play" size={15} />} onClick={() => setPresenting(true)}>Present</Button>
          <Tooltip content="Document properties" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="settings" size={16} />} onClick={() => setInspectorOpen((value) => !value)} /></Tooltip>
          <span className={styles.avatar}>E</span>
        </div>
      </header>

      <div className={mergeClasses(styles.tabsBar, styles.noPrint)}>
        <TabList className={styles.tabs} selectedValue={ribbonTab} onTabSelect={(_, data) => setRibbonTab(String(data.value) as RibbonTab)}>
          <Tab value="file">File</Tab><Tab value="home">Home</Tab><Tab value="insert">Insert</Tab><Tab value="layout">Layout</Tab><Tab value="review">Review</Tab><Tab value="view">View</Tab>
        </TabList>
      </div>

      <div className={mergeClasses(styles.ribbon, styles.noPrint)}>{ribbonContent}</div>

      <div className={styles.editorGrid} style={{ gridTemplateColumns: editorColumns }}>
        <aside className={mergeClasses(styles.sidebar, !sidebarOpen && styles.sidebarHidden, styles.noPrint)}>
          <div className={styles.paneHeader}><span className={styles.paneHeaderStack}><Text className={styles.paneSectionTitle}>Documents</Text><Caption1 className={styles.paneSubtle}>{library.length} saved locally</Caption1></span><Tooltip content="New document" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="plus" size={14} />} onClick={newDoc} /></Tooltip></div>
          <div className={styles.library}>
            {library.map((entry) => <Button key={entry.id} appearance="subtle" className={entry.id === doc.id ? styles.libraryItemActive : styles.libraryItem} onClick={() => loadDoc(entry.id)} icon={<Icon name="file" size={17} />}>
              <span className={styles.libraryText}><Text className={styles.truncate} weight="semibold">{entry.title}</Text><Caption1>{kindLabel(entry.kind)} · {new Date(entry.updatedAt).toLocaleDateString()}</Caption1></span>
            </Button>)}
          </div>
          <div className={styles.docTools}>
            <Button appearance="subtle" className={styles.leftAction} icon={<Icon name="copy" size={14} />} onClick={duplicateDoc}>Duplicate</Button>
            <Button appearance="subtle" className={styles.leftAction} icon={<Icon name="undo" size={14} />} onClick={restoreSeeds}>Restore bundled version</Button>
            <Button appearance="subtle" className={mergeClasses(styles.leftAction, styles.destructive)} icon={<Icon name="trash" size={14} />} onClick={() => setDeleteTarget('document')}>Delete document</Button>
          </div>
          <Divider />
          <div className={styles.paneHeader}><span className={styles.paneHeaderStack}><Text className={styles.paneSectionTitle}>Document outline</Text><Caption1 className={styles.paneSubtle}>Jump to a section</Caption1></span></div>
          <nav className={styles.outline}>
            {outline.map(({ page, index, title }) => <Button key={page.id} appearance="subtle" className={index === pageIndex ? styles.outlineItemActive : styles.outlineItem} onClick={() => scrollToPage(index)}>
              <span className={styles.outlineNumber}>{index + 1}</span><span className={styles.truncate}>{title}</span>
            </Button>)}
          </nav>
        </aside>

        <main className={styles.workspace}>
          <div className={mergeClasses(styles.rulerTop, styles.noPrint)}><div className={styles.rulerTrack}><div className={styles.rulerNumbers}>{Array.from({ length: 11 }, (_, index) => <span key={index}>{index}</span>)}</div></div></div>
          <div ref={canvasRef} className={styles.canvas} onClick={() => { setSelectedBlockId(undefined); setInspectorOpen(true) }}>
            <div className={mergeClasses(styles.verticalRuler, styles.noPrint)} />
            <div className={styles.documentStack}>
              {doc.pages.map((page, index) => <div key={page.id} ref={(element) => { pageRefs.current[index] = element }} data-page-index={index} className={mergeClasses(styles.pageItem, index === pageIndex && styles.activePage)} onMouseDown={() => setPageIndex(index)}>
                <div style={{ zoom }}>
                  <PageCanvas doc={doc} page={page} pageIndex={index} selectedBlockId={index === pageIndex ? selectedBlockId : undefined} onSelectBlock={(id) => { setPageIndex(index); setSelectedBlockId(id); if (id) setInspectorOpen(true) }} onUpdatePage={(next) => updatePageAt(index, next)} onOpenDocumentSettings={() => { setPageIndex(index); setInspectorOpen(true) }} />
                </div>
              </div>)}
            </div>
          </div>
        </main>

        <div className={mergeClasses(styles.inspectorWrap, !inspectorOpen && styles.inspectorHidden, styles.noPrint)}>
          <Inspector doc={doc} block={selectedBlock} onDocumentChange={patchDoc} onBlockChange={updateBlock} onClose={() => setInspectorOpen(false)} />
        </div>
      </div>

      <div className={mergeClasses(styles.statusbar, styles.noPrint)} style={{ gridTemplateColumns: statusColumns }}>
        <div className={styles.statusLeft}><span>Page {pageIndex + 1} of {doc.pages.length}</span><span>{wordCount.toLocaleString()} words</span></div>
        <div className={styles.statusCenter}><span className={styles.statusSaved}><span className={styles.greenDot} />{status}</span><span>Language: Auto</span><span>{pageLabel(currentPage, pageIndex)}</span></div>
        <div className={styles.statusRight}><span>{Math.round(zoom * 100)}%</span><button aria-label="Zoom" className={styles.zoomRange as unknown as string} style={{ display: 'none' }} /><input className={styles.zoomRange} aria-label="Zoom" type="range" min="55" max="110" value={Math.round(zoom * 100)} onChange={(event) => setZoom(Number(event.target.value) / 100)} /><Button appearance="subtle" size="small" onClick={() => setZoom((value) => Math.max(.55, +(value - .05).toFixed(2)))}>−</Button><Button appearance="subtle" size="small" onClick={() => setZoom((value) => Math.min(1.1, +(value + .05).toFixed(2)))}>+</Button></div>
      </div>

      <div className={mergeClasses(styles.printOnly, styles.printDocument)}>
        {doc.pages.map((page, index) => <PageCanvas key={page.id} doc={doc} page={page} pageIndex={index} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />)}
      </div>

      {presenting && <Presentation doc={doc} startPage={pageIndex} onClose={() => setPresenting(false)} />}
      <Toaster toasterId={toasterId} position="top-end" />

      <Dialog open={deleteTarget !== null} onOpenChange={(_, data) => { if (!data.open) setDeleteTarget(null) }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{deleteTarget === 'document' ? 'Delete document?' : 'Delete page?'}</DialogTitle>
            <DialogContent><Text className={styles.dialogText}>{deleteTarget === 'document' ? `“${doc.title}” will be removed from the local library. This action cannot be undone.` : `Page ${pageIndex + 1} will be permanently removed from this document.`}</Text></DialogContent>
            <DialogActions><Button appearance="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button appearance="primary" onClick={() => deleteTarget === 'document' ? confirmRemoveDoc() : confirmDeletePage()}>Delete</Button></DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
