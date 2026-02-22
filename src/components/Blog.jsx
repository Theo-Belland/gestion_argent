import { useState, useEffect } from 'react';
import '../styles/Blog.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


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

  if (loading) return <div className="blog-no-posts">Chargement du blog...</div>;

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>📝 Blog</h1>
        <p>Conseils et astuces pour mieux gérer vos finances</p>
      </div>

      {isAdmin && (
        <div>
          <button onClick={() => setShowForm(!showForm)} className="blog-admin-button">
            {showForm ? 'Annuler' : '✏️ Écrire un post'}
          </button>

          {showForm && (
            <form onSubmit={handlePostSubmit} className="blog-form">
              <div className="blog-form-group">
                <label>Titre du post</label>
                <input
                  type="text"
                  placeholder="Titre du post"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div className="blog-form-group">
                <label>Contenu (supporte markdown)</label>
                <textarea
                  placeholder="Contenu (supporte markdown)"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows="6"
                />
              </div>
              <div className="blog-form-group">
                <label>Catégorie</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  <option value="conseil">Conseil</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="actualité">Actualité</option>
                  <option value="astuce">Astuce</option>
                </select>
              </div>
              <div className="blog-post-actions">
                <button type="submit" className="blog-form-submit">Publier</button>
                <button type="button" onClick={() => setShowForm(false)} className="blog-form-cancel">Annuler</button>
              </div>
            </form>
          )}
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p className="blog-no-posts">Aucun post pour le moment. Soyez le premier à écrire ! ✍️</p>
        ) : (
          posts.map(post => (
            <div
              key={post._id}
              className="blog-post-card"
              onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
            >
              <div className="blog-post-header">
                <div>
                  <span className={`blog-post-category ${post.category}`}>{post.category}</span>
                  <h2 className="blog-post-title">{post.title}</h2>
                  <p className="blog-post-meta">
                    Par <strong>{post.author}</strong> • {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(post._id);
                    }}
                    className="blog-delete-btn"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {expandedPost === post._id && (
                <div>
                  <div className="blog-post-content">
                    {post.content}
                  </div>

                  <div className="blog-comments-section">
                    <h3 className="blog-comments-title">💬 Commentaires ({post.comments.length})</h3>

                    {post.comments.map(comment => (
                      <div key={comment._id} className="blog-comment">
                        <div className="blog-comment-header">
                          <div>
                            <span className="blog-comment-author">{comment.author}</span>
                            <span className="blog-comment-rating">
                              {'⭐'.repeat(comment.rating)}
                            </span>
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => deleteComment(post._id, comment._id)}
                              className="blog-comment-delete"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                        <p className="blog-comment-content">{comment.content}</p>
                        <p className="blog-comment-date">
                          {new Date(comment.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}

                    <form onSubmit={(e) => handleCommentSubmit(post._id, e)} className="blog-comment-form">
                      <div className="blog-comment-form-group">
                        <input
                          type="text"
                          placeholder="Votre nom"
                          value={newComment.author}
                          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                        />
                      </div>
                      <div className="blog-comment-form-group">
                        <textarea
                          placeholder="Votre commentaire..."
                          value={newComment.content}
                          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                          rows="3"
                        />
                      </div>
                      <div className="blog-post-actions">
                        <select
                          value={newComment.rating}
                          onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                        >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                          <option value="4">⭐⭐⭐⭐ Bon</option>
                          <option value="3">⭐⭐⭐ Moyen</option>
                          <option value="2">⭐⭐ Pas bon</option>
                          <option value="1">⭐ Mauvais</option>
                        </select>
                        <button type="submit" className="blog-comment-form-submit">Commenter</button>
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
