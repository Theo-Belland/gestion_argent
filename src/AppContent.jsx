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

const API_BASE = 'http://localhost:5000/api';

function AppContent() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [credits, setCredits] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    // Enregistrer une visite côté backend
    fetch('http://localhost:5000/api/metrics/visit', {
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
        const [incomesRes, expensesRes, savingsRes, creditsRes] = await Promise.all([
          fetch(`${API_BASE}/incomes`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/expenses`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/savings`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/credits`, { headers: getAuthHeaders() })
        ]);
        const incomesData = await incomesRes.json();
        const expensesData = await expensesRes.json();
        const savingsData = await savingsRes.json();
        const creditsData = await creditsRes.json();
        setIncomes(incomesData);
        setExpenses(expensesData);
        setSavings(savingsData);
        setCredits(creditsData);
        console.log('Data loaded:', { incomesData, expensesData, savingsData, creditsData });
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2em'
      }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return null; // Sera redirigé vers login
  }

  return (
    <div className="App">
      <nav style={{
        background: '#333',
        color: 'white',
        padding: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Accueil</Link>
          <Link to="/app" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>App</Link>
          <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Blog</Link>
          <Link to="/app/epargnes" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Épargnes</Link>
          <Link to="/app/credits" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Crédits</Link>
          <Link to="/app/rapports" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Rapports</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Admin</Link>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Bonjour, {user.email}</span>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="" element={
          <>
            <SummaryBar incomes={incomes} expenses={expenses} savings={savings} />
            <h1>Gestion de l'Argent</h1>
            <button onClick={resetData} style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '10px' }}>Remettre à zéro toutes les données</button>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
              <IncomeForm onAddIncome={addIncome} />
              <ExpenseForm onAddExpense={addExpense} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
              <IncomeTable incomes={incomes} onDeleteIncome={deleteIncome} onEditIncome={editIncome} />
              <div style={{ flex: '1' }}>
                <ExpenseTable expenses={expenses} credits={credits} onDeleteExpense={deleteExpense} onEditExpense={editExpense} />
              </div>
            </div>
            <BalanceChart incomes={incomes} expenses={expenses} />
          </>
        } />
        <Route path="epargnes" element={
          <>
            <SummaryBar incomes={incomes} expenses={expenses} savings={savings} />
            <h1>Mes Épargnes</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
              <SavingsForm onAddSavings={addSavings} />
              <SavingsTable 
                savings={savings} 
                onDeleteSavings={deleteSavings}
                onAddToSavings={addToSavings}
                onWithdrawSavings={withdrawSavings}
                onEditSavings={editSavings}
              />
            </div>
          </>
        } />
        <Route path="credits" element={
          <>
            <SummaryBar incomes={incomes} expenses={expenses} savings={savings} />
            <h1>Mes Crédits</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
              <CreditForm onAddCredit={addCredit} />
              <CreditTable 
                credits={credits} 
                onDeleteCredit={deleteCredit}
                onEditCredit={editCredit}
                onUpdateCreditBalance={updateCreditBalance}
              />
            </div>
          </>
        } />
        <Route path="rapports" element={
          <>
            <SummaryBar incomes={incomes} expenses={expenses} savings={savings} />
            <h1>Rapports Mensuels</h1>
            <MonthlyReport incomes={incomes} expenses={expenses} />
          </>
        } />
      </Routes>
    </div>
  );
}

export default AppContent;