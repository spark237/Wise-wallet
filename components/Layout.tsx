
import React, { useState } from 'react';
import { User, ViewName } from '../types';
import { 
  LayoutDashboard, 
  PieChart, 
  Wallet, 
  PiggyBank, 
  Download, 
  LogOut, 
  Menu, 
  X,
  Calculator as CalcIcon,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { Calculator } from './tools/Calculator';
import { CurrencyConverter } from './tools/CurrencyConverter';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentView, 
  onNavigate, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showConverter, setShowConverter] = useState(false);

  const navItems = [
    { id: 'dashboard' as ViewName, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'budgets' as ViewName, label: 'Budgets', icon: Wallet },
    { id: 'analytics' as ViewName, label: 'Analytics', icon: PieChart },
    { id: 'savings' as ViewName, label: 'Savings Goals', icon: PiggyBank },
    { id: 'export' as ViewName, label: 'Export Data', icon: Download },
    { id: 'support' as ViewName, label: 'Support', icon: HelpCircle },
  ];

  const handleNavClick = (view: ViewName) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
           <div className="bg-primary-600 p-1.5 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
           </div>
           <span className="font-bold text-xl text-slate-900 tracking-tight">Wise Wallet</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Tool Icons placed closely together */}
          <button onClick={() => setShowConverter(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setShowCalculator(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <CalcIcon size={20} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop) / Drawer (Mobile) */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
             <div className="bg-primary-600 p-1.5 rounded-lg text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
             </div>
             <span className="font-bold text-xl text-slate-900 tracking-tight">Wise Wallet</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={`mr-3 ${currentView === item.id ? 'text-primary-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

           {/* Desktop Tools Area (Bottom of Sidebar) */}
           <div className="px-4 py-4 hidden lg:block border-t border-slate-100">
             <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Tools</p>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setShowConverter(true)} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                  <RefreshCw size={20} className="mb-1" />
                  <span className="text-xs">Convert</span>
                </button>
                <button onClick={() => setShowCalculator(true)} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                  <CalcIcon size={20} className="mb-1" />
                  <span className="text-xs">Calc</span>
                </button>
             </div>
           </div>

          {/* User & Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center p-3 mb-2 rounded-lg bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                {(user.username || user.email).substring(0, 1).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user.username || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Tool Modals */}
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
      {showConverter && <CurrencyConverter onClose={() => setShowConverter(false)} />}
    </div>
  );
};
