import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '20px' }}>
      <nav style={{
        background: '#333',
        color: 'white',
        padding: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => navigate('/app')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Retour à l'App</button>
          <h2>Dashboard Admin</h2>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </nav>

      <h1>Administration</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('stats')} style={{ padding: '8px 16px', background: activeTab === 'stats' ? '#667eea' : '#ccc', color: activeTab === 'stats' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Statistiques</button>
        <button onClick={() => setActiveTab('blog')} style={{ padding: '8px 16px', background: activeTab === 'blog' ? '#667eea' : '#ccc', color: activeTab === 'blog' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Gestion Blog</button>
      </div>

      {activeTab === 'stats' && (
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2>Statistiques Globales</h2>
          <p>Utilisateurs: {stats.users}</p>
          <p>Visites: {stats.visits ?? '—'}</p>
        </div>

        <div style={{ flex: '2', minWidth: '500px' }}>
          <h2>Utilisateurs</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rôle</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date d'inscription</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {user.role !== 'admin' && (
                      <button onClick={() => promoteToAdmin(user._id)} style={{ background: 'blue', color: 'white', border: 'none', padding: '5px', marginRight: '5px' }}>
                        Promouvoir Admin
                      </button>
                    )}
                    <button onClick={() => deleteUser(user._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>
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
          <button onClick={() => { setShowBlogForm(!showBlogForm); setEditingPostId(null); setNewPost({ title: '', content: '', category: 'conseil', status: 'published' }); }} style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}>
            {showBlogForm ? 'Annuler' : '✏️ Nouveau Post'}
          </button>

          {showBlogForm && (
            <form onSubmit={handlePostSubmit} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Titre"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <textarea
                placeholder="Contenu"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows="6"
                style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', fontFamily: 'monospace' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select value={newPost.category} onChange={(e) => setNewPost({ ...newPost, category: e.target.value })} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="conseil">Conseil</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="actualité">Actualité</option>
                  <option value="astuce">Astuce</option>
                </select>
                <select value={newPost.status} onChange={(e) => setNewPost({ ...newPost, status: e.target.value })} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '8px 16px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {editingPostId ? 'Mettre à jour' : 'Créer'}
              </button>
            </form>
          )}

          <h3>Posts ({posts.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Titre</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Catégorie</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Statut</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{post.category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}><span style={{ padding: '2px 6px', borderRadius: '3px', background: post.status === 'published' ? '#4CAF50' : '#ff9800', color: 'white', fontSize: '0.85em' }}>{post.status}</span></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => editPost(post)} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>Éditer</button>
                    <button onClick={() => deletePost(post._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}>Supprimer</button>
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