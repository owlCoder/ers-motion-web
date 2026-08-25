import { useEffect, useMemo, useState } from 'react'
import { Button, Caption1, makeStyles, tokens, Tooltip } from '@fluentui/react-components'
import type { CourseDocument } from '../types'
import { PageCanvas } from './PageCanvas'
import { Icon } from './Icon'

const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1123

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#202124',
    display: 'grid',
    gridTemplateRows: '50px minmax(0,1fr)',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    backgroundColor: 'rgba(18,18,18,.96)',
    borderBottom: '1px solid rgba(255,255,255,.10)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 2px 12px rgba(0,0,0,.20)',
  },
  stageWrap: {
    minWidth: 0,
    minHeight: 0,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '14px 32px 32px',
    scrollbarGutter: 'stable both-edges',
  },
  stage: {
    position: 'relative',
    flex: '0 0 auto',
    backgroundColor: '#fff',
    boxShadow: '0 24px 80px rgba(0,0,0,.42)',
    transitionProperty: 'width, height',
    transitionDuration: '120ms',
  },
  scaledPage: {
    position: 'absolute',
    inset: 0,
    width: `${PAGE_WIDTH}px`,
    height: `${PAGE_HEIGHT}px`,
    transformOrigin: 'top left',
  },
  pageCounter: { minWidth: '68px', textAlign: 'center', color: '#fff' },
  zoomLabel: { minWidth: '44px', textAlign: 'center', color: '#d6d6d6' },
  separator: { width: '1px', height: '22px', backgroundColor: 'rgba(255,255,255,.16)', margin: '0 5px' },
})

const clamp = (value: number) => Math.max(0.35, Math.min(1.25, value))

export function Presentation({ doc, startPage, onClose }: { doc: CourseDocument; startPage: number; onClose: () => void }) {
  const styles = useStyles()
  const [index, setIndex] = useState(startPage)
  const [scale, setScale] = useState(0.8)

  const fitScale = useMemo(() => {
    const availableWidth = Math.max(320, window.innerWidth - 96)
    const availableHeight = Math.max(320, window.innerHeight - 92)
    return clamp(Math.min(availableWidth / PAGE_WIDTH, availableHeight / PAGE_HEIGHT, 1.15))
  }, [])

  useEffect(() => {
    const fit = () => {
      const availableWidth = Math.max(320, window.innerWidth - 96)
      const availableHeight = Math.max(320, window.innerHeight - 92)
      setScale(clamp(Math.min(availableWidth / PAGE_WIDTH, availableHeight / PAGE_HEIGHT, 1.15)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' || event.key === 'PageDown') setIndex((value) => Math.min(doc.pages.length - 1, value + 1))
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') setIndex((value) => Math.max(0, value - 1))
      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
        event.preventDefault()
        setScale((value) => clamp(value + .08))
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault()
        setScale((value) => clamp(value - .08))
      }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [doc.pages.length, onClose])

  return <div className={styles.overlay} role="dialog" aria-label="Presentation mode">
    <div className={styles.toolbar}>
      <Tooltip content="Previous page" relationship="label"><Button appearance="subtle" size="small" disabled={index === 0} icon={<Icon name="left" size={18} />} onClick={() => setIndex((value) => Math.max(0, value - 1))} /></Tooltip>
      <Caption1 className={styles.pageCounter}>{index + 1} / {doc.pages.length}</Caption1>
      <Tooltip content="Next page" relationship="label"><Button appearance="subtle" size="small" disabled={index === doc.pages.length - 1} icon={<Icon name="right" size={18} />} onClick={() => setIndex((value) => Math.min(doc.pages.length - 1, value + 1))} /></Tooltip>
      <span className={styles.separator} />
      <Tooltip content="Zoom out" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="zoomOut" size={17} />} onClick={() => setScale((value) => clamp(value - .08))} /></Tooltip>
      <Caption1 className={styles.zoomLabel}>{Math.round(scale * 100)}%</Caption1>
      <Tooltip content="Zoom in" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="zoomIn" size={17} />} onClick={() => setScale((value) => clamp(value + .08))} /></Tooltip>
      <Tooltip content="Fit page" relationship="label"><Button appearance="subtle" size="small" onClick={() => setScale(fitScale)}>Fit</Button></Tooltip>
      <span className={styles.separator} />
      <Tooltip content="Close presentation" relationship="label"><Button appearance="subtle" size="small" icon={<Icon name="close" size={18} />} onClick={onClose} /></Tooltip>
    </div>
    <div className={styles.stageWrap}>
      <div className={styles.stage} style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}>
        <div className={styles.scaledPage} style={{ transform: `scale(${scale})` }}>
          <PageCanvas doc={doc} page={doc.pages[index]} pageIndex={index} selectedBlockId={undefined} onSelectBlock={() => {}} onUpdatePage={() => {}} onOpenDocumentSettings={() => {}} readonly />
        </div>
      </div>
    </div>
  </div>
}
