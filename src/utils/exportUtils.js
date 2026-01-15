import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (incomes, expenses, title = 'Rapport Financier') => {
  const doc = new jsPDF();
  
  // Titre
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(11);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

  // Revenus
  doc.setFontSize(14);
  doc.text('Revenus', 14, 40);
  
  const incomeData = incomes.map(inc => [
    inc.description,
    `${inc.amount}€`,
    new Date(inc.date).toLocaleDateString('fr-FR'),
    inc.isRecurring ? 'Oui' : 'Non'
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Description', 'Montant', 'Date', 'Récurrent']],
    body: incomeData,
    theme: 'grid',
    headStyles: { fillColor: [76, 175, 80] }
  });

  // Dépenses
  const startY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Dépenses', 14, startY);

  const expenseData = expenses.map(exp => [
    exp.description,
    `${exp.amount}€`,
    new Date(exp.date).toLocaleDateString('fr-FR'),
    exp.category,
    exp.type
  ]);

  autoTable(doc, {
    startY: startY + 5,
    head: [['Description', 'Montant', 'Date', 'Catégorie', 'Type']],
    body: expenseData,
    theme: 'grid',
    headStyles: { fillColor: [220, 53, 69] }
  });

  // Totaux
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text(`Total Revenus: ${totalIncome.toFixed(2)}€`, 14, finalY);
  doc.text(`Total Dépenses: ${totalExpense.toFixed(2)}€`, 14, finalY + 7);
  doc.setFontSize(14);
  doc.text(`Solde: ${balance.toFixed(2)}€`, 14, finalY + 17);

  // Télécharger
  doc.save(`rapport_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToCSV = (data, filename = 'export.csv', headers = []) => {
  if (data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // Générer les headers si pas fournis
  if (headers.length === 0) {
    headers = Object.keys(data[0]);
  }

  // Créer le contenu CSV
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Échapper les virgules et guillemets
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
