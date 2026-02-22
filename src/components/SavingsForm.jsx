import { useState } from 'react';
import '../styles/SavingsForm.scss';

function SavingsForm({ onAddSavings }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [frequency, setFrequency] = useState('annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !interestRate || !startDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newSavings = {
      name,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      frequency: frequency,
      startDate: startDate,
      lastUpdate: new Date().toISOString().split('T')[0],
    };

    onAddSavings(newSavings);

    // Réinitialiser le formulaire
    setName('');
    setAmount('');
    setInterestRate('');
    setFrequency('annual');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="savings-form-container">
      <h2>Ajouter une Épargne</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Nom de l'épargne:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Vacances, Voiture..."
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Montant Initial (€):
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Taux d'Intérêt (%):
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            max="100"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Périodicité de l'Intérêt:
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="form-select"
          >
            <option value="annual">Annuel</option>
            <option value="monthly">Mensuel</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Date de Début:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="form-submit-btn"
        >
          Ajouter l'Épargne
        </button>
      </form>
    </div>
  );
}

export default SavingsForm;
