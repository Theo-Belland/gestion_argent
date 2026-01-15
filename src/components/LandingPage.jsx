import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.scss';

function LandingPage() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Log visit once on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/metrics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/', user: user?.email })
    }).catch(() => {});
  }, [user?.email]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Gestion de l'Argent</h1>
        <p>Votre outil simple et efficace pour gérer vos finances personnelles</p>
        <div className="landing-header-buttons">
          <Link to="/login" className="landing-btn-primary">Se connecter</Link>
          <Link to="/register" className="landing-btn-secondary">Créer un compte</Link>
        </div>
      </header>

      <section className="landing-demo-section">
        <h2>Démo express</h2>
        <p>Aperçu visuel des indicateurs clés avant de créer votre compte.</p>
        <div className="landing-demo-cards">
          {[{
            label: 'Revenus mensuels', value: '7 284 €', type: 'income'
          }, {
            label: 'Dépenses', value: '675 €', type: 'expense'
          }, {
            label: 'Épargnes', value: '0 €', type: 'savings'
          }, {
            label: 'Crédits restants', value: '3', type: 'credits'
          }].map((item, idx) => (
            <div key={idx} className="landing-demo-card">
              <div className="landing-demo-card-label">{item.label}</div>
              <div className={`landing-demo-card-value ${item.type}`}>{item.value}</div>
            </div>
          ))}
        </div>
        <div className="landing-demo-info">
          <div>Essai immédiat : connectez-vous puis rendez-vous sur l'espace Admin pour voir vos propres métriques.</div>
          <div>Vous n'avez pas de compte ? Créez-en un et explorez l'app en quelques secondes.</div>
        </div>
      </section>

      <section className="landing-features-section">
        <h2>Fonctionnalités Clés</h2>
        <div className="landing-features-cards">
          <div className="landing-feature-card">
            <div className="landing-feature-card-icon">💰</div>
            <h3>Suivi des Revenus</h3>
            <p>Enregistrez vos revenus fixes et variables facilement.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card-icon">📊</div>
            <h3>Analyse des Dépenses</h3>
            <p>Visualisez vos dépenses avec des tableaux et graphiques.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card-icon">🏦</div>
            <h3>Gestion des Crédits</h3>
            <p>Suivez vos crédits et mensualités automatiquement.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card-icon">💸</div>
            <h3>Épargnes</h3>
            <p>Planifiez et suivez vos objectifs d'épargne.</p>
          </div>
        </div>
      </section>

      <section className="landing-demo-image-section">
        <h2>Démonstration</h2>
        <p>Voici un aperçu de l'interface :</p>
        <img src="/demo-screenshot.png" alt="Démonstration de l'app" className="landing-demo-image" />
      </section>

      <section className="landing-cta-section">
        <h2>Commencez Maintenant</h2>
        <p>Créez votre compte gratuitement pour accéder à votre tableau de bord personnalisé.</p>
        <Link to="/register" className="landing-cta-button">S'inscrire</Link>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 Gestion de l'Argent. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default LandingPage;