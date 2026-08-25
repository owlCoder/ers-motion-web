import {
  Button,
  Caption1,
  Checkbox,
  Divider,
  Field,
  Input,
  makeStyles,
  Select,
  Slider,
  Text,
  Textarea,
  tokens,
  Tooltip,
} from '@fluentui/react-components'
import type { Accent, Block, CalloutTone, CodeLanguage, CourseDocument, DiagramVariant, DocumentKind, DocumentTheme, TextVariant } from '../types'
import { ACCENTS, uid } from '../utils'
import { Icon } from './Icon'

const useStyles = makeStyles({
  root: {
    minWidth: 0,
    height: '100%',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media print': { display: 'none' },
  },
  header: {
    position: 'sticky', top: 0, zIndex: 5,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  titleStack: { display: 'flex', flexDirection: 'column', gap: '2px' },
  section: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, padding: tokens.spacingHorizontalM },
  sectionTitle: { textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.colorNeutralForeground3 },
  accentRow: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  accentButton: { minWidth: '28px', width: '28px', height: '28px', padding: 0, borderRadius: '50%' },
  accentSelected: { outline: `2px solid ${tokens.colorNeutralForeground1}`, outlineOffset: '2px' },
  formatRow: { display: 'flex', gap: tokens.spacingHorizontalXS },
  repeatStack: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  repeatRow: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: tokens.spacingHorizontalXS, alignItems: 'start' },
  diagramEditor: {
    display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalS, border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground2,
  },
  tableRow: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr)) auto', gap: tokens.spacingHorizontalXS, alignItems: 'start' },
  full: { width: '100%' },
  fileInput: {
    width: '100%', boxSizing: 'border-box', padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  codeInput: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' },
  destructive: { color: tokens.colorPaletteRedForeground1 },
})

