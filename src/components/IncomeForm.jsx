import { useState } from 'react';

function IncomeForm({ onAddIncome }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [period, setPeriod] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount && date) {
      onAddIncome({ description, amount: parseFloat(amount), date, isRecurring, period });
      setDescription('');
      setAmount('');
      setDate('');
      setIsRecurring(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un Revenu</h3>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Montant"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Récurrent
      </label>
      {isRecurring && (
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="monthly">Mensuel</option>
          <option value="yearly">Annuel</option>
        </select>
      )}
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default IncomeForm;