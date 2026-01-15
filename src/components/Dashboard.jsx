import { Link } from 'react-router-dom';
import '../styles/dashboard.scss';

function Dashboard({ incomes, expenses, savings, goals, budgets }) {
  // Calculs
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;
  const totalSavings = savings.reduce((sum, sav) => sum + sav.currentAmount, 0);

  // Objectifs proches de completion
  const nearCompleteGoals = goals
    .filter(g => (g.currentAmount / g.targetAmount) >= 0.8 && (g.currentAmount / g.targetAmount) < 1)
    .slice(0, 3);

  // Budgets dépassés ou proches
  const alertBudgets = budgets
    .filter(b => b.isExceeded || b.isNearLimit)
    .slice(0, 3);

  // Dépenses récentes
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Revenus récents
  const recentIncomes = [...incomes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <h1>📊 Tableau de bord</h1>

      {/* Cartes de statistiques */}
      <div className="dashboard-stats">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Revenus totaux</h3>
            <p className="stat-value">{totalIncome.toFixed(2)} €</p>
            <Link to="/app/transactions" className="stat-link">Voir détails →</Link>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Dépenses totales</h3>
            <p className="stat-value">{totalExpense.toFixed(2)} €</p>
            <Link to="/app/transactions" className="stat-link">Voir détails →</Link>
          </div>
        </div>

        <div className={`stat-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-icon">{balance >= 0 ? '✅' : '⚠️'}</div>
          <div className="stat-content">
            <h3>Solde</h3>
            <p className="stat-value">{balance.toFixed(2)} €</p>
          </div>
        </div>

        <div className="stat-card savings">
          <div className="stat-icon">🏦</div>
          <div className="stat-content">
            <h3>Épargne totale</h3>
            <p className="stat-value">{totalSavings.toFixed(2)} €</p>
            <Link to="/app/epargnes" className="stat-link">Gérer →</Link>
          </div>
        </div>
      </div>

      {/* Widgets */}
      <div className="dashboard-widgets">
        {/* Objectifs proches */}
        {nearCompleteGoals.length > 0 && (
          <div className="widget">
            <h3>🎯 Objectifs bientôt atteints</h3>
            <div className="widget-content">
              {nearCompleteGoals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal._id} className="widget-item">
                    <span className="widget-item-name">{goal.title}</span>
                    <div className="progress-mini">
                      <progress className="progress-bar-mini" max="100" value={progress}></progress>
                    </div>
                    <span className="widget-item-value">{progress.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
            <Link to="/app/objectifs" className="widget-link">Voir tous les objectifs →</Link>
          </div>
        )}

        {/* Alertes budgets */}
        {alertBudgets.length > 0 && (
          <div className="widget alert">
            <h3>⚠️ Alertes budgets</h3>
            <div className="widget-content">
              {alertBudgets.map(budget => (
                <div key={budget._id} className="widget-item alert-item">
                  <span className="widget-item-name">{budget.category}</span>
                  <span className={`widget-item-badge ${budget.isExceeded ? 'danger' : 'warning'}`}>
                    {budget.isExceeded ? 'Dépassé' : 'Proche limite'}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/app/budgets" className="widget-link">Gérer les budgets →</Link>
          </div>
        )}

        {/* Transactions récentes */}
        <div className="widget">
          <h3>📜 Dernières dépenses</h3>
          <div className="widget-content">
            {recentExpenses.length === 0 ? (
              <p className="widget-empty">Aucune dépense enregistrée</p>
            ) : (
              recentExpenses.map(exp => (
                <div key={exp._id} className="widget-item">
                  <span className="widget-item-name">{exp.description}</span>
                  <span className="widget-item-value expense-value">{exp.amount.toFixed(2)} €</span>
                </div>
              ))
            )}
          </div>
          <Link to="/app/transactions" className="widget-link">Voir toutes les transactions →</Link>
        </div>

        <div className="widget">
          <h3>💵 Derniers revenus</h3>
          <div className="widget-content">
            {recentIncomes.length === 0 ? (
              <p className="widget-empty">Aucun revenu enregistré</p>
            ) : (
              recentIncomes.map(inc => (
                <div key={inc._id} className="widget-item">
                  <span className="widget-item-name">{inc.description}</span>
                  <span className="widget-item-value income-value">{inc.amount.toFixed(2)} €</span>
                </div>
              ))
            )}
          </div>
          <Link to="/app/transactions" className="widget-link">Voir toutes les transactions →</Link>
        </div>
      </div>

      {/* Raccourcis */}
      <div className="dashboard-shortcuts">
        <h3>🚀 Accès rapide</h3>
        <div className="shortcut-grid">
          <Link to="/app/transactions" className="shortcut-card">
            <span className="shortcut-icon">📝</span>
            <span>Transactions</span>
          </Link>
          <Link to="/app/objectifs" className="shortcut-card">
            <span className="shortcut-icon">🎯</span>
            <span>Objectifs</span>
          </Link>
          <Link to="/app/budgets" className="shortcut-card">
            <span className="shortcut-icon">💼</span>
            <span>Budgets</span>
          </Link>
          <Link to="/app/rapports" className="shortcut-card">
            <span className="shortcut-icon">📊</span>
            <span>Rapports</span>
          </Link>
          <Link to="/app/import" className="shortcut-card">
            <span className="shortcut-icon">📥</span>
            <span>Import CSV</span>
          </Link>
          <Link to="/app/profile" className="shortcut-card">
            <span className="shortcut-icon">👤</span>
            <span>Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
