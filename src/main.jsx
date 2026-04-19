// ─── ENTRY POINT ──────────────────────────────────────────────────
// [L60] Create React App / Vite — main.jsx bootstraps the React app
// [L70] BrowserRouter — wraps app to enable client-side routing
// [L61] App component — root component rendered into #root div

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // [L70] React Router v6
import './index.css'   // [L13] External stylesheet import
import App from './App.jsx'

// [L51] DOM access — getElementById finds the mount point
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* [L70] BrowserRouter — uses HTML5 history API for routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
