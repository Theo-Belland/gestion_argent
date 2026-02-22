import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import IncomeTable from './components/IncomeTable';
import ExpenseTable from './components/ExpenseTable';
import BalanceChart from './components/BalanceChart';
import MonthlyReport from './components/MonthlyReport';
import SummaryBar from './components/SummaryBar';
import SavingsForm from './components/SavingsForm';
import SavingsTable from './components/SavingsTable';
import CreditForm from './components/CreditForm';
import CreditTable from './components/CreditTable';
import GoalForm from './components/GoalForm';
import GoalTable from './components/GoalTable';
import BudgetForm from './components/BudgetForm';
import BudgetTable from './components/BudgetTable';
import ExportButtons from './components/ExportButtons';
import ImportCSV from './components/ImportCSV';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';

import AppSection from './components/AppSection';
import './styles/AppContent.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';

function AppContent() {
  // Ajout du state pour le mois et l'année sélectionnés
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [credits, setCredits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    // Enregistrer une visite côté backend
    fetch(`${API_BASE}/metrics/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/app', user: userData ? JSON.parse(userData).email : undefined })
    }).catch(() => {});

    if (!token) {
      navigate('/login');
      return;
    }

    // Si on a déjà les données utilisateur en cache, les utiliser
    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
      return;
    }

    // Sinon, récupérer les informations depuis l'API
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const userInfo = await res.json();
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          // Token invalide, rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Fonction helper pour les headers d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Charger les données depuis l'API
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [incomesRes, expensesRes, savingsRes, creditsRes, goalsRes, budgetsRes] = await Promise.all([
          fetch(`${API_BASE}/incomes`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/expenses`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/savings`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/credits`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/goals`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/budgets`, { headers: getAuthHeaders() })
        ]);
        const incomesData = await incomesRes.json();
        const expensesData = await expensesRes.json();
        const savingsData = await savingsRes.json();
        const creditsData = await creditsRes.json();
        const goalsData = await goalsRes.json();
        const budgetsData = await budgetsRes.json();
        setIncomes(incomesData);
        setExpenses(expensesData);
        setSavings(savingsData);
        setCredits(creditsData);
        setGoals(goalsData);
        setBudgets(budgetsData);
        console.log('Data loaded:', { incomesData, expensesData, savingsData, creditsData, goalsData, budgetsData });
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.message.includes('401')) {
          // Token invalide, rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [user, navigate]);

  const fetchIncomes = async () => {
    try {
      const res = await fetch(`${API_BASE}/incomes`, { headers: getAuthHeaders() });
      const data = await res.json();
      setIncomes(data);
    } catch (err) {
      console.error('Error fetching incomes:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/expenses`, { headers: getAuthHeaders() });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const addIncome = async (income) => {
    try {
      const res = await fetch(`${API_BASE}/incomes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(income)
      });
      const newIncome = await res.json();
      setIncomes([...incomes, newIncome]);
    } catch (err) {
      console.error('Error adding income:', err);
    }
  };

  const addExpense = async (expense) => {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expense)
      });
      const newExpense = await res.json();
      setExpenses([...expenses, newExpense]);
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      await fetch(`${API_BASE}/incomes/${incomeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setIncomes(incomes.filter(inc => inc._id !== incomeId));
    } catch (err) {
      console.error('Error deleting income:', err);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await fetch(`${API_BASE}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const editIncome = async (incomeId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/incomes/${incomeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newData)
      });
      const updatedIncome = await res.json();
      setIncomes(incomes.map(inc => inc._id === incomeId ? updatedIncome : inc));
    } catch (err) {
      console.error('Error editing income:', err);
    }
  };

  const editExpense = async (expenseId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newData)
      });
      const updatedExpense = await res.json();
      setExpenses(expenses.map(exp => exp._id === expenseId ? updatedExpense : exp));
    } catch (err) {
      console.error('Error editing expense:', err);
    }
  };

  const addSavings = async (newSavings) => {
    try {
      const res = await fetch(`${API_BASE}/savings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSavings)
      });
      const savingsItem = await res.json();
      setSavings([...savings, savingsItem]);
    } catch (err) {
      console.error('Error adding savings:', err);
    }
  };

  const deleteSavings = async (savingsId) => {
    try {
      await fetch(`${API_BASE}/savings/${savingsId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setSavings(savings.filter(s => s._id !== savingsId));
    } catch (err) {
      console.error('Error deleting savings:', err);
    }
  };

  const addToSavings = async (savingsId, newAmount) => {
    try {
      const res = await fetch(`${API_BASE}/savings/${savingsId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: newAmount })
      });
      const updatedSavings = await res.json();
      setSavings(savings.map(s => s._id === savingsId ? updatedSavings : s));
    } catch (err) {
      console.error('Error updating savings:', err);
    }
  };

  const withdrawSavings = async (savingsId, newAmount) => {
    try {
      const res = await fetch(`${API_BASE}/savings/${savingsId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount: newAmount })
      });
      const updatedSavings = await res.json();
      setSavings(savings.map(s => s._id === savingsId ? updatedSavings : s));
    } catch (err) {
      console.error('Error updating savings:', err);
    }
  };

  const editSavings = async (savingsId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/savings/${savingsId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newData)
      });
      const updatedSavings = await res.json();
      setSavings(savings.map(s => s._id === savingsId ? updatedSavings : s));
    } catch (err) {
      console.error('Error editing savings:', err);
    }
  };

  const addCredit = async (credit) => {
    try {
      const res = await fetch(`${API_BASE}/credits`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credit)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const newCredit = await res.json();
      setCredits([...credits, newCredit]);

      // Calculer la mensualité et l'ajouter automatiquement comme dépense fixe
      const monthlyRate = parseFloat(credit.interestRate) || 0;
      const durationMonths = parseInt(credit.durationMonths) || 0;
      const monthlyPayment = isNaN(monthlyRate) || monthlyRate === 0 || durationMonths === 0 ? 0 :
                             credit.amount * (monthlyRate / 100 / 12 * Math.pow(1 + monthlyRate / 100 / 12, durationMonths)) /
                             (Math.pow(1 + monthlyRate / 100 / 12, durationMonths) - 1);
      const perPersonMonthly = monthlyPayment / 2;

      const expenseData = {
        description: `Mensualité ${credit.name}`,
        amount: perPersonMonthly,
        date: new Date().toISOString().split('T')[0],
        type: 'fixed',
        category: 'Crédit',
        isRecurring: true,
        period: 'monthly'
      };

      await addExpense(expenseData);
    } catch (err) {
      console.error('Error adding credit:', err);
      alert('Erreur lors de l\'ajout du crédit. Vérifiez la console pour plus de détails.');
    }
  };

  const deleteCredit = async (creditId) => {
    try {
      await fetch(`${API_BASE}/credits/${creditId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setCredits(credits.filter(c => c._id !== creditId));
    } catch (err) {
      console.error('Error deleting credit:', err);
    }
  };

  const editCredit = async (creditId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/credits/${creditId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newData)
      });
      const updatedCredit = await res.json();
      setCredits(credits.map(c => c._id === creditId ? updatedCredit : c));
    } catch (err) {
      console.error('Error editing credit:', err);
    }
  };

  const updateCreditBalance = async (creditId, newBalance) => {
    try {
      const res = await fetch(`${API_BASE}/credits/${creditId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ balance: newBalance })
      });
      const updatedCredit = await res.json();
      setCredits(credits.map(c => c._id === creditId ? updatedCredit : c));
    } catch (err) {
      console.error('Error updating credit balance:', err);
    }
  };

  const resetData = async () => {
    try {
      await Promise.all([
        ...incomes.map(inc => fetch(`${API_BASE}/incomes/${inc._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })),
        ...expenses.map(exp => fetch(`${API_BASE}/expenses/${exp._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })),
        ...savings.map(sav => fetch(`${API_BASE}/savings/${sav._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })),
        ...credits.map(cred => fetch(`${API_BASE}/credits/${cred._id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        }))
      ]);
      setIncomes([]);
      setExpenses([]);
      setSavings([]);
      setCredits([]);
    } catch (err) {
      console.error('Error resetting data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="app-main-content">Chargement...</div>
    );
  }

  if (!user) {
    return null; // Sera redirigé vers login
  }

  // Helpers pour filtrer par mois/année
  function isSameMonthYear(dateStr, month, year) {
    const d = new Date(dateStr);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  }
  const filteredIncomes = incomes.filter(inc => isSameMonthYear(inc.date, selectedMonth, selectedYear));
  // Les dépenses fixes récurrentes doivent apparaître chaque mois
  const filteredExpenses = expenses.filter(exp => {
    if (exp.type === 'fixed' && exp.isRecurring) {
      // Affiche la dépense fixe pour tous les mois après sa date d'origine
      const d = new Date(exp.date);
      return (selectedYear > d.getFullYear()) ||
             (selectedYear === d.getFullYear() && selectedMonth >= d.getMonth() + 1);
    }
    // Les autres dépenses sont filtrées normalement
    return isSameMonthYear(exp.date, selectedMonth, selectedYear);
  });
  // Les épargnes récurrentes (frequency: 'monthly') doivent apparaître chaque mois à partir de startDate
  const filteredSavings = savings.filter(sav => {
    if (sav.frequency === 'monthly' && sav.startDate) {
      const d = new Date(sav.startDate);
      return (selectedYear > d.getFullYear()) ||
             (selectedYear === d.getFullYear() && selectedMonth >= d.getMonth() + 1);
    }
    return isSameMonthYear(sav.date, selectedMonth, selectedYear);
  });

  // DEBUG : log savings filtrés et tous les savings
  if (typeof window !== 'undefined') {
    console.log('DEBUG filteredSavings:', filteredSavings);
    console.log('DEBUG all savings:', savings);
  }
  // Afficher tous les crédits actifs chaque mois (à partir de startDate, tant que la durée n'est pas terminée)
  const filteredCredits = credits.filter(cred => {
    if (cred.startDate && cred.durationMonths) {
      const start = new Date(cred.startDate);
      const endMonth = start.getMonth() + cred.durationMonths;
      const endYear = start.getFullYear() + Math.floor(endMonth / 12);
      const endMonthNorm = endMonth % 12 || 12;
      // Le crédit est actif si le mois sélectionné est entre startDate et la fin
      const afterStart = (selectedYear > start.getFullYear()) || (selectedYear === start.getFullYear() && selectedMonth >= start.getMonth() + 1);
      const beforeEnd = (selectedYear < endYear) || (selectedYear === endYear && selectedMonth <= endMonthNorm);
      return afterStart && beforeEnd;
    }
    return true;
  });
  const filteredBudgets = budgets.filter(bud => isSameMonthYear(bud.date, selectedMonth, selectedYear));

  // DEBUG : log savings juste avant le rendu
  if (typeof window !== 'undefined') {
    window.__DEBUG_SAVINGS_APP = savings;
    console.log('DEBUG savings array in AppContent:', savings);
    if (savings && savings.length > 0) {
      console.log('DEBUG first savings object:', savings[0]);
      Object.entries(savings[0]).forEach(([key, value]) => {
        console.log(`  ${key}:`, value, '| type:', typeof value);
      });
    }
  }
  return (
    <div className="app-content-container">
      {/* Sélecteur de mois/année */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <label>Mois :
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{(i+1).toString().padStart(2, '0')}</option>
            ))}
          </select>
        </label>
        <label>Année :
          <input type="number" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={{ width: 80 }} />
        </label>
      </div>


      <Routes>
        <Route index element={<Dashboard incomes={filteredIncomes} expenses={filteredExpenses} savings={filteredSavings} goals={goals} budgets={filteredBudgets} />} />
        <Route path="transactions" element={
          <>
            <SummaryBar incomes={filteredIncomes} expenses={filteredExpenses} savings={filteredSavings} />
            <AppSection title="Gestion de l'Argent" icon="💼" color="green" actions={<ExportButtons incomes={filteredIncomes} expenses={filteredExpenses} />}>
              <div className="app-form-container" style={{display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                <div style={{flex: 1, minWidth: 320, maxWidth: 420}}>
                  <IncomeForm onAddIncome={addIncome} />
                </div>
                <div style={{flex: 1, minWidth: 320, maxWidth: 420}}>
                  <ExpenseForm onAddExpense={addExpense} />
                </div>
              </div>
              <button onClick={resetData} className="app-reset-button" style={{margin: '24px 0 0 0', float: 'right'}}>Remettre à zéro toutes les données</button>
            </AppSection>
            <AppSection title="Revenus et Dépenses" icon="📊" color="pink">
              <div className="app-tables-flex">
                <div className="app-table-block app-table-income">
                  <h3 style={{marginBottom: 12}}><span role="img" aria-label="income">💰</span> Revenus</h3>
                  <IncomeTable incomes={filteredIncomes} onDeleteIncome={deleteIncome} onEditIncome={editIncome} />
                </div>
                <div className="app-table-block app-table-expense">
                  <h3 style={{marginBottom: 12}}><span role="img" aria-label="expense">🛒</span> Dépenses</h3>
                  <ExpenseTable expenses={filteredExpenses} credits={filteredCredits} onDeleteExpense={deleteExpense} onEditExpense={editExpense} />
                </div>
              </div>
            </AppSection>
            <AppSection title="Évolution du Solde" icon="📈" color="blue">
              <BalanceChart incomes={filteredIncomes} expenses={filteredExpenses} />
            </AppSection>
          </>
        } />
        <Route path="epargnes" element={
          <>
            <SummaryBar incomes={filteredIncomes} expenses={filteredExpenses} savings={filteredSavings} />
            <AppSection title="Mes Épargnes" icon="💙" color="blue">
              <div className="app-form-container">
                <SavingsForm onAddSavings={addSavings} />
                <SavingsTable 
                  savings={filteredSavings} 
                  onDeleteSavings={deleteSavings}
                  onAddToSavings={addToSavings}
                  onWithdrawSavings={withdrawSavings}
                  onEditSavings={editSavings}
                />
              </div>
            </AppSection>
          </>
        } />
        <Route path="credits" element={
          <>
            <SummaryBar incomes={filteredIncomes} expenses={filteredExpenses} savings={filteredSavings} />
            <AppSection title="Mes Crédits" icon="💳" color="pink">
              <div className="app-form-container">
                <CreditForm onAddCredit={addCredit} />
                <CreditTable 
                  credits={filteredCredits} 
                  onDeleteCredit={deleteCredit}
                  onEditCredit={editCredit}
                  onUpdateCreditBalance={updateCreditBalance}
                />
              </div>
            </AppSection>
          </>
        } />
        <Route path="rapports" element={
          <>
            <SummaryBar incomes={filteredIncomes} expenses={filteredExpenses} savings={filteredSavings} />
            <AppSection title="Rapports Mensuels" icon="📅" color="yellow">
              <MonthlyReport incomes={filteredIncomes} expenses={filteredExpenses} />
            </AppSection>
          </>
        } />
        <Route path="objectifs" element={
          <>
            <AppSection title="Mes Objectifs Financiers" icon="🎯" color="green">
              <div className="app-form-container">
                <GoalForm onGoalAdded={(goal) => setGoals([...goals, goal])} />
              </div>
              <GoalTable 
                goals={goals} 
                onGoalDeleted={(id) => setGoals(goals.filter(g => g._id !== id))}
                onGoalUpdated={(updated) => setGoals(goals.map(g => g._id === updated._id ? updated : g))}
              />
            </AppSection>
          </>
        } />
        <Route path="budgets" element={
          <>
            <AppSection title="Mes Budgets" icon="🗂️" color="blue">
              <div className="app-form-container">
                <BudgetForm onBudgetAdded={(budget) => setBudgets([...budgets, budget])} />
              </div>
              <BudgetTable 
                budgets={filteredBudgets} 
                onBudgetDeleted={(id) => setBudgets(budgets.filter(b => b._id !== id))}
                onBudgetUpdated={(updated) => setBudgets(budgets.map(b => b._id === updated._id ? updated : b))}
              />
            </AppSection>
          </>
        } />
        <Route path="import" element={
          <>
            <h1>Import de données</h1>
            <div className="app-section">
              <ImportCSV type="income" onImportComplete={fetchIncomes} />
              <ImportCSV type="expense" onImportComplete={fetchExpenses} />
            </div>
          </>
        } />
        <Route path="profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default AppContent;