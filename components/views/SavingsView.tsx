
import React, { useState, useEffect } from 'react';
import { SavingsGoal, User } from '../../types';
import { storageService } from '../../services/storage';
import { formatCurrency } from '../../utils/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Target, PiggyBank, PartyPopper } from 'lucide-react';

interface SavingsViewProps {
  user: User;
}

export const SavingsView: React.FC<SavingsViewProps> = ({ user }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    // Clean subscription: subscribeToSavings handles the initial load internally.
    // We only need to call it once and clean up the returned unsubscribe function.
    const unsubscribe = storageService.subscribeToSavings(user, setGoals);
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;

    const newGoal: SavingsGoal = {
      id: storageService.generateId(),
      name,
      targetAmount: parseFloat(target),
      currentAmount: parseFloat(current) || 0,
      color
    };

    await storageService.saveSavingsGoal(user, newGoal);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Critical: Prevent click from opening modal or triggering other effects
    
    if (window.confirm('Delete this savings goal?')) {
      // 1. Optimistic update: Remove from UI immediately for instant feedback
      const updatedGoals = goals.filter(g => g.id !== id);
      setGoals(updatedGoals);
      
      // 2. Persist deletion in storage
      try {
        await storageService.deleteSavingsGoal(user, id);
      } catch (error) {
        console.error("Failed to delete goal", error);
        // If deletion fails, we might want to reload to sync state,
        // but typically the subscription will handle eventual consistency.
      }
    }
  };

  const handleUpdateAmount = async (e: React.MouseEvent, goal: SavingsGoal, amount: number) => {
    e.stopPropagation();
    const updatedGoal = { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) };
    
    // Optimistic update
    setGoals(prev => prev.map(g => g.id === goal.id ? updatedGoal : g));
    
    await storageService.saveSavingsGoal(user, updatedGoal);
  };

  const resetForm = () => {
    setName('');
    setTarget('');
    setCurrent('');
    setColor('#6366f1');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Savings Goals</h1>
          <p className="text-slate-500">Track your progress towards financial targets.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} className="mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 && !showForm && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
            <PiggyBank size={48} className="mb-4 opacity-50" />
            <p>No savings goals yet. Create one to start saving!</p>
          </div>
        )}

        {goals.map((goal) => {
          const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const isCompleted = percentage >= 100;

          return (
            <div key={goal.id} className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col group transition-all hover:shadow-md">
              
              {isCompleted && (
                 <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                 </div>
              )}

              <div className="flex justify-between items-start mb-4 z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                     {isCompleted ? <PartyPopper size={20} className="animate-bounce" /> : <Target size={20} style={{ color: goal.color }} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{goal.name}</h3>
                    <p className="text-xs text-slate-500">Target: {formatCurrency(goal.targetAmount, user.currency)}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, goal.id)} 
                  className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-md hover:bg-rose-50 -mr-2 -mt-2"
                  title="Delete Goal"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-4 z-10">
                <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">{formatCurrency(goal.currentAmount, user.currency)}</span>
                     <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>{percentage.toFixed(0)}%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : ''}`}
                        style={{ width: `${percentage}%`, backgroundColor: isCompleted ? undefined : goal.color }}
                      ></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                   <Button variant="secondary" className="text-xs h-8" onClick={(e) => handleUpdateAmount(e, goal, 10)}>+ {formatCurrency(10, user.currency)}</Button>
                   <Button variant="secondary" className="text-xs h-8" onClick={(e) => handleUpdateAmount(e, goal, 100)}>+ {formatCurrency(100, user.currency)}</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Create Savings Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Goal Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. New Car" />
              <Input label={`Target Amount (${user.currency})`} type="number" value={target} onChange={e => setTarget(e.target.value)} required placeholder="5000" />
              <Input label={`Current Saved (${user.currency})`} type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="0" />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color Tag</label>
                <div className="flex gap-2">
                  {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'].map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Create Goal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
