import { exportToPDF, exportToCSV } from '../utils/exportUtils';
import '../styles/exportButtons.scss';

function ExportButtons({ incomes, expenses }) {
  const handlePDFExport = () => {
    exportToPDF(incomes, expenses, 'Rapport Financier Mensuel');
  };

  const handleIncomesCSV = () => {
    const data = incomes.map(inc => ({
      description: inc.description,
      montant: inc.amount,
      date: new Date(inc.date).toLocaleDateString('fr-FR'),
      recurrent: inc.isRecurring ? 'Oui' : 'Non'
    }));
    exportToCSV(data, `revenus_${new Date().toISOString().split('T')[0]}.csv`, 
      ['description', 'montant', 'date', 'recurrent']);
  };

  const handleExpensesCSV = () => {
    const data = expenses.map(exp => ({
      description: exp.description,
      montant: exp.amount,
      date: new Date(exp.date).toLocaleDateString('fr-FR'),
      categorie: exp.category,
      type: exp.type,
      recurrent: exp.isRecurring ? 'Oui' : 'Non'
    }));
    exportToCSV(data, `depenses_${new Date().toISOString().split('T')[0]}.csv`, 
      ['description', 'montant', 'date', 'categorie', 'type', 'recurrent']);
  };

  return (
    <div className="export-buttons">
      <button onClick={handlePDFExport} className="export-btn pdf-btn">
        📄 Exporter en PDF
      </button>
      <button onClick={handleIncomesCSV} className="export-btn csv-btn">
        📊 Revenus CSV
      </button>
      <button onClick={handleExpensesCSV} className="export-btn csv-btn">
        📊 Dépenses CSV
      </button>
    </div>
  );
}

export default ExportButtons;
