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
    if (credit.currentBalance !== undefined && credit.currentBalance !== null) {
      remainingAmount = credit.currentBalance;
    } else {
      // Calcul théorique si pas de montant actuel
      const monthlyRate = credit.interestRate / 100 / 12;
      const monthlyPayment = credit.amount * (monthlyRate * Math.pow(1 + monthlyRate, credit.durationMonths)) /
                            (Math.pow(1 + monthlyRate, credit.durationMonths) - 1);
      remainingAmount = monthlyPayment * monthsRemaining;
    }

    // Part par personne (divisé par 2)
    const perPersonRemaining = remainingAmount / 2;

    return {
      monthsElapsed,
      monthsRemaining,
      remainingAmount,
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
          {expList.map((exp) => {
            return (
              <tr key={exp._id}>
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
                    <td>{exp.amount} €</td>
                    <td>{exp.date}</td>
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

    const totalCreditParts = credits.reduce((sum, credit) => {
      const details = calculateCreditDetails(credit);
      return sum + details.perPersonRemaining;
    }, 0);

    return (
      <div>
        <h3>Dépenses Fixes - Crédits (Parts par personne)</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Montant Restant</th>
              <th>Part par Personne</th>
              <th>Mois Restants</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((credit) => {
              const details = calculateCreditDetails(credit);
              return (
                <tr key={credit.id}>
                  <td>{credit.name}</td>
                  <td>{details.remainingAmount.toFixed(2)} €</td>
                  <td style={{ fontWeight: 'bold', color: '#dc3545' }}>{details.perPersonRemaining.toFixed(2)} €</td>
                  <td>{details.monthsRemaining}</td>
                  <td>{credit.startDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p><strong>Total Crédits (parts par personne) :</strong> {totalCreditParts.toFixed(2)} €</p>
      </div>
    );
  };

  return (
    <div>
      {renderCreditTable()}
      {categories.map(cat => {
        const catExpenses = fixedExpenses.filter(exp => exp.category === cat);
        return catExpenses.length > 0 ? renderTable(`Dépenses Fixes - ${cat}`, catExpenses) : null;
      })}
      {renderTable('Dépenses Variables', variableExpenses)}
    </div>
  );
}

export default ExpenseTable;