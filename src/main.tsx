import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import App from './App'
import { WordWorkspaceEnhancements } from './components/WordWorkspaceEnhancements'
import './print.css'
import './word-shell.css'

document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'
document.body.style.overflow = 'hidden'

type SavedStyle = {
  element: HTMLElement
  display: string
  width: string
  minWidth: string
  maxWidth: string
  height: string
  minHeight: string
  overflow: string
  margin: string
  padding: string
}

let savedStyles: SavedStyle[] = []
let activePrintRoot: HTMLElement | null = null
let savedDocumentTitle = document.title

function remember(element: HTMLElement) {
  savedStyles.push({
    element,
    display: element.style.display,
    width: element.style.width,
    minWidth: element.style.minWidth,
    maxWidth: element.style.maxWidth,
    height: element.style.height,
    minHeight: element.style.minHeight,
    overflow: element.style.overflow,
    margin: element.style.margin,
    padding: element.style.padding,
  })
}

const preparePrintLayout = () => {
  const provider = document.querySelector('.fui-FluentProvider') as HTMLElement | null
  const appRoot = provider?.firstElementChild as HTMLElement | null
  if (!provider || !appRoot) return

  const directChildren = Array.from(appRoot.children) as HTMLElement[]
  const printContainer = directChildren.find((element) =>
    Array.from(element.children).some((child) => child.classList.contains('page-wrap')),
  )
  if (!printContainer) return

  savedStyles = []
  activePrintRoot = printContainer
  savedDocumentTitle = document.title
  const academicTitle = printContainer.querySelector('.cover-page .text-title')?.textContent?.trim()
    || printContainer.querySelector('.text-h1')?.textContent?.trim()
  if (academicTitle) document.title = academicTitle

  document.body.classList.add('ers-printing')
  appRoot.classList.add('ers-app-root')
  printContainer.classList.add('ers-print-root')

  remember(provider)
  remember(appRoot)
  directChildren.forEach(remember)

  directChildren.forEach((element) => {
    element.style.display = element === printContainer ? 'block' : 'none'
  })

  for (const element of [provider, appRoot, printContainer]) {
    element.style.width = '210mm'
    element.style.minWidth = '210mm'
    element.style.maxWidth = '210mm'
    element.style.height = 'auto'
    element.style.minHeight = '0'
    element.style.overflow = 'visible'
    element.style.margin = '0'
    element.style.padding = '0'
  }

  document.documentElement.style.height = 'auto'
  document.body.style.height = 'auto'
  document.body.style.overflow = 'visible'
}

const restoreEditorLayout = () => {
  savedStyles.forEach(({ element, display, width, minWidth, maxWidth, height, minHeight, overflow, margin, padding }) => {
    element.style.display = display
    element.style.width = width
    element.style.minWidth = minWidth
    element.style.maxWidth = maxWidth
    element.style.height = height
    element.style.minHeight = minHeight
    element.style.overflow = overflow
    element.style.margin = margin
    element.style.padding = padding
  })
  savedStyles = []

  activePrintRoot?.classList.remove('ers-print-root')
  activePrintRoot = null
  document.querySelector('.ers-app-root')?.classList.remove('ers-app-root')
  document.body.classList.remove('ers-printing')
  document.title = savedDocumentTitle

  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'
  document.body.style.overflow = 'hidden'
}

window.addEventListener('beforeprint', preparePrintLayout)
window.addEventListener('afterprint', restoreEditorLayout)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme} style={{ height: '100vh', width: '100%' }}>
      <App />
      <WordWorkspaceEnhancements />
    </FluentProvider>
  </React.StrictMode>,
)
