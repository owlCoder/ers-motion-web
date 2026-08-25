import { useEffect, useState } from 'react'
import { Button, Caption1, makeStyles, mergeClasses, tokens, Tooltip } from '@fluentui/react-components'
import type { CourseDocument } from '../types'
import { PageCanvas } from './PageCanvas'
import { Icon } from './Icon'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: '#202124',
    display: 'grid',
    gridTemplateRows: '52px minmax(0,1fr)',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: 'rgba(20,20,20,.92)',
    borderBottom: '1px solid rgba(255,255,255,.12)',
    backdropFilter: 'blur(12px)',
  },
  close: { marginLeft: tokens.spacingHorizontalL },
  stageWrap: { minHeight: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' },
  stage: { boxShadow: tokens.shadow64, backgroundColor: '#fff', transitionProperty: 'width, height', transitionDuration: '160ms' },
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' || event.key === 'PageDown') setIndex((value) => Math.min(doc.pages.length - 1, value + 1))
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') setIndex((value) => Math.max(0, value - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc.pages.length, onClose])

  return <div className={styles.overlay} role="dialog" aria-label="Presentation mode">
    <div className={styles.toolbar}>
      <Tooltip content="Previous page" relationship="label"><Button appearance="primary" size="small" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>←</Button></Tooltip>
      <Caption1 className={styles.pageCounter}>{index + 1} / {doc.pages.length}</Caption1>
      <Tooltip content="Next page" relationship="label"><Button appearance="primary" size="small" disabled={index === doc.pages.length - 1} onClick={() => setIndex((value) => Math.min(doc.pages.length - 1, value + 1))}>→</Button></Tooltip>
      <Tooltip content="Close presentation" relationship="label"><Button appearance="primary" size="small" className={mergeClasses(styles.close)} icon={<Icon name="close" size={18} />} onClick={onClose} /></Tooltip>
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