const fluentClassNames = (...classes: Array<string | false | null | undefined>) => classes
  .flatMap((value) => typeof value === 'string' ? value.split(/\s+/) : [])
  .filter((value) => value && !value.startsWith('___'))
  .join(' ')

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
  const patchDoc = (patch: Partial<CourseDocument>) => onDocumentChange({ ...doc, ...patch, updatedAt: new Date().toISOString() })
  const patchTheme = (patch: Partial<DocumentTheme>) => patchDoc({ theme: { ...doc.theme, ...patch } })

  const header = (title: string, subtitle: string) => (
    <div className={styles.header}>
      <span className={styles.titleStack}><Text weight="semibold">{title}</Text><Caption1>{subtitle}</Caption1></span>
      {onClose && <Tooltip content="Zatvori panel" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="close" size={16} />} onClick={onClose} /></Tooltip>}
    </div>
  )

  if (!block) {
    return (
      <aside className={styles.root}>
        {header('Dokument', 'Izgled i metapodaci')}
        <div className={styles.section}>
          <Field label="Naslov"><Input value={doc.title} onChange={(_, data) => patchDoc({ title: data.value })} /></Field>
          <Field label="Podnaslov"><Input value={doc.subtitle || ''} onChange={(_, data) => patchDoc({ subtitle: data.value })} /></Field>
          <Field label="Predmet"><Input value={doc.subject} onChange={(_, data) => patchDoc({ subject: data.value })} /></Field>
          <Field label="Vrsta dokumenta"><Select value={doc.kind} onChange={(e) => patchDoc({ kind: e.target.value as DocumentKind })}><option value="praktikum">Praktikum</option><option value="specifikacija">Projektna specifikacija</option><option value="skripta">Skripta</option><option value="dokument">Dokument</option></Select></Field>
        </div>
        <Divider />
        <div className={styles.section}>
          <Caption1 className={fluentClassNames(styles.sectionTitle)}>Tipografija i stil</Caption1>
          <Field label="Tema"><Select value={doc.theme.name} onChange={(e) => patchTheme({ name: e.target.value as DocumentTheme['name'] })}><option>Academic Light</option><option>Editorial Light</option><option>Minimal Light</option></Select></Field>
          <Field label="Tipografija"><Select value={doc.theme.font} onChange={(e) => patchTheme({ font: e.target.value as DocumentTheme['font'] })}><option value="System">Sans serif</option><option value="Serif">Serif</option><option value="Humanist">Humanist sans</option></Select></Field>
          <Field label="Gustina"><Select value={doc.theme.density} onChange={(e) => patchTheme({ density: e.target.value as DocumentTheme['density'] })}><option value="comfortable">Komforna</option><option value="compact">Kompaktna</option></Select></Field>
          <Field label="Akcent">
            <div className={styles.accentRow}>{(Object.keys(ACCENTS) as Accent[]).map((accent) => (
              <Tooltip key={accent} content={accent} relationship="label">
                <Button
                  appearance="outline"
                  className={fluentClassNames(styles.accentButton, doc.theme.accent === accent ? styles.accentSelected : '')}
                  style={{ backgroundColor: ACCENTS[accent].solid }}
                  onClick={() => patchTheme({ accent })}
                  aria-label={accent}
                />
              </Tooltip>
            ))}</div>
          </Field>
        </div>
        <Divider />
        <div className={styles.section}>
          <Caption1 className={fluentClassNames(styles.sectionTitle)}>Zaglavlje i podnožje</Caption1>
          <Field label="Zaglavlje"><Input value={doc.headerText || ''} onChange={(_, data) => patchDoc({ headerText: data.value })} /></Field>
          <Field label="Podnožje"><Input value={doc.footerText || ''} onChange={(_, data) => patchDoc({ footerText: data.value })} /></Field>
        </div>
      </aside>
    )
  }

  const patch = (value: Block) => onBlockChange(value)

  return (
    <aside className={styles.root}>
      {header('Izabrani blok', block.type)}

      {block.type === 'text' && <>
        <div className={styles.section}>
          <Field label="Tip teksta"><Select value={block.variant} onChange={(e) => patch({ ...block, variant: e.target.value as TextVariant })}><option value="title">Naslov dokumenta</option><option value="subtitle">Podnaslov</option><option value="h1">Naslov 1</option><option value="h2">Naslov 2</option><option value="h3">Naslov 3</option><option value="paragraph">Paragraf</option><option value="quote">Istaknuti tekst</option><option value="caption">Opis / caption</option></Select></Field>
          <Field label="Poravnanje"><Select value={block.align || 'left'} onChange={(e) => patch({ ...block, align: e.target.value as 'left' | 'center' | 'right' })}><option value="left">Levo</option><option value="center">Centar</option><option value="right">Desno</option></Select></Field>
        </div>
        <Divider />
        <div className={styles.section}>
          <Caption1 className={fluentClassNames(styles.sectionTitle)}>Formatiranje označenog teksta</Caption1>
          <div className={styles.formatRow}>
            <Tooltip content="Podebljano" relationship="label"><Button appearance="subtle" icon={<Icon name="bold" size={16} />} onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold') }} /></Tooltip>
            <Tooltip content="Kurziv" relationship="label"><Button appearance="subtle" icon={<Icon name="italic" size={16} />} onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic') }} /></Tooltip>
            <Tooltip content="Podvučeno" relationship="label"><Button appearance="subtle" icon={<Icon name="underline" size={16} />} onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline') }} /></Tooltip>
          </div>
          <Caption1>Označite tekst direktno na stranici, zatim primenite format.</Caption1>
        </div>
      </>}

      {block.type === 'list' && <div className={styles.section}>
        <Field label="Vrsta liste"><Select value={block.ordered ? 'ordered' : 'unordered'} onChange={(e) => patch({ ...block, ordered: e.target.value === 'ordered' })}><option value="unordered">Lista sa oznakama</option><option value="ordered">Numerisana lista</option></Select></Field>
        <Caption1 className={fluentClassNames(styles.sectionTitle)}>Stavke</Caption1>
        <div className={styles.repeatStack}>{block.items.map((item, i) => <div className={styles.repeatRow} key={i}><Input value={stripHtml(item)} onChange={(_, data) => { const items = [...block.items]; items[i] = data.value; patch({ ...block, items }) }} /><Button appearance="subtle" icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, items: block.items.filter((_, j) => j !== i) })} /></div>)}</div>
        <Button appearance="secondary" className={fluentClassNames(styles.full)} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, items: [...block.items, 'Nova stavka'] })}>Dodaj stavku</Button>
      </div>}

      {block.type === 'code' && <div className={styles.section}>
        <Field label="Jezik"><Select value={block.language} onChange={(e) => patch({ ...block, language: e.target.value as CodeLanguage })}><option value="csharp">C#</option><option value="bash">Shell / CLI</option><option value="json">JSON</option><option value="markdown">Markdown</option><option value="typescript">TypeScript</option><option value="text">Tekst</option></Select></Field>
        <Field label="Opis"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
        <Field label="Kod"><Textarea className={fluentClassNames(styles.codeInput)} value={block.code} rows={16} resize="vertical" onChange={(_, data) => patch({ ...block, code: data.value })} /></Field>
        <Checkbox checked={!!block.lineNumbers} label="Brojevi linija" onChange={(_, data) => patch({ ...block, lineNumbers: data.checked === true })} />
      </div>}

      {block.type === 'callout' && <div className={styles.section}>
        <Field label="Vrsta"><Select value={block.tone} onChange={(e) => patch({ ...block, tone: e.target.value as CalloutTone })}><option value="info">Informacija</option><option value="note">Napomena</option><option value="task">Zadatak</option><option value="warning">Upozorenje</option><option value="success">Rezultat</option></Select></Field>
      </div>}

      {block.type === 'diagram' && <div className={styles.section}>
        <Field label="Raspored"><Select value={block.variant} onChange={(e) => patch({ ...block, variant: e.target.value as DiagramVariant })}><option value="flow">Tok</option><option value="timeline">Vremenska linija</option><option value="pipeline">Proces</option><option value="stack">Slojevi</option><option value="hub">Centralni element i grane</option></Select></Field>
        <Field label="Naslov"><Input value={block.title || ''} onChange={(_, data) => patch({ ...block, title: data.value })} /></Field>
        {block.variant !== 'stack' && <Field label="Kolone"><Select value={block.columns || 4} onChange={(e) => patch({ ...block, columns: Number(e.target.value) as 2 | 3 | 4 | 5 })}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></Select></Field>}
        <Caption1 className={fluentClassNames(styles.sectionTitle)}>Elementi</Caption1>
        <div className={styles.repeatStack}>{block.items.map((item, i) => <div className={styles.diagramEditor} key={item.id}>
          <div className={styles.repeatRow}><Input value={item.title} onChange={(_, data) => { const items = [...block.items]; items[i] = { ...item, title: data.value }; patch({ ...block, items }) }} /><Button appearance="subtle" className={fluentClassNames(styles.destructive)} icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, items: block.items.filter((x) => x.id !== item.id) })} /></div>
          <Input value={item.subtitle || ''} placeholder="Kratak opis" onChange={(_, data) => { const items = [...block.items]; items[i] = { ...item, subtitle: data.value }; patch({ ...block, items }) }} />
          <Select value={item.accent || 'blue'} onChange={(e) => { const items = [...block.items]; items[i] = { ...item, accent: e.target.value as Accent }; patch({ ...block, items }) }}>{Object.keys(ACCENTS).map((accent) => <option key={accent} value={accent}>{accent}</option>)}</Select>
        </div>)}</div>
        <Button appearance="secondary" className={fluentClassNames(styles.full)} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, items: [...block.items, { id: uid('item'), title: 'Novi element', subtitle: 'opis', accent: 'blue' }] })}>Dodaj element</Button>
        <Field label="Opis ispod dijagrama"><Input value={block.footer || ''} onChange={(_, data) => patch({ ...block, footer: data.value })} /></Field>
      </div>}

      {block.type === 'table' && <div className={styles.section}>
        <Field label="Opis"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
        <Caption1 className={fluentClassNames(styles.sectionTitle)}>Kolone</Caption1>
        <div className={styles.repeatStack}>{block.headers.map((header, i) => <div className={styles.repeatRow} key={i}><Input value={stripHtml(header)} onChange={(_, data) => { const headers = [...block.headers]; headers[i] = data.value; const rows = block.rows.map((row) => { const copy = [...row]; while (copy.length < headers.length) copy.push(''); return copy.slice(0, headers.length) }); patch({ ...block, headers, rows }) }} /><Button appearance="subtle" disabled={block.headers.length <= 1} icon={<Icon name="trash" size={14} />} onClick={() => { const headers = block.headers.filter((_, j) => j !== i); const rows = block.rows.map((row) => row.filter((_, j) => j !== i)); patch({ ...block, headers, rows }) }} /></div>)}</div>
        <Button appearance="secondary" className={fluentClassNames(styles.full)} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, headers: [...block.headers, `Kolona ${block.headers.length + 1}`], rows: block.rows.map((row) => [...row, '']) })}>Dodaj kolonu</Button>
        <Caption1 className={fluentClassNames(styles.sectionTitle)}>Redovi</Caption1>
        <div className={styles.repeatStack}>{block.rows.map((row, ri) => <div className={styles.tableRow} key={ri}>{row.map((cell, ci) => <Input key={ci} value={stripHtml(cell)} onChange={(_, data) => { const rows = block.rows.map((r) => [...r]); rows[ri][ci] = data.value; patch({ ...block, rows }) }} />)}<Button appearance="subtle" icon={<Icon name="trash" size={14} />} onClick={() => patch({ ...block, rows: block.rows.filter((_, i) => i !== ri) })} /></div>)}</div>
        <Button appearance="secondary" className={fluentClassNames(styles.full)} icon={<Icon name="plus" size={14} />} onClick={() => patch({ ...block, rows: [...block.rows, block.headers.map(() => '')] })}>Dodaj red</Button>
      </div>}

      {block.type === 'image' && <div className={styles.section}>
        <Field label="Slika"><input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const file = e.target.files?.[0]; if (file) readImage(file, (src) => patch({ ...block, src })) }} /></Field>
        <Field label="Opis"><Input value={block.caption || ''} onChange={(_, data) => patch({ ...block, caption: data.value })} /></Field>
        <Field label={`Širina: ${block.widthPercent || 100}%`}><Slider min={40} max={100} step={5} value={block.widthPercent || 100} onChange={(_, data) => patch({ ...block, widthPercent: data.value })} /></Field>
      </div>}

      {block.type === 'institution' && <div className={styles.section}>
        <Field label="Univerzitet"><Input value={stripHtml(block.university)} onChange={(_, data) => patch({ ...block, university: data.value })} /></Field>
        <Field label="Fakultet"><Input value={stripHtml(block.faculty)} onChange={(_, data) => patch({ ...block, faculty: data.value })} /></Field>
        <Field label="Departman / odsek"><Input value={stripHtml(block.department || '')} onChange={(_, data) => patch({ ...block, department: data.value })} /></Field>
        <Field label="Levi logo"><input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const file = e.target.files?.[0]; if (file) readImage(file, (leftLogoSrc) => patch({ ...block, leftLogoSrc })) }} /></Field>
        <Field label="Desni logo"><input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const file = e.target.files?.[0]; if (file) readImage(file, (rightLogoSrc) => patch({ ...block, rightLogoSrc })) }} /></Field>
      </div>}

      {block.type === 'divider' && <div className={styles.section}><Caption1>Razdelna linija između dve celine sadržaja.</Caption1></div>}
    </aside>
  )
}
