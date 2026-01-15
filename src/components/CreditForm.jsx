import { useState } from 'react';
import '../styles/CreditForm.scss';

function CreditForm({ onAddCredit }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentBalance, setCurrentBalance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount || !interestRate || !durationMonths || !startDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newCredit = {
      name,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      durationMonths: parseInt(durationMonths),
      startDate: startDate,
      balance: currentBalance ? parseFloat(currentBalance) : parseFloat(amount),
    };

    onAddCredit(newCredit);

    // Réinitialiser le formulaire
    setName('');
    setAmount('');
    setInterestRate('');
    setDurationMonths('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setCurrentBalance('');
  };

  return (
    <div className="credit-form-container">
      <h2>Ajouter un Crédit</h2>
      <form onSubmit={handleSubmit}>
        <div className="credit-form-group">
          <label className="credit-form-group label">Nom du crédit:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Voiture, Maison..."
            className="credit-form-group input"
          />
        </div>

        <div className="credit-form-group">
          <label className="credit-form-group label">Montant emprunté (€):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="credit-form-group input"
          />
        </div>

        <div className="credit-form-group">
          <label className="credit-form-group label">Taux d'intérêt annuel (%):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            max="50"
            className="credit-form-group input"
          />
        </div>

        <div className="credit-form-group">
          <label className="credit-form-group label">Durée (mois):</label>
          <input
            type="number"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            placeholder="Ex: 60"
            min="1"
            max="360"
            className="credit-form-group input"
          />
        </div>

        <div className="credit-form-group">
          <label className="credit-form-group label">Montant restant actuel (€):</label>
          <input
            type="number"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            placeholder="Montant indiqué par votre banque"
            step="0.01"
            min="0"
            className="credit-form-group input"
          />
          <small className="credit-form-help-text">
            Laissez vide si c'est un nouveau crédit
          </small>
        </div>

        <div className="credit-form-group">
          <label className="credit-form-group label">Date de début:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="credit-form-group input"
          />
        </div>

        <button type="submit" className="credit-form-submit">
          Ajouter le Crédit
        </button>
      </form>
    </div>
  );
}

export default CreditForm;