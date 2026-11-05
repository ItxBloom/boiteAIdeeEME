function Footer() {
  return (
    <div id="footerwrap">
      <footer id="footer" itemScope itemType="https://schema.org/WPFooter">

        <div className="main-col">
          {/* ----- Colonne de gauche : logo + réseaux sociaux ----- */}
          <div className="footer-left-wrap">
            <div className="footer-logo-wrapper">
              <div id="footer-logo">
                <a href="https://eme-enseignement.fr" title="EME">
                  <span>EME</span>
                </a>
              </div>
            </div>

            <div className="social-widget">
              <ul className="social-links">
                <li className="social-link-item twitch">
                  <a href="https://www.twitch.tv/eme_enseignement" target="_blank" rel="noopener noreferrer">
                    Twitch
                  </a>
                </li>
                <li className="social-link-item facebook">
                  <a href="https://fr-fr.facebook.com/ememarseille/" target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </li>
                <li className="social-link-item linkedin">
                  <a
                    href="https://www.linkedin.com/company/ecole-modele-d-electronique"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li className="social-link-item instagram">
                  <a href="https://www.instagram.com/eme_enseignement/" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ----- Colonne de droite : contact ----- */}
          <div className="footer-right-wrap">
            <div className="footer-text">
              <div className="footer-text-inner">
                <div className="one">
                  <h3>Contactez-nous</h3>
                  233 Bd de Saint-Marcel, 13011 Marseille
                  <br />
                  <a href="tel:0491446537">04 91 44 65 37</a>
                </div>
                <div className="two">
                  <a href="mailto:secretariat@eme-enseignement.fr">secretariat@eme-enseignement.fr</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer