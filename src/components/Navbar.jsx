import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss';

function Navbar() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Dropdowns à afficher si connecté
  const dropdowns = user ? [
    {
      label: 'Tableau de bord',
      items: [
        { label: 'Accueil', to: '/app' },
        { label: 'Transactions', to: '/app/transactions' },
        { label: 'Rapports', to: '/app/rapports' },
      ]
    },
    {
      label: 'Gestion',
      items: [
        { label: 'Objectifs', to: '/app/objectifs' },
        { label: 'Budgets', to: '/app/budgets' },
        { label: 'Épargnes', to: '/app/epargnes' },
        { label: 'Crédits', to: '/app/credits' },
      ]
    },
    {
      label: 'Outils',
      items: [
        { label: 'Import CSV', to: '/app/import' },
      ]
    },
    {
      label: 'Profil',
      items: [
        { label: 'Mon profil', to: '/app/profile' },
      ]
    },
    {
      label: 'Autres',
      items: [
        { label: 'Blog', to: '/blog' },
        ...(user.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
        { label: 'Déconnexion', action: handleLogout, isLogout: true },
      ]
    },
  ] : [
    {
      label: 'Compte',
      items: [
        { label: 'Connexion', to: '/login' },
        { label: 'Inscription', to: '/register' },
        { label: 'Blog', to: '/blog' },
      ]
    }
  ];

  return (
    <nav className="navbar-general">
      <Link to="/" className="navbar-logo">Gestion Argent</Link>
      <div className="navbar-multi-dropdowns">
        {dropdowns.map((dropdown, idx) => (
          <div
            className={"navbar-multi-dropdown-wrapper" + (openDropdown === idx ? " open" : "")}
            key={dropdown.label}
            onMouseEnter={() => setOpenDropdown(idx)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="navbar-multi-dropdown-toggle" onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}>
              {dropdown.label} <span className="navbar-dropdown-arrow">▼</span>
            </button>
            {openDropdown === idx && (
              <div className="navbar-dropdown-menu">
                {dropdown.items.map((item, i) => item.to ? (
                  <button
                    key={item.label}
                    className={"navbar-dropdown-item" + (item.isLogout ? " logout" : "")}
                    onClick={() => { navigate(item.to); setOpenDropdown(null); }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <button
                    key={item.label}
                    className={"navbar-dropdown-item" + (item.isLogout ? " logout" : "")}
                    onClick={() => { item.action(); setOpenDropdown(null); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
