import { useState } from 'react';

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
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        flex: '1',
        minWidth: '300px'
      }}>
        <h2>Mes Épargnes</h2>
        <p style={{ color: '#666' }}>Aucune épargne enregistrée.</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      flex: '1',
      minWidth: '300px'
    }}>
      <h2>Mes Épargnes</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#e8f4f8', borderBottom: '2px solid #007bff' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nom</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Montant Initial</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Taux (%)</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Périodicité</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Date Début</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Intérêts Gagnés</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savings.map((savingsItem) => {
            const { interest, total, days } = calculateInterest(savingsItem);
            const isEditing = editingId === savingsItem._id;

            if (isEditing) {
              return (
                <tr key={savingsItem._id} style={{ backgroundColor: '#fff3cd', borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      style={{ width: '100%', padding: '5px' }}
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '5px' }}
                      step="0.01"
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <input
                      type="number"
                      value={editData.interestRate}
                      onChange={(e) => setEditData({ ...editData, interestRate: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '5px' }}
                      step="0.01"
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <select
                      value={editData.frequency}
                      onChange={(e) => setEditData({ ...editData, frequency: e.target.value })}
                      style={{ width: '100%', padding: '5px' }}
                    >
                      <option value="annual">Annuel</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <input
                      type="date"
                      value={editData.startDate}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                      style={{ width: '100%', padding: '5px' }}
                    />
                  </td>
                  <td colSpan="2" style={{ padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleSaveEdit(savingsItem._id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Annuler
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={savingsItem._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{savingsItem.name}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{savingsItem.amount.toFixed(2)} €</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{savingsItem.interestRate.toFixed(2)}%</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {savingsItem.frequency === 'monthly' ? 'Mensuel' : 'Annuel'}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', fontSize: '0.9em' }}>
                  {new Date(savingsItem.startDate).toLocaleDateString('fr-FR')}
                </td>
                <td 
                  style={{ padding: '10px', textAlign: 'right', color: '#28a745', fontWeight: 'bold', cursor: 'pointer', position: 'relative' }}
                  onMouseEnter={() => setShowDetails(savingsItem._id)}
                  onMouseLeave={() => setShowDetails(null)}
                >
                  +{interest.toFixed(2)} €
                  {showDetails === savingsItem._id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#333',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '4px',
                      fontSize: '0.9em',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      marginBottom: '5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {Math.floor(days)} jours • {new Date(savingsItem.startDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#007bff' }}>
                  {total.toFixed(2)} €
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(savingsItem)}
                    style={{
                      padding: '5px 8px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDeleteSavings(savingsItem._id)}
                    style={{
                      padding: '5px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{
        backgroundColor: '#e8f4f8',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px'
      }}>
        <h3>Ajouter ou Retirer des Montants</h3>
        {savings.map((savingsItem) => (
          <div key={savingsItem._id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setModalOpen(modalOpen === savingsItem._id ? null : savingsItem._id)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold'
              }}
            >
              {savingsItem.name} {modalOpen === savingsItem._id ? '▲' : '▼'}
            </button>

            {modalOpen === savingsItem._id && (
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginTop: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Ajouter un montant:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Montant à ajouter"
                      value={addAmount[savingsItem._id] || ''}
                      onChange={(e) => setAddAmount({ ...addAmount, [savingsItem._id]: e.target.value })}
                      step="0.01"
                      min="0"
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      onClick={() => handleAddAmount(savingsItem._id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Retirer un montant:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      placeholder="Montant à retirer"
                      value={withdrawAmount[savingsItem._id] || ''}
                      onChange={(e) => setWithdrawAmount({ ...withdrawAmount, [savingsItem._id]: e.target.value })}
                      step="0.01"
                      min="0"
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      onClick={() => handleWithdrawAmount(savingsItem._id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
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
