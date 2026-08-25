import { useEffect, useState } from 'react'
import { Button, Caption1, makeStyles, tokens, Tooltip } from '@fluentui/react-components'
import type { CourseDocument } from '../types'
import { PageCanvas } from './PageCanvas'
import { Icon } from './Icon'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: '#202124',
    display: 'grid', gridTemplateRows: '56px minmax(0,1fr)', color: tokens.colorNeutralForegroundOnBrand,
  },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: tokens.spacingHorizontalS,
    backgroundColor: 'rgba(20,20,20,.92)', borderBottom: '1px solid rgba(255,255,255,.12)',
  },
  close: { marginLeft: tokens.spacingHorizontalL },
  stageWrap: { minHeight: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' },
  stage: { boxShadow: tokens.shadow64, backgroundColor: '#fff' },
  pageCounter: { minWidth: '72px', textAlign: 'center', color: '#fff' },
})

export function Presentation({ doc, startPage, onClose }: { doc: CourseDocument; startPage: number; onClose: () => void }) {
  const styles = useStyles()
  const [index, setIndex] = useState(startPage)
  const [scale, setScale] = useState(0.8)

  useEffect(() => {
    const calc = () => setScale(Math.min((window.innerWidth - 120) / 794, (window.innerHeight - 90) / 1123, 1.25))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'PageDown') setIndex((value) => Math.min(doc.pages.length - 1, value + 1))
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setIndex((value) => Math.max(0, value - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc.pages.length, onClose])

  return <div className={styles.overlay} role="dialog" aria-label="Režim prikaza">
    <div className={styles.toolbar}>
      <Tooltip content="Prethodna strana" relationship="label"><Button appearance="primary" size="small" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>←</Button></Tooltip>
      <Caption1 className={styles.pageCounter}>{index + 1} / {doc.pages.length}</Caption1>
      <Tooltip content="Sledeća strana" relationship="label"><Button appearance="primary" size="small" disabled={index === doc.pages.length - 1} onClick={() => setIndex((value) => Math.min(doc.pages.length - 1, value + 1))}>→</Button></Tooltip>
      <Tooltip content="Zatvori prikaz" relationship="label"><Button appearance="primary" size="small" className={styles.close} icon={<Icon name="close" size={18} />} onClick={onClose} /></Tooltip>
    </div>
    <div className={styles.stageWrap}>
      <div className={styles.stage} style={{ width: 794 * scale, height: 1123 * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 794 }}>
          <PageCanvas doc={doc} page={doc.pages[index]} pageIndex={index} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />
        </div>
      </div>
    </div>
  </div>
}
