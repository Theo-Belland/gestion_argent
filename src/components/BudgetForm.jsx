import { useState } from 'react';
import '../styles/BudgetForm.scss';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function BudgetForm({ onBudgetAdded }) {
  const [budget, setBudget] = useState({
    category: 'Alimentation',
    maxAmount: '',
    period: 'mensuel',
    alertThreshold: '80'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget.maxAmount) {
      alert('Montant maximum requis');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...budget,
          maxAmount: parseFloat(budget.maxAmount),
          alertThreshold: parseInt(budget.alertThreshold)
        })
      });

      if (res.ok) {
        const newBudget = await res.json();
        onBudgetAdded(newBudget);
        setBudget({ category: 'Alimentation', maxAmount: '', period: 'mensuel', alertThreshold: '80' });
        alert('Budget créé !');
      } else {
        alert('Erreur lors de la création');
      }
    } catch (err) {
      console.error('Error creating budget:', err);
      alert('Erreur réseau');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form-container">
      <h3>💰 Nouveau Budget</h3>
      <select value={budget.category} onChange={(e) => setBudget({ ...budget, category: e.target.value })} className="budget-form-select">
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
        placeholder="Montant maximum (€)"
        value={budget.maxAmount}
        onChange={(e) => setBudget({ ...budget, maxAmount: e.target.value })}
        required
        className="budget-form-input"
      />
      <select value={budget.period} onChange={(e) => setBudget({ ...budget, period: e.target.value })} className="budget-form-select">
        <option value="mensuel">Mensuel</option>
        <option value="annuel">Annuel</option>
      </select>
      <div className="budget-alert-row">
        <label>Seuil d'alerte: {budget.alertThreshold}%</label>
        <input
          type="range"
          min="50"
          max="100"
          value={budget.alertThreshold}
          onChange={(e) => setBudget({ ...budget, alertThreshold: e.target.value })}
          className="budget-range"
        />
      </div>
      <button type="submit" className="budget-form-button">Créer le budget</button>
    </form>
  );
}

export default BudgetForm;
