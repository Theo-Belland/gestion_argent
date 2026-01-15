import { useState } from 'react';
import TagInput from './TagInput';
import '../styles/ExpenseForm.scss';

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('variable'); // 'fixed' or 'variable'
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount && date) {
      onAddExpense({ description, amount: parseFloat(amount), date, type, category, isRecurring, period, tags });
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
      setIsRecurring(false);
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h3>Ajouter une Dépense</h3>

      <div className="expense-form-group">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="expense-form-group">
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="expense-form-group">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="expense-form-group">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="fixed">Fixe</option>
          <option value="variable">Variable</option>
        </select>
      </div>

      {type === 'fixed' && (
        <div className="expense-form-group">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choisir une catégorie</option>
            <option value="Crédit">Crédit</option>
            <option value="Facture">Facture</option>
            <option value="Assurance">Assurance</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      )}

      <div className="expense-form-group">
        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          {' '}Récurrent
        </label>
      </div>

      {isRecurring && (
        <div className="expense-form-group">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">Mensuel</option>
            <option value="yearly">Annuel</option>
          </select>
        </div>
      )}

      <div className="expense-tags-section">
        <label className="expense-tags-label">Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <button type="submit">Ajouter</button>
    </form>
  );
}

export default ExpenseForm;