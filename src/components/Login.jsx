import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.scss';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Rediriger vers l'app principale
        navigate('/app');
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Connexion</h2>
      </div>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
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

        <div className="login-form-group">
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

        <button type="submit" disabled={loading} className="login-submit">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="login-links">
        <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
        <p><Link to="/forgot-password">Mot de passe oublié ?</Link></p>
        <p><Link to="/">Retour à l'accueil</Link></p>
      </div>
    </div>
  );
}

export default Login;