
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

function Admin() {

    const navigate = useNavigate()

    const [idees, setIdees] = useState([])
    const [chargement, setChargement] = useState(true)
    const [erreur, setErreur] = useState('')

    const [categorieActive, setCategorieActive] = useState("Toutes les idées")
    const [recherche, setRecherche] = useState('')
    const [tri, setTri] = useState('recent')
    const [pageActive, setPageActive] = useState('idees')


    // Récupérer les idées depuis la base de données
    async function chargerIdees() {
        try {
            setChargement(true)
            setErreur('')

            const reponse = await fetch('http://localhost:3000/api/idees')

            if (!reponse.ok) {
                throw new Error("Impossible de récupérer les idées.")
            }

            const donnees = await reponse.json()

            setIdees(donnees)

        } catch (error) {
            console.error(error)
            setErreur("Impossible de contacter le serveur.")
        } finally {
            setChargement(false)
        }
    }


    // Charger les idées à l'ouverture de la page
    useEffect(() => {
        chargerIdees()
    }, [])


    // Liste des catégories
    const categories = [
        "Vie scolaire",
        "Matériel",
        "Activités et sorties",
        "Etablissement",
        "Restauration",
        "Autre"
    ]


    // Filtrer les idées selon la catégorie et la recherche
    let ideesFiltrees = idees.filter((idee) => {

        const correspondCategorie =
            categorieActive === "Toutes les idées" ||
            idee.categorie === categorieActive

        const correspondRecherche =
            idee.titre.toLowerCase().includes(recherche.toLowerCase()) ||
            idee.contenu.toLowerCase().includes(recherche.toLowerCase())

        return correspondCategorie && correspondRecherche
    })


    // Trier les idées
    ideesFiltrees.sort((a, b) => {

        if (tri === 'recent') {
            return new Date(b.date_creation) - new Date(a.date_creation)
        }

        if (tri === 'ancien') {
            return new Date(a.date_creation) - new Date(b.date_creation)
        }

        return a.titre.localeCompare(b.titre)
    })


    // Supprimer une idée
    function supprimerIdee(id) {

        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer cette idée ?"
        )

        if (confirmation) {
            setIdees(idees.filter((idee) => idee.id !== id))
        }
    }


    // Calculer le nombre d'idées par catégorie
    function nombreParCategorie(categorie) {
        return idees.filter((idee) => idee.categorie === categorie).length
    }


    // Calculer le nombre d'idées reçues pendant le mois actuel
    const moisActuel = idees.filter((idee) => {
        const date = new Date(idee.date_creation)
        const maintenant = new Date()

        return (
            date.getMonth() === maintenant.getMonth() &&
            date.getFullYear() === maintenant.getFullYear()
        )
    }).length


    // Calculer les idées reçues sur les 6 derniers mois
    const statistiquesMois = []

    for (let i = 5; i >= 0; i--) {

        const date = new Date()
        date.setDate(1)
        date.setMonth(date.getMonth() - i)

        const nombre = idees.filter((idee) => {
            const dateIdee = new Date(idee.date_creation)

            return (
                dateIdee.getMonth() === date.getMonth() &&
                dateIdee.getFullYear() === date.getFullYear()
            )
        }).length

        statistiquesMois.push({
            nom: date.toLocaleDateString('fr-FR', { month: 'short' }),
            nombre: nombre
        })
    }


    const maximumMois = Math.max(
        ...statistiquesMois.map((mois) => mois.nombre),
        1
    )


    return (
        <div className="admin-page">

            {/* Barre latérale */}
            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <h2>EME</h2>
                    <p>Boîte à idées</p>
                </div>

                <nav className="admin-nav">

                    <button
                        className={pageActive === 'idees' ? 'active' : ''}
                        onClick={() => setPageActive('idees')}
                    >
                        <span>▦</span> Toutes les idées
                    </button>

                    <button
                        className={pageActive === 'statistiques' ? 'active' : ''}
                        onClick={() => setPageActive('statistiques')}
                    >
                        <span>▥</span> Statistiques
                    </button>

                </nav>

                <div className="admin-sidebar-bottom">
                    <p>Administration EME</p>
                </div>

            </aside>


            {/* Contenu principal */}
            <main className="admin-main">

                {/* Bouton retour en haut à droite */}
                <div className="admin-retour">
                    <button
                        className="bouton-retour"
                        onClick={() => navigate(-1)}
                    >
                        ← Retour
                    </button>
                </div>


                {/* En-tête du tableau de bord */}
                <header className="admin-header">

                    <div>
                        <h1>Tableau de bord</h1>
                        <p>Gestion de la boîte à idées</p>
                    </div>

                    <span className="admin-badge">
                        Administration
                    </span>

                </header>


                {/* Cartes statistiques */}
                <section className="admin-stats">

                    <div className="stat-card">
                        <p>Total des idées</p>
                        <h2>{idees.length}</h2>
                        <span>Depuis la création</span>
                    </div>

                    <div className="stat-card">
                        <p>Catégories utilisées</p>
                        <h2>
                            {categories.filter(c => nombreParCategorie(c) > 0).length}
                        </h2>
                        <span>Sur {categories.length} catégories</span>
                    </div>

                    <div className="stat-card">
                        <p>Idées ce mois-ci</p>
                        <h2>{moisActuel}</h2>
                        <span>Depuis le début du mois</span>
                    </div>

                </section>


                {/* Page de gestion des idées */}
                {pageActive === 'idees' && (

                    <section className="admin-section">

                        <div className="admin-section-title">

                            <div>
                                <h2>Gestion des idées</h2>
                                <p>Consulte et gère les propositions reçues.</p>
                            </div>

                            <span>{idees.length} idées</span>

                        </div>


                        {/* Chargement et erreurs */}
                        {chargement && <p>Chargement des idées...</p>}

                        {erreur && <p>{erreur}</p>}


                        {!chargement && !erreur && (

                            <>

                                {/* Filtres */}
                                <div className="admin-filtres">

                                    <input
                                        type="text"
                                        placeholder="Rechercher une idée..."
                                        value={recherche}
                                        onChange={(e) => setRecherche(e.target.value)}
                                    />

                                    <select
                                        value={categorieActive}
                                        onChange={(e) => setCategorieActive(e.target.value)}
                                    >
                                        <option value="Toutes les idées">
                                            Toutes les catégories
                                        </option>

                                        {categories.map((categorie) => (
                                            <option key={categorie} value={categorie}>
                                                {categorie}
                                            </option>
                                        ))}

                                    </select>

                                    <select
                                        value={tri}
                                        onChange={(e) => setTri(e.target.value)}
                                    >
                                        <option value="recent">Plus récentes</option>
                                        <option value="ancien">Plus anciennes</option>
                                        <option value="titre">Ordre alphabétique</option>
                                    </select>

                                </div>


                                {/* Liste des idées */}
                                <div className="admin-table-container">

                                    <table className="admin-table">

                                        <thead>
                                            <tr>
                                                <th>Titre</th>
                                                <th>Catégorie</th>
                                                <th>Sous-catégorie</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {ideesFiltrees.map((idee) => (

                                                <tr key={idee.id}>

                                                    <td>
                                                        <strong>{idee.titre}</strong>
                                                        <small>{idee.contenu}</small>
                                                    </td>

                                                    <td>{idee.categorie}</td>

                                                    <td>{idee.sous_categorie}</td>

                                                    <td>
                                                        {new Date(idee.date_creation).toLocaleDateString('fr-FR')}
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="admin-delete"
                                                            onClick={() => supprimerIdee(idee.id)}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>

                                                </tr>

                                            ))}


                                            {ideesFiltrees.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="admin-empty">
                                                        Aucune idée trouvée.
                                                    </td>
                                                </tr>
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </>

                        )}

                    </section>

                )}


                {/* Page statistiques */}
                {pageActive === 'statistiques' && (

                    <section className="admin-section">

                        <div className="admin-section-title">

                            <div>
                                <h2>Statistiques</h2>
                                <p>Répartition des idées reçues.</p>
                            </div>

                        </div>


                        <div className="admin-statistiques">

                            {/* Statistiques par catégorie */}
                            <div className="statistique-card">

                                <h3>Idées par catégorie</h3>

                                {categories.map((categorie) => {

                                    const nombre = nombreParCategorie(categorie)

                                    const pourcentage = idees.length > 0
                                        ? (nombre / idees.length) * 100
                                        : 0

                                    return (

                                        <div className="statistique-ligne" key={categorie}>

                                            <div className="statistique-label">
                                                <span>{categorie}</span>
                                                <strong>{nombre}</strong>
                                            </div>

                                            <div className="statistique-barre">
                                                <div style={{ width: `${pourcentage}%` }}></div>
                                            </div>

                                        </div>

                                    )
                                })}

                            </div>


                            {/* Évolution sur 6 mois */}
                            <div className="statistique-card">

                                <h3>Évolution sur 6 mois</h3>

                                <div className="statistique-mois">

                                    {statistiquesMois.map((mois, index) => (

                                        <div className="statistique-mois-item" key={index}>

                                            <strong>{mois.nombre}</strong>

                                            <div className="statistique-colonne">
                                                <div
                                                    style={{
                                                        height: `${(mois.nombre / maximumMois) * 100}%`
                                                    }}
                                                ></div>
                                            </div>

                                            <span>{mois.nom}</span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </section>

                )}

            </main>

        </div>
    )
}

export default Admin
