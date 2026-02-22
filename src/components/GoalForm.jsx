import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function GoalForm({ onGoalAdded }) {
  const [goal, setGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Épargne',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.title || !goal.targetAmount) {
      alert('Titre et montant cible requis');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...goal,
          targetAmount: parseFloat(goal.targetAmount),
          currentAmount: parseFloat(goal.currentAmount) || 0
        })
      });

      if (res.ok) {
        const newGoal = await res.json();
        onGoalAdded(newGoal);
        setGoal({ title: '', targetAmount: '', currentAmount: '', deadline: '', category: 'Épargne', description: '' });
        alert('Objectif créé !');
      } else {
        alert('Erreur lors de la création');
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      alert('Erreur réseau');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>📊 Nouvel Objectif Financier</h3>
      <input
        type="text"
        placeholder="Titre (ex: Vacances 2026)"
        value={goal.title}
        onChange={(e) => setGoal({ ...goal, title: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Montant cible (€)"
        value={goal.targetAmount}
        onChange={(e) => setGoal({ ...goal, targetAmount: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Montant actuel (€)"
        value={goal.currentAmount}
        onChange={(e) => setGoal({ ...goal, currentAmount: e.target.value })}
      />
      <input
        type="date"
        placeholder="Date limite"
        value={goal.deadline}
        onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
      />
      <select value={goal.category} onChange={(e) => setGoal({ ...goal, category: e.target.value })}>
        <option value="Épargne">Épargne</option>
        <option value="Voyage">Voyage</option>
        <option value="Achat">Achat</option>
        <option value="Investissement">Investissement</option>
        <option value="Autre">Autre</option>
      </select>
      <textarea
        placeholder="Description (optionnel)"
        value={goal.description}
        onChange={(e) => setGoal({ ...goal, description: e.target.value })}
        rows="2"
      />
      <button type="submit">Créer l'objectif</button>
    </form>
  );
}

export default GoalForm;
