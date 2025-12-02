
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { BudgetsView } from './components/views/BudgetsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SavingsView } from './components/views/SavingsView';
import { ExportView } from './components/views/ExportView';
import { SupportView } from './components/views/SupportView';
import { User, Transaction, ViewName } from './types';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');

  // Check for persisted session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('wise_wallet_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthChecking(false);
  }, []);

  // Subscribe to transaction updates when user is logged in
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const unsubscribe = storageService.subscribeToTransactions(user, (data) => {
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('wise_wallet_user');
    setUser(null);
    setCurrentView('dashboard');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && <Dashboard user={user} transactions={transactions} />}
      {currentView === 'budgets' && <BudgetsView user={user} transactions={transactions} />}
      {currentView === 'analytics' && <AnalyticsView user={user} transactions={transactions} />}
      {currentView === 'savings' && <SavingsView user={user} />}
      {currentView === 'export' && <ExportView transactions={transactions} />}
      {currentView === 'support' && <SupportView />}
    </Layout>
  );
};

export default App;
