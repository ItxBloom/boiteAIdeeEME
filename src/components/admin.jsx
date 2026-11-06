import { useEffect, useState } from 'react'
import supabase from '../supabase.js'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [enVerification, setEnVerification] = useState(true)

  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState('')
  const [projets, setProjets] = useState([])
  const [travaux, setTravaux] = useState([])
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fichierImage, setFichierImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const [formProjet, setFormProjet] = useState({
    titre: '', description: '', categorie: '', date_creation: ''
  })

  const [formTravail, setFormTravail] = useState({
    titre: '', description: '', image_url: '', categorie: '', date_creation: ''
  })

  const [infos, setInfos] = useState({
    email: '',
    instagram: '',
    about_me: ''
  })

  // SESSION
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') return
      setSession(session)
    })
  }, [])

  // CHECK ADMIN
  useEffect(() => {
    if (session) {
      checkAdmin(session.user.id).then((resultat) => {
        setIsAdmin(resultat)
        setEnVerification(false)
      })
    } else {
      setEnVerification(false)
    }
  }, [session])

  async function checkAdmin(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) return false
    return data?.role === 'admin'
  }

  // CHARGEMENT DONNÉES
  useEffect(() => {
    if (session && isAdmin) {
      chargerProjets()
      chargerTravaux()
      chargerInfos()
    }
  }, [session, isAdmin])

  async function seConnecter(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password: mdp })
    if (error) setErreur('Email ou mot de passe incorrect')
  }

  async function motDePasseOublie() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    })
    if (error) setErreur(error.message)
    else setMessage('Email de récupération envoyé')
  }

  async function seDeconnecter() {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
    setEnVerification(false)
  }

  async function chargerProjets() {
    const { data } = await supabase.from('projets').select('*').order('id', { ascending: false })
    setProjets(data || [])
  }

  async function chargerTravaux() {
    const { data } = await supabase.from('travaux').select('*').order('id', { ascending: false })
    setTravaux(data || [])
  }

  async function ajouterProjet(e) {
    e.preventDefault()
    const { error } = await supabase.from('projets').insert([formProjet])
    if (error) setMessage('Erreur : ' + error.message)
    else {
      setMessage('Projet ajouté !')
      setFormProjet({ titre: '', description: '', categorie: '', date_creation: '' })
      chargerProjets()
    }
  }

  function handleFichierImage(e) {
    const fichier = e.target.files[0]
    if (!fichier) return
    setFichierImage(fichier)
    setPreviewImage(URL.createObjectURL(fichier))
  }

  async function ajouterTravail(e) {
    e.preventDefault()
    let image_url = formTravail.image_url

    if (fichierImage) {
      setUploading(true)
      const nomFichier = `${Date.now()}_${fichierImage.name}`
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(nomFichier, fichierImage)

      if (uploadError) {
        setMessage('Erreur upload image : ' + uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('images').getPublicUrl(nomFichier)
      image_url = data.publicUrl
      setUploading(false)
    }

    const { error } = await supabase.from('travaux').insert([{ ...formTravail, image_url }])
    if (error) setMessage('Erreur : ' + error.message)
    else {
      setMessage('Travail ajouté !')
      setFormTravail({ titre: '', description: '', image_url: '', categorie: '', date_creation: '' })
      setFichierImage(null)
      setPreviewImage(null)
      chargerTravaux()
    }
  }

  async function supprimerProjet(id) {
    const { error } = await supabase.from('projets').delete().eq('id', id)
    if (error) setMessage('Erreur suppression : ' + error.message)
    else chargerProjets()
  }

  async function supprimerTravail(id) {
    const { error } = await supabase.from('travaux').delete().eq('id', id)
    if (error) setMessage('Erreur suppression : ' + error.message)
    else chargerTravaux()
  }

  async function chargerInfos() {
    const { data, error } = await supabase
      .from('infos')
      .select('*')
      .eq('id', 1)
      .single()

    if (!error && data) {
      setInfos({
        email: data.email || '',
        instagram: data.instagram || '',
        about_me: data.about_me || ''
      })
    }
  }

  async function sauvegarderInfos(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('infos')
      .update({
        email: infos.email,
        instagram: infos.instagram,
        about_me: infos.about_me
      })
      .eq('id', 1)

    if (error) {
      setMessage('Erreur infos : ' + error.message)
    } else {
      setMessage('Infos mises à jour !')
    }
  }

  // ÉCRAN DE CONNEXION
  if (!session) return (
    <div className="admin-connexion">
      <h2>Accès administration</h2>
      <form onSubmit={seConnecter}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
        <button type="button" onClick={motDePasseOublie}>Mot de passe oublié</button>
        {erreur && <p className="admin-erreur">{erreur}</p>}
        {message && <p className="admin-message">{message}</p>}
      </form>
    </div>
  )

  // CHARGEMENT EN COURS
  if (enVerification) return (
    <div className="admin-connexion">
      <p>Vérification en cours...</p>
    </div>
  )

  // SECURITY CHECK
  if (!isAdmin) return (
    <div className="admin-connexion">
      <p>Accès refusé</p>
    </div>
  )

  // INTERFACE ADMIN
  return (
    <div className="admin-page">

      <div className="admin-header">
        <h1>Panel Admin</h1>
        <button className="bouton-deconnexion" onClick={seDeconnecter}>Se déconnecter</button>
      </div>

      {message && <p className="admin-message">{message}</p>}

      {/* Formulaire Projets */}
      <h2>Ajouter un projet en cours</h2>
      <form onSubmit={ajouterProjet} className="admin-form">
        <label>Titre</label>
        <input value={formProjet.titre} onChange={e => setFormProjet({...formProjet, titre: e.target.value})} required />
        <label>Description</label>
        <textarea value={formProjet.description} onChange={e => setFormProjet({...formProjet, description: e.target.value})} />
        <label>Catégorie</label>
        <input value={formProjet.categorie} onChange={e => setFormProjet({...formProjet, categorie: e.target.value})} />
        <label>Date de création</label>
        <input type="date" value={formProjet.date_creation} onChange={e => setFormProjet({...formProjet, date_creation: e.target.value})} />
        <button type="submit">Ajouter le projet</button>
      </form>

      <h2>Projets en cours existants</h2>
      <ul className="admin-liste">
        {projets.map(p => (
          <li key={p.id}>
            <strong>{p.titre}</strong> — {p.categorie}
            <button onClick={() => supprimerProjet(p.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      {/* Formulaire Travaux */}
      <h2>Ajouter un projet terminé</h2>
      <form onSubmit={ajouterTravail} className="admin-form">
        <label>Titre</label>
        <input value={formTravail.titre} onChange={e => setFormTravail({...formTravail, titre: e.target.value})} required />
        <label>Description</label>
        <textarea value={formTravail.description} onChange={e => setFormTravail({...formTravail, description: e.target.value})} />
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFichierImage}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Aperçu"
            style={{ width: '150px', borderRadius: '8px', marginTop: '8px' }}
          />
        )}
        <label>Catégorie</label>
        <input value={formTravail.categorie} onChange={e => setFormTravail({...formTravail, categorie: e.target.value})} />
        <label>Date de création</label>
        <input type="date" value={formTravail.date_creation} onChange={e => setFormTravail({...formTravail, date_creation: e.target.value})} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Upload en cours...' : 'Ajouter le travail'}
        </button>
      </form>

      <h2>Projets terminés existants</h2>
      <ul className="admin-liste">
        {travaux.map(t => (
          <li key={t.id}>
            {t.image_url && (
              <img
                src={t.image_url}
                alt={t.titre}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginRight: '10px' }}
              />
            )}
            <strong>{t.titre}</strong> — {t.categorie}
            <button onClick={() => supprimerTravail(t.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Informations Contact / About</h2>
      <form onSubmit={sauvegarderInfos} className="admin-form">
        <label>Email</label>
        <input
          value={infos.email}
          onChange={(e) => setInfos({ ...infos, email: e.target.value })}
        />

        <label>Instagram</label>
        <input
          value={infos.instagram}
          onChange={(e) => setInfos({ ...infos, instagram: e.target.value })}
        />

        <label>About me</label>
        <textarea
          value={infos.about_me}
          onChange={(e) => setInfos({ ...infos, about_me: e.target.value })}
        />

        <button type="submit">Sauvegarder</button>
      </form>

    </div>
  )
}