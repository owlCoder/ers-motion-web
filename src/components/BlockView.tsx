import { useMemo } from 'react'
import { Button, makeStyles, mergeClasses, tokens, Toolbar, ToolbarButton, Tooltip } from '@fluentui/react-components'
import type { Block, CalloutBlock, CodeBlock, DiagramBlock, ImageBlock, InstitutionBlock, ListBlock, TableBlock, TextBlock } from '../types'
import { ACCENTS, highlightCode, type ArtifactMeta } from '../utils'
import { EditableText } from './EditableText'
import { Icon } from './Icon'

export type BlockAction = 'delete' | 'duplicate' | 'up' | 'down'

const useEditorStyles = makeStyles({
  blockRoot: {
    position: 'relative',
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: 'outline-color, background-color, box-shadow',
    transitionDuration: '120ms',
  },
  selected: {
    outline: `2px solid ${tokens.colorBrandStroke1}`,
    outlineOffset: '4px',
    backgroundColor: 'rgba(15,108,189,.025)',
  },
  rail: {
    position: 'absolute',
    left: '-45px',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '3px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    zIndex: 4,
    transitionProperty: 'opacity, transform',
    transitionDuration: '120ms',
    '@media print': { display: 'none' },
  },
  railHidden: { opacity: 0, transform: 'translateX(4px)', pointerEvents: 'none' },
  drag: { cursor: 'grab', minWidth: '28px', width: '28px', height: '28px' },
  destructive: { color: tokens.colorPaletteRedForeground1 },
  insertWrap: { marginTop: tokens.spacingVerticalM, '@media print': { display: 'none' } },
  insertToolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2px',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalXS,
    backgroundColor: 'rgba(255,255,255,.72)',
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    opacity: .58,
    transitionProperty: 'opacity, border-color, box-shadow',
    transitionDuration: '140ms',
    ':hover': { opacity: 1, borderTopColor: tokens.colorBrandStroke2, borderRightColor: tokens.colorBrandStroke2, borderBottomColor: tokens.colorBrandStroke2, borderLeftColor: tokens.colorBrandStroke2, boxShadow: tokens.shadow2 },
  },
})

function BlockChrome({ selected, onSelect, onAction, onDragStart, children }: { selected: boolean; onSelect: () => void; onAction: (a: BlockAction) => void; onDragStart: (e: React.DragEvent) => void; children: React.ReactNode }) {
  const styles = useEditorStyles()
  return (
    <div className={mergeClasses(styles.blockRoot, selected && styles.selected)} onClick={(event) => { event.stopPropagation(); onSelect() }}>
      <div className={mergeClasses(styles.rail, !selected && styles.railHidden)}>
        <Tooltip content="Drag block" relationship="label"><Button appearance="subtle" size="small" className={styles.drag} draggable onDragStart={onDragStart}>⋮⋮</Button></Tooltip>
        <Tooltip content="Move up" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="up" size={15} />} onClick={() => onAction('up')} /></Tooltip>
        <Tooltip content="Move down" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="down" size={15} />} onClick={() => onAction('down')} /></Tooltip>
        <Tooltip content="Duplicate" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="copy" size={15} />} onClick={() => onAction('duplicate')} /></Tooltip>
        <Tooltip content="Delete" relationship="label"><Button appearance="subtle" size="small" className={styles.destructive} icon={<Icon name="trash" size={15} />} onClick={() => onAction('delete')} /></Tooltip>
      </div>
      {children}
    </div>
  )
}

function ArtifactCaption({ meta, caption }: { meta?: ArtifactMeta; caption?: string }) {
  if (!meta && !caption) return null
  return <figcaption>{meta && <span className="artifact-number">{meta.label}</span>}{caption && <span>{meta ? ` — ${caption}` : caption}</span>}</figcaption>
}

function TextView({ block, update, select }: { block: TextBlock; update: (b: Block) => void; select: () => void }) {
  const cls = `text-block text-${block.variant} align-${block.align || 'left'}`
  return <EditableText html={block.html} className={cls} onFocus={select} onChange={(html) => update({ ...block, html })} />
}

