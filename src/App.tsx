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
  Input,
  makeStyles,
  mergeClasses,
  Select,
  Slider,
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
const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1123
const MIN_ZOOM = 0.55
const MAX_ZOOM = 1.25

type RibbonTab = 'file' | 'home' | 'insert' | 'layout' | 'references' | 'review' | 'view'

const useStyles = makeStyles({
  root: {
    width: '100vw', height: '100vh', minWidth: '1100px', overflow: 'hidden', display: 'grid',
    gridTemplateRows: '48px 40px 116px minmax(0, 1fr) 30px', backgroundColor: '#f3f3f3',
    color: tokens.colorNeutralForeground1, fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
  },
  titlebar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 13px 0 10px', backgroundColor: '#fff', borderBottom: '1px solid #ededed', position: 'relative', zIndex: 50 },
  titleLeft: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 },
  titleRight: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  appIcon: { width: '30px', height: '30px', display: 'grid', placeItems: 'center', borderRadius: '5px', backgroundColor: '#185abd', color: '#fff', fontWeight: 700, fontSize: '14px', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)' },
  appName: { color: '#185abd', fontWeight: 650, whiteSpace: 'nowrap', marginRight: '10px' },
  docTitleTop: { minWidth: 0, maxWidth: '540px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '14px', borderLeft: '1px solid #e7e7e7' },
  docTitleText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  savedState: { display: 'flex', alignItems: 'center', gap: '6px', color: '#4b4b4b', marginRight: '8px' },
  savedDot: { width: '17px', height: '17px', borderRadius: '50%', border: '1.5px solid #2e7d32', color: '#2e7d32', display: 'grid', placeItems: 'center', fontSize: '10px', lineHeight: 1 },
  avatar: { width: '31px', height: '31px', borderRadius: '50%', backgroundColor: '#0f6cbd', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, marginLeft: '4px' },
  tabsBar: { display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '0 10px 0 12px', backgroundColor: '#fff', borderBottom: '1px solid #e3e3e3', position: 'relative', zIndex: 45 },
  tabs: { minHeight: '39px' },
  editingMode: { marginBottom: '4px' },
  ribbon: { display: 'flex', alignItems: 'stretch', gap: 0, padding: '8px 8px 7px', backgroundColor: '#fff', borderBottom: '1px solid #d8d8d8', boxShadow: '0 2px 5px rgba(0,0,0,.045)', overflowX: 'auto', overflowY: 'hidden', position: 'relative', zIndex: 40 },
  ribbonGroup: { minWidth: '118px', height: '100px', display: 'grid', gridTemplateRows: '1fr 19px', padding: '0 9px', borderRight: '1px solid #e8e8e8', flexShrink: 0 },
  ribbonGroupWide: { minWidth: '238px' },
  ribbonGroupStyles: { minWidth: '328px' },
  ribbonGroupBody: { display: 'flex', alignItems: 'center', gap: '4px', minHeight: 0 },
  ribbonGroupBodyWrap: { display: 'flex', flexWrap: 'wrap', alignContent: 'center', gap: '3px', minHeight: 0 },
  ribbonGroupTwoRows: { display: 'grid', gridTemplateRows: '32px 32px', gap: '3px', alignContent: 'center' },
  ribbonRow: { display: 'flex', alignItems: 'center', gap: '3px' },
  ribbonGroupLabel: { textAlign: 'center', color: '#777', fontSize: '10px', alignSelf: 'end' },
  ribbonBigButton: { minWidth: '62px', height: '67px', display: 'flex', flexDirection: 'column', gap: '5px', padding: '7px 7px' },
  ribbonSmallButton: { minWidth: '31px', height: '30px', padding: '0 7px' },
  ribbonTextButton: { height: '30px', padding: '0 8px' },
  ribbonSelect: { width: '124px' },
  ribbonSizeSelect: { width: '58px' },
  colorSwatch: { width: '15px', height: '3px', backgroundColor: '#d13438', borderRadius: '2px', display: 'block', marginTop: '-5px' },
  highlightSwatch: { width: '15px', height: '3px', backgroundColor: '#fff100', borderRadius: '2px', display: 'block', marginTop: '-5px' },
  styleCard: { height: '61px', minWidth: '102px', border: '1px solid #d6d6d6', borderRadius: '2px', background: '#fff', padding: '7px 11px', textAlign: 'left', cursor: 'pointer', transitionProperty: 'background, border-color, box-shadow, transform', transitionDuration: '110ms', ':hover': { background: '#f5f9ff', borderTopColor: '#8ab6e5', borderRightColor: '#8ab6e5', borderBottomColor: '#8ab6e5', borderLeftColor: '#8ab6e5', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }, ':active': { transform: 'translateY(1px)' } },
  styleCardSelected: { borderTopColor: '#7aa7d8', borderRightColor: '#7aa7d8', borderBottomColor: '#7aa7d8', borderLeftColor: '#7aa7d8', boxShadow: 'inset 0 0 0 1px #7aa7d8', background: '#f6faff' },
  styleCardTitle: { display: 'block', color: '#222', fontSize: '15px', lineHeight: 1.15 },
  styleCardHeading: { color: '#185abd' },
  styleCardMeta: { display: 'block', color: '#777', fontSize: '9px', marginTop: '4px' },
  searchWrap: { width: '156px' },
  editorGrid: { minHeight: 0, display: 'grid', transitionProperty: 'grid-template-columns', transitionDuration: '180ms', transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)' },
  sidebar: { minWidth: 0, overflow: 'hidden auto', backgroundColor: '#fff', borderRight: '1px solid #dcdcdc', transitionProperty: 'opacity, transform', transitionDuration: '160ms' },
  sidebarHidden: { opacity: 0, transform: 'translateX(-10px)', pointerEvents: 'none' },
  paneHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 10px 6px 12px' },
  paneHeaderStack: { display: 'flex', flexDirection: 'column', gap: '1px' },
  paneSectionTitle: { fontWeight: 650, color: '#242424' },
  paneSubtle: { color: '#777' },
  newDocumentButton: { margin: '2px 10px 8px', justifyContent: 'flex-start' },
  library: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 7px 10px' },
  libraryItem: { width: '100%', justifyContent: 'flex-start', minHeight: '50px', height: 'auto', textAlign: 'left', borderRadius: '4px' },
  libraryItemActive: { width: '100%', justifyContent: 'flex-start', minHeight: '50px', height: 'auto', textAlign: 'left', borderRadius: '4px', backgroundColor: '#e7f0fa' },
  libraryText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 },
  truncate: { maxWidth: '202px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docTools: { display: 'flex', flexDirection: 'column', gap: '1px', padding: '3px 7px 9px' },
  leftAction: { justifyContent: 'flex-start' },
  destructive: { color: tokens.colorPaletteRedForeground1 },
  outline: { display: 'flex', flexDirection: 'column', gap: '1px', padding: '0 7px 20px' },
  outlineItem: { width: '100%', justifyContent: 'flex-start', textAlign: 'left', minHeight: '31px', height: 'auto', borderRadius: '4px' },
  outlineItemActive: { width: '100%', justifyContent: 'flex-start', textAlign: 'left', minHeight: '31px', height: 'auto', borderRadius: '4px', backgroundColor: '#e7f0fa', color: '#0f548c' },
  outlineNumber: { width: '22px', flex: '0 0 22px', color: '#8a8a8a', fontVariantNumeric: 'tabular-nums' },
  workspace: { minWidth: 0, minHeight: 0, display: 'grid', gridTemplateRows: '26px minmax(0,1fr)', backgroundColor: '#efefef', position: 'relative' },
  rulerTop: { position: 'relative', backgroundColor: '#fafafa', borderBottom: '1px solid #d5d5d5', overflow: 'hidden' },
  rulerTrack: { height: '100%', margin: '0 auto', position: 'relative', color: '#777', fontSize: '8px', backgroundImage: 'repeating-linear-gradient(to right, transparent 0, transparent 19px, #c6c6c6 20px, transparent 21px)', transitionProperty: 'width', transitionDuration: '100ms' },
  rulerNumbers: { display: 'flex', justifyContent: 'space-between', padding: '2px 2px 0', opacity: .78, userSelect: 'none' },
  rulerIndentLeft: { position: 'absolute', left: '12%', top: '13px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #4d8bd6' },
  rulerIndentRight: { position: 'absolute', right: '12%', top: '13px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid #4d8bd6' },
  canvas: { minHeight: 0, overflow: 'auto', scrollBehavior: 'smooth', backgroundColor: '#ececec', position: 'relative' },
  canvasInner: { minWidth: '100%', width: 'max-content', position: 'relative', paddingTop: '18px' },
  verticalRuler: { position: 'absolute', top: '18px', width: '24px', zIndex: 3, backgroundColor: '#fafafa', border: '1px solid #d5d5d5', borderTop: 0, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #c6c6c6 20px, transparent 21px)', pointerEvents: 'none', transitionProperty: 'left, height', transitionDuration: '100ms' },
  documentStack: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', padding: '0 54px 78px' },
  pageFrame: { flex: '0 0 auto', position: 'relative', transitionProperty: 'width, height', transitionDuration: '100ms' },
  pageScale: { position: 'absolute', inset: 0, transformOrigin: 'top left', transitionProperty: 'transform', transitionDuration: '100ms' },
  pageItem: { borderRadius: '2px' },
  inspectorWrap: { minWidth: 0, overflow: 'hidden', backgroundColor: '#fff', borderLeft: '1px solid #dcdcdc', transitionProperty: 'opacity, transform', transitionDuration: '160ms' },
  inspectorHidden: { opacity: 0, transform: 'translateX(10px)', pointerEvents: 'none' },
  statusbar: { display: 'grid', alignItems: 'center', height: '30px', backgroundColor: '#fff', borderTop: '1px solid #dcdcdc', fontSize: '11px', color: '#555' },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '14px', minWidth: 0 },
  statusCenter: { display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '15px', minWidth: 0 },
  statusRight: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '7px', paddingRight: '10px' },
  statusSaved: { display: 'flex', alignItems: 'center', gap: '5px' },
  greenDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2e7d32' },
  statusViewButton: { minWidth: '28px', width: '28px', height: '25px', padding: 0 },
  zoomSlider: { width: '105px' },
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

function clampZoom(value: number) { return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(value * 100) / 100)) }

