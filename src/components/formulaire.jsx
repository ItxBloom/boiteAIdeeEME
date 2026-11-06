
import { useState } from 'react'

function Formulaire() {

  const [titre, setTitre] = useState('')
  const [categorie, setCategorie] = useState('')
  const [texte, setTexte] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [erreur, setErreur] = useState('')

  async function envoyer(evenement) {
    evenement.preventDefault()

    // Réinitialiser les messages
    setEnvoye(false)
    setErreur('')


    try {

      // Envoyer les données à l'API
      const reponse = await fetch('http://localhost:3000/api/idees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titre: titre,
          categorie: categorie,
          contenu: texte
        })
      })

      // Vérifier si la requête a fonctionné
      if (reponse.ok) {

        setTitre('')
        setCategorie('')
        setTexte('')

        setEnvoye(true)

      } else {

        const resultat = await reponse.json()
        setErreur(resultat.error || 'Une erreur est survenue.')

      }

    } catch (error) {

      console.error(error)
      setErreur("Impossible de contacter le serveur.")

    }

    // Vérifier que tous les champs sont remplis
    if (!titre.trim() || !categorie.trim() || !texte.trim()) {
      setErreur("Tous les champs sont obligatoires.")
      return
    }
    
  }

  return (
    <form className="formulaire" onSubmit={envoyer}>

      <h2>Votre idée</h2>

      {envoye && (
        <p className="message">
          Merci, votre idée a bien été envoyée.
        </p>
      )}

      {erreur && (
        <p className="erreur">
          {erreur}
        </p>
      )}

      <label htmlFor="titre">Titre</label>

      <input
        id="titre"
        type="text"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      <label htmlFor="categorie">Catégorie</label>

      <select
        id="categorie"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        required
      >
        <option value="">Choisir une catégorie</option>
        <option value="Vie scolaire">Vie scolaire</option>
        <option value="Matériel">Matériel</option>
        <option value="Activités et sorties">Activités et sorties</option>
        <option value="Etablissement">Etablissement</option>
        <option value="Restauration">Restauration</option>
        <option value="Autre">Autre</option>
      </select>

      <label htmlFor="texte">Description de votre idée</label>

      <textarea
        id="texte"
        rows="6"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        required
      />

      <button type="submit">
        Envoyer mon idée
      </button>

    </form>
  )
}

export default Formulaire