function ListView({ block, update, select }: { block: ListBlock; update: (b: Block) => void; select: () => void }) {
  const Tag = block.ordered ? 'ol' : 'ul'
  return (
    <Tag className={`list-block ${block.ordered ? 'ordered' : ''}`}>
      {block.items.map((item, i) => (
        <li key={i}>
          <EditableText html={item} onFocus={select} className="list-item-editor" onChange={(html) => {
            const items = [...block.items]
            items[i] = html
            update({ ...block, items })
          }} />
        </li>
      ))}
    </Tag>
  )
}

function CodeView({ block, meta }: { block: CodeBlock; meta?: ArtifactMeta }) {
  const highlightedLines = useMemo(() => highlightCode(block.code, block.language).split('\n'), [block.code, block.language])
  const languageLabel = ({ csharp: 'C#', bash: 'Shell', json: 'JSON', markdown: 'Markdown', typescript: 'TypeScript', text: 'Text' } as const)[block.language]
  return (
    <figure className="code-figure">
      <div className="code-header"><span>{languageLabel}</span></div>
      <div className={`code-block ${block.lineNumbers ? 'with-lines' : ''}`}>
        {highlightedLines.map((line, index) => <div className="code-line" key={index}>
          {block.lineNumbers && <span className="line-number" aria-hidden="true">{index + 1}</span>}
          <code dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
        </div>)}
      </div>
      <ArtifactCaption meta={meta} caption={block.caption} />
    </figure>
  )
}

const tones: Record<CalloutBlock['tone'], { icon: string }> = {
  info: { icon: 'i' }, note: { icon: '✦' }, task: { icon: '✓' }, warning: { icon: '!' }, success: { icon: '✓' },
}

function CalloutView({ block, update, select }: { block: CalloutBlock; update: (b: Block) => void; select: () => void }) {
  return (
    <div className={`callout callout-${block.tone}`}>
      <div className="callout-icon">{tones[block.tone].icon}</div>
      <div className="callout-body">
        <EditableText html={block.title} onFocus={select} className="callout-title" onChange={(title) => update({ ...block, title })} />
        <EditableText html={block.text} onFocus={select} className="callout-text" onChange={(text) => update({ ...block, text })} />
      </div>
    </div>
  )
}

function TableView({ block, meta }: { block: TableBlock; meta?: ArtifactMeta }) {
  return (
    <figure className="table-figure">
      <div className="table-scroll"><table>{block.headers.length > 0 && <thead><tr>{block.headers.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: h }} />)}</tr></thead>}<tbody>{block.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: c }} />)}</tr>)}</tbody></table></div>
      <ArtifactCaption meta={meta} caption={block.caption} />
    </figure>
  )
}

function DiagramCard({ item, compact = false }: { item: DiagramBlock['items'][number]; compact?: boolean }) {
  const accent = ACCENTS[item.accent || 'blue']
  return <div className={`diagram-card ${compact ? 'compact' : ''}`} style={{ '--accent': accent.solid, '--accent-soft': accent.soft } as React.CSSProperties}><div className="diagram-title">{item.title}</div>{item.subtitle && <div className="diagram-subtitle">{item.subtitle}</div>}</div>
}

function DiagramView({ block, meta }: { block: DiagramBlock; meta?: ArtifactMeta }) {
  if (block.variant === 'stack') return <figure className="diagram">{block.title && <div className="diagram-heading">{block.title}</div>}<div className="diagram-stack">{block.items.map((item) => <DiagramCard key={item.id} item={item} />)}</div><ArtifactCaption meta={meta} caption={block.footer} /></figure>
  if (block.variant === 'hub') {
    const [hub, ...children] = block.items
    return <figure className="diagram diagram-hub">{block.title && <div className="diagram-heading">{block.title}</div>}{hub && <div className="hub-center"><DiagramCard item={hub} /></div>}<div className="hub-connector" /><div className="hub-children" style={{ gridTemplateColumns: `repeat(${Math.min(block.columns || 4, Math.max(children.length, 1))}, minmax(0,1fr))` }}>{children.map((item) => <DiagramCard key={item.id} item={item} compact />)}</div><ArtifactCaption meta={meta} caption={block.footer} /></figure>
  }
  const columns = block.columns || Math.min(5, Math.max(2, block.items.length)) as 2 | 3 | 4 | 5
  return <figure className={`diagram diagram-${block.variant}`}>{block.title && <div className="diagram-heading">{block.title}</div>}<div className="diagram-flow" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>{block.items.map((item, i) => <div key={item.id} className="flow-item-wrap"><DiagramCard item={item} compact={block.items.length > 5} />{i < block.items.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}</div>)}</div><ArtifactCaption meta={meta} caption={block.footer} /></figure>
}