export default function App() {
  const styles = useStyles()
  const [doc, setDoc] = useState<CourseDocument | null>(null)
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [zoom, setZoom] = useState(0.9)
  const [presenting, setPresenting] = useState(false)
  const [status, setStatus] = useState('Opening…')
  const [deleteTarget, setDeleteTarget] = useState<'document' | 'page' | null>(null)
  const [ribbonTab, setRibbonTab] = useState<RibbonTab>('home')
  const [findQuery, setFindQuery] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Array<HTMLDivElement | null>>([])
  const toasterId = useId('ers-toaster')
  const { dispatchToast } = useToastController(toasterId)

  const notify = (message: string, intent: 'success' | 'error' | 'info' = 'success') => dispatchToast(<Toast><ToastTitle>{message}</ToastTitle></Toast>, { intent })
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
      try { await saveDocumentLocal(doc); await setMeta('lastDocumentId', doc.id); setStatus('Saved locally'); refreshLibrary() }
      catch (error) { console.error(error); setStatus('Save error') }
    }, 650)
    return () => window.clearTimeout(timer)
  }, [doc])

  useEffect(() => {
    if (!doc) return
    const frame = window.requestAnimationFrame(() => canvasRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
    return () => window.cancelAnimationFrame(frame)
  }, [doc?.id])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey
      if (!modifier) return
      const key = event.key.toLowerCase()
      if (key === 's') { event.preventDefault(); if (doc) saveDocumentToDisk(doc).then(() => notify('Document saved.')).catch(() => notify('Save cancelled.', 'info')); return }
      if (key === 'p') { event.preventDefault(); window.print(); return }
      if (key === '+' || key === '=') { event.preventDefault(); setZoom((value) => clampZoom(value + 0.05)); return }
      if (key === '-') { event.preventDefault(); setZoom((value) => clampZoom(value - 0.05)); return }
      if (key === '0') { event.preventDefault(); setZoom(1) }
    }
    window.addEventListener('keydown', handler, { capture: true })
    return () => window.removeEventListener('keydown', handler, { capture: true })
  }, [doc])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handler = (event: WheelEvent) => { if (!(event.ctrlKey || event.metaKey)) return; event.preventDefault(); setZoom((value) => clampZoom(value + (event.deltaY < 0 ? 0.05 : -0.05))) }
    canvas.addEventListener('wheel', handler, { passive: false })
    return () => canvas.removeEventListener('wheel', handler)
  }, [])

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
  const outline = useMemo(() => !doc ? [] : doc.pages.map((page, index) => ({ page, index, title: pageOutlineTitle(page, index) })).filter(({ page, index }) => index === 0 || page.blocks.some((block) => block.type === 'text' && block.variant === 'h1')), [doc])
  const wordCount = useMemo(() => { if (!doc) return 0; const text = doc.pages.flatMap((page) => page.blocks.map(plainBlockText)).join(' ').trim(); return text ? text.split(/\s+/u).filter(Boolean).length : 0 }, [doc])

  const patchDoc = (next: CourseDocument) => setDoc(touch(next))
  const updatePageAt = (index: number, page: DocumentPage) => { if (doc) patchDoc({ ...doc, pages: doc.pages.map((current, i) => i === index ? page : current) }) }
  const updateBlock = (block: Block) => { if (currentPage) updatePageAt(pageIndex, { ...currentPage, blocks: currentPage.blocks.map((current) => current.id === block.id ? block : current) }) }
  const patchSelectedText = (patch: Partial<TextBlock>) => { if (selectedBlock?.type === 'text') updateBlock({ ...selectedBlock, ...patch }) }
  const insertBlock = (type: Block['type']) => { if (!currentPage) return; const block = createBlock(type); updatePageAt(pageIndex, { ...currentPage, blocks: [...currentPage.blocks, block] }); setSelectedBlockId(block.id); setInspectorOpen(true) }
  const scrollToPage = (index: number, behavior: ScrollBehavior = 'smooth') => { setPageIndex(index); setSelectedBlockId(undefined); window.requestAnimationFrame(() => pageRefs.current[index]?.scrollIntoView({ behavior, block: 'start', inline: 'nearest' })) }
  const loadDoc = async (id: string) => { const loaded = await loadDocumentLocal(id); if (!loaded) return; setDoc(loaded); setPageIndex(0); setSelectedBlockId(undefined); await setMeta('lastDocumentId', id) }
  const newDoc = async () => { const next = freshDocument(); await saveDocumentLocal(next); setDoc(next); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary() }
  const duplicateDoc = async () => { if (!doc) return; const next = duplicateAsNew(doc); await saveDocumentLocal(next); setDoc(next); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary(); notify('Document duplicated.') }
  const confirmRemoveDoc = async () => { if (!doc) return; await deleteDocumentLocal(doc.id); await refreshLibrary(); const remaining = (await listDocumentsLocal())[0]; if (remaining) await loadDoc(remaining.id); else await newDoc(); setDeleteTarget(null); notify('Document deleted.', 'info') }
  const openFromDisk = async () => { try { const opened = await openDocumentFromDisk(); if (!opened) return; opened.updatedAt = new Date().toISOString(); await saveDocumentLocal(opened); setDoc(opened); setPageIndex(0); setSelectedBlockId(undefined); await refreshLibrary(); notify('Document opened.') } catch (error) { console.error(error); notify('The selected file is not a valid ERS document.', 'error') } }
  const restoreSeeds = async () => { for (const seed of bundledDocuments) await saveDocumentLocal(clone(seed)); await refreshLibrary(); const restored = bundledDocuments.find((seed) => seed.id === doc?.id); if (restored) setDoc(clone(restored)); notify('Bundled materials restored.', 'info') }
  const addPage = () => { if (!doc) return; const pages = [...doc.pages]; pages.splice(pageIndex + 1, 0, emptyPage()); patchDoc({ ...doc, pages }); window.setTimeout(() => scrollToPage(pageIndex + 1), 20) }
  const duplicatePage = () => { if (!doc || !currentPage) return; const page = clone(currentPage); page.id = uid('page'); page.blocks = page.blocks.map((block) => ({ ...block, id: uid('block') })); const pages = [...doc.pages]; pages.splice(pageIndex + 1, 0, page); patchDoc({ ...doc, pages }); window.setTimeout(() => scrollToPage(pageIndex + 1), 20) }
  const confirmDeletePage = () => { if (!doc || doc.pages.length <= 1) return; const nextIndex = Math.min(pageIndex, doc.pages.length - 2); patchDoc({ ...doc, pages: doc.pages.filter((_, index) => index !== pageIndex) }); setSelectedBlockId(undefined); setDeleteTarget(null); window.setTimeout(() => scrollToPage(nextIndex, 'auto'), 20) }
  const movePage = (direction: -1 | 1) => { if (!doc) return; const to = pageIndex + direction; if (to < 0 || to >= doc.pages.length) return; const pages = [...doc.pages]; [pages[pageIndex], pages[to]] = [pages[to], pages[pageIndex]]; patchDoc({ ...doc, pages }); window.setTimeout(() => scrollToPage(to, 'auto'), 20) }
  const findInDocument = () => { if (!doc) return; const query = findQuery.trim().toLocaleLowerCase(); if (!query) return; const match = doc.pages.findIndex((page) => page.blocks.map(plainBlockText).join(' ').toLocaleLowerCase().includes(query)); if (match >= 0) { scrollToPage(match); notify(`Found on page ${match + 1}.`, 'info') } else notify('No matches found.', 'info') }
  const runInlineCommand = (command: string, value?: string) => document.execCommand(command, false, value)

  if (!doc || !currentPage) return <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#f3f3f3' }}><Text size={400}>Opening ERS Studio…</Text></div>

  const editorColumns = `${sidebarOpen ? '270px' : '0px'} minmax(0,1fr) ${inspectorOpen ? '326px' : '0px'}`
  const statusColumns = editorColumns
  const scaledPageWidth = PAGE_WIDTH * zoom
  const scaledPageHeight = PAGE_HEIGHT * zoom
  const selectedVariant = selectedBlock?.type === 'text' ? selectedBlock.variant : undefined

  const ribbonHome = <>
    <div className={styles.ribbonGroup}><div className={styles.ribbonGroupBody}><Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="note" size={24} />} onClick={() => notify('Paste with Ctrl+V / Cmd+V in the selected text area.', 'info')}>Paste</Button><div className={styles.ribbonGroupTwoRows}><div className={styles.ribbonRow}><Button appearance="subtle" size="small" className={styles.ribbonTextButton} onClick={() => runInlineCommand('cut')}>Cut</Button><Button appearance="subtle" size="small" className={styles.ribbonTextButton} onClick={() => runInlineCommand('copy')}>Copy</Button></div><Button appearance="subtle" size="small" className={styles.ribbonTextButton} disabled>Format Painter</Button></div></div><span className={styles.ribbonGroupLabel}>Clipboard</span></div>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}><div className={styles.ribbonGroupTwoRows}><div className={styles.ribbonRow}><Select className={styles.ribbonSelect} value={doc.theme.font} onChange={(event) => patchDoc({ ...doc, theme: { ...doc.theme, font: event.target.value as CourseDocument['theme']['font'] } })}><option value="System">Segoe UI</option><option value="Serif">Georgia</option><option value="Humanist">Trebuchet MS</option></Select><Select className={styles.ribbonSizeSelect} defaultValue="11"><option>9</option><option>10</option><option>11</option><option>12</option><option>14</option><option>16</option><option>18</option><option>24</option></Select><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('fontSize', '4') }}>A↑</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('fontSize', '2') }}>A↓</Button></div><div className={styles.ribbonRow}><Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="bold" size={17} />} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('bold') }} /><Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="italic" size={17} />} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('italic') }} /><Button appearance="subtle" className={styles.ribbonSmallButton} icon={<Icon name="underline" size={17} />} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('underline') }} /><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('strikeThrough') }}>S̶</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('subscript') }}>x₂</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('superscript') }}>x²</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('hiliteColor', '#fff100') }}>🖍<span className={styles.highlightSwatch} /></Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('foreColor', '#c50f1f') }}>A<span className={styles.colorSwatch} /></Button><Button appearance="subtle" className={styles.ribbonSmallButton} onMouseDown={(event) => { event.preventDefault(); runInlineCommand('removeFormat') }}>Aa</Button></div></div><span className={styles.ribbonGroupLabel}>Font</span></div>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}><div className={styles.ribbonGroupTwoRows}><div className={styles.ribbonRow}><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => insertBlock('list')}>•≡</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => { const block = createBlock('list'); if (block.type === 'list') block.ordered = true; updatePageAt(pageIndex, { ...currentPage, blocks: [...currentPage.blocks, block] }); setSelectedBlockId(block.id) }}>1≡</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>⇤</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>⇥</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>↕</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>¶</Button></div><div className={styles.ribbonRow}><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'left' })}>☰</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'center' })}>≡</Button><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={() => patchSelectedText({ align: 'right' })}>☷</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>☰</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>↕</Button><Button appearance="subtle" className={styles.ribbonSmallButton} disabled>▦</Button></div></div><span className={styles.ribbonGroupLabel}>Paragraph</span></div>
    <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupStyles)}><div className={styles.ribbonGroupBody}><button className={mergeClasses(styles.styleCard, selectedVariant === 'paragraph' && styles.styleCardSelected)} onClick={() => patchSelectedText({ variant: 'paragraph' })}><span className={styles.styleCardTitle}>Normal</span><span className={styles.styleCardMeta}>Body text</span></button><button className={mergeClasses(styles.styleCard, selectedVariant === 'h1' && styles.styleCardSelected)} onClick={() => patchSelectedText({ variant: 'h1' })}><span className={mergeClasses(styles.styleCardTitle, styles.styleCardHeading)}>Heading 1</span><span className={styles.styleCardMeta}>Section</span></button><button className={mergeClasses(styles.styleCard, selectedVariant === 'h2' && styles.styleCardSelected)} onClick={() => patchSelectedText({ variant: 'h2' })}><span className={styles.styleCardTitle}>Heading 2</span><span className={styles.styleCardMeta}>Subsection</span></button></div><span className={styles.ribbonGroupLabel}>Styles</span></div>
    <div className={styles.ribbonGroup}><div className={styles.ribbonGroupTwoRows}><div className={styles.ribbonRow}><Input className={styles.searchWrap} size="small" placeholder="Find" value={findQuery} onChange={(_, data) => setFindQuery(data.value)} onKeyDown={(event) => { if (event.key === 'Enter') findInDocument() }} /><Button appearance="subtle" className={styles.ribbonSmallButton} onClick={findInDocument}>⌕</Button></div><div className={styles.ribbonRow}><Button appearance="subtle" className={styles.ribbonTextButton} disabled>Replace</Button><Button appearance="subtle" className={styles.ribbonTextButton} onClick={() => setSelectedBlockId(undefined)}>Select</Button></div></div><span className={styles.ribbonGroupLabel}>Editing</span></div>
  </>

  const ribbonInsert = <><div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}><div className={styles.ribbonGroupBodyWrap}>{([['text', 'Text'], ['list', 'List'], ['code', 'Code'], ['callout', 'Callout'], ['table', 'Table'], ['diagram', 'Diagram'], ['image', 'Image'], ['institution', 'Institution'], ['divider', 'Divider']] as Array<[Block['type'], string]>).map(([type, label]) => <Button key={type} appearance="subtle" className={styles.ribbonTextButton} onClick={() => insertBlock(type)}>{label}</Button>)}</div><span className={styles.ribbonGroupLabel}>Content blocks</span></div><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={addPage}>New page</Button><Button appearance="subtle" onClick={duplicatePage}>Duplicate</Button></div><span className={styles.ribbonGroupLabel}>Pages</span></div></>
  const ribbonFile = <div className={mergeClasses(styles.ribbonGroup, styles.ribbonGroupWide)}><div className={styles.ribbonGroupBody}><Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="plus" size={23} />} onClick={newDoc}>New</Button><Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="open" size={23} />} onClick={openFromDisk}>Open</Button><Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="save" size={23} />} onClick={() => saveDocumentToDisk(doc)}>Save as</Button><Button appearance="subtle" className={styles.ribbonBigButton} icon={<Icon name="print" size={23} />} onClick={() => window.print()}>PDF</Button></div><span className={styles.ribbonGroupLabel}>Document</span></div>
  const ribbonLayout = <><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={() => movePage(-1)} disabled={pageIndex === 0}>Move up</Button><Button appearance="subtle" onClick={() => movePage(1)} disabled={pageIndex === doc.pages.length - 1}>Move down</Button><Button appearance="subtle" onClick={() => setDeleteTarget('page')} disabled={doc.pages.length <= 1}>Delete page</Button></div><span className={styles.ribbonGroupLabel}>Page order</span></div><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={() => setZoom(.75)}>75%</Button><Button appearance="subtle" onClick={() => setZoom(1)}>100%</Button><Button appearance="subtle" onClick={() => setZoom(1.15)}>115%</Button></div><span className={styles.ribbonGroupLabel}>Scale</span></div></>
  const ribbonReferences = <><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" disabled>Table of Contents</Button><Button appearance="subtle" disabled>Footnote</Button></div><span className={styles.ribbonGroupLabel}>References</span></div><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={() => { const block = createBlock('text'); if (block.type === 'text') block.variant = 'caption'; updatePageAt(pageIndex, { ...currentPage, blocks: [...currentPage.blocks, block] }); setSelectedBlockId(block.id) }}>Insert caption</Button><Button appearance="subtle" disabled>Cross-reference</Button></div><span className={styles.ribbonGroupLabel}>Captions</span></div></>
  const ribbonReview = <><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" disabled>Editor</Button><Button appearance="subtle" disabled>Comments</Button><Button appearance="subtle" onClick={() => setInspectorOpen(true)}>Properties</Button></div><span className={styles.ribbonGroupLabel}>Review</span></div><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={() => setPresenting(true)}>Preview</Button><Button appearance="subtle" onClick={() => window.print()}>Print preview</Button></div><span className={styles.ribbonGroupLabel}>Preview</span></div></>
  const ribbonView = <><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance={sidebarOpen ? 'secondary' : 'subtle'} onClick={() => setSidebarOpen((value) => !value)}>Navigation</Button><Button appearance={inspectorOpen ? 'secondary' : 'subtle'} onClick={() => setInspectorOpen((value) => !value)}>Inspector</Button><Button appearance="subtle" onClick={() => setPresenting(true)}>Focus</Button></div><span className={styles.ribbonGroupLabel}>Show</span></div><div className={styles.ribbonGroup}><div className={styles.ribbonGroupBodyWrap}><Button appearance="subtle" onClick={() => setZoom((value) => clampZoom(value - .08))}>Zoom out</Button><Button appearance="subtle" onClick={() => setZoom(1)}>100%</Button><Button appearance="subtle" onClick={() => setZoom((value) => clampZoom(value + .08))}>Zoom in</Button></div><span className={styles.ribbonGroupLabel}>Zoom</span></div></>
  const ribbonContent = ribbonTab === 'file' ? ribbonFile : ribbonTab === 'insert' ? ribbonInsert : ribbonTab === 'layout' ? ribbonLayout : ribbonTab === 'references' ? ribbonReferences : ribbonTab === 'review' ? ribbonReview : ribbonTab === 'view' ? ribbonView : ribbonHome

  return <div className={styles.root}>
    <header className={mergeClasses(styles.titlebar, styles.noPrint)}><div className={styles.titleLeft}><Tooltip content={sidebarOpen ? 'Hide navigation' : 'Show navigation'} relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="menu" size={17} />} onClick={() => setSidebarOpen((value) => !value)} /></Tooltip><span className={styles.appIcon}>E</span><Text className={styles.appName}>ERS Studio</Text><div className={styles.docTitleTop}><Badge appearance="tint" color="brand">{kindLabel(doc.kind)}</Badge><Text className={styles.docTitleText} weight="semibold">{doc.title}</Text><Icon name="down" size={13} /></div></div><div className={styles.titleRight}><span className={styles.savedState}><span className={styles.savedDot}>✓</span><Caption1>{status}</Caption1></span><Tooltip content="Undo" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="undo" size={16} />} onClick={() => runInlineCommand('undo')} /></Tooltip><Tooltip content="Redo" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="redo" size={16} />} onClick={() => runInlineCommand('redo')} /></Tooltip><Tooltip content="Collaboration is not enabled for local documents" relationship="label"><Button appearance="secondary" size="small" disabled>Share</Button></Tooltip><Tooltip content="Comments are not enabled for local documents" relationship="label"><Button appearance="subtle" size="small" disabled>▢</Button></Tooltip><Tooltip content="Document properties" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="settings" size={16} />} onClick={() => setInspectorOpen((value) => !value)} /></Tooltip><Button appearance="subtle" size="small" aria-label="More options">•••</Button><span className={styles.avatar}>E</span></div></header>
    <div className={mergeClasses(styles.tabsBar, styles.noPrint)}><TabList className={styles.tabs} selectedValue={ribbonTab} onTabSelect={(_, data) => setRibbonTab(String(data.value) as RibbonTab)}><Tab value="file">File</Tab><Tab value="home">Home</Tab><Tab value="insert">Insert</Tab><Tab value="layout">Layout</Tab><Tab value="references">References</Tab><Tab value="review">Review</Tab><Tab value="view">View</Tab></TabList><Button appearance="subtle" size="small" className={styles.editingMode}>Editing⌄</Button></div>
    <div className={mergeClasses(styles.ribbon, styles.noPrint)}>{ribbonContent}</div>
    <div className={styles.editorGrid} style={{ gridTemplateColumns: editorColumns }}>
      <aside className={mergeClasses(styles.sidebar, !sidebarOpen && styles.sidebarHidden, styles.noPrint)}><div className={styles.paneHeader}><span className={styles.paneHeaderStack}><Text className={styles.paneSectionTitle}>Documents</Text></span><Tooltip content="Close navigation" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="close" size={14} />} onClick={() => setSidebarOpen(false)} /></Tooltip></div><Button appearance="outline" className={styles.newDocumentButton} icon={<Icon name="plus" size={14} />} onClick={newDoc}>New document</Button><div className={styles.library}>{library.map((entry) => <Button key={entry.id} appearance="subtle" className={entry.id === doc.id ? styles.libraryItemActive : styles.libraryItem} onClick={() => loadDoc(entry.id)} icon={<Icon name="file" size={17} />}><span className={styles.libraryText}><Text className={styles.truncate} weight="semibold">{entry.title}</Text><Caption1>{kindLabel(entry.kind)} · {new Date(entry.updatedAt).toLocaleDateString()}</Caption1></span></Button>)}</div><div className={styles.docTools}><Button appearance="subtle" className={styles.leftAction} icon={<Icon name="copy" size={14} />} onClick={duplicateDoc}>Duplicate</Button><Button appearance="subtle" className={styles.leftAction} icon={<Icon name="undo" size={14} />} onClick={restoreSeeds}>Restore bundled version</Button><Button appearance="subtle" className={mergeClasses(styles.leftAction, styles.destructive)} icon={<Icon name="trash" size={14} />} onClick={() => setDeleteTarget('document')}>Delete document</Button></div><Divider /><div className={styles.paneHeader}><span className={styles.paneHeaderStack}><Text className={styles.paneSectionTitle}>Document outline</Text><Caption1 className={styles.paneSubtle}>Jump to a section</Caption1></span></div><nav className={styles.outline}>{outline.map(({ page, index, title }) => <Button key={page.id} appearance="subtle" className={index === pageIndex ? styles.outlineItemActive : styles.outlineItem} onClick={() => scrollToPage(index)}><span className={styles.outlineNumber}>{index + 1}</span><span className={styles.truncate}>{title}</span></Button>)}</nav></aside>
      <main className={styles.workspace}><div className={mergeClasses(styles.rulerTop, styles.noPrint)}><div className={styles.rulerTrack} style={{ width: scaledPageWidth }}><div className={styles.rulerNumbers}>{Array.from({ length: 19 }, (_, index) => <span key={index}>{index}</span>)}</div><span className={styles.rulerIndentLeft} /><span className={styles.rulerIndentRight} /></div></div><div ref={canvasRef} className={styles.canvas} onClick={() => { setSelectedBlockId(undefined); setInspectorOpen(true) }}><div className={styles.canvasInner} style={{ minWidth: Math.max(scaledPageWidth + 108, 760) }}><div className={mergeClasses(styles.verticalRuler, styles.noPrint)} style={{ left: `calc(50% - ${scaledPageWidth / 2}px - 26px)`, height: scaledPageHeight }} /><div className={styles.documentStack}>{doc.pages.map((page, index) => <div key={page.id} ref={(element) => { pageRefs.current[index] = element }} data-page-index={index} className={styles.pageItem} onMouseDown={() => setPageIndex(index)}><div className={styles.pageFrame} style={{ width: scaledPageWidth, height: scaledPageHeight }}><div className={styles.pageScale} style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${zoom})` }}><PageCanvas doc={doc} page={page} pageIndex={index} selectedBlockId={index === pageIndex ? selectedBlockId : undefined} onSelectBlock={(id) => { setPageIndex(index); setSelectedBlockId(id); if (id) setInspectorOpen(true) }} onUpdatePage={(next) => updatePageAt(index, next)} onOpenDocumentSettings={() => { setPageIndex(index); setInspectorOpen(true) }} /></div></div></div>)}</div></div></div></main>
      <div className={mergeClasses(styles.inspectorWrap, !inspectorOpen && styles.inspectorHidden, styles.noPrint)}><Inspector doc={doc} block={selectedBlock} onDocumentChange={patchDoc} onBlockChange={updateBlock} onClose={() => setInspectorOpen(false)} /></div>
    </div>
    <div className={mergeClasses(styles.statusbar, styles.noPrint)} style={{ gridTemplateColumns: statusColumns }}><div className={styles.statusLeft}><span>Page {pageIndex + 1} of {doc.pages.length}</span><span>{wordCount.toLocaleString()} words</span></div><div className={styles.statusCenter}><span className={styles.statusSaved}><span className={styles.greenDot} />{status}</span><span>Language: Auto</span><span>{pageLabel(currentPage, pageIndex)}</span></div><div className={styles.statusRight}><Tooltip content="Print layout" relationship="label"><Button appearance="subtle" size="small" className={styles.statusViewButton} icon={<Icon name="file" size={14} />} /></Tooltip><Tooltip content="Focus mode" relationship="label"><Button appearance="subtle" size="small" className={styles.statusViewButton} icon={<Icon name="play" size={14} />} onClick={() => setPresenting(true)} /></Tooltip><span>{Math.round(zoom * 100)}%</span><Button appearance="subtle" size="small" onClick={() => setZoom((value) => clampZoom(value - .05))}>−</Button><Slider className={styles.zoomSlider} min={55} max={125} step={5} value={Math.round(zoom * 100)} onChange={(_, data) => setZoom(data.value / 100)} /><Button appearance="subtle" size="small" onClick={() => setZoom((value) => clampZoom(value + .05))}>+</Button></div></div>
    <div className={mergeClasses(styles.printOnly, styles.printDocument)}>{doc.pages.map((page, index) => <PageCanvas key={page.id} doc={doc} page={page} pageIndex={index} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />)}</div>
    {presenting && <Presentation doc={doc} startPage={pageIndex} onClose={() => setPresenting(false)} />}
    <Toaster toasterId={toasterId} position="top-end" />
    <Dialog open={deleteTarget !== null} onOpenChange={(_, data) => { if (!data.open) setDeleteTarget(null) }}><DialogSurface><DialogBody><DialogTitle>{deleteTarget === 'document' ? 'Delete document?' : 'Delete page?'}</DialogTitle><DialogContent><Text className={styles.dialogText}>{deleteTarget === 'document' ? `“${doc.title}” will be removed from the local library. This action cannot be undone.` : `Page ${pageIndex + 1} will be permanently removed from this document.`}</Text></DialogContent><DialogActions><Button appearance="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button appearance="primary" onClick={() => deleteTarget === 'document' ? confirmRemoveDoc() : confirmDeletePage()}>Delete</Button></DialogActions></DialogBody></DialogSurface></Dialog>
  </div>
}
