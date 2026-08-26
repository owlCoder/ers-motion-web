import { useEffect, useMemo, useState } from 'react'
import type { Block, CourseDocument, DiagramBlock, TextBlock } from './types'
import { practicum2026 } from './content/canvaPracticum'
import { projectSpec2026Reflowed } from './content/projectSpecReflow'
import { ACCENTS, highlightCode } from './utils'
import './static-site.css'

type DocumentKey = 'praktikum' | 'specifikacija'
type ArtifactKind = 'figure' | 'listing' | 'table'

type PreparedBlock = {
  block: Block
  anchor?: string
  artifactLabel?: string
}

type TocEntry = {
  id: string
  label: string
  level: 1 | 2 | 3
}

const documents: Record<DocumentKey, CourseDocument> = {
  praktikum: practicum2026,
  specifikacija: projectSpec2026Reflowed,
}

function plain(html: string) {
  const node = document.createElement('div')
  node.innerHTML = html
  return node.textContent?.trim() || ''
}

function inlineMarkup(html: string) {
  return html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
}

function slug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

function sectionFromHeading(block: TextBlock) {
  const value = plain(block.html)
  const numbered = value.match(/^(\d+(?:\.\d+)*)\.?\s+/)
  if (numbered) return numbered[1]
  const exercise = value.match(/^Vežba\s+(\d+)\b/i)
  if (exercise) return exercise[1]
  if (/^Sažetak\b/i.test(value)) return 'S'
  if (/^Preporučena literatura\b/i.test(value)) return 'L'
  return undefined
}

function prepareDocument(doc: CourseDocument) {
  const counters = new Map<string, Record<ArtifactKind, number>>()
  const usedAnchors = new Map<string, number>()
  let section = '0'
  const toc: TocEntry[] = []
  const prepared: PreparedBlock[] = []

  const nextArtifact = (kind: ArtifactKind) => {
    const current = counters.get(section) || { figure: 0, listing: 0, table: 0 }
    current[kind] += 1
    counters.set(section, current)
    const number = `${section}.${current[kind]}`
    if (kind === 'figure') return `Slika ${number}`
    if (kind === 'listing') return `Listing ${number}`
    return `Tabela ${number}`
  }

  for (const page of doc.pages) {
    if (page.layout === 'cover' || page.label === 'Sadržaj') continue
    for (const block of page.blocks) {
      let anchor: string | undefined
      let artifactLabel: string | undefined

      if (block.type === 'text' && ['h1', 'h2', 'h3'].includes(block.variant)) {
        const detected = sectionFromHeading(block)
        if (detected) section = detected
        const label = plain(block.html)
        const base = slug(label)
        const count = (usedAnchors.get(base) || 0) + 1
        usedAnchors.set(base, count)
        anchor = count === 1 ? base : `${base}-${count}`
        toc.push({
          id: anchor,
          label,
          level: block.variant === 'h1' ? 1 : block.variant === 'h2' ? 2 : 3,
        })
      }

      if (block.type === 'image' || block.type === 'diagram') artifactLabel = nextArtifact('figure')
      if (block.type === 'code') artifactLabel = nextArtifact('listing')
      if (block.type === 'table') artifactLabel = nextArtifact('table')

      prepared.push({ block, anchor, artifactLabel })
    }
  }

  return { prepared, toc }
}

function Caption({ label, text }: { label?: string; text?: string }) {
  if (!label && !text) return null
  return (
    <figcaption>
      {label && <strong>{label}</strong>}
      {label && text && <span> — </span>}
      {text && <span>{text}</span>}
    </figcaption>
  )
}

function TextView({ block, anchor }: { block: TextBlock; anchor?: string }) {
  const props = {
    id: anchor,
    className: `doc-${block.variant} ${block.align ? `align-${block.align}` : ''}`,
    dangerouslySetInnerHTML: { __html: inlineMarkup(block.html) },
  }
  if (block.variant === 'h1') return <h1 {...props} />
  if (block.variant === 'h2') return <h2 {...props} />
  if (block.variant === 'h3') return <h3 {...props} />
  if (block.variant === 'quote') return <blockquote {...props} />
  if (block.variant === 'caption') return <p {...props} />
  if (block.variant === 'title') return <h1 {...props} />
  if (block.variant === 'subtitle') return <p {...props} />
  return <p {...props} />
}

function CodeView({ block, label }: { block: Extract<Block, { type: 'code' }>; label?: string }) {
  const lines = block.code.split('\n')
  return (
    <figure className="code-figure keep-together">
      <div className="code-toolbar"><span>{block.language}</span></div>
      <pre className="code-panel">
        {lines.map((line, index) => (
          <span className="code-row" key={`${block.id}-${index}`}>
            <span className="code-number" aria-hidden="true">{index + 1}</span>
            <code dangerouslySetInnerHTML={{ __html: highlightCode(line || ' ', block.language) }} />
          </span>
        ))}
      </pre>
      <Caption label={label} text={block.caption} />
    </figure>
  )
}

function DiagramView({ block, label }: { block: DiagramBlock; label?: string }) {
  const columns = Math.min(block.columns || 4, Math.max(1, block.items.length))
  return (
    <figure className="diagram-figure keep-together">
      {block.title && <h4>{block.title}</h4>}
      <div className={`diagram-grid diagram-${block.variant}`} style={{ '--diagram-columns': columns } as React.CSSProperties}>
        {block.items.map((item, index) => {
          const accent = ACCENTS[item.accent || 'blue']
          return (
            <div className="diagram-card" key={item.id} style={{ '--card-accent': accent.solid, '--card-soft': accent.soft } as React.CSSProperties}>
              <span className="diagram-index">{index + 1}</span>
              <strong>{item.title}</strong>
              {item.subtitle && <span>{item.subtitle}</span>}
            </div>
          )
        })}
      </div>
      <Caption label={label} text={block.footer} />
    </figure>
  )
}

