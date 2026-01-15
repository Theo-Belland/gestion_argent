import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/passwordReset.scss';

const API_BASE = 'http://localhost:5000/api';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    // Vérifier la validité du token au chargement
    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/password-reset/verify-token/${token}`);
        const data = await res.json();
        setValidToken(data.valid);
        if (!data.valid) {
          setError(data.message || 'Token invalide ou expiré');
        }
      } catch (err) {
        console.error('Erreur token:', err);
        setError('Erreur de vérification du token');
        setValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/password-reset/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur reset:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <p>Vérification du token...</p>
        </div>
      </div>
    );
  }

  if (validToken === false) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <h2>❌ Token invalide</h2>
          <div className="error-message">{error}</div>
          <div className="back-to-login">
            <Link to="/forgot-password">← Demander un nouveau lien</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2>🔒 Nouveau mot de passe</h2>
        <p>Entrez votre nouveau mot de passe ci-dessous.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
          />
          
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        {message && (
          <div className="success-message">
            {message}
            <p>Redirection vers la connexion...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="back-to-login">
          <Link to="/login">← Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
