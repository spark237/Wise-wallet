
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Transaction, User, ExpenseSummary } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { formatCurrency } from '../utils/format';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus, Trash2, Sparkles } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { storageService } from '../services/storage';
import { getFinancialAdvice } from '../services/gemini';
import { Button } from './ui/Button';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  const [showForm, setShowForm] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Derived State (Real-time calculations)
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'Income') {
          acc.income += t.amount;
        } else {
          acc.expense += t.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const expenseBreakdown: ExpenseSummary[] = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalExpense === 0) return [];

    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory).map(([category, amount]: [string, number]) => ({
      category: category as any,
      amount,
      percentage: (amount / totalExpense) * 100,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const handleAddTransaction = async (data: any) => {
    await storageService.addTransaction(user, data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await storageService.deleteTransaction(user, id);
    }
  };

  const handleGetAdvice = async () => {
    setIsLoadingAdvice(true);
    setAiAdvice(null);
    const advice = await getFinancialAdvice(transactions);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {user.username || 'Friend'}</h1>
          <p className="text-slate-500">Here's your financial overview for this month.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={handleGetAdvice} disabled={isLoadingAdvice || transactions.length === 0}>
             <Sparkles size={16} className={`mr-2 ${isLoadingAdvice ? 'animate-pulse' : 'text-violet-600'}`} />
             {isLoadingAdvice ? 'Analyzing...' : 'Wise Insights'}
           </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* AI Advice Section */}
      {aiAdvice && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm text-violet-600">
               <Sparkles size={20} />
             </div>
             <div className="space-y-2">
               <h3 className="font-semibold text-indigo-900">AI Financial Advisor</h3>
               <div className="prose prose-indigo prose-sm text-indigo-800">
                 {aiAdvice.split('\n').map((line, i) => (
                    line.trim() && <p key={i} className="mb-1">{line}</p>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Balance</p>
            <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatCurrency(balance, user.currency)}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
            <Wallet size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              +{formatCurrency(totals.income, user.currency)}
            </p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
            <ArrowUpCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold mt-1 text-rose-600">
              -{formatCurrency(totals.expense, user.currency)}
            </p>
          </div>
          <div className="bg-rose-50 p-3 rounded-full text-rose-600">
            <ArrowDownCircle size={24} />
          </div>
        </div>
      </div>

      {/* Charts & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending Breakdown</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value, user.currency)}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400">
                <p>No expenses to visualize yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
            {transactions.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No transactions found. Add one to get started!</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="group flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      t.type === 'Income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {t.type === 'Income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{t.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{t.category}</span>
                        <span>•</span>
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount, user.currency)}
                    </span>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} onSubmit={handleAddTransaction} />
      )}
    </div>
  );
};
