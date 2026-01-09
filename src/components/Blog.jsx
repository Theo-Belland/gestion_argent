import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'conseil', status: 'published' });
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState({ author: '', content: '', rating: 5 });
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/blog`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert('Titre et contenu requis');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPost)
      });

      if (res.ok) {
        const post = await res.json();
        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '', category: 'conseil' });
        setShowForm(false);
        alert('Post créé avec succès');
      } else {
        alert('Erreur lors de la création');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Erreur');
    }
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.content) {
      alert('Auteur et commentaire requis');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        setNewComment({ author: '', content: '', rating: 5 });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
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

  const deleteComment = async (postId, commentId) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await fetch(`${API_BASE}/blog/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const post = posts.find(p => p._id === postId);
      const updatedPost = {
        ...post,
        comments: post.comments.filter(c => c._id !== commentId)
      };
      setPosts(posts.map(p => p._id === postId ? updatedPost : p));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      conseil: '#667eea',
      tutorial: '#764ba2',
      actualité: '#ff6b6b',
      astuce: '#4ecdc4'
    };
    return colors[category] || '#999';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Chargement du blog...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5em', marginBottom: '10px', color: '#333' }}>📝 Blog</h1>
      <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666', marginBottom: '30px' }}>Conseils et astuces pour mieux gérer vos finances</p>

      {isAdmin && (
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            {showForm ? 'Annuler' : '✏️ Écrire un post'}
          </button>

          {showForm && (
            <form onSubmit={handlePostSubmit} style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '15px',
              border: '1px solid #ddd'
            }}>
              <input
                type="text"
                placeholder="Titre du post"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <textarea
                placeholder="Contenu (supports markdown)"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows="6"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', fontFamily: 'monospace' }}
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value="conseil">Conseil</option>
                <option value="tutorial">Tutorial</option>
                <option value="actualité">Actualité</option>
                <option value="astuce">Astuce</option>
              </select>
              <button type="submit" style={{
                padding: '10px 20px',
                background: '#764ba2',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Publier
              </button>
            </form>
          )}
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '1.1em', marginTop: '40px' }}>Aucun post pour le moment. Soyez le premier à écrire ! ✍️</p>
        ) : (
          posts.map(post => (
            <div
              key={post._id}
              style={{
                background: 'white',
                borderLeft: `5px solid ${getCategoryColor(post.category)}`,
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    background: getCategoryColor(post.category),
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.85em',
                    marginBottom: '10px'
                  }}>
                    {post.category}
                  </span>
                  <h2 style={{ fontSize: '1.5em', margin: '10px 0', color: '#333' }}>{post.title}</h2>
                  <p style={{ color: '#999', fontSize: '0.95em', margin: '5px 0' }}>
                    Par <strong>{post.author}</strong> • {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(post._id);
                    }}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              {expandedPost === post._id && (
                <div>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    marginTop: '15px',
                    borderRadius: '6px',
                    lineHeight: '1.6',
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif'
                  }}>
                    {post.content}
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>💬 Commentaires ({post.comments.length})</h3>

                    {post.comments.map(comment => (
                      <div key={comment._id} style={{
                        background: '#f0f0f0',
                        padding: '12px',
                        marginBottom: '10px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #667eea'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{comment.author}</strong>
                            <span style={{ marginLeft: '10px', color: '#ff9800' }}>
                              {'⭐'.repeat(comment.rating)}
                            </span>
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => deleteComment(post._id, comment._id)}
                              style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '0.9em'
                              }}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                        <p style={{ marginTop: '8px', color: '#555' }}>{comment.content}</p>
                        <p style={{ fontSize: '0.85em', color: '#999', marginTop: '5px' }}>
                          {new Date(comment.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}

                    <form onSubmit={(e) => handleCommentSubmit(post._id, e)} style={{ marginTop: '15px' }}>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={newComment.author}
                        onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <textarea
                        placeholder="Votre commentaire..."
                        value={newComment.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                        rows="3"
                        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={newComment.rating}
                          onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                          <option value="4">⭐⭐⭐⭐ Bon</option>
                          <option value="3">⭐⭐⭐ Moyen</option>
                          <option value="2">⭐⭐ Pas bon</option>
                          <option value="1">⭐ Mauvais</option>
                        </select>
                        <button type="submit" style={{
                          padding: '8px 15px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}>
                          Commenter
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Blog;
