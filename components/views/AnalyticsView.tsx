
import React, { useMemo } from 'react';
import { Transaction, User } from '../../types';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

interface AnalyticsViewProps {
  user: User; // Added user for currency formatting
  transactions: Transaction[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ user, transactions }) => {
  
  // Prepare data for Monthly Income vs Expense
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; income: number; expense: number; dateVal: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const name = date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
      
      if (!data[key]) {
        data[key] = { name, income: 0, expense: 0, dateVal: date.getTime() };
      }
      
      if (t.type === 'Income') {
        data[key].income += t.amount;
      } else {
        data[key].expense += t.amount;
      }
    });

    // Sort chronologically
    return Object.values(data).sort((a, b) => a.dateVal - b.dateVal);
  }, [transactions]);

  // Calculate Cumulative Trend
  const cumulativeData = useMemo(() => {
    let runningBalance = 0;
    return monthlyData.map(item => {
      const net = item.income - item.expense;
      runningBalance += net;
      return {
        ...item,
        cumulative: runningBalance
      };
    });
  }, [monthlyData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500">Deep dive into your financial trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Income vs Expense Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Income vs Expenses</h3>
          <div className="h-[300px]">
             {monthlyData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={monthlyData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => formatCurrency(value, user.currency)} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value, user.currency), undefined]}
                   />
                   <Legend />
                   <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Not enough data yet</div>
             )}
          </div>
        </div>

        {/* Cumulative Net Balance Trend Area Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Net Balance Trend (Cumulative)</h3>
          <p className="text-xs text-slate-400 mb-4 -mt-4">Cumulative income minus expenses month over month</p>
          <div className="h-[300px]">
            {cumulativeData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={cumulativeData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => formatCurrency(value, user.currency)} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value, user.currency), 'Net Balance']}
                   />
                   <Area 
                    type="monotone" 
                    dataKey="cumulative"
                    name="Cumulative Balance"
                    stroke="#6366f1" 
                    fill="#e0e7ff" 
                    strokeWidth={2}
                   />
                 </AreaChart>
               </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Not enough data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
