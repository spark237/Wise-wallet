
import React, { useState, useEffect } from 'react';
import { Budget, Transaction, User } from '../../types';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../../constants';
import { storageService } from '../../services/storage';
import { formatCurrency } from '../../utils/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit2 } from 'lucide-react';

interface BudgetsViewProps {
  user: User;
  transactions: Transaction[];
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({ user, transactions }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null); // category being edited
  const [editLimit, setEditLimit] = useState<string>('');
  
  // Calculate spent amount for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const spendingByCategory = transactions.reduce((acc, t) => {
    const tDate = new Date(t.date);
    if (t.type === 'Expense' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const unsubscribe = storageService.subscribeToBudgets(user, setBudgets);
    return () => unsubscribe();
  }, [user]);

  const handleSaveBudget = async (category: string) => {
    const limit = parseFloat(editLimit);
    if (isNaN(limit) || limit <= 0) return;
    
    await storageService.saveBudget(user, { category: category as any, limit });
    setIsEditing(null);
    setEditLimit('');
  };

  const startEdit = (category: string, currentLimit?: number) => {
    setIsEditing(category);
    setEditLimit(currentLimit ? currentLimit.toString() : '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Budgets</h1>
          <p className="text-slate-500">Set limits for your spending categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPENSE_CATEGORIES.map((category) => {
          const budget = budgets.find(b => b.category === category);
          const spent = spendingByCategory[category] || 0;
          const limit = budget?.limit || 0;
          const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOverBudget = spent > limit && limit > 0;
          const color = CATEGORY_COLORS[category];

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 rounded-full" style={{ backgroundColor: color }}></div>
                  <h3 className="font-semibold text-slate-900">{category}</h3>
                </div>
                {isEditing === category ? (
                  <div className="flex items-center gap-2">
                     <button onClick={() => setIsEditing(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => startEdit(category, limit)} 
                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {limit > 0 ? <Edit2 size={16} /> : <Plus size={16} />}
                  </button>
                )}
              </div>

              <div className="flex-1">
                {isEditing === category ? (
                  <div className="flex gap-2 items-end">
                    <Input 
                      autoFocus
                      label={`Monthly Limit (${user.currency})`}
                      type="number" 
                      value={editLimit} 
                      onChange={e => setEditLimit(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button onClick={() => handleSaveBudget(category)} className="mb-[2px]">Save</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className={`text-2xl font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
                        {formatCurrency(spent, user.currency)}
                      </span>
                      <span className="text-sm text-slate-500">
                        of {formatCurrency(limit, user.currency)}
                      </span>
                    </div>

                    {limit > 0 ? (
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-primary-500'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 mt-2">No budget set</p>
                    )}
                    
                    {limit > 0 && (
                      <p className="text-xs text-slate-400 mt-2 text-right">
                        {percentage.toFixed(0)}% used
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
