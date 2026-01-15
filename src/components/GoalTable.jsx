import { useState } from 'react';
import '../styles/goals.scss';

const API_BASE = 'http://localhost:5000/api';

function GoalTable({ goals, onGoalDeleted, onGoalUpdated }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (goal) => {
    setEditId(goal._id);
    setEditData({ ...goal, deadline: goal.deadline ? goal.deadline.split('T')[0] : '' });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/goals/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editData,
          targetAmount: parseFloat(editData.targetAmount),
          currentAmount: parseFloat(editData.currentAmount)
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onGoalUpdated(updated);
        setEditId(null);
      }
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    if (!confirm('Supprimer cet objectif ?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/goals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        onGoalDeleted(id);
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const calculateProgress = (current, target) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="goals-container">
      <h3>🎯 Mes Objectifs Financiers</h3>
      {goals.length === 0 ? (
        <p className="empty-state">Aucun objectif défini. Créez-en un pour commencer !</p>
      ) : (
        <div className="goals-grid">
          {goals.map(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;
            const isUrgent = daysLeft !== null && daysLeft < 30 && !isCompleted;

            return (
              <div key={goal._id} className={`goal-card ${isCompleted ? 'completed' : ''} ${isUrgent ? 'urgent' : ''}`}>
                {editId === goal._id ? (
                  <div className="goal-edit">
                    <input
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Titre"
                    />
                    <input
                      type="number"
                      value={editData.targetAmount}
                      onChange={(e) => setEditData({ ...editData, targetAmount: e.target.value })}
                      placeholder="Cible"
                    />
                    <input
                      type="number"
                      value={editData.currentAmount}
                      onChange={(e) => setEditData({ ...editData, currentAmount: e.target.value })}
                      placeholder="Actuel"
                    />
                    <input
                      type="date"
                      value={editData.deadline}
                      onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-btn">✓</button>
                      <button onClick={() => setEditId(null)} className="cancel-btn">✗</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="goal-header">
                      <h4>{goal.title}</h4>
                      <span className="goal-category">{goal.category}</span>
                    </div>
                    
                    {goal.description && <p className="goal-description">{goal.description}</p>}
                    
                    <div className="goal-amounts">
                      <span className="current-amount">{goal.currentAmount}€</span>
                      <span className="divider">/</span>
                      <span className="target-amount">{goal.targetAmount}€</span>
                    </div>

                    <div className="progress-bar">
                      <progress className="progress-fill" max="100" value={progress}></progress>
                      <span className="progress-label">{progress}%</span>
                    </div>

                    {goal.deadline && (
                      <div className={`deadline ${isUrgent ? 'urgent-deadline' : ''}`}>
                        {daysLeft !== null && daysLeft >= 0 ? (
                          <>📅 {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}</>
                        ) : daysLeft < 0 ? (
                          <>⚠️ Échéance dépassée</>
                        ) : null}
                      </div>
                    )}

                    <div className="goal-actions">
                      <button onClick={() => startEdit(goal)} className="edit-btn">✏️ Modifier</button>
                      <button onClick={() => deleteGoal(goal._id)} className="delete-btn">🗑️</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GoalTable;
