import { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '50px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <nav style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '20px'
      }}>
        {user ? (
          <>
            <Link to="/app" style={{ color: 'white', textDecoration: 'none' }}>App</Link>
            <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
            )}
            <span>Bonjour, {user.email}</span>
            <button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.reload();
            }} style={{ background: 'none', color: 'white', border: '1px solid white', padding: '5px 10px', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Connexion</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Inscription</Link>
          </>
        )}
      </nav>
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3em', marginBottom: '10px' }}>Gestion de l'Argent</h1>
        <p style={{ fontSize: '1.2em' }}>Votre outil simple et efficace pour gérer vos finances personnelles</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/login" style={{ padding: '10px 20px', background: 'white', color: '#764ba2', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Se connecter</Link>
          <Link to="/register" style={{ marginLeft: '10px', padding: '10px 20px', border: '1px solid white', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Créer un compte</Link>
        </div>
      </header>

      <section style={{ margin: '40px auto', maxWidth: '900px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <h2 style={{ marginBottom: '10px' }}>Démo express</h2>
        <p style={{ marginBottom: '20px' }}>Aperçu visuel des indicateurs clés avant de créer votre compte.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          {[{
            label: 'Revenus mensuels', value: '7 284 €', color: '#8ef0c0'
          }, {
            label: 'Dépenses', value: '675 €', color: '#ffd480'
          }, {
            label: 'Épargnes', value: '0 €', color: '#9ec5fe'
          }, {
            label: 'Crédits restants', value: '3', color: '#f8b4d9'
          }].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '15px 20px', minWidth: '180px' }}>
              <div style={{ fontSize: '0.95em', opacity: 0.85 }}>{item.label}</div>
              <div style={{ fontSize: '1.6em', fontWeight: '700', marginTop: '6px', color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.95em', opacity: 0.9 }}>
          <div>Essai immédiat : connectez-vous puis rendez-vous sur l'espace Admin pour voir vos propres métriques.</div>
          <div style={{ marginTop: '6px' }}>Vous n'avez pas de compte ? Créez-en un et explorez l'app en quelques secondes.</div>
        </div>
      </section>

      <section style={{ marginBottom: '50px' }}>
        <h2>Fonctionnalités Clés</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', marginTop: '30px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>💰</div>
            <h3>Suivi des Revenus</h3>
            <p>Enregistrez vos revenus fixes et variables facilement.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>📊</div>
            <h3>Analyse des Dépenses</h3>
            <p>Visualisez vos dépenses avec des tableaux et graphiques.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>🏦</div>
            <h3>Gestion des Crédits</h3>
            <p>Suivez vos crédits et mensualités automatiquement.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <div style={{ fontSize: '3em', marginBottom: '10px' }}>💸</div>
            <h3>Épargnes</h3>
            <p>Planifiez et suivez vos objectifs d'épargne.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '50px' }}>
        <h2>Démonstration</h2>
        <p>Voici un aperçu de l'interface :</p>
        <img src="/demo-screenshot.png" alt="Démonstration de l'app" style={{ maxWidth: '80%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} />
        {/* Remplacez par une vraie image ou vidéo */}
      </section>

      <section>
        <h2>Commencez Maintenant</h2>
        <p>Créez votre compte gratuitement pour accéder à votre tableau de bord personnalisé.</p>
        <div style={{ marginTop: '30px' }}>
          <Link to="/register" style={{
            background: '#28a745',
            color: 'white',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1.2em'
          }}>S'inscrire</Link>
        </div>
      </section>

      <footer style={{ marginTop: '50px', fontSize: '0.9em' }}>
        <p>&copy; 2026 Gestion de l'Argent. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default LandingPage;