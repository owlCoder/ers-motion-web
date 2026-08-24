import { useMemo } from 'react'
import type { Block, CalloutBlock, CodeBlock, DiagramBlock, ImageBlock, InstitutionBlock, ListBlock, TableBlock, TextBlock } from '../types'
import { ACCENTS, highlightCode, uid } from '../utils'
import { EditableText } from './EditableText'
import { Icon } from './Icon'

export type BlockAction = 'delete' | 'duplicate' | 'up' | 'down'

function BlockChrome({ selected, onSelect, onAction, onDragStart, children }: { selected: boolean; onSelect: () => void; onAction: (a: BlockAction) => void; onDragStart: (e: React.DragEvent) => void; children: React.ReactNode }) {
  return (
    <div className={`doc-block ${selected ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect() }}>
      <div className="block-rail no-print">
        <button className="drag-handle" draggable onDragStart={onDragStart} title="Prevuci blok" aria-label="Prevuci blok">⋮⋮</button>
        <button onClick={() => onAction('up')} title="Pomeri gore"><Icon name="up" size={15} /></button>
        <button onClick={() => onAction('down')} title="Pomeri dole"><Icon name="down" size={15} /></button>
        <button onClick={() => onAction('duplicate')} title="Kopiraj"><Icon name="copy" size={15} /></button>
        <button className="danger" onClick={() => onAction('delete')} title="Obriši"><Icon name="trash" size={15} /></button>
      </div>
      {children}
    </div>
  )
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
            const items = [...block.items]; items[i] = html; update({ ...block, items })
          }} />
        </li>
      ))}
    </Tag>
  )
}

function CodeView({ block }: { block: CodeBlock }) {
  const html = useMemo(() => highlightCode(block.code, block.language), [block.code, block.language])
  const lines = block.code.split('\n')
  const languageLabel = ({ csharp: 'C#', bash: 'Shell', json: 'JSON', markdown: 'Markdown', typescript: 'TypeScript', text: 'Text' } as const)[block.language]
  return (
    <figure className="code-figure">
      <div className="code-header"><span>{languageLabel}</span></div>
      <pre className={`code-block ${block.lineNumbers ? 'with-lines' : ''}`}>
        {block.lineNumbers && <span className="line-numbers">{lines.map((_, i) => <span key={i}>{i + 1}</span>)}</span>}
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  )
}

const tones: Record<CalloutBlock['tone'], { icon: string }> = {
  info: { icon: 'i' },
  note: { icon: '✦' },
  task: { icon: '✓' },
  warning: { icon: '!' },
  success: { icon: '✓' },
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

function TableView({ block }: { block: TableBlock }) {
  return (
    <figure className="table-figure">
      <div className="table-scroll">
        <table>
          {block.headers.length > 0 && <thead><tr>{block.headers.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: h }} />)}</tr></thead>}
          <tbody>{block.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: c }} />)}</tr>)}</tbody>
        </table>
      </div>
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  )
}

function DiagramCard({ item, compact = false }: { item: DiagramBlock['items'][number]; compact?: boolean }) {
  const a = ACCENTS[item.accent || 'blue']
  return (
    <div className={`diagram-card ${compact ? 'compact' : ''}`} style={{ '--accent': a.solid, '--accent-soft': a.soft } as React.CSSProperties}>
      <div className="diagram-title">{item.title}</div>
      {item.subtitle && <div className="diagram-subtitle">{item.subtitle}</div>}
    </div>
  )
}

function DiagramView({ block }: { block: DiagramBlock }) {
  if (block.variant === 'stack') {
    return <figure className="diagram">{block.title && <div className="diagram-heading">{block.title}</div>}<div className="diagram-stack">{block.items.map((item) => <DiagramCard key={item.id} item={item} />)}</div>{block.footer && <figcaption>{block.footer}</figcaption>}</figure>
  }
  if (block.variant === 'hub') {
    const [hub, ...children] = block.items
    return (
      <figure className="diagram diagram-hub">
        {block.title && <div className="diagram-heading">{block.title}</div>}
        {hub && <div className="hub-center"><DiagramCard item={hub} /></div>}
        <div className="hub-connector" />
        <div className="hub-children" style={{ gridTemplateColumns: `repeat(${Math.min(block.columns || 4, Math.max(children.length, 1))}, minmax(0,1fr))` }}>{children.map((item) => <DiagramCard key={item.id} item={item} compact />)}</div>
        {block.footer && <figcaption>{block.footer}</figcaption>}
      </figure>
    )
  }
  const columns = block.columns || Math.min(5, Math.max(2, block.items.length)) as 2 | 3 | 4 | 5
  return (
    <figure className={`diagram diagram-${block.variant}`}>
      {block.title && <div className="diagram-heading">{block.title}</div>}
      <div className="diagram-flow" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
        {block.items.map((item, i) => (
          <div key={item.id} className="flow-item-wrap">
            <DiagramCard item={item} compact={block.items.length > 5} />
            {i < block.items.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
      {block.footer && <figcaption>{block.footer}</figcaption>}
    </figure>
  )
}

function ImageView({ block }: { block: ImageBlock }) {
  if (!block.src) return <div className="image-placeholder"><Icon name="image" size={28} /><span>Izaberite sliku u panelu sa desne strane</span></div>
  return <figure className="image-figure" style={{ width: `${block.widthPercent || 100}%` }}><img src={block.src} alt={block.alt || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>
}

function InstitutionView({ block, update, select }: { block: InstitutionBlock; update: (b: Block) => void; select: () => void }) {
  return (
    <div className="institution-block">
      <div className="institution-logo-wrap left">{block.leftLogoSrc && <img src={block.leftLogoSrc} alt="Logo univerziteta" />}</div>
      <div className="institution-copy">
        <EditableText html={block.university} onFocus={select} className="institution-university" onChange={(university) => update({ ...block, university })} />
        <EditableText html={block.faculty} onFocus={select} className="institution-faculty" onChange={(faculty) => update({ ...block, faculty })} />
        {block.department !== undefined && <EditableText html={block.department || ''} onFocus={select} className="institution-department" onChange={(department) => update({ ...block, department })} />}
      </div>
      <div className="institution-logo-wrap right">{block.rightLogoSrc && <img src={block.rightLogoSrc} alt="Logo fakulteta" />}</div>
    </div>
  )
}

export function BlockView({ block, selected, onSelect, onUpdate, onAction, onDragStart, onDrop }: {
  block: Block
  selected: boolean
  onSelect: () => void
  onUpdate: (block: Block) => void
  onAction: (action: BlockAction) => void
  onDragStart: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const body = (() => {
    switch (block.type) {
      case 'text': return <TextView block={block} update={onUpdate} select={onSelect} />
      case 'list': return <ListView block={block} update={onUpdate} select={onSelect} />
      case 'code': return <CodeView block={block} />
      case 'callout': return <CalloutView block={block} update={onUpdate} select={onSelect} />
      case 'table': return <TableView block={block} />
      case 'diagram': return <DiagramView block={block} />
      case 'image': return <ImageView block={block} />
      case 'institution': return <InstitutionView block={block} update={onUpdate} select={onSelect} />
      case 'divider': return <hr className="doc-divider" />
    }
  })()

  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <BlockChrome selected={selected} onSelect={onSelect} onAction={onAction} onDragStart={onDragStart}>{body}</BlockChrome>
    </div>
  )
}

export function MiniInsertBar({ onInsert }: { onInsert: (type: Block['type']) => void }) {
  const buttons: { type: Block['type']; icon: Parameters<typeof Icon>[0]['name']; label: string }[] = [
    { type: 'text', icon: 'text', label: 'Tekst' },
    { type: 'list', icon: 'list', label: 'Lista' },
    { type: 'code', icon: 'code', label: 'Kod' },
    { type: 'callout', icon: 'note', label: 'Istaknuto' },
    { type: 'table', icon: 'table', label: 'Tabela' },
    { type: 'diagram', icon: 'diagram', label: 'Dijagram' },
    { type: 'image', icon: 'image', label: 'Slika' },
    { type: 'institution', icon: 'file', label: 'Institucija' },
    { type: 'divider', icon: 'divider', label: 'Linija' },
  ]
  return <div className="insert-bar no-print">{buttons.map((b) => <button key={b.type} onClick={() => onInsert(b.type)} title={`Dodaj: ${b.label}`}><Icon name={b.icon} size={15} /><span>{b.label}</span></button>)}</div>
}
