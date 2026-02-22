import { useState } from 'react';
import '../styles/SavingsTable.scss';

function SavingsTable({ savings, onDeleteSavings, onAddToSavings, onWithdrawSavings, onEditSavings }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [addAmount, setAddAmount] = useState({});
  const [withdrawAmount, setWithdrawAmount] = useState({});
  const [showDetails, setShowDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);

  const calculateInterest = (savings) => {
    const startDate = new Date(savings.startDate);
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = (today - startDate) / msPerDay;
    const years = days / 365.25;
    const months = days / 30.44;
    
    let amountWithInterest;
    
    if (savings.frequency === 'monthly') {
      // Formule d'intérêt composé mensuel : Capital × (1 + r/12)^n où n = nombre de mois
      amountWithInterest = savings.amount * Math.pow(1 + (savings.interestRate / 100 / 12), months);
    } else {
      // Formule d'intérêt composé annuel : Capital × (1 + r)^n où n = nombre d'années
      amountWithInterest = savings.amount * Math.pow(1 + (savings.interestRate / 100), years);
    }
    
    const interest = amountWithInterest - savings.amount;
    
    return {
      interest: interest,
      total: amountWithInterest,
      years: years,
      months: months,
      days: days
    };
  };

  const handleEdit = (savings) => {
    setEditingId(savings._id);
    setEditData({ ...savings });
  };

  const handleSaveEdit = (savingsId) => {
    onEditSavings(savingsId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleAddAmount = (savingsId) => {
    const amount = parseFloat(addAmount[savingsId]) || 0;
    if (amount > 0) {
      const savingsItem = savings.find(s => s._id === savingsId);
      const newAmount = savingsItem.amount + amount;
      onAddToSavings(savingsId, newAmount);
      setAddAmount({ ...addAmount, [savingsId]: '' });
    }
  };

  const handleWithdrawAmount = (savingsId) => {
    const amount = parseFloat(withdrawAmount[savingsId]) || 0;
    if (amount > 0) {
      const savingsItem = savings.find(s => s._id === savingsId);
      const newAmount = Math.max(0, savingsItem.amount - amount);
      onWithdrawSavings(savingsId, newAmount);
      setWithdrawAmount({ ...withdrawAmount, [savingsId]: '' });
    }
  };

  if (savings.length === 0) {
    return (
      <div className="savings-header">
        <h2 className="savings-header-title">Mes Épargnes</h2>
        <p className="savings-empty-message">Aucune épargne enregistrée.</p>
      </div>
    );
  }

  return (
    <div className="savings-table-wrapper">
      <h2 className="savings-table-title">Mes Épargnes</h2>
      <table className="savings-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th className="savings-table-align-right">Montant Initial</th>
            <th className="savings-table-align-right">Taux (%)</th>
            <th className="savings-table-align-center">Périodicité</th>
            <th className="savings-table-align-center">Date Début</th>
            <th className="savings-table-align-right">Intérêts Gagnés</th>
            <th className="savings-table-align-right">Total</th>
            <th className="savings-table-align-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {savings.map((savingsItem) => {
            const { interest, total, days } = calculateInterest(savingsItem);
            const isEditing = editingId === savingsItem._id;

            if (isEditing) {
              return (
                <tr key={`edit-row-${savingsItem._id}`} className="savings-edit-row">
                  <td className="savings-edit-cell">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </td>
                  <td className="savings-edit-cell savings-table-align-right">
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      step="0.01"
                    />
                  </td>
                  <td className="savings-edit-cell savings-table-align-right">
                    <input
                      type="number"
                      value={editData.interestRate}
                      onChange={(e) => setEditData({ ...editData, interestRate: parseFloat(e.target.value) })}
                      step="0.01"
                    />
                  </td>
                  <td className="savings-edit-cell savings-table-align-center">
                    <select
                      value={editData.frequency}
                      onChange={(e) => setEditData({ ...editData, frequency: e.target.value })}
                    >
                      <option value="annual">Annuel</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </td>
                  <td className="savings-edit-cell savings-table-align-center">
                    <input
                      type="date"
                      value={editData.startDate}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    />
                  </td>
                  <td colSpan="2" className="savings-edit-cell savings-table-align-center">
                    <button
                      onClick={() => handleSaveEdit(savingsItem._id)}
                      className="savings-save-button"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="savings-cancel-button"
                    >
                      Annuler
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={`row-${savingsItem._id}`}>
                <td>{savingsItem.name}</td>
                <td className="savings-table-align-right">{typeof savingsItem.amount === 'number' && !isNaN(savingsItem.amount) ? savingsItem.amount.toFixed(2) : '0.00'} €</td>
                <td className="savings-table-align-right">{typeof savingsItem.interestRate === 'number' && !isNaN(savingsItem.interestRate) ? savingsItem.interestRate.toFixed(2) : '0.00'}%</td>
                <td className="savings-table-align-center">
                  {savingsItem.frequency === 'monthly' ? 'Mensuel' : 'Annuel'}
                </td>
                <td className="savings-date-cell">
                  {savingsItem.startDate ? (new Date(savingsItem.startDate).toLocaleDateString('fr-FR') !== 'Invalid Date' ? new Date(savingsItem.startDate).toLocaleDateString('fr-FR') : '—') : '—'}
                </td>
                <td 
                  className="savings-interest savings-tooltip-container"
                  onMouseEnter={() => setShowDetails(savingsItem._id)}
                  onMouseLeave={() => setShowDetails(null)}
                >
                  {typeof interest === 'number' && !isNaN(interest) ? `+${interest.toFixed(2)} €` : '+0.00 €'}
                  {showDetails === savingsItem._id && (
                    <div className="savings-tooltip">
                      {typeof days === 'number' && !isNaN(days) ? Math.floor(days) : '—'} jours • {savingsItem.startDate ? (new Date(savingsItem.startDate).toLocaleDateString('fr-FR') !== 'Invalid Date' ? new Date(savingsItem.startDate).toLocaleDateString('fr-FR') : '—') : '—'}
                    </div>
                  )}
                </td>
                <td className="savings-total">
                  {typeof total === 'number' && !isNaN(total) ? `${total.toFixed(2)} €` : '0.00 €'}
                </td>
                <td className="savings-table-align-center">
                  <button
                    onClick={() => handleEdit(savingsItem)}
                    className="savings-btn savings-btn-edit"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDeleteSavings(savingsItem._id)}
                    className="savings-btn savings-btn-delete"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="savings-add-section">
        <h3 className="savings-add-section-title">Ajouter ou Retirer des Montants</h3>
        {savings.map((savingsItem) => (
          <div key={`add-item-${savingsItem._id}`} className="savings-add-item">
            <button
              onClick={() => setModalOpen(modalOpen === savingsItem._id ? null : savingsItem._id)}
              className="savings-toggle-button"
            >
              {savingsItem.name} {modalOpen === savingsItem._id ? '▲' : '▼'}
            </button>

            {modalOpen === savingsItem._id && (
              <div className="savings-accordion-content" key={`accordion-${savingsItem._id}`}> 
                <div className="savings-modal-field" key={`add-${savingsItem._id}`}> 
                  <label className="savings-modal-label">
                    Ajouter un montant:
                  </label>
                  <div className="savings-section-inputs">
                    <input
                      type="number"
                      placeholder="Montant à ajouter"
                      value={addAmount[savingsItem._id] || ''}
                      onChange={(e) => setAddAmount({ ...addAmount, [savingsItem._id]: e.target.value })}
                      step="0.01"
                      min="0"
                      className="savings-add-input"
                    />
                    <button
                      onClick={() => handleAddAmount(savingsItem._id)}
                      className="savings-add-button"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div key={`remove-${savingsItem._id}`}> 
                  <label className="savings-modal-label">
                    Retirer un montant:
                  </label>
                  <div className="savings-section-inputs">
                    <input
                      type="number"
                      placeholder="Montant à retirer"
                      value={withdrawAmount[savingsItem._id] || ''}
                      onChange={(e) => setWithdrawAmount({ ...withdrawAmount, [savingsItem._id]: e.target.value })}
                      step="0.01"
                      min="0"
                      className="savings-add-input"
                    />
                    <button
                      onClick={() => handleWithdrawAmount(savingsItem._id)}
                      className="savings-remove-button"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavingsTable;
