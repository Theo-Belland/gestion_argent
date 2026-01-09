import { useState } from 'react';

function ExpenseTable({ expenses, credits, onDeleteExpense, onEditExpense }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fixedExpenses = expenses.filter(exp => exp.type === 'fixed');
  const variableExpenses = expenses.filter(exp => exp.type === 'variable');

  // Fonction pour calculer les détails des crédits
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
    const interestRate = parseFloat(credit.interestRate) || 0;
    const durationMonths = parseInt(credit.durationMonths) || 0;
    const monthlyRate = interestRate / 100 / 12;
    const estimatedMonthlyPayment = isNaN(monthlyRate) || monthlyRate === 0 || durationMonths === 0 ? 0 :
                                   credit.amount * (monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
                                   (Math.pow(1 + monthlyRate, durationMonths) - 1);

    // Part par personne (divisé par 2)
    const perPersonMonthly = estimatedMonthlyPayment / 2;
    const perPersonRemaining = remainingAmount / 2;

    return {
      monthsElapsed,
      monthsRemaining,
      monthlyPayment: estimatedMonthlyPayment,
      remainingAmount,
      perPersonMonthly,
      perPersonRemaining
    };
  };

  const startEdit = (id) => {
    const exp = expenses.find(e => e._id === id);
    setEditId(id);
    setEditData({ ...exp });
  };

  const saveEdit = () => {
    onEditExpense(editId, editData);
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const renderTable = (title, expList) => (
    <div>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Récurrent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expList.map((exp, index) => {
            let displayAmount = `${exp.amount} €`;
            let displayDate = exp.date;

            if (exp.category === 'Crédit' && exp.description.startsWith('Mensualité ')) {
              const creditName = exp.description.replace('Mensualité ', '');
              const credit = credits.find(c => c.name === creditName);
              if (credit) {
                const details = calculateCreditDetails(credit);
                displayAmount = `${details.perPersonMonthly.toFixed(2)} €`;
                displayDate = new Date(credit.startDate).toLocaleDateString('fr-FR'); // Date de prélèvement
              }
            }

            return (
              <tr key={exp._id || index}>
                {editId === exp._id ? (
                  <>
                    <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
                    <td><input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })} /></td>
                    <td><input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /></td>
                    <td><input type="checkbox" checked={editData.isRecurring} onChange={(e) => setEditData({ ...editData, isRecurring: e.target.checked })} /></td>
                    <td>
                      <button onClick={saveEdit}>Sauvegarder</button>
                      <button onClick={cancelEdit}>Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exp.description}</td>
                    <td>{displayAmount}</td>
                    <td>{new Date(displayDate).toLocaleDateString('fr-FR')}</td>
                    <td>{exp.isRecurring ? 'Oui' : 'Non'}</td>
                    <td>
                      <button onClick={() => startEdit(exp._id)}>Modifier</button>
                      <button onClick={() => onDeleteExpense(exp._id)}>Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p><strong>Total {title.toLowerCase()} :</strong> {expList.reduce((sum, exp) => sum + (exp.amount || 0), 0)} €</p>
    </div>
  );

  const categories = ['Facture', 'Assurance', 'Autre'];

  // Fonction pour rendre le tableau des crédits
  const renderCreditTable = () => {
    if (!credits || credits.length === 0) return null;

    const totalCreditMonthly = credits.reduce((sum, credit) => {
      const details = calculateCreditDetails(credit);
      return sum + details.perPersonMonthly;
    }, 0);

    return (
      <div>
        <h3>Dépenses Fixes - Crédits (Mensualités)</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Mensualité Totale</th>
              <th>Part par Personne</th>
              <th>Mois Restants</th>
              <th>Date de Prélèvement</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((credit, index) => {
              const details = calculateCreditDetails(credit);
              return (
                <tr key={credit._id || index}>
                  <td>{credit.name}</td>
                  <td>{details.monthlyPayment.toFixed(2)} €</td>
                  <td style={{ fontWeight: 'bold', color: '#dc3545' }}>{details.perPersonMonthly.toFixed(2)} €</td>
                  <td>{details.monthsRemaining}</td>
                  <td>{new Date(credit.startDate).toLocaleDateString('fr-FR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p><strong>Total Mensualités Crédits (parts par personne) :</strong> {totalCreditMonthly.toFixed(2)} €</p>
      </div>
    );
  };

  return (
    <div>
      {renderCreditTable()}
      {categories.map(cat => {
        const catExpenses = fixedExpenses.filter(exp => exp.category === cat);
        return catExpenses.length > 0 ? <div key={cat}>{renderTable(`Dépenses Fixes - ${cat}`, catExpenses)}</div> : null;
      })}
      {renderTable('Dépenses Variables', variableExpenses)}
    </div>
  );
}

export default ExpenseTable;