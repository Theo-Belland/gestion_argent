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

function loadFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return [];
  }
}

function App() {
  const [incomes, setIncomes] = useState(() => loadFromLocalStorage('incomes'));
  const [expenses, setExpenses] = useState(() => loadFromLocalStorage('expenses'));
  const [savings, setSavings] = useState(() => loadFromLocalStorage('savings'));
  const [credits, setCredits] = useState(() => loadFromLocalStorage('credits'));

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('savings', JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  const addIncome = (income) => {
    setIncomes([...incomes, income]);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const deleteIncome = (incomeToDelete) => {
    setIncomes(incomes.filter(inc => inc !== incomeToDelete));
  };

  const deleteExpense = (expenseToDelete) => {
    setExpenses(expenses.filter(exp => exp !== expenseToDelete));
  };

  const editIncome = (index, newData) => {
    const newIncomes = [...incomes];
    newIncomes[index] = newData;
    setIncomes(newIncomes);
  };

  const editExpense = (index, newData) => {
    const newExpenses = [...expenses];
    newExpenses[index] = newData;
    setExpenses(newExpenses);
  };

  const addSavings = (newSavings) => {
    setSavings([...savings, newSavings]);
  };

  const deleteSavings = (savingsId) => {
    setSavings(savings.filter(s => s.id !== savingsId));
  };

  const addToSavings = (savingsId, newAmount) => {
    setSavings(savings.map(s =>
      s.id === savingsId ? { ...s, amount: newAmount } : s
    ));
  };

  const withdrawSavings = (savingsId, newAmount) => {
    setSavings(savings.map(s =>
      s.id === savingsId ? { ...s, amount: newAmount } : s
    ));
  };

  const editSavings = (savingsId, newData) => {
    setSavings(savings.map(s =>
      s.id === savingsId ? newData : s
    ));
  };

  const addCredit = (credit) => {
    setCredits([...credits, credit]);
  };

  const deleteCredit = (creditId) => {
    setCredits(credits.filter(c => c.id !== creditId));
  };

  const editCredit = (creditId, newData) => {
    setCredits(credits.map(c =>
      c.id === creditId ? newData : c
    ));
  };

  const updateCreditBalance = (creditId, newBalance) => {
    setCredits(credits.map(c =>
      c.id === creditId ? { ...c, currentBalance: newBalance } : c
    ));
  };

  const resetData = () => {
    localStorage.clear();
    setIncomes([]);
    setExpenses([]);
    setSavings([]);
    setCredits([]);
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
