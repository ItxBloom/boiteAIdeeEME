
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import './App.css'

import Formulaire from './components/formulaire'
import Footer from './components/footer'
import BoutonAdmin from './components/BoutonAdmin'

import Admin from './pages/Admin'

// Contenu principal de l'application
function ContenuApp() {
  const location = useLocation()

  return (
    <div className="page">

      {/* En-tête affiché uniquement sur la page d'accueil */}
      {location.pathname === '/' && (
        <header>
          <div className="header-titre">
            <h1>Boîte à idées</h1>
            <p>École modèle d’électronique</p>
          </div>

          <BoutonAdmin />
        </header>
      )}

      {/* Pages de l'application */}
      <main>
        <Routes>
          <Route path="/" element={<Formulaire />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* Pied de page affiché uniquement sur la page d'accueil */}
      {location.pathname === '/' && <Footer />}

    </div>
  )
}

// Application principale avec le système de navigation
function App() {
  return (
    <BrowserRouter>
      <ContenuApp />
    </BrowserRouter>
  )
}

export default App
