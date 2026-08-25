import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import App from './App'

document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'
document.body.style.overflow = 'hidden'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme} style={{ height: '100vh' }}>
      <App />
    </FluentProvider>
  </React.StrictMode>,
)
