import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import '../styles/BalanceChart.scss';

function BalanceChart({ incomes, expenses }) {
  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const totalFixed = expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalVariable = expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const balance = totalIncome - totalFixed - totalVariable;

  const data = [
    { name: 'Dépenses Fixes', value: totalFixed || 0, color: '#FF8042' },
    { name: 'Dépenses Variables', value: totalVariable || 0, color: '#00C49F' },
    { name: 'Solde Restant', value: Math.max(balance, 0), color: '#0088FE' },
  ].filter(item => item.value > 0); // Only show if value > 0

  if (data.length === 0) {
    return (
      <div className="balance-chart-container">
        <h3 className="balance-chart-title">Diagramme des Dépenses et Solde</h3>
        <p className="balance-chart-empty">Aucune donnée à afficher.</p>
      </div>
    );
  }

  return (
    <div className="balance-chart-container">
      <h3 className="balance-chart-title">Diagramme des Dépenses et Solde</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="balance-chart-total">Solde Total: {balance} €</p>
    </div>
  );
}

export default BalanceChart;