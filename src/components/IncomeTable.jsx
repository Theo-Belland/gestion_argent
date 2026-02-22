import { useState } from 'react';
import SearchFilter from './SearchFilter';
import '../styles/searchFilter.scss';
import '../styles/IncomeTable.scss';

function IncomeTable({ incomes, onDeleteIncome, onEditIncome }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (incomeList) => {
    if (!filters) return incomeList;
    return incomeList.filter(inc => {
      if (filters.search && !inc.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.dateFrom && new Date(inc.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(inc.date) > new Date(filters.dateTo)) return false;
      if (filters.minAmount && inc.amount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount && inc.amount > parseFloat(filters.maxAmount)) return false;
      if (filters.tags && filters.tags.length > 0) {
        if (!inc.tags || !filters.tags.some(tag => inc.tags.includes(tag))) return false;
      }
      return true;
    });
  };

  const filteredIncomes = applyFilters(incomes);

  const startEdit = (id) => {
    const income = incomes.find(inc => inc._id === id);
    setEditId(id);
    setEditData({ ...income });
  };

  const saveEdit = () => {
    onEditIncome(editId, editData);
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="income-table-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <button
        className="income-table-toggle-filter"
        onClick={() => setShowFilters((v) => !v)}
        style={{ marginBottom: 10, marginTop: 5, padding: '6px 14px', borderRadius: 6, border: '1px solid #bbb', background: '#f8f9fa', cursor: 'pointer', fontWeight: 500 }}
      >
        {showFilters ? 'Masquer la recherche ▲' : 'Afficher la recherche ▼'}
      </button>
      {showFilters && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <SearchFilter onFilterChange={setFilters} />
        </div>
      )}
      <h3>Revenus</h3>
      <table className="income-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Récurrent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncomes.map((inc) => (
            <tr key={inc._id}>
              {editId === inc._id ? (
                <>
                  <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
                  <td><input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })} /></td>
                  <td><input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /></td>
                  <td><input type="checkbox" checked={editData.isRecurring} onChange={(e) => setEditData({ ...editData, isRecurring: e.target.checked })} /></td>
                  <td>
                    {inc.description}
                    {inc.tags && inc.tags.length > 0 && (
                      <div className="income-table-tags">
                        {inc.tags.map((tag, i) => (
                          <span key={i} className="income-table-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <button onClick={saveEdit}>Sauvegarder</button>
                    <button onClick={cancelEdit}>Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{inc.description}</td>
                  <td>{inc.amount} €</td>
                  <td>{new Date(inc.date).toLocaleDateString('fr-FR')}</td>
                  <td>{inc.isRecurring ? 'Oui' : 'Non'}</td>
                  <td>
                    <button onClick={() => startEdit(inc._id)}>Modifier</button>
                    <button onClick={() => onDeleteIncome(inc._id)}>Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncomeTable;