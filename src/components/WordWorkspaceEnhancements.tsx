import { useEffect, useRef, useState } from 'react'
import { loadDocumentLocal, saveDocumentLocal } from '../db'
import { bundledDocuments } from '../seed'

const LEFT_MIN = 220
const LEFT_MAX = 440
const RIGHT_MIN = 300
const RIGHT_MAX = 500
const LEFT_DEFAULT = 286
const RIGHT_DEFAULT = 346
const PRACTICUM_CONTENT_REVISION = 'practicum-academic-pass-2026-08-25-a'
const LEGACY_PRACTICUM_UPDATED_AT = '2026-08-24T21:39:00+02:00'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function numberFromStorage(key: string, fallback: number) {
  const value = Number(window.localStorage.getItem(key))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

type GridParts = {
  grid: HTMLElement
  navigation: HTMLElement
  workspace: HTMLElement
  inspector: HTMLElement
}

function findGridParts(): GridParts | null {
  const workspace = document.querySelector('main:not(.page-content)') as HTMLElement | null
  const grid = workspace?.parentElement as HTMLElement | null
  if (!workspace || !grid || grid.children.length < 3) return null
  const navigation = Array.from(grid.children).find((element) => element.tagName.toLowerCase() === 'aside') as HTMLElement | undefined
  const inspector = Array.from(grid.children).find((element) => element !== workspace && element !== navigation) as HTMLElement | undefined
  if (!navigation || !inspector) return null
  return { grid, navigation, workspace, inspector }
}

function isPaneVisible(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return style.pointerEvents !== 'none' && Number(style.opacity || '1') > 0.05
}

export function WordWorkspaceEnhancements() {
  const [leftX, setLeftX] = useState<number | null>(null)
  const [rightX, setRightX] = useState<number | null>(null)
  const [top, setTop] = useState(0)
  const [height, setHeight] = useState(0)
  const [leftVisible, setLeftVisible] = useState(false)
  const [rightVisible, setRightVisible] = useState(false)
  const dragSide = useRef<'left' | 'right' | null>(null)
  const partsRef = useRef<GridParts | null>(null)
  const widthsRef = useRef({
    left: typeof window === 'undefined' ? LEFT_DEFAULT : numberFromStorage('ers-left-pane-width', LEFT_DEFAULT),
    right: typeof window === 'undefined' ? RIGHT_DEFAULT : numberFromStorage('ers-right-pane-width', RIGHT_DEFAULT),
  })

  useEffect(() => {
    if (window.localStorage.getItem('ers-practicum-content-revision') === PRACTICUM_CONTENT_REVISION) return
    const timer = window.setTimeout(() => {
      ;(async () => {
        try {
          const practicum = bundledDocuments.find((document) => document.kind === 'praktikum')
          if (!practicum) return
          const existing = await loadDocumentLocal(practicum.id)
          const shouldReplace = !existing || existing.updatedAt === LEGACY_PRACTICUM_UPDATED_AT
          if (shouldReplace) await saveDocumentLocal(practicum)
          window.localStorage.setItem('ers-practicum-content-revision', PRACTICUM_CONTENT_REVISION)
          if (shouldReplace) window.location.reload()
        } catch (error) {
          console.error('Unable to migrate bundled practicum content.', error)
        }
      })()
    }, 1350)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.dataset.ersWordPaneStyle = 'true'
    style.textContent = `
      [data-ers-resizable-grid="true"] {
        grid-template-columns: var(--ers-left-pane, 286px) minmax(0, 1fr) var(--ers-right-pane, 346px) !important;
        position: relative !important;
      }
      [data-ers-pane-resizer="true"] {
        position: fixed;
        width: 8px;
        transform: translateX(-4px);
        cursor: col-resize;
        z-index: 9998;
        background: transparent;
        touch-action: none;
      }
      [data-ers-pane-resizer="true"]::after {
        content: "";
        position: absolute;
        left: 3px;
        top: 0;
        bottom: 0;
        width: 2px;
        border-radius: 2px;
        background: transparent;
        transition: background 120ms ease, box-shadow 120ms ease;
      }
      [data-ers-pane-resizer="true"]:hover::after,
      [data-ers-pane-resizer="true"][data-dragging="true"]::after {
        background: #0f6cbd;
        box-shadow: 0 0 0 1px rgba(15,108,189,.08);
      }
      @media print { [data-ers-pane-resizer="true"] { display: none !important; } }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    const apply = () => {
      const parts = findGridParts()
      if (!parts) return
      partsRef.current = parts
      parts.grid.dataset.ersResizableGrid = 'true'

      const navVisible = isPaneVisible(parts.navigation)
      const inspectorVisible = isPaneVisible(parts.inspector)
      const left = navVisible ? widthsRef.current.left : 0
      const right = inspectorVisible ? widthsRef.current.right : 0
      parts.grid.style.setProperty('--ers-left-pane', `${left}px`)
      parts.grid.style.setProperty('--ers-right-pane', `${right}px`)

      const rect = parts.grid.getBoundingClientRect()
      setTop(rect.top)
      setHeight(rect.height)
      setLeftVisible(navVisible)
      setRightVisible(inspectorVisible)
      setLeftX(navVisible ? rect.left + left : null)
      setRightX(inspectorVisible ? rect.right - right : null)
    }

    apply()
    const interval = window.setInterval(apply, 300)
    const resize = () => apply()
    window.addEventListener('resize', resize)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '+', ctrlKey: true, bubbles: true, cancelable: true }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '+', ctrlKey: true, bubbles: true, cancelable: true }))
    }, 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const parts = partsRef.current
      if (!parts || !dragSide.current) return
      const rect = parts.grid.getBoundingClientRect()
      if (dragSide.current === 'left') {
        const width = clamp(event.clientX - rect.left, LEFT_MIN, Math.min(LEFT_MAX, rect.width * 0.38))
        widthsRef.current.left = width
        window.localStorage.setItem('ers-left-pane-width', String(Math.round(width)))
        parts.grid.style.setProperty('--ers-left-pane', `${width}px`)
        setLeftX(rect.left + width)
      } else {
        const width = clamp(rect.right - event.clientX, RIGHT_MIN, Math.min(RIGHT_MAX, rect.width * 0.42))
        widthsRef.current.right = width
        window.localStorage.setItem('ers-right-pane-width', String(Math.round(width)))
        parts.grid.style.setProperty('--ers-right-pane', `${width}px`)
        setRightX(rect.right - width)
      }
    }
    const up = () => {
      dragSide.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const startDrag = (side: 'left' | 'right') => (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragSide.current = side
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const reset = (side: 'left' | 'right') => {
    const parts = partsRef.current
    if (!parts) return
    if (side === 'left') {
      widthsRef.current.left = LEFT_DEFAULT
      window.localStorage.setItem('ers-left-pane-width', String(LEFT_DEFAULT))
      parts.grid.style.setProperty('--ers-left-pane', `${LEFT_DEFAULT}px`)
    } else {
      widthsRef.current.right = RIGHT_DEFAULT
      window.localStorage.setItem('ers-right-pane-width', String(RIGHT_DEFAULT))
      parts.grid.style.setProperty('--ers-right-pane', `${RIGHT_DEFAULT}px`)
    }
  }

  return <>
    {leftVisible && leftX !== null && <div
      data-ers-pane-resizer="true"
      data-dragging={dragSide.current === 'left' ? 'true' : 'false'}
      aria-label="Resize navigation pane"
      title="Drag to resize navigation pane · double-click to reset"
      style={{ left: leftX, top, height }}
      onPointerDown={startDrag('left')}
      onDoubleClick={() => reset('left')}
    />}
    {rightVisible && rightX !== null && <div
      data-ers-pane-resizer="true"
      data-dragging={dragSide.current === 'right' ? 'true' : 'false'}
      aria-label="Resize inspector pane"
      title="Drag to resize inspector pane · double-click to reset"
      style={{ left: rightX, top, height }}
      onPointerDown={startDrag('right')}
      onDoubleClick={() => reset('right')}
    />}
  </>
}
