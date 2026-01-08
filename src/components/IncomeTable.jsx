import { useState } from 'react';

function IncomeTable({ incomes, onDeleteIncome, onEditIncome }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...incomes[index] });
  };

  const saveEdit = () => {
    onEditIncome(editIndex, editData);
    setEditIndex(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
  };

  return (
    <div>
      <h3>Revenus</h3>
      <table>
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
          {incomes.map((inc, index) => (
            <tr key={index}>
              {editIndex === index ? (
                <>
                  <td><input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} /></td>
                  <td><input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })} /></td>
                  <td><input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /></td>
                  <td><input type="checkbox" checked={editData.isRecurring} onChange={(e) => setEditData({ ...editData, isRecurring: e.target.checked })} /></td>
                  <td>
                    <button onClick={saveEdit}>Sauvegarder</button>
                    <button onClick={cancelEdit}>Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{inc.description}</td>
                  <td>{inc.amount} €</td>
                  <td>{inc.date}</td>
                  <td>{inc.isRecurring ? 'Oui' : 'Non'}</td>
                  <td>
                    <button onClick={() => startEdit(index)}>Modifier</button>
                    <button onClick={() => onDeleteIncome(inc)}>Supprimer</button>
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