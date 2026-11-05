import './App.css'
import Formulaire from './components/formulaire'
import Footer from './components/Footer'

// App est le composant principal : il assemble les morceaux de la page
function App() {
  return (
    <div className="page">
      <header>
        <h1>Boîte à idées</h1>
        <p>École modèle d’électronique</p>
      </header>

      <main>
        <Formulaire />
      </main>

      <Footer />
    </div>
  )
}

export default App