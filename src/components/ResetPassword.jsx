import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import '../styles/passwordReset.scss';

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'https://api.geretonbudget.theobelland.fr/api';

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get('token');
  const email = params.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('ResetPassword params:', { token, email });
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token || !email) {
      setError('Lien invalide ou expiré.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la réinitialisation.');
      } else {
        setMessage(data.message || 'Mot de passe réinitialisé avec succès.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('ResetPassword fetch error:', err);
      setError('Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="password-reset-container">
        <div className="password-reset-card">
          <h2>🔒 Nouveau mot de passe</h2>
          <div className="error-message">Lien invalide ou expiré.</div>
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

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser'}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="back-to-login">
          <Link to="/login">← Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
