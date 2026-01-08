import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [credits, setCredits] = useState([]);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomesRes, expensesRes, savingsRes, creditsRes] = await Promise.all([
          fetch(`${API_BASE}/incomes`),
          fetch(`${API_BASE}/expenses`),
          fetch(`${API_BASE}/savings`),
          fetch(`${API_BASE}/credits`)
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
      }
    };
    fetchData();
  }, []);

  const addIncome = async (income) => {
    try {
      const res = await fetch(`${API_BASE}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      await fetch(`${API_BASE}/incomes/${incomeId}`, { method: 'DELETE' });
      setIncomes(incomes.filter(inc => inc._id !== incomeId));
    } catch (err) {
      console.error('Error deleting income:', err);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await fetch(`${API_BASE}/expenses/${expenseId}`, { method: 'DELETE' });
      setExpenses(expenses.filter(exp => exp._id !== expenseId));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const editIncome = async (incomeId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/incomes/${incomeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      await fetch(`${API_BASE}/savings/${savingsId}`, { method: 'DELETE' });
      setSavings(savings.filter(s => s._id !== savingsId));
    } catch (err) {
      console.error('Error deleting savings:', err);
    }
  };

  const addToSavings = async (savingsId, newAmount) => {
    try {
      const res = await fetch(`${API_BASE}/savings/${savingsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credit)
      });
      const newCredit = await res.json();
      setCredits([...credits, newCredit]);
    } catch (err) {
      console.error('Error adding credit:', err);
    }
  };

  const deleteCredit = async (creditId) => {
    try {
      await fetch(`${API_BASE}/credits/${creditId}`, { method: 'DELETE' });
      setCredits(credits.filter(c => c._id !== creditId));
    } catch (err) {
      console.error('Error deleting credit:', err);
    }
  };

  const editCredit = async (creditId, newData) => {
    try {
      const res = await fetch(`${API_BASE}/credits/${creditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        ...incomes.map(inc => fetch(`${API_BASE}/incomes/${inc._id}`, { method: 'DELETE' })),
        ...expenses.map(exp => fetch(`${API_BASE}/expenses/${exp._id}`, { method: 'DELETE' })),
        ...savings.map(sav => fetch(`${API_BASE}/savings/${sav._id}`, { method: 'DELETE' })),
        ...credits.map(cred => fetch(`${API_BASE}/credits/${cred._id}`, { method: 'DELETE' }))
      ]);
      setIncomes([]);
      setExpenses([]);
      setSavings([]);
      setCredits([]);
    } catch (err) {
      console.error('Error resetting data:', err);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav style={{
          background: '#333',
          color: 'white',
          padding: '10px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Accueil</Link>
          <Link to="/epargnes" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Épargnes</Link>
          <Link to="/credits" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Crédits</Link>
          <Link to="/rapports" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>Rapports</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <SummaryBar incomes={incomes} expenses={expenses} />
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
          <Route path="/epargnes" element={
            <>
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
          <Route path="/credits" element={
            <>
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
          <Route path="/rapports" element={
            <>
              <h1>Rapports Mensuels</h1>
              <MonthlyReport incomes={incomes} expenses={expenses} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
