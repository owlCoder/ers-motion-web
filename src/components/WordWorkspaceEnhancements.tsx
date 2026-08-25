import { useEffect, useRef, useState } from 'react'
import { loadDocumentLocal, saveDocumentLocal } from '../db'
import { bundledDocuments } from '../seed'

const LEFT_MIN = 220
const LEFT_MAX = 440
const RIGHT_MIN = 300
const RIGHT_MAX = 500
const LEFT_DEFAULT = 286
const RIGHT_DEFAULT = 346
const BUNDLED_CONTENT_REVISION = 'academic-content-pass-2026-08-25-c'

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

function markWordShell(parts: GridParts) {
  const provider = document.querySelector('.fui-FluentProvider') as HTMLElement | null
  const appRoot = provider?.firstElementChild as HTMLElement | null
  if (!appRoot) return
  appRoot.dataset.ersAppRoot = 'true'
  const rows = Array.from(appRoot.children) as HTMLElement[]
  rows[0]?.setAttribute('data-ers-titlebar', 'true')
  rows[1]?.setAttribute('data-ers-tabsbar', 'true')
  rows[2]?.setAttribute('data-ers-ribbon', 'true')
  rows[3]?.setAttribute('data-ers-editor-grid', 'true')
  rows[4]?.setAttribute('data-ers-statusbar', 'true')
  parts.navigation.dataset.ersNavigation = 'true'
  parts.workspace.dataset.ersWorkspace = 'true'
  parts.inspector.dataset.ersInspector = 'true'
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
    if (window.localStorage.getItem('ers-bundled-content-revision') === BUNDLED_CONTENT_REVISION) return
    const timer = window.setTimeout(() => {
      ;(async () => {
        try {
          let replacedAny = false
          for (const bundled of bundledDocuments) {
            const existing = await loadDocumentLocal(bundled.id)
            const shouldReplace = !existing || new Date(bundled.updatedAt).getTime() > new Date(existing.updatedAt).getTime()
            if (shouldReplace) {
              await saveDocumentLocal(bundled)
              replacedAny = true
            }
          }
          window.localStorage.setItem('ers-bundled-content-revision', BUNDLED_CONTENT_REVISION)
          if (replacedAny) window.location.reload()
        } catch (error) {
          console.error('Unable to migrate bundled course content.', error)
        }
      })()
    }, 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.dataset.ersWordPaneStyle = 'true'
    style.textContent = `
      [data-ers-app-root="true"] {
        --ers-office-blue: #185abd;
        --ers-office-blue-hover: #0f6cbd;
        --ers-office-border: #e2e2e2;
        --ers-office-surface: #ffffff;
        --ers-office-pane: #fbfbfb;
      }
      [data-ers-titlebar="true"] {
        background: linear-gradient(180deg, #fff 0%, #fdfdfd 100%) !important;
        border-bottom: 1px solid #ececec !important;
      }
      [data-ers-tabsbar="true"] {
        background: #fff !important;
        border-bottom: 0 !important;
        box-shadow: inset 0 -1px 0 #e8e8e8;
      }
      [data-ers-ribbon="true"] {
        position: relative;
        z-index: 20;
        margin: 0 6px 6px;
        border: 1px solid #dfdfdf !important;
        border-top: 0 !important;
        border-radius: 0 0 8px 8px;
        background: linear-gradient(180deg, #fff 0%, #fdfdfd 100%) !important;
        box-shadow: 0 2px 5px rgba(0,0,0,.055);
        overflow: hidden;
      }
      [data-ers-editor-grid="true"] {
        border-top: 1px solid #e6e6e6;
      }
      [data-ers-navigation="true"],
      [data-ers-inspector="true"] {
        background: var(--ers-office-pane) !important;
      }
      [data-ers-navigation="true"] {
        border-right-color: #dedede !important;
      }
      [data-ers-inspector="true"] {
        border-left-color: #dedede !important;
      }
      [data-ers-workspace="true"] {
        background: #e8e8e8 !important;
      }
      [data-ers-statusbar="true"] {
        background: #fff !important;
        border-top: 1px solid #dedede !important;
        box-shadow: 0 -1px 2px rgba(0,0,0,.025);
      }
      [data-ers-app-root="true"] .fui-Button,
      [data-ers-app-root="true"] .fui-ToolbarButton,
      [data-ers-app-root="true"] .fui-Tab {
        transition: background-color 110ms ease, border-color 110ms ease, color 110ms ease, transform 90ms ease;
      }
      [data-ers-app-root="true"] .fui-Button:active,
      [data-ers-app-root="true"] .fui-ToolbarButton:active {
        transform: translateY(.5px);
      }
      [data-ers-ribbon="true"] .fui-Button,
      [data-ers-ribbon="true"] .fui-ToolbarButton {
        border-radius: 4px;
      }
      [data-ers-navigation="true"] button,
      [data-ers-inspector="true"] button {
        transition: background-color 110ms ease, color 110ms ease;
      }
      [data-ers-navigation="true"]::-webkit-scrollbar,
      [data-ers-inspector="true"]::-webkit-scrollbar,
      [data-ers-workspace="true"]::-webkit-scrollbar {
        width: 11px;
        height: 11px;
      }
      [data-ers-navigation="true"]::-webkit-scrollbar-thumb,
      [data-ers-inspector="true"]::-webkit-scrollbar-thumb,
      [data-ers-workspace="true"]::-webkit-scrollbar-thumb {
        background: #c7c7c7;
        border: 3px solid transparent;
        background-clip: padding-box;
        border-radius: 999px;
      }
      [data-ers-navigation="true"]::-webkit-scrollbar-thumb:hover,
      [data-ers-inspector="true"]::-webkit-scrollbar-thumb:hover,
      [data-ers-workspace="true"]::-webkit-scrollbar-thumb:hover {
        background: #aeb0b3;
        border: 3px solid transparent;
        background-clip: padding-box;
      }
      [data-ers-resizable-grid="true"] {
        grid-template-columns: var(--ers-left-pane, 286px) minmax(0, 1fr) var(--ers-right-pane, 346px) !important;
        position: relative !important;
      }
      [data-ers-pane-resizer="true"] {
        position: fixed;
        width: 9px;
        transform: translateX(-4.5px);
        cursor: col-resize;
        z-index: 9998;
        background: transparent;
        touch-action: none;
      }
      [data-ers-pane-resizer="true"]::after {
        content: "";
        position: absolute;
        left: 4px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: transparent;
        transition: background 110ms ease, box-shadow 110ms ease;
      }
      [data-ers-pane-resizer="true"]:hover::after,
      [data-ers-pane-resizer="true"][data-dragging="true"]::after {
        background: #0f6cbd;
        box-shadow: 0 0 0 1px rgba(15,108,189,.08);
      }
      @media print {
        [data-ers-pane-resizer="true"] { display: none !important; }
        [data-ers-ribbon="true"] { box-shadow: none !important; }
      }
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
      markWordShell(parts)

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
      // App starts at 90%; two document-only increments produce a comfortable 100% Word-like opening view.
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