import React, { useState, useEffect } from 'react';
import { TransactionType, Category, Transaction } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category>('Groceries');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update category when type changes to ensure valid category
  useEffect(() => {
    if (type === 'Income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setIsSubmitting(true);
    await onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date,
    });
    setIsSubmitting(false);
    onClose();
  };

  const categories = type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Add Transaction</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'Income' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setType('Income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                type === 'Expense' 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setType('Expense')}
            >
              Expense
            </button>
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="text-lg font-medium"
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="Description"
            type="text"
            placeholder="e.g. Weekly Groceries"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Save Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};