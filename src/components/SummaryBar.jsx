import '../styles/SummaryBar.scss';

function SummaryBar({ incomes, expenses, savings = [] }) {
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalFixed = expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalVariable = expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalExpenses = totalFixed + totalVariable;
  const totalSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const savingsAfterExpenses = totalIncome - totalExpenses;
  const remainingToLive = totalIncome - totalFixed;

  console.log('SummaryBar calculations:', { 
    totalIncome, 
    totalFixed, 
    totalVariable, 
    totalExpenses, 
    totalSavings,
    savingsAfterExpenses, 
    remainingToLive 
  });

  const formatCurrency = (amount) => {
    return amount + ' €';
  };

  return (
    <div className="summary-bar">
      <div className="summary-card positive">
        <h3>💰 Revenus</h3>
        <p>{formatCurrency(totalIncome)}</p>
      </div>
      <div className="summary-card negative">
        <h3>🏠 Fixes</h3>
        <p>{formatCurrency(totalFixed)}</p>
      </div>
      <div className="summary-card negative">
        <h3>🛒 Variables</h3>
        <p>{formatCurrency(totalVariable)}</p>
      </div>
      <div className="summary-card savings">
        <h3>💰 Épargnes</h3>
        <p>{formatCurrency(totalSavings)}</p>
      </div>
      <div className="summary-card">
        <h3>💸 Solde Restant</h3>
        <p className={`summary-card-value ${savingsAfterExpenses >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(savingsAfterExpenses)}</p>
      </div>
      <div className="summary-card">
        <h3>📊 Reste à Vivre</h3>
        <p className={`summary-card-value ${remainingToLive >= 0 ? 'neutral' : 'negative'}`}>{formatCurrency(remainingToLive)}</p>
      </div>
    </div>
  );
}

export default SummaryBar;