import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './AppRouter.jsx'
import './root.css'
import './tailwind.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
