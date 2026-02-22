import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/passwordReset.scss';

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'https://api.geretonbudget.theobelland.fr/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-card">
        <h2>🔑 Mot de passe oublié ?</h2>
        <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Envoyer le lien'}
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

export default ForgotPassword;
