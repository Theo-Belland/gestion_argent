function SummaryBar({ incomes, expenses }) {
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalFixed = expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalVariable = expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalExpenses = totalFixed + totalVariable;
  const savings = totalIncome - totalExpenses;
  const remainingToLive = totalIncome - totalFixed;

  console.log('SummaryBar calculations:', { totalIncome, totalFixed, totalVariable, totalExpenses, savings, remainingToLive });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
        <h3 style={{ margin: '0', fontSize: '1.2em' }}>💰 Revenus</h3>
        <p style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0' }}>{formatCurrency(totalIncome)}</p>
      </div>
      <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
        <h3 style={{ margin: '0', fontSize: '1.2em' }}>🏠 Fixes</h3>
        <p style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0' }}>{formatCurrency(totalFixed)}</p>
      </div>
      <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
        <h3 style={{ margin: '0', fontSize: '1.2em' }}>🛒 Variables</h3>
        <p style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0' }}>{formatCurrency(totalVariable)}</p>
      </div>
      <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
        <h3 style={{ margin: '0', fontSize: '1.2em' }}>💸 Solde Restant</h3>
        <p style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
          margin: '5px 0',
          color: savings >= 0 ? '#4CAF50' : '#F44336'
        }}>{formatCurrency(savings)}</p>
      </div>
      <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
        <h3 style={{ margin: '0', fontSize: '1.2em' }}>📊 Reste à Vivre</h3>
        <p style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
          margin: '5px 0',
          color: remainingToLive >= 0 ? '#2196F3' : '#FF9800'
        }}>{formatCurrency(remainingToLive)}</p>
      </div>
    </div>
  );
}

export default SummaryBar;