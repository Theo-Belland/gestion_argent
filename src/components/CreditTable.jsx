import { useState } from 'react';
import '../styles/CreditTable.scss';

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
    if (credit.balance !== undefined && credit.balance !== null) {
      remainingAmount = credit.balance;
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
      <div className="credit-table-container">
        <h2>Mes Crédits</h2>
        <p className="credit-no-data">Aucun crédit enregistré.</p>
      </div>
    );
  }

  return (
    <div className="credit-table-container">
      <h2>Mes Crédits</h2>
      <table className="credit-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Montant Initial</th>
            <th>Taux (%)</th>
            <th>Mois Restants</th>
            <th>Montant Restant Actuel</th>
            <th>Part/Personne</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => {
            const details = calculateCreditDetails(credit);
            const isEditing = editingId === credit._id;

            if (isEditing) {
              return (
                <tr key={credit._id}>
                  <td>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="credit-modal-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      className="credit-modal-input"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editData.interestRate}
                      onChange={(e) => setEditData({ ...editData, interestRate: parseFloat(e.target.value) })}
                      className="credit-modal-input"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editData.durationMonths}
                      onChange={(e) => setEditData({ ...editData, durationMonths: parseInt(e.target.value) })}
                      className="credit-modal-input"
                    />
                  </td>
                  <td colSpan="2">
                    <button
                      onClick={() => handleSaveEdit(credit._id)}
                      className="credit-update-btn"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="credit-delete-btn"
                    >
                      Annuler
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={credit._id}>
                <td>{credit.name}</td>
                <td>{credit.amount.toFixed(2)} €</td>
                <td>{credit.interestRate.toFixed(2)}%</td>
                <td>
                  {details.monthsRemaining}
                </td>
                <td>
                  <div>
                    <div>{details.remainingAmount.toFixed(2)} €</div>
                    <div className="credit-table-actions">
                      <input
                        type="number"
                        placeholder="Nouveau montant"
                        value={updateBalance[credit._id] || ''}
                        onChange={(e) => setUpdateBalance({ ...updateBalance, [credit._id]: e.target.value })}
                        step="0.01"
                        min="0"
                        className="credit-modal-input"
                      />
                      <button onClick={() => handleUpdateBalance(credit._id)} className="credit-update-btn">
                        ✓
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  {details.perPersonRemaining.toFixed(2)} €
                </td>
                <td>
                  <button onClick={() => handleEdit(credit)} className="credit-edit-btn">
                    Modifier
                  </button>
                  <button onClick={() => onDeleteCredit(credit._id)} className="credit-delete-btn">
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="credit-details-card">
        <h3>Détails des Crédits</h3>
        <p className="small-text">
          💡 <strong>Conseil :</strong> Pour que les montants correspondent exactement à votre relevé bancaire,
          utilisez le champ "Nouveau montant" dans le tableau pour saisir le montant restant indiqué par votre banque.
        </p>
        {credits.map((credit) => {
          const details = calculateCreditDetails(credit);
          return (
            <div key={credit._id}>
              <button
                onClick={() => setShowDetails(showDetails === credit._id ? null : credit._id)}
                className="credit-edit-btn"
              >
                {credit.name} {showDetails === credit._id ? '▲' : '▼'}
              </button>

              {showDetails === credit._id && (
                <div className="credit-details-card">
                  <div>
                    <div className="credit-details-card">
                      <strong>Mensualité estimée:</strong><br />
                      {details.monthlyPayment.toFixed(2)} €
                      <br /><small className="small-text">(calcul théorique)</small>
                    </div>
                    <div className="credit-details-card">
                      <strong>Mensualité par personne:</strong><br />
                      {details.perPersonMonthly.toFixed(2)} €
                      <br /><small className="small-text">(calcul théorique)</small>
                    </div>
                    <div className="credit-details-card">
                      <strong>Mois écoulés:</strong><br />
                      {details.monthsElapsed}
                    </div>
                    <div className="credit-details-card">
                      <strong>Mois restants:</strong><br />
                      {details.monthsRemaining}
                    </div>
                    <div className="credit-details-card">
                      <strong>Intérêts payés:</strong><br />
                      {details.totalInterestPaid.toFixed(2)} €
                    </div>
                    <div className="credit-details-card">
                      <strong>Montant restant actuel:</strong><br />
                      {details.remainingAmount.toFixed(2)} €
                    </div>
                    <div className="credit-details-card">
                      <strong>Part par personne:</strong><br />
                      {details.perPersonRemaining.toFixed(2)} €
                    </div>
                    <div className="credit-details-card">
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