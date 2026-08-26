import { useMemo, useState } from 'react'
import type { Block, CourseDocument, DocumentPage } from '../types'
import { BlockView, type BlockAction } from './BlockView'
import { clone, computeArtifactMeta } from '../utils'
import '../document.css'
import '../document-polish.css'

export function PageCanvas({ doc, page, pageIndex, selectedBlockId, onSelectBlock, onUpdatePage, onOpenDocumentSettings, readonly = false }: {
  doc: CourseDocument
  page: DocumentPage
  pageIndex: number
  selectedBlockId?: string
  onSelectBlock: (id?: string) => void
  onUpdatePage: (page: DocumentPage) => void
  onOpenDocumentSettings: () => void
  readonly?: boolean
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const artifactMeta = useMemo(() => computeArtifactMeta(doc), [doc])
  const suppressArtifactCaptions = page.label?.trim().toLowerCase() === 'sadržaj'
  const metaFor = (blockId: string) => suppressArtifactCaptions ? undefined : artifactMeta[blockId]

  const updateBlock = (next: Block) => onUpdatePage({ ...page, blocks: page.blocks.map((block) => block.id === next.id ? next : block) })
  const action = (id: string, actionType: BlockAction) => {
    const index = page.blocks.findIndex((block) => block.id === id)
    if (index < 0) return
    if (actionType === 'delete') {
      onUpdatePage({ ...page, blocks: page.blocks.filter((block) => block.id !== id) })
      if (selectedBlockId === id) onSelectBlock(undefined)
      return
    }
    if (actionType === 'duplicate') {
      const next = clone(page.blocks[index])
      next.id = `${next.id}-copy-${Date.now().toString(36)}`
      const blocks = [...page.blocks]
      blocks.splice(index + 1, 0, next)
      onUpdatePage({ ...page, blocks })
      return
    }
    const target = actionType === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= page.blocks.length) return
    const blocks = [...page.blocks]
    ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
    onUpdatePage({ ...page, blocks })
  }
  const drop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    const from = page.blocks.findIndex((block) => block.id === draggedId)
    const to = page.blocks.findIndex((block) => block.id === targetId)
    if (from < 0 || to < 0) return
    const blocks = [...page.blocks]
    const [moved] = blocks.splice(from, 1)
    blocks.splice(to, 0, moved)
    onUpdatePage({ ...page, blocks })
    setDraggedId(null)
  }

  const fontClass = doc.theme.font === 'Serif' ? 'font-serif' : doc.theme.font === 'Humanist' ? 'font-humanist' : 'font-system'
  const densityClass = doc.theme.density === 'compact' ? 'density-compact' : 'density-comfortable'
  const isCover = page.layout === 'cover'
  const anchorId = readonly ? `page-${page.id}` : `editor-page-${page.id}`

  return (
    <div className="page-wrap" id={anchorId} data-document-page={pageIndex + 1}>
      <section className={`a4-page ${isCover ? 'cover-page' : ''} theme-${doc.theme.name.replaceAll(' ', '-').toLowerCase()} ${fontClass} ${densityClass}`} data-accent={doc.theme.accent} onClick={() => { onSelectBlock(undefined); onOpenDocumentSettings() }}>
        {!isCover && <header className="page-header"><span>{doc.headerText || doc.subject}</span><span>{doc.kind === 'praktikum' ? 'Praktikum' : doc.kind === 'specifikacija' ? 'Projektna specifikacija' : doc.title}</span></header>}
        <main className="page-content">
          {page.blocks.map((block) => readonly
            ? <div key={block.id} className="readonly-block"><BlockView block={block} selected={false} onSelect={() => {}} onUpdate={() => {}} onAction={() => {}} onDragStart={() => {}} onDrop={() => {}} artifactMeta={metaFor(block.id)} /></div>
            : <BlockView key={block.id} block={block} selected={selectedBlockId === block.id} onSelect={() => onSelectBlock(block.id)} onUpdate={updateBlock} onAction={(blockAction) => action(block.id, blockAction)} onDragStart={(event) => { setDraggedId(block.id); event.dataTransfer.effectAllowed = 'move' }} onDrop={(event) => { event.preventDefault(); drop(block.id) }} artifactMeta={metaFor(block.id)} />
          )}
        </main>
        {!isCover && <footer className="page-footer"><span>{doc.footerText || 'Elementi razvoja softvera'}</span><span>{pageIndex + 1}</span></footer>}
      </section>
    </div>
  )
}
