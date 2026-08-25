import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import App from './App'
import { WordWorkspaceEnhancements } from './components/WordWorkspaceEnhancements'

document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'
document.body.style.overflow = 'hidden'

const preparePrintLayout = () => {
  const provider = document.querySelector('.fui-FluentProvider') as HTMLElement | null
  const appRoot = provider?.firstElementChild as HTMLElement | null
  if (!appRoot) return

  const directChildren = Array.from(appRoot.children) as HTMLElement[]
  const printContainer = directChildren.find((element) => Array.from(element.children).some((child) => child.classList.contains('page-wrap')))
  if (!printContainer) return

  directChildren.forEach((element) => {
    element.dataset.ersDisplayBeforePrint = element.style.display
    if (element !== printContainer) element.style.display = 'none'
  })
  printContainer.style.display = 'block'
  document.documentElement.style.height = 'auto'
  document.body.style.height = 'auto'
  document.body.style.overflow = 'visible'
}

const restoreEditorLayout = () => {
  const provider = document.querySelector('.fui-FluentProvider') as HTMLElement | null
  const appRoot = provider?.firstElementChild as HTMLElement | null
  if (appRoot) {
    Array.from(appRoot.children).forEach((node) => {
      const element = node as HTMLElement
      if ('ersDisplayBeforePrint' in element.dataset) {
        element.style.display = element.dataset.ersDisplayBeforePrint || ''
        delete element.dataset.ersDisplayBeforePrint
      }
    })
  }
  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'
  document.body.style.overflow = 'hidden'
}

window.addEventListener('beforeprint', preparePrintLayout)
window.addEventListener('afterprint', restoreEditorLayout)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme} style={{ height: '100vh' }}>
      <App />
      <WordWorkspaceEnhancements />
    </FluentProvider>
  </React.StrictMode>,
)
