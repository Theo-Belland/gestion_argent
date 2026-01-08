import { useState } from 'react';

function CreditTable({ credits, onDeleteCredit, onEditCredit, onUpdateCreditBalance }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [updateBalance, setUpdateBalance] = useState({});
  const [showDetails, setShowDetails] = useState(null);

  const calculateCreditDetails = (credit) => {
    const startDate = new Date(credit.startDate);
    const today = new Date();
    const monthsElapsed = Math.floor((today - startDate) / (30.44 * 24 * 60 * 60 * 1000));
    const monthsRemaining = Math.max(0, credit.durationMonths - monthsElapsed);

    // Utiliser le montant restant actuel si disponible, sinon calculer théoriquement
    let remainingAmount;
    if (credit.currentBalance !== undefined && credit.currentBalance !== null) {
      remainingAmount = credit.currentBalance;
    } else {
      // Calcul théorique si pas de montant actuel
      const monthlyRate = credit.interestRate / 100 / 12;
      const monthlyPayment = credit.amount * (monthlyRate * Math.pow(1 + monthlyRate, credit.durationMonths)) /
                            (Math.pow(1 + monthlyRate, credit.durationMonths) - 1);
      remainingAmount = monthlyPayment * monthsRemaining;
    }

    // Estimation de la mensualité (si pas connue)
    const monthlyRate = credit.interestRate / 100 / 12;
    const estimatedMonthlyPayment = credit.amount * (monthlyRate * Math.pow(1 + monthlyRate, credit.durationMonths)) /
                                   (Math.pow(1 + monthlyRate, credit.durationMonths) - 1);

    // Intérêts totaux payés (estimation)
    const totalInterestPaid = (estimatedMonthlyPayment * monthsElapsed) - (credit.amount - remainingAmount);

    // Part par personne (divisé par 2)
    const perPersonMonthly = estimatedMonthlyPayment / 2;
    const perPersonRemaining = remainingAmount / 2;

    return {
      monthsElapsed,
      monthsRemaining,
      monthlyPayment: estimatedMonthlyPayment,
      remainingAmount,
      totalInterestPaid,
      perPersonMonthly,
      perPersonRemaining
    };
  };

  const handleEdit = (credit) => {
    setEditingId(credit._id);
    setEditData({ ...credit });
  };

  const handleSaveEdit = (creditId) => {
    onEditCredit(creditId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleUpdateBalance = (creditId) => {
    const newBalance = parseFloat(updateBalance[creditId]);
    if (!isNaN(newBalance) && newBalance >= 0) {
      onUpdateCreditBalance(creditId, newBalance);
      setUpdateBalance({ ...updateBalance, [creditId]: '' });
    }
  };

  if (credits.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        flex: '1',
        minWidth: '300px'
      }}>
        <h2>Mes Crédits</h2>
        <p style={{ color: '#666' }}>Aucun crédit enregistré.</p>
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
      <h2>Mes Crédits</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#ffe6e6', borderBottom: '2px solid #dc3545' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nom</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Montant Initial</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Taux (%)</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Mois Restants</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Montant Restant Actuel</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Part/Personne</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => {
            const details = calculateCreditDetails(credit);
            const isEditing = editingId === credit._id;

            if (isEditing) {
              return (
                <tr key={credit._id} style={{ backgroundColor: '#fff5f5', borderBottom: '1px solid #ddd' }}>
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
                    <input
                      type="number"
                      value={editData.durationMonths}
                      onChange={(e) => setEditData({ ...editData, durationMonths: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '5px' }}
                    />
                  </td>
                  <td colSpan="2" style={{ padding: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleSaveEdit(credit._id)}
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
              <tr key={credit._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{credit.name}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{credit.amount.toFixed(2)} €</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{credit.interestRate.toFixed(2)}%</td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#dc3545' }}>
                  {details.monthsRemaining}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#dc3545' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div>{details.remainingAmount.toFixed(2)} €</div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input
                        type="number"
                        placeholder="Nouveau montant"
                        value={updateBalance[credit._id] || ''}
                        onChange={(e) => setUpdateBalance({ ...updateBalance, [credit._id]: e.target.value })}
                        step="0.01"
                        min="0"
                        style={{
                          width: '80px',
                          padding: '3px',
                          fontSize: '0.8em',
                          border: '1px solid #ccc',
                          borderRadius: '3px'
                        }}
                      />
                      <button
                        onClick={() => handleUpdateBalance(credit._id)}
                        style={{
                          padding: '3px 6px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '0.8em'
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#007bff' }}>
                  {details.perPersonRemaining.toFixed(2)} €
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(credit)}
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
                    onClick={() => onDeleteCredit(credit._id)}
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
        backgroundColor: '#ffe6e6',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px'
      }}>
        <h3>Détails des Crédits</h3>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
          💡 <strong>Conseil :</strong> Pour que les montants correspondent exactement à votre relevé bancaire,
          utilisez le champ "Nouveau montant" dans le tableau pour saisir le montant restant indiqué par votre banque.
        </p>
        {credits.map((credit) => {
          const details = calculateCreditDetails(credit);
          return (
            <div key={credit._id} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => setShowDetails(showDetails === credit._id ? null : credit._id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold'
                }}
              >
                {credit.name} {showDetails === credit._id ? '▲' : '▼'}
              </button>

              {showDetails === credit._id && (
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  marginTop: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Mensualité estimée:</strong><br />
                      {details.monthlyPayment.toFixed(2)} €
                      <br /><small style={{ color: '#666' }}>(calcul théorique)</small>
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Mensualité par personne:</strong><br />
                      {details.perPersonMonthly.toFixed(2)} €
                      <br /><small style={{ color: '#666' }}>(calcul théorique)</small>
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Mois écoulés:</strong><br />
                      {details.monthsElapsed}
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Mois restants:</strong><br />
                      {details.monthsRemaining}
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Intérêts payés:</strong><br />
                      {details.totalInterestPaid.toFixed(2)} €
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Montant restant actuel:</strong><br />
                      {details.remainingAmount.toFixed(2)} €
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Part par personne:</strong><br />
                      {details.perPersonRemaining.toFixed(2)} €
                    </div>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                      <strong>Informations:</strong><br />
                      Début: {credit.startDate}<br />
                      Durée: {credit.durationMonths} mois<br />
                      Taux: {credit.interestRate}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CreditTable;