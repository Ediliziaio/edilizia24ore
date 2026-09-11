import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'
import { salvaParametriCampagna } from './lib/eicLead'

// Salva UTM/gclid/fbclid all'atterraggio: il form può essere compilato su un'altra pagina.
salvaParametriCampagna()

const rootEl = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// When the page was statically prerendered, hydrate the existing markup;
// otherwise (dev server) mount a fresh client render.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}

// Analytics loads only after explicit consent (no-op until an ID is configured).
initAnalytics()
