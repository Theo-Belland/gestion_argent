import { useState } from 'react';
import '../styles/budgets.scss';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function BudgetTable({ budgets, onBudgetDeleted, onBudgetUpdated }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (budget) => {
    setEditId(budget._id);
    setEditData({ ...budget });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...editData,
          maxAmount: parseFloat(editData.maxAmount),
          alertThreshold: parseInt(editData.alertThreshold)
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onBudgetUpdated(updated);
        setEditId(null);
      }
    } catch (err) {
      console.error('Error updating budget:', err);
    }
  };

  const deleteBudget = async (id) => {
    if (!confirm('Supprimer ce budget ?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        onBudgetDeleted(id);
      }
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  const getStatusColor = (budget) => {
    if (budget.isExceeded) return '#dc3545';
    if (budget.isNearLimit) return '#ff9800';
    return '#4CAF50';
  };

  const getStatusIcon = (budget) => {
    if (budget.isExceeded) return '🚨';
    if (budget.isNearLimit) return '⚠️';
    return '✅';
  };

  const getStatusText = (budget) => {
    if (budget.isExceeded) return 'Dépassé';
    if (budget.isNearLimit) return 'Attention';
    return 'OK';
  };

  return (
    <div className="budgets-container">
      <h3>💳 Mes Budgets</h3>
      {budgets.length === 0 ? (
        <p className="empty-state">Aucun budget défini. Créez-en un pour suivre vos dépenses !</p>
      ) : (
        <div className="budgets-grid">
          {budgets.map(budget => (
            <div 
              key={budget._id} 
              className={`budget-card ${budget.isExceeded ? 'exceeded' : ''} ${budget.isNearLimit ? 'warning' : ''}`}
            >
              {editId === budget._id ? (
                <div className="budget-edit">
                  <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })}>
                    <option value="Alimentation">Alimentation</option>
                    <option value="Transport">Transport</option>
                    <option value="Logement">Logement</option>
                    <option value="Loisirs">Loisirs</option>
                    <option value="Santé">Santé</option>
                    <option value="Crédit">Crédit</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <input
                    type="number"
                    value={editData.maxAmount}
                    onChange={(e) => setEditData({ ...editData, maxAmount: e.target.value })}
                    placeholder="Max"
                  />
                  <div className="edit-actions">
                    <button onClick={saveEdit} className="save-btn">✓</button>
                    <button onClick={() => setEditId(null)} className="cancel-btn">✗</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="budget-header">
                    <h4>{budget.category}</h4>
                    <span className={`budget-status ${budget.isExceeded ? 'status-danger' : (budget.isNearLimit ? 'status-warning' : 'status-ok')}`}>
                      {getStatusIcon(budget)} {getStatusText(budget)}
                    </span>
                  </div>

                  <div className="budget-amounts">
                    <div className="spent-amount">
                      <span className="label">Dépensé</span>
                      <span className={`value ${budget.isExceeded ? 'status-danger' : (budget.isNearLimit ? 'status-warning' : 'status-ok')}`}> 
                        {typeof budget.spent === 'number' ? budget.spent.toFixed(2) : '0.00'}€
                      </span>
                    </div>
                    <div className="max-amount">
                      <span className="label">Budget</span>
                      <span className="value">{typeof budget.maxAmount === 'number' ? budget.maxAmount.toFixed(2) : '0.00'}€</span>
                    </div>
                  </div>

                  <div className="budget-progress-bar">
                    <progress 
                      className={`budget-progress-fill ${budget.isExceeded ? 'status-danger' : (budget.isNearLimit ? 'status-warning' : 'status-ok')}`}
                      max="100"
                      value={Math.min(100, budget.percentage || 0)}
                    ></progress>
                    <span className="budget-progress-label">{budget.percentage || 0}%</span>
                  </div>

                  <div className="budget-remaining">
                    Reste: <strong>{(typeof budget.maxAmount === 'number' && typeof budget.spent === 'number') ? Math.max(0, budget.maxAmount - budget.spent).toFixed(2) : '0.00'}€</strong>
                  </div>

                  <div className="budget-period">
                    📅 Période: {budget.period}
                  </div>

                  <div className="budget-actions">
                    <button onClick={() => startEdit(budget)} className="edit-btn">✏️</button>
                    <button onClick={() => deleteBudget(budget._id)} className="delete-btn">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BudgetTable;
