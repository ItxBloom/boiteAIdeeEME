import { useState } from 'react'

function Formulaire() {

  const [titre, setTitre] = useState('')
  const [sousTitre, setSousTitre] = useState('')
  const [texte, setTexte] = useState('')
  const [envoye, setEnvoye] = useState(false)

  function envoyer(evenement) {
    evenement.preventDefault() // empêche la page de se recharger

    console.log({ titre, sousTitre, texte })

    setTitre('')
    setSousTitre('')
    setTexte('')
    setEnvoye(true)
  }

  return (
    <form className="formulaire" onSubmit={envoyer}>
      <h2>Votre idée</h2>

      {envoye && <p className="message">Merci, votre idée a bien été envoyée.</p>}

      <label htmlFor="titre">Titre</label>
      <input
        id="titre"
        type="text"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      <label htmlFor="sousTitre">Sous-titre</label>
      <input
        id="sousTitre"
        type="text"
        value={sousTitre}
        onChange={(e) => setSousTitre(e.target.value)}
      />

      <label htmlFor="texte">Texte</label>
      <textarea
        id="texte"
        rows="6"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        required
      />

      <button type="submit">Envoyer mon idée</button>
    </form>
  )
}

export default Formulaire