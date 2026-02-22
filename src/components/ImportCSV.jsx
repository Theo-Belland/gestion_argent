import { useState } from 'react';
import '../styles/importCSV.scss';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.geretonbudget.theobelland.fr/api';


function ImportCSV({ type = 'expense', onImportComplete }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Veuillez sélectionner un fichier CSV');
    }
  };

  const parseCSV = (file) => {
    setParsing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        return obj;
      });

      setPreview({ headers, data: data.slice(0, 5), total: data.length });
      setParsing(false);
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file || !preview) return;

    setParsing(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        return obj;
      });

      // Mapper les données selon le type
      const endpoint = type === 'expense' ? 'expenses' : 'incomes';
      let successCount = 0;
      let errorCount = 0;

      for (const row of data) {
        try {
          const mapped = {
            description: row.description || row.Description,
            amount: parseFloat(row.amount || row.montant || row.Montant),
            date: row.date || new Date().toISOString().split('T')[0],
            category: row.category || row.categorie || row.Catégorie || 'Autre',
            type: type === 'expense' ? (row.type || 'variable') : undefined
          };

          const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(mapped)
          });

          if (res.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          console.error('Error importing row:', err);
          errorCount++;
        }
      }

      setParsing(false);
      alert(`Import terminé!\n✅ ${successCount} importés\n❌ ${errorCount} erreurs`);
      
      if (onImportComplete) {
        onImportComplete();
      }
      
      setFile(null);
      setPreview(null);
    };

    reader.readAsText(file);
  };

  return (
    <div className="import-csv-container">
      <h3>📥 Import CSV - {type === 'expense' ? 'Dépenses' : 'Revenus'}</h3>
      
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          id="csv-file-input"
          className="file-input"
        />
        <label htmlFor="csv-file-input" className="file-input-label">
          📄 Choisir un fichier CSV
        </label>
        {file && <span className="file-name">{file.name}</span>}
      </div>

      {parsing && <p className="parsing-message">⏳ Analyse en cours...</p>}

      {preview && (
        <div className="preview-container">
          <h4>Aperçu ({preview.total} lignes détectées)</h4>
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  {preview.headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.data.map((row, i) => (
                  <tr key={i}>
                    {preview.headers.map((header, j) => (
                      <td key={j}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="preview-note">Note: Seules les 5 premières lignes sont affichées</p>
          
          <button onClick={handleImport} className="import-btn" disabled={parsing}>
            ✓ Importer toutes les données
          </button>
        </div>
      )}

      <div className="csv-help">
        <p><strong>Format attendu:</strong></p>
        <ul>
          <li>Colonnes: description, amount (ou montant), date, category (optionnel)</li>
          <li>Date au format: YYYY-MM-DD ou DD/MM/YYYY</li>
          <li>Montant: nombre décimal (ex: 25.50)</li>
        </ul>
      </div>
    </div>
  );
}

export default ImportCSV;
