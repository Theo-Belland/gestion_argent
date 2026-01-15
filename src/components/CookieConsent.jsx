import { useState, useEffect } from 'react';
import '../styles/cookieConsent.scss';

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(() => {
    return !localStorage.getItem('cookieConsent');
  });

  useEffect(() => {
    // Effet vide car l'état est initialisé correctement
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-content">
          <div className="cookie-icon">🍪</div>
          <div className="cookie-text">
            <h3>Nous utilisons des cookies</h3>
            <p>
              Ce site utilise des cookies pour améliorer votre expérience et sauvegarder vos préférences.
              En continuant à utiliser notre site, vous acceptez notre politique de cookies.
            </p>
          </div>
        </div>
        <div className="cookie-actions">
          <button className="btn-decline" onClick={handleDecline}>
            Refuser
          </button>
          <button className="btn-accept" onClick={handleAccept}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
