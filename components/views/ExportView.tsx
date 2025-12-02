import React from 'react';
import { Transaction } from '../../types';
import { Button } from '../ui/Button';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

interface ExportViewProps {
  transactions: Transaction[];
}

export const ExportView: React.FC<ExportViewProps> = ({ transactions }) => {

  const downloadCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wise-wallet-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wise-wallet-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Export Data</h1>
        <p className="text-slate-500">Download your financial data for external use.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:border-primary-200 transition-colors">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-2">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Export as CSV</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Best for viewing in Excel, Google Sheets, or Numbers. Includes all transaction details.
          </p>
          <Button onClick={downloadCSV} variant="secondary" className="w-full max-w-[200px]">
            <Download size={16} className="mr-2" />
            Download CSV
          </Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:border-primary-200 transition-colors">
          <div className="p-4 bg-amber-50 rounded-full text-amber-600 mb-2">
            <FileJson size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Export as JSON</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Raw data format. Useful for developers or importing into other software.
          </p>
          <Button onClick={downloadJSON} variant="secondary" className="w-full max-w-[200px]">
            <Download size={16} className="mr-2" />
            Download JSON
          </Button>
        </div>
      </div>
    </div>
  );
};