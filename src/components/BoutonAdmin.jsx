import { useNavigate } from 'react-router-dom'

function BoutonAdmin() {
  const navigate = useNavigate()

  return (
    <button
      className="bouton-admin"
      onClick={() => navigate('/admin')}
    >
      Connexion
    </button>
  )
}

export default BoutonAdmin