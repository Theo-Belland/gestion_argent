import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/userProfile.scss';

 const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  
  // Formulaires
  const [emailForm, setEmailForm] = useState({ email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [preferences, setPreferences] = useState({ currency: 'EUR', language: 'fr', notifications: true });
  const [deletePassword, setDeletePassword] = useState('');
  
  // Messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/profile/profile`, {
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }
      
      const data = await res.json();
      console.log('Profile data:', data);
      setUser(data);
      setEmailForm({ email: data.email || '' });
      setPreferences(data.preferences || { currency: 'EUR', language: 'fr', notifications: true });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Erreur de chargement du profil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const res = await fetch(`${API_BASE}/profile/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: emailForm.email })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage('Email mis à jour avec succès');
        fetchProfile();
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur email:', err);
      setError('Erreur de connexion');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profile/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Mot de passe changé avec succès');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      console.error('Erreur password:', err);
      setError('Erreur de connexion');
    }
  };

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/profile/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ preferences })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Préférences mises à jour');
        fetchProfile();
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur préférences:', err);
      setError('Erreur de connexion');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!window.confirm('⚠️ ATTENTION: Cette action est irréversible. Toutes vos données seront définitivement supprimées. Êtes-vous sûr ?')) {
      return;
    }

    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/profile/account`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Votre compte a été supprimé');
        navigate('/');
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError('Erreur de connexion');
    }
  };

  if (loading) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Erreur</h2>
        <p>Impossible de charger le profil utilisateur.</p>
        {error && <p>{error}</p>}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Erreur</h2>
        <p>Impossible de charger le profil utilisateur.</p>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <h1>👤 Mon Profil</h1>

      {message && <div className="profile-success">{message}</div>}
      {error && <div className="profile-error">{error}</div>}

      <div className="profile-tabs">
        <button 
          className={activeTab === 'info' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('info')}
        >
          📋 Informations
        </button>
        <button 
          className={activeTab === 'security' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('security')}
        >
          🔒 Sécurité
        </button>
        <button 
          className={activeTab === 'preferences' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Préférences
        </button>
        <button 
          className={activeTab === 'danger' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('danger')}
        >
          ⚠️ Zone dangereuse
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="profile-section">
            <h2>Informations du compte</h2>
            <div className="info-card">
              <p><strong>Email:</strong> {user?.email || 'Non défini'}</p>
              <p><strong>Rôle:</strong> {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
              <p><strong>Membre depuis:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non disponible'}</p>
            </div>

            <form onSubmit={handleUpdateEmail} className="profile-form">
              <h3>Modifier l'email</h3>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                required
              />
              <button type="submit">Mettre à jour l'email</button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="profile-section">
            <h2>Sécurité</h2>
            <form onSubmit={handleChangePassword} className="profile-form">
              <h3>Changer le mot de passe</h3>
              <input
                type="password"
                placeholder="Mot de passe actuel"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength="6"
              />
              <input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength="6"
              />
              <button type="submit">Changer le mot de passe</button>
            </form>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="profile-section">
            <h2>Préférences</h2>
            <form onSubmit={handleUpdatePreferences} className="profile-form">
              <div className="form-group">
                <label>Devise</label>
                <select 
                  value={preferences.currency} 
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                  <option value="GBP">Livre (£)</option>
                  <option value="CHF">Franc suisse (CHF)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Langue</label>
                <select 
                  value={preferences.language} 
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>


              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                  />
                  Recevoir des notifications générales
                </label>
              </div>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.goalMails ?? true}
                    onChange={(e) => setPreferences({ ...preferences, goalMails: e.target.checked })}
                  />
                  Recevoir des mails de progression d'objectif (50%, 80%, 100%)
                </label>
              </div>

              <button type="submit">Sauvegarder les préférences</button>
            </form>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="profile-section danger-zone">
            <h2>⚠️ Supprimer mon compte</h2>
            <p className="danger-warning">
              Cette action est <strong>irréversible</strong>. Toutes vos données (revenus, dépenses, épargnes, crédits, objectifs, budgets) seront <strong>définitivement supprimées</strong>.
            </p>
            <form onSubmit={handleDeleteAccount} className="profile-form">
              <input
                type="password"
                placeholder="Entrez votre mot de passe pour confirmer"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-danger">Supprimer définitivement mon compte</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
