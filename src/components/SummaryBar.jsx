import '../styles/SummaryBar.scss';

function SummaryBar({ incomes, expenses, savings = [] }) {
      if (typeof window !== 'undefined') {
        console.log('DEBUG savings array in SummaryBar (détail):');
        if (Array.isArray(savings)) {
          savings.forEach((sav, idx) => {
            console.log(`  [${idx}]`, sav, '| amount:', sav && sav.amount, '| type:', typeof (sav && sav.amount));
          });
        } else {
          console.log('  savings n’est pas un tableau:', savings);
        }
      }
    if (typeof window !== 'undefined') {
      window.__DEBUG_SAVINGS = savings;
      console.log('DEBUG savings array in SummaryBar:', savings);
    }
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalFixed = expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalVariable = expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalExpenses = totalFixed + totalVariable;
  if (typeof window !== 'undefined' && Array.isArray(savings)) {
    savings.forEach((sav, idx) => {
      console.log(`[DEBUG] savings[${idx}]`, sav, '| amount:', sav && sav.amount, '| type:', typeof (sav && sav.amount));
    });
  }
  let totalSavings = 0;
  if (Array.isArray(savings) && savings.length > 0) {
    totalSavings = savings
      .filter(sav => sav && typeof sav.amount === 'number' && isFinite(sav.amount))
      .reduce((sum, sav) => sum + sav.amount, 0);
  }
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
    return (typeof amount === 'number' && !isNaN(amount) ? amount.toFixed(2) : '0.00') + ' €';
  };

  let displaySavings = '';
  if (typeof totalSavings === 'number' && !isNaN(totalSavings)) {
    displaySavings = formatCurrency(totalSavings);
  } else {
    displaySavings = '0.00 €';
  }
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
        <p>{displaySavings}</p>
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