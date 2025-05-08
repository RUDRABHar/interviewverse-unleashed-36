
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import './styles/fonts.css'
import './styles/design-tokens.css'
import './styles/animations.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
)
