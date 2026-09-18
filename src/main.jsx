import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// NOTE(backend): IMPORTANT import order — don't reorder unless you know why.
// 1) index.css loads Tailwind v4 + shadcn/ui theme tokens (HSL variables).
// 2) tokens.css loads legacy Vendora brand variables used by app.css.
// 3) App.jsx then pulls in app.css on top for the current landing/auth layout.
// Once the whole app is on Tailwind classes, you can delete tokens.css + app.css.
import './styles/index.css'
import './styles/tokens.css'

import App from './app/App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider><App /></AuthProvider>
  </StrictMode>,
)
