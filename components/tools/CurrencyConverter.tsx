
import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { CURRENCIES } from '../../constants';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CurrencyConverterProps {
  onClose: () => void;
}

// Mock exchange rates (relative to USD) for demo purposes
const RATES: Record<string, number> = {
  'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 150.5, 'CAD': 1.35,
  'AUD': 1.53, 'INR': 83.1, 'CNY': 7.19, 'BRL': 4.97, 'MXN': 17.05,
  'KRW': 1330, 'RUB': 92.5, 'ZAR': 19.1, 'NGN': 1500, 'XAF': 605.50
};

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<string>('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  const result = (() => {
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    const rate = (RATES[to] || 1) / (RATES[from] || 1);
    return val * rate;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-semibold">Currency Converter</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
               <select 
                value={from} 
                onChange={e => setFrom(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
               >
                 {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
               </select>
            </div>
            
            <div className="pt-5">
              <ArrowRightLeft size={16} className="text-slate-400" />
            </div>

            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
               <select 
                value={to} 
                onChange={e => setTo(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
               >
                 {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
               </select>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-xl text-center">
            <p className="text-sm text-primary-600 mb-1">Converted Amount</p>
            <p className="text-3xl font-bold text-primary-700">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: to }).format(result)}
            </p>
            <p className="text-xs text-primary-400 mt-2">
              1 {from} ≈ {((RATES[to] || 1) / (RATES[from] || 1)).toFixed(4)} {to}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
