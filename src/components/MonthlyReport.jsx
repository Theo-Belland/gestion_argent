import { useState } from 'react';

function MonthlyReport({ incomes, expenses }) {
  console.log('MonthlyReport rendering', incomes, expenses);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fonction pour obtenir le mois et l'année d'une date
  const getMonthYear = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  };

  // Calculer les totaux pour un mois donné
  const calculateTotals = (month, year) => {
    const monthIncomes = incomes.filter(inc => {
      const my = getMonthYear(inc.date);
      return my && my.month === month && my.year === year;
    });
    const monthExpenses = expenses.filter(exp => {
      const my = getMonthYear(exp.date);
      return my && my.month === month && my.year === year;
    });

    const totalIncome = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Ajouter les récurrents mensuels
    const recurringIncomes = incomes.filter(inc => inc.isRecurring && inc.period === 'monthly');
    const recurringExpenses = expenses.filter(exp => exp.isRecurring && exp.period === 'monthly');

    const projectedIncome = totalIncome + recurringIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const projectedExpense = totalExpense + recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      actualIncome: totalIncome,
      actualExpense: totalExpense,
      projectedIncome,
      projectedExpense,
      balance: projectedIncome - projectedExpense
    };
  };

  const currentTotals = calculateTotals(selectedMonth, selectedYear);

  // Générer les 12 derniers mois pour historique
  const history = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(selectedYear, selectedMonth - 1 - i, 1);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    try {
      const totals = calculateTotals(m, y);
      history.push({ month: m, year: y, ...totals });
    } catch (e) {
      console.error('Error calculating totals for', m, y, e);
    }
  }

  // Prévision pour les 6 prochains mois
  const forecast = [];
  for (let i = 1; i <= 6; i++) {
    const date = new Date(selectedYear, selectedMonth - 1 + i, 1);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    try {
      const totals = calculateTotals(m, y);
      forecast.push({ month: m, year: y, ...totals });
    } catch (e) {
      console.error('Error calculating totals for', m, y, e);
    }
  }

  return (
    <div>
      <h3>Rapport Mensuel</h3>
      <label>
        Mois:
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </label>
      <label>
        Année:
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        />
      </label>

      <h4>Mois Sélectionné</h4>
      <p>Revenus Réels: {currentTotals.actualIncome.toFixed(2)} €</p>
      <p>Dépenses Réelles: {currentTotals.actualExpense.toFixed(2)} €</p>
      <p>Revenus Projetés: {currentTotals.projectedIncome.toFixed(2)} €</p>
      <p>Dépenses Projetées: {currentTotals.projectedExpense.toFixed(2)} €</p>
      <p>Solde Projeté: {currentTotals.balance.toFixed(2)} €</p>

      <h4>Historique (12 derniers mois)</h4>
      <table>
        <thead>
          <tr>
            <th>Mois</th>
            <th>Revenus Réels</th>
            <th>Dépenses Réelles</th>
            <th>Solde Projeté</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, index) => (
            <tr key={index}>
              <td>{h.month}/{h.year}</td>
              <td>{h.actualIncome.toFixed(2)} €</td>
              <td>{h.actualExpense.toFixed(2)} €</td>
              <td>{h.balance.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Prévision (6 prochains mois)</h4>
      <table>
        <thead>
          <tr>
            <th>Mois</th>
            <th>Revenus Projetés</th>
            <th>Dépenses Projetées</th>
            <th>Solde Projeté</th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((f, index) => (
            <tr key={index}>
              <td>{f.month}/{f.year}</td>
              <td>{f.projectedIncome.toFixed(2)} €</td>
              <td>{f.projectedExpense.toFixed(2)} €</td>
              <td>{f.balance.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MonthlyReport;