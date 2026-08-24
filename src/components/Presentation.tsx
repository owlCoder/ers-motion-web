import { useEffect, useState } from 'react'
import type { CourseDocument } from '../types'
import { PageCanvas } from './PageCanvas'
import { Icon } from './Icon'

export function Presentation({ doc, startPage, onClose }: { doc: CourseDocument; startPage: number; onClose: () => void }) {
  const [index, setIndex] = useState(startPage)
  const [scale, setScale] = useState(0.8)
  useEffect(() => {
    const calc = () => setScale(Math.min((window.innerWidth - 120) / 794, (window.innerHeight - 80) / 1123, 1.25))
    calc(); window.addEventListener('resize', calc); return () => window.removeEventListener('resize', calc)
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'PageDown') setIndex((v) => Math.min(doc.pages.length - 1, v + 1))
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setIndex((v) => Math.max(0, v - 1))
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [doc.pages.length, onClose])

  return <div className="presentation-overlay">
    <div className="presentation-toolbar">
      <button onClick={() => setIndex((v) => Math.max(0, v - 1))}>←</button>
      <span>{index + 1} / {doc.pages.length}</span>
      <button onClick={() => setIndex((v) => Math.min(doc.pages.length - 1, v + 1))}>→</button>
      <button onClick={onClose}><Icon name="close" size={18} /></button>
    </div>
    <div className="presentation-stage" style={{ width: 794 * scale, height: 1123 * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 794 }}>
        <PageCanvas doc={doc} page={doc.pages[index]} pageIndex={index} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />
      </div>
    </div>
  </div>
}
