import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  // Carrega tema ao montar
  useEffect(() => {
    const saved = localStorage.getItem('cnc_portal_theme_v1') || 'dark'
    setTheme(saved as 'light' | 'dark')
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  // Alterna tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('cnc_portal_theme_v1', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-lockup">
          <h1>CNC Portal</h1>
          <p>Passagem de Turno Beta V1.01</p>
        </div>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="app-main">
        <section className="card glass">
          <h2>Bem-vindo ao CNC Portal</h2>
          <p>Sistema de Passagem de Turno - Beta V1.01</p>
          <p>Versão modular em React + TypeScript</p>
        </section>
      </main>

      <div className="toast" id="toast"></div>
    </div>
  )
}

export default App
