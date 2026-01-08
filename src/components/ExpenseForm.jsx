import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('variable'); // 'fixed' or 'variable'
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [period, setPeriod] = useState('monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount && date) {
      onAddExpense({ description, amount: parseFloat(amount), date, type, category, isRecurring, period });
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
      setIsRecurring(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter une Dépense</h3>
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
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="fixed">Fixe</option>
        <option value="variable">Variable</option>
      </select>
      {type === 'fixed' && (
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Choisir une catégorie</option>
          <option value="Crédit">Crédit</option>
          <option value="Facture">Facture</option>
          <option value="Assurance">Assurance</option>
          <option value="Autre">Autre</option>
        </select>
      )}
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

export default ExpenseForm;