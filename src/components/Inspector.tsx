import { useEffect, useState } from 'react'
import {
  Button,
  Caption1,
  Checkbox,
  Divider,
  Field,
  Input,
  makeStyles,
  mergeClasses,
  Select,
  Slider,
  Tab,
  TabList,
  Text,
  Textarea,
  tokens,
  Tooltip,
} from '@fluentui/react-components'
import type { Accent, Block, CalloutTone, CodeLanguage, CourseDocument, DiagramVariant, DocumentKind, DocumentTheme, TextVariant } from '../types'
import { ACCENTS, uid } from '../utils'
import { Icon } from './Icon'

type InspectorTab = 'document' | 'page' | 'selection'

const useStyles = makeStyles({
  root: { minWidth: 0, height: '100%', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#fff', '@media print': { display: 'none' } },
  header: { position: 'sticky', top: 0, zIndex: 8, backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5' },
  headerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 6px' },
  titleStack: { display: 'flex', flexDirection: 'column', gap: '1px' },
  tabs: { paddingLeft: '8px', minHeight: '36px' },
  section: { display: 'flex', flexDirection: 'column', gap: '11px', padding: '14px 13px' },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: '.065em', color: '#727272', fontWeight: 650 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  accentRow: { display: 'flex', flexWrap: 'wrap', gap: '9px' },
  accentButton: { minWidth: '24px', width: '24px', height: '24px', padding: 0, borderRadius: '50%' },
  accentSelected: { outline: '2px solid #242424', outlineOffset: '2px' },
  formatRow: { display: 'flex', gap: '4px' },
  repeatStack: { display: 'flex', flexDirection: 'column', gap: '7px' },
  repeatRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 30px', gap: '5px', alignItems: 'start' },
  diagramEditor: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', border: '1px solid #e3e3e3', borderRadius: '5px', backgroundColor: '#fafafa' },
  tableRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 30px', gap: '5px', alignItems: 'start' },
  full: { width: '100%' },
  fileInput: { width: '100%', boxSizing: 'border-box', padding: '7px', border: '1px solid #d1d1d1', borderRadius: '4px', backgroundColor: '#fff', font: 'inherit' },
  codeInput: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: '12px' },
  destructive: { color: tokens.colorPaletteRedForeground1 },
  hint: { color: '#777', lineHeight: 1.45 },
  pagePreview: { display: 'grid', placeItems: 'center', padding: '15px', border: '1px solid #e1e1e1', borderRadius: '5px', backgroundColor: '#f6f6f6' },
  miniPage: { width: '88px', height: '124px', backgroundColor: '#fff', border: '1px solid #d6d6d6', boxShadow: '0 2px 5px rgba(0,0,0,.08)', position: 'relative' },
  miniMargin: { position: 'absolute', inset: '13px 11px', border: '1px dashed #9dbbdc' },
})

const stripHtml = (value: string) => {
  const div = document.createElement('div')
  div.innerHTML = value
  return div.textContent || ''
}

const readImage = (file: File, done: (value: string) => void) => {
  const reader = new FileReader()
  reader.onload = () => done(String(reader.result))
  reader.readAsDataURL(file)
}

export function Inspector({ doc, block, onDocumentChange, onBlockChange, onClose }: {
  doc: CourseDocument
  block?: Block
  onDocumentChange: (doc: CourseDocument) => void
  onBlockChange: (block: Block) => void
  onClose?: () => void
}) {
  const styles = useStyles()
  const [tab, setTab] = useState<InspectorTab>(block ? 'selection' : 'document')
  const patchDoc = (patch: Partial<CourseDocument>) => onDocumentChange({ ...doc, ...patch, updatedAt: new Date().toISOString() })
  const patchTheme = (patch: Partial<DocumentTheme>) => patchDoc({ theme: { ...doc.theme, ...patch } })
  const patch = (value: Block) => onBlockChange(value)

  useEffect(() => {
    if (block) setTab('selection')
    else if (tab === 'selection') setTab('document')
  }, [block])

  return <aside className={styles.root}>
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <span className={styles.titleStack}><Text weight="semibold">Inspector</Text><Caption1>{tab === 'selection' && block ? `Selected ${block.type}` : tab === 'page' ? 'Page properties' : 'Document properties'}</Caption1></span>
        {onClose && <Tooltip content="Close Inspector" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="close" size={15} />} onClick={onClose} /></Tooltip>}
      </div>
      <TabList className={styles.tabs} selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value) as InspectorTab)}>
        <Tab value="document">Document</Tab><Tab value="page">Page</Tab><Tab value="selection" disabled={!block}>Selection</Tab>
      </TabList>
    </div>

    {tab === 'document' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>General</Caption1>
      <Field label="Title"><Input value={doc.title} onChange={(_, data) => patchDoc({ title: data.value })} /></Field>
      <Field label="Subtitle"><Input value={doc.subtitle || ''} onChange={(_, data) => patchDoc({ subtitle: data.value })} /></Field>
      <Field label="Course"><Input value={doc.subject} onChange={(_, data) => patchDoc({ subject: data.value })} /></Field>
      <Field label="Document type"><Select value={doc.kind} onChange={(event) => patchDoc({ kind: event.target.value as DocumentKind })}><option value="praktikum">Practicum</option><option value="specifikacija">Project specification</option><option value="skripta">Course notes</option><option value="dokument">Document</option></Select></Field>
    </div>}

    {tab === 'page' && <>
      <div className={styles.section}>
        <Caption1 className={styles.sectionTitle}>Page setup</Caption1>
        <div className={styles.pagePreview}><div className={styles.miniPage}><span className={styles.miniMargin} /></div></div>
        <div className={styles.twoCol}><Field label="Paper"><Select value="A4" disabled><option>A4</option></Select></Field><Field label="Orientation"><Select value="portrait" disabled><option value="portrait">Portrait</option></Select></Field></div>
      </div>
      <Divider />
      <div className={styles.section}>
        <Caption1 className={styles.sectionTitle}>Appearance</Caption1>
        <Field label="Theme"><Select value={doc.theme.name} onChange={(event) => patchTheme({ name: event.target.value as DocumentTheme['name'] })}><option>Academic Light</option><option>Editorial Light</option><option>Minimal Light</option></Select></Field>
        <div className={styles.twoCol}><Field label="Typography"><Select value={doc.theme.font} onChange={(event) => patchTheme({ font: event.target.value as DocumentTheme['font'] })}><option value="System">Segoe UI</option><option value="Serif">Georgia</option><option value="Humanist">Trebuchet MS</option></Select></Field><Field label="Density"><Select value={doc.theme.density} onChange={(event) => patchTheme({ density: event.target.value as DocumentTheme['density'] })}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></Select></Field></div>
        <Field label="Accent color"><div className={styles.accentRow}>{(Object.keys(ACCENTS) as Accent[]).map((accent) => <Tooltip key={accent} content={accent} relationship="label"><Button appearance="outline" className={mergeClasses(styles.accentButton, doc.theme.accent === accent && styles.accentSelected)} style={{ backgroundColor: ACCENTS[accent].solid }} onClick={() => patchTheme({ accent })} aria-label={accent} /></Tooltip>)}</div></Field>
      </div>
      <Divider />
      <div className={styles.section}>
        <Caption1 className={styles.sectionTitle}>Header & footer</Caption1>
        <Field label="Header"><Input value={doc.headerText || ''} onChange={(_, data) => patchDoc({ headerText: data.value })} /></Field>
        <Field label="Footer"><Input value={doc.footerText || ''} onChange={(_, data) => patchDoc({ footerText: data.value })} /></Field>
      </div>
    </>}

    {tab === 'selection' && block?.type === 'text' && <>
      <div className={styles.section}>
        <Caption1 className={styles.sectionTitle}>Text</Caption1>
        <Field label="Style"><Select value={block.variant} onChange={(event) => patch({ ...block, variant: event.target.value as TextVariant })}><option value="title">Document title</option><option value="subtitle">Subtitle</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="paragraph">Normal</option><option value="quote">Quote</option><option value="caption">Caption</option></Select></Field>
        <Field label="Alignment"><Select value={block.align || 'left'} onChange={(event) => patch({ ...block, align: event.target.value as 'left' | 'center' | 'right' })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></Select></Field>
      </div>
      <Divider />
      <div className={styles.section}>
        <Caption1 className={styles.sectionTitle}>Formatting</Caption1>
        <div className={styles.formatRow}><Tooltip content="Bold" relationship="label"><Button appearance="subtle" icon={<Icon name="bold" size={16} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('bold') }} /></Tooltip><Tooltip content="Italic" relationship="label"><Button appearance="subtle" icon={<Icon name="italic" size={16} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('italic') }} /></Tooltip><Tooltip content="Underline" relationship="label"><Button appearance="subtle" icon={<Icon name="underline" size={16} />} onMouseDown={(event) => { event.preventDefault(); document.execCommand('underline') }} /></Tooltip></div>
      </div>
    </>}

    {tab === 'selection' && block?.type === 'list' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>List</Caption1>
      <Field label="List type"><Select value={block.ordered ? 'ordered' : 'unordered'} onChange={(event) => patch({ ...block, ordered: event.target.value === 'ordered' })}><option value="unordered">Bulleted</option><option value="ordered">Numbered</option></Select></Field>
      <div className={styles.repeatStack}>{block.items.map((item, index) => <div className={styles.repeatRow} key={index}><Input value={stripHtml(item)} onChange={(_, data) => { const items = [...block.items]; items[index] = data.value; patch({ ...block, items }) }} /><Button appearance="subtle" icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, items: block.items.filter((_, itemIndex) => itemIndex !== index) })} /></div>)}</div>
      <Button appearance="secondary" className={styles.full} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, items: [...block.items, 'New item'] })}>Add item</Button>
    </div>}

    {tab === 'selection' && block?.type === 'code' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>Code block</Caption1>
      <Field label="Language"><Select value={block.language} onChange={(event) => patch({ ...block, language: event.target.value as CodeLanguage })}><option value="csharp">C#</option><option value="bash">Shell / CLI</option><option value="json">JSON</option><option value="markdown">Markdown</option><option value="typescript">TypeScript</option><option value="text">Text</option></Select></Field>
      <Field label="Caption"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
      <Field label="Code"><Textarea className={styles.codeInput} value={block.code} rows={15} resize="vertical" onChange={(_, data) => patch({ ...block, code: data.value })} /></Field>
      <Checkbox checked={!!block.lineNumbers} label="Show line numbers" onChange={(_, data) => patch({ ...block, lineNumbers: data.checked === true })} />
    </div>}

    {tab === 'selection' && block?.type === 'callout' && <div className={styles.section}><Caption1 className={styles.sectionTitle}>Callout</Caption1><Field label="Type"><Select value={block.tone} onChange={(event) => patch({ ...block, tone: event.target.value as CalloutTone })}><option value="info">Information</option><option value="note">Note</option><option value="task">Task</option><option value="warning">Warning</option><option value="success">Result</option></Select></Field></div>}

    {tab === 'selection' && block?.type === 'diagram' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>Diagram</Caption1>
      <Field label="Layout"><Select value={block.variant} onChange={(event) => patch({ ...block, variant: event.target.value as DiagramVariant })}><option value="flow">Flow</option><option value="timeline">Timeline</option><option value="pipeline">Pipeline</option><option value="stack">Layers</option><option value="hub">Hub and branches</option></Select></Field>
      <Field label="Title"><Input value={block.title || ''} onChange={(_, data) => patch({ ...block, title: data.value })} /></Field>
      {block.variant !== 'stack' && <Field label="Columns"><Select value={block.columns || 4} onChange={(event) => patch({ ...block, columns: Number(event.target.value) as 2 | 3 | 4 | 5 })}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></Select></Field>}
      <div className={styles.repeatStack}>{block.items.map((item, index) => <div className={styles.diagramEditor} key={item.id}><div className={styles.repeatRow}><Input value={item.title} onChange={(_, data) => { const items = [...block.items]; items[index] = { ...item, title: data.value }; patch({ ...block, items }) }} /><Button appearance="subtle" className={styles.destructive} icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, items: block.items.filter((candidate) => candidate.id !== item.id) })} /></div><Input value={item.subtitle || ''} placeholder="Short description" onChange={(_, data) => { const items = [...block.items]; items[index] = { ...item, subtitle: data.value }; patch({ ...block, items }) }} /><Select value={item.accent || 'blue'} onChange={(event) => { const items = [...block.items]; items[index] = { ...item, accent: event.target.value as Accent }; patch({ ...block, items }) }}>{Object.keys(ACCENTS).map((accent) => <option key={accent} value={accent}>{accent}</option>)}</Select></div>)}</div>
      <Button appearance="secondary" className={styles.full} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, items: [...block.items, { id: uid('item'), title: 'New item', subtitle: 'description', accent: 'blue' }] })}>Add item</Button>
      <Field label="Caption"><Input value={block.footer || ''} onChange={(_, data) => patch({ ...block, footer: data.value })} /></Field>
    </div>}

    {tab === 'selection' && block?.type === 'table' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>Table</Caption1>
      <Field label="Caption"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
      <Caption1>Columns</Caption1>
      <div className={styles.repeatStack}>{block.headers.map((header, index) => <div className={styles.repeatRow} key={index}><Input value={stripHtml(header)} onChange={(_, data) => { const headers = [...block.headers]; headers[index] = data.value; const rows = block.rows.map((row) => { const copy = [...row]; while (copy.length < headers.length) copy.push(''); return copy.slice(0, headers.length) }); patch({ ...block, headers, rows }) }} /><Button appearance="subtle" disabled={block.headers.length <= 1} icon={<Icon name="trash" size={14} />} onClick={() => { const headers = block.headers.filter((_, itemIndex) => itemIndex !== index); const rows = block.rows.map((row) => row.filter((_, itemIndex) => itemIndex !== index)); patch({ ...block, headers, rows }) }} /></div>)}</div>
      <Button appearance="secondary" className={styles.full} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, headers: [...block.headers, `Column ${block.headers.length + 1}`], rows: block.rows.map((row) => [...row, '']) })}>Add column</Button>
      <Caption1>Rows</Caption1>
      <div className={styles.repeatStack}>{block.rows.map((row, rowIndex) => <div className={styles.tableRow} key={rowIndex}><Input value={row.map(stripHtml).join(' | ')} onChange={(_, data) => { const rows = block.rows.map((candidate) => [...candidate]); const parts = data.value.split('|').map((part) => part.trim()); rows[rowIndex] = block.headers.map((_, columnIndex) => parts[columnIndex] || ''); patch({ ...block, rows }) }} /><Button appearance="subtle" icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, rows: block.rows.filter((_, index) => index !== rowIndex) })} /></div>)}</div>
      <Button appearance="secondary" className={styles.full} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, rows: [...block.rows, block.headers.map(() => '')] })}>Add row</Button>
    </div>}

    {tab === 'selection' && block?.type === 'image' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>Image</Caption1>
      <Field label="Image"><input type="file" accept="image/*" className={styles.fileInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (src) => patch({ ...block, src })) }} /></Field>
      <Field label="Caption"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
      <Field label={`Width: ${block.widthPercent || 100}%`}><Slider min={40} max={100} step={5} value={block.widthPercent || 100} onChange={(_, data) => patch({ ...block, widthPercent: data.value })} /></Field>
    </div>}

    {tab === 'selection' && block?.type === 'institution' && <div className={styles.section}>
      <Caption1 className={styles.sectionTitle}>Institution</Caption1>
      <Field label="University"><Input value={stripHtml(block.university)} onChange={(_, data) => patch({ ...block, university: data.value })} /></Field>
      <Field label="Faculty"><Input value={stripHtml(block.faculty)} onChange={(_, data) => patch({ ...block, faculty: data.value })} /></Field>
      <Field label="Department"><Input value={stripHtml(block.department || '')} onChange={(_, data) => patch({ ...block, department: data.value })} /></Field>
      <Field label="Left logo"><input type="file" accept="image/*" className={styles.fileInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (leftLogoSrc) => patch({ ...block, leftLogoSrc })) }} /></Field>
      <Field label="Right logo"><input type="file" accept="image/*" className={styles.fileInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (rightLogoSrc) => patch({ ...block, rightLogoSrc })) }} /></Field>
    </div>}

    {tab === 'selection' && block?.type === 'divider' && <div className={styles.section}><Caption1 className={styles.hint}>Divider block</Caption1></div>}
  </aside>
}