function ImageView({ block, meta }: { block: ImageBlock; meta?: ArtifactMeta }) {
  if (!block.src) return <div className="image-placeholder"><Icon name="image" size={28} /><span>Choose an image in the Inspector</span></div>
  return <figure className="image-figure" style={{ width: `${block.widthPercent || 100}%` }}><img src={block.src} alt={block.alt || ''} /><ArtifactCaption meta={meta} caption={block.caption} /></figure>
}

function InstitutionView({ block, update, select }: { block: InstitutionBlock; update: (b: Block) => void; select: () => void }) {
  return <div className="institution-block"><div className="institution-logo-wrap left">{block.leftLogoSrc && <img src={block.leftLogoSrc} alt="University logo" />}</div><div className="institution-copy"><EditableText html={block.university} onFocus={select} className="institution-university" onChange={(university) => update({ ...block, university })} /><EditableText html={block.faculty} onFocus={select} className="institution-faculty" onChange={(faculty) => update({ ...block, faculty })} />{block.department !== undefined && <EditableText html={block.department || ''} onFocus={select} className="institution-department" onChange={(department) => update({ ...block, department })} />}</div><div className="institution-logo-wrap right">{block.rightLogoSrc && <img src={block.rightLogoSrc} alt="Faculty logo" />}</div></div>
}

export function BlockView({ block, selected, onSelect, onUpdate, onAction, onDragStart, onDrop, artifactMeta }: {
  block: Block; selected: boolean; onSelect: () => void; onUpdate: (block: Block) => void; onAction: (action: BlockAction) => void; onDragStart: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; artifactMeta?: ArtifactMeta
}) {
  const body = (() => {
    switch (block.type) {
      case 'text': return <TextView block={block} update={onUpdate} select={onSelect} />
      case 'list': return <ListView block={block} update={onUpdate} select={onSelect} />
      case 'code': return <CodeView block={block} meta={artifactMeta} />
      case 'callout': return <CalloutView block={block} update={onUpdate} select={onSelect} />
      case 'table': return <TableView block={block} meta={artifactMeta} />
      case 'diagram': return <DiagramView block={block} meta={artifactMeta} />
      case 'image': return <ImageView block={block} meta={artifactMeta} />
      case 'institution': return <InstitutionView block={block} update={onUpdate} select={onSelect} />
      case 'divider': return <hr className="doc-divider" />
    }
  })()
  return <div onDragOver={(event) => event.preventDefault()} onDrop={onDrop}><BlockChrome selected={selected} onSelect={onSelect} onAction={onAction} onDragStart={onDragStart}>{body}</BlockChrome></div>
}

export function MiniInsertBar({ onInsert }: { onInsert: (type: Block['type']) => void }) {
  const styles = useEditorStyles()
  const buttons: { type: Block['type']; icon: Parameters<typeof Icon>[0]['name']; label: string }[] = [
    { type: 'text', icon: 'text', label: 'Text' }, { type: 'list', icon: 'list', label: 'List' }, { type: 'code', icon: 'code', label: 'Code' }, { type: 'callout', icon: 'note', label: 'Callout' }, { type: 'table', icon: 'table', label: 'Table' }, { type: 'diagram', icon: 'diagram', label: 'Diagram' }, { type: 'image', icon: 'image', label: 'Image' }, { type: 'institution', icon: 'file', label: 'Institution' }, { type: 'divider', icon: 'divider', label: 'Divider' },
  ]
  return <div className={styles.insertWrap}><Toolbar className={styles.insertToolbar} aria-label="Insert block">{buttons.map((button) => <Tooltip key={button.type} content={`Insert ${button.label}`} relationship="label"><ToolbarButton icon={<Icon name={button.icon} size={15} />} onClick={() => onInsert(button.type)}>{button.label}</ToolbarButton></Tooltip>)}</Toolbar></div>
}