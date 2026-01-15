import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.scss';

const API_BASE = 'http://localhost:5000/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'conseil', status: 'published' });
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/app');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, { headers }),
        fetch(`${API_BASE}/admin/stats`, { headers })
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData);
      setStats(statsData);

      const postsRes = await fetch(`${API_BASE}/blog/admin/all`, { headers });
      const postsData = await postsRes.json();
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: 'admin' })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u._id === userId ? updatedUser : u));
        alert('Utilisateur promu admin');
      } else {
        alert('Erreur lors de la promotion');
      }
    } catch (err) {
      console.error('Error promoting user:', err);
      alert('Erreur');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('Titre et contenu requis');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (editingPostId) {
        const res = await fetch(`${API_BASE}/blog/${editingPostId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newPost)
        });

        if (res.ok) {
          const updatedPost = await res.json();
          setPosts(posts.map(p => p._id === editingPostId ? updatedPost : p));
          alert('Post mis à jour');
        }
      } else {
        const res = await fetch(`${API_BASE}/blog`, {
          method: 'POST',
          headers,
          body: JSON.stringify(newPost)
        });

        if (res.ok) {
          const post = await res.json();
          setPosts([post, ...posts]);
          alert('Post créé');
        }
      }

      setNewPost({ title: '', content: '', category: 'conseil', status: 'draft' });
      setEditingPostId(null);
      setShowBlogForm(false);
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Erreur');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Supprimer ce post ?')) return;
    try {
      await fetch(`${API_BASE}/blog/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const editPost = (post) => {
    setNewPost({ title: post.title, content: post.content, category: post.category, status: post.status });
    setEditingPostId(post._id);
    setShowBlogForm(true);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="admin-dashboard-container">

      <h2 style={{marginTop: '1.5rem'}}>Dashboard Admin</h2>

      <h1>Administration</h1>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab('stats')} className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : 'inactive'}`}>Statistiques</button>
        <button onClick={() => setActiveTab('blog')} className={`admin-tab-btn ${activeTab === 'blog' ? 'active' : 'inactive'}`}>Gestion Blog</button>
      </div>

      {activeTab === 'stats' && (
      <div className="admin-content">
        <div className="admin-section">
          <h2>Statistiques Globales</h2>
          <p>Utilisateurs: {stats.users}</p>
          <p>Visites: {stats.visits ?? '—'}</p>
        </div>

        <div className="admin-section admin-section-wide">
          <h2>Utilisateurs</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button onClick={() => promoteToAdmin(user._id)} className="admin-promote-btn">
                        Promouvoir Admin
                      </button>
                    )}
                    <button onClick={() => deleteUser(user._id)} className="admin-delete-btn">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'blog' && (
        <div>
          <h2>Gestion des Posts de Blog</h2>
          <button onClick={() => { setShowBlogForm(!showBlogForm); setEditingPostId(null); setNewPost({ title: '', content: '', category: 'conseil', status: 'published' }); }} className="admin-btn admin-btn-secondary admin-toggle-btn">
            {showBlogForm ? 'Annuler' : '✏️ Nouveau Post'}
          </button>

          {showBlogForm && (
            <form onSubmit={handlePostSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Titre"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="admin-form-input"
              />
              <textarea
                placeholder="Contenu"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows="6"
                className="admin-form-textarea"
              />
              <div className="admin-form-controls">
                <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} className="admin-form-select">
                  <option value="conseil">Conseil</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="actualité">Actualité</option>
                  <option value="astuce">Astuce</option>
                </select>
                <select value={newPost.status} onChange={(e) => setNewPost({ ...newPost, status: e.target.value })} className="admin-form-select">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary">
                {editingPostId ? 'Mettre à jour' : 'Créer'}
              </button>
            </form>
          )}

          <h3>Posts ({posts.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td><span className={`status-badge ${post.status === 'published' ? 'status-published' : 'status-draft'}`}>{post.status}</span></td>
                  <td>
                    <button onClick={() => editPost(post)} className="admin-btn-edit">Éditer</button>
                    <button onClick={() => deletePost(post._id)} className="admin-btn-delete">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;