function BlockView({ item }: { item: PreparedBlock }) {
  const { block, anchor, artifactLabel } = item
  if (block.type === 'text') return <TextView block={block} anchor={anchor} />
  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul'
    return <Tag className="doc-list">{block.items.map((entry, index) => <li key={index} dangerouslySetInnerHTML={{ __html: inlineMarkup(entry) }} />)}</Tag>
  }
  if (block.type === 'code') return <CodeView block={block} label={artifactLabel} />
  if (block.type === 'callout') {
    return (
      <aside className={`callout callout-${block.tone} keep-together`}>
        <strong>{block.title}</strong>
        <div dangerouslySetInnerHTML={{ __html: inlineMarkup(block.text) }} />
      </aside>
    )
  }
  if (block.type === 'table') {
    return (
      <figure className="table-figure keep-together">
        <div className="table-scroll">
          <table>
            {block.headers.length > 0 && <thead><tr>{block.headers.map((header, index) => <th key={index} dangerouslySetInnerHTML={{ __html: inlineMarkup(header) }} />)}</tr></thead>}
            <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} dangerouslySetInnerHTML={{ __html: inlineMarkup(cell) }} />)}</tr>)}</tbody>
          </table>
        </div>
        <Caption label={artifactLabel} text={block.caption} />
      </figure>
    )
  }
  if (block.type === 'diagram') return <DiagramView block={block} label={artifactLabel} />
  if (block.type === 'image') {
    return (
      <figure className="image-figure keep-together" style={{ maxWidth: `${block.widthPercent || 100}%` }}>
        <img src={block.src} alt={block.alt || block.caption || ''} loading="lazy" />
        <Caption label={artifactLabel} text={block.caption} />
      </figure>
    )
  }
  if (block.type === 'institution') {
    return (
      <div className="institution-row keep-together">
        <img src={block.leftLogoSrc || '/brand/university.svg'} alt="Univerzitet u Novom Sadu" />
        <div><strong>{block.university}</strong><span>{block.faculty}</span>{block.department && <small>{block.department}</small>}</div>
        <img src={block.rightLogoSrc || '/brand/ftn.svg'} alt="Fakultet tehničkih nauka" />
      </div>
    )
  }
  return <hr className="doc-divider" />
}

function DocumentCover({ doc }: { doc: CourseDocument }) {
  const isPracticum = doc.kind === 'praktikum'
  return (
    <header className="document-cover">
      <div className="cover-institution">
        <img src="/brand/university.svg" alt="Univerzitet u Novom Sadu" />
        <div>
          <span>Univerzitet u Novom Sadu</span>
          <strong>Fakultet tehničkih nauka</strong>
          <small>Primenjeno softversko inženjerstvo · 2026/2027</small>
        </div>
        <img src="/brand/ftn.svg" alt="FTN" />
      </div>
      <div className="cover-copy">
        <span className="eyebrow">Elementi razvoja softvera</span>
        <h1>{isPracticum ? 'Praktikum' : 'Specifikacija projektnog zadatka'}</h1>
        <p>{isPracticum ? 'Radni materijal za vežbe, samostalno ponavljanje i projektni rad.' : 'Pravila, tehnički zahtevi, projektne kontrolne tačke i kriterijumi za semestralni projekat.'}</p>
      </div>
    </header>
  )
}

function StaticDocument({ doc }: { doc: CourseDocument }) {
  const { prepared, toc } = useMemo(() => prepareDocument(doc), [doc])

  return (
    <div className="document-layout">
      <aside className="toc-panel no-print">
        <div className="toc-title">Sadržaj</div>
        <nav>
          {toc.filter((entry) => entry.level <= 2).map((entry) => (
            <a className={`toc-level-${entry.level}`} key={entry.id} href={`#${entry.id}`}>{entry.label}</a>
          ))}
        </nav>
      </aside>

      <main className="document-paper">
        <DocumentCover doc={doc} />
        <article className="document-body">
          {prepared.map((item, index) => <BlockView item={item} key={`${item.block.id}-${index}`} />)}
        </article>
        <footer className="document-end">
          <span>Elementi razvoja softvera</span>
          <span>Univerzitet u Novom Sadu · Fakultet tehničkih nauka</span>
        </footer>
      </main>
    </div>
  )
}

export default function StaticApp() {
  const initial = window.location.hash.startsWith('#specifikacija') ? 'specifikacija' : 'praktikum'
  const [active, setActive] = useState<DocumentKey>(initial)
  const doc = documents[active]

  useEffect(() => {
    document.title = active === 'praktikum' ? 'ERS — Praktikum' : 'ERS — Specifikacija projektnog zadatka'
  }, [active])

  const choose = (key: DocumentKey) => {
    setActive(key)
    history.replaceState(null, '', key === 'praktikum' ? '#praktikum' : '#specifikacija')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <header className="site-header no-print">
        <a className="site-brand" href="#praktikum" onClick={(event) => { event.preventDefault(); choose('praktikum') }}>
          <span className="brand-mark">E</span>
          <span><strong>ERS</strong><small>Elementi razvoja softvera</small></span>
        </a>
        <nav className="document-switcher" aria-label="Dokumenti">
          <button className={active === 'praktikum' ? 'active' : ''} onClick={() => choose('praktikum')}>Praktikum</button>
          <button className={active === 'specifikacija' ? 'active' : ''} onClick={() => choose('specifikacija')}>Specifikacija</button>
        </nav>
        <button className="print-button" onClick={() => window.print()}>Štampaj / PDF</button>
      </header>
      <StaticDocument doc={doc} />
    </div>
  )
}
