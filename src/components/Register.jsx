import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    // Vérifier la longueur du mot de passe
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Rediriger vers l'app principale
        navigate('/app');
      } else {
        setError(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Inscription</h2>
      </div>

      {error && <div className="register-error">{error}</div>}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="register-submit">
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>

      <div className="register-links">
        <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        <p><Link to="/">Retour à l'accueil</Link></p>
      </div>
    </div>
  );
}

export default Register;