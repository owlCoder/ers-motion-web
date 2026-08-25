import { useEffect, useRef, useState } from 'react'
import type { Block, CourseDocument, DocumentPage } from '../types'
import { BlockView, MiniInsertBar, type BlockAction } from './BlockView'
import { createBlock, clone } from '../utils'
import '../document.css'

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
  const pageRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  useEffect(() => {
    const check = () => {
      const el = pageRef.current
      if (!el) return
      setOverflow(el.scrollHeight > el.clientHeight + 8)
    }
    check()
    const ro = new ResizeObserver(check)
    if (pageRef.current) ro.observe(pageRef.current)
    return () => ro.disconnect()
  }, [page.blocks, page.layout])

  const updateBlock = (next: Block) => onUpdatePage({ ...page, blocks: page.blocks.map((b) => b.id === next.id ? next : b) })
  const action = (id: string, a: BlockAction) => {
    const index = page.blocks.findIndex((b) => b.id === id)
    if (index < 0) return
    if (a === 'delete') {
      onUpdatePage({ ...page, blocks: page.blocks.filter((b) => b.id !== id) })
      if (selectedBlockId === id) onSelectBlock(undefined)
      return
    }
    if (a === 'duplicate') {
      const next = clone(page.blocks[index])
      next.id = `${next.id}-copy-${Date.now().toString(36)}`
      const blocks = [...page.blocks]
      blocks.splice(index + 1, 0, next)
      onUpdatePage({ ...page, blocks })
      return
    }
    const to = a === 'up' ? index - 1 : index + 1
    if (to < 0 || to >= page.blocks.length) return
    const blocks = [...page.blocks]
    ;[blocks[index], blocks[to]] = [blocks[to], blocks[index]]
    onUpdatePage({ ...page, blocks })
  }
  const insert = (type: Block['type']) => onUpdatePage({ ...page, blocks: [...page.blocks, createBlock(type)] })
  const drop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    const from = page.blocks.findIndex((b) => b.id === draggedId)
    const to = page.blocks.findIndex((b) => b.id === targetId)
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

  return (
    <div className="page-wrap">
      <section ref={pageRef} className={`a4-page ${isCover ? 'cover-page' : ''} theme-${doc.theme.name.replaceAll(' ', '-').toLowerCase()} ${fontClass} ${densityClass}`} data-accent={doc.theme.accent} onClick={() => { onSelectBlock(undefined); onOpenDocumentSettings() }}>
        {!isCover && <header className="page-header"><span>{doc.headerText || doc.subject}</span><span>{doc.kind === 'praktikum' ? 'Praktikum' : doc.kind === 'specifikacija' ? 'Projektna specifikacija' : doc.title}</span></header>}
        <main className="page-content">
          {page.blocks.map((block) => readonly
            ? <div key={block.id} className="readonly-block"><BlockView block={block} selected={false} onSelect={() => {}} onUpdate={() => {}} onAction={() => {}} onDragStart={() => {}} onDrop={() => {}} /></div>
            : <BlockView key={block.id} block={block} selected={selectedBlockId === block.id} onSelect={() => onSelectBlock(block.id)} onUpdate={updateBlock} onAction={(a) => action(block.id, a)} onDragStart={(e) => { setDraggedId(block.id); e.dataTransfer.effectAllowed = 'move' }} onDrop={(e) => { e.preventDefault(); drop(block.id) }} />
          )}
          {!readonly && <MiniInsertBar onInsert={insert} />}
        </main>
        {!isCover && <footer className="page-footer"><span>{doc.footerText || 'Elementi razvoja softvera'}</span><span>{pageIndex + 1}</span></footer>}
        {overflow && !readonly && <div className="overflow-warning no-print">Sadržaj prelazi granicu stranice</div>}
      </section>
    </div>
  )
}
