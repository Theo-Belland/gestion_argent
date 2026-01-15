import { useState } from 'react';
import TagInput from './TagInput';
import '../styles/IncomeForm.scss';

function IncomeForm({ onAddIncome }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount && date) {
      onAddIncome({ description, amount: parseFloat(amount), date, isRecurring, period, tags });
      setDescription('');
      setAmount('');
      setDate('');
      setIsRecurring(false);
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="income-form-container">
      <h3>Ajouter un Revenu</h3>

      <div className="income-form-group">
        <label>Description</label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="income-form-group">
        <label>Montant</label>
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="income-form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="income-form-group">
        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          {' '}Récurrent
        </label>
        {isRecurring && (
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="monthly">Mensuel</option>
            <option value="yearly">Annuel</option>
          </select>
        )}
      </div>

      <div className="income-form-tags-section">
        <label className="income-form-tags-label">Tags</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <button type="submit" className="income-form-submit">Ajouter</button>
    </form>
  );
}

export default IncomeForm;