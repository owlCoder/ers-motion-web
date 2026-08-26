import React from 'react'
import ReactDOM from 'react-dom/client'
import StaticApp from './StaticApp'

document.documentElement.lang = 'sr'
document.body.style.margin = '0'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StaticApp />
  </React.StrictMode>,
)
