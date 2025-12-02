
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User } from '../types';
import { CURRENCIES } from '../constants';
import { storageService } from '../services/storage';
import { Globe, Wallet, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isLogin) {
        // --- Login Flow ---
        
        // Strictly check if profile exists
        const storedProfile = storageService.getUserProfile(email);
        
        if (!storedProfile) {
          throw new Error("Account not found. Please sign up first.");
        }

        // In a real app, we would verify the password here.
        // For this demo, existence of the profile allows entry.
        
        // Restore user session
        localStorage.setItem('wise_wallet_user', JSON.stringify(storedProfile));
        onLogin(storedProfile);
        
      } else {
        // --- Sign Up Flow ---
        
        // Check if user already exists
        const existingProfile = storageService.getUserProfile(email);
        if (existingProfile) {
          throw new Error("Account already exists. Please log in.");
        }

        if (!username.trim()) {
           throw new Error("Username is required.");
        }

        // Generate a consistent, safe UID based on email
        const safeId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        const newUser: User = {
          uid: `user_${safeId}`,
          username: username.trim(),
          email: email,
          currency: currency,
        };

        // CRITICAL: Persist the new user profile to storage so it survives logout/refresh
        storageService.saveUserProfile(newUser);
        
        // Create active session
        localStorage.setItem('wise_wallet_user', JSON.stringify(newUser));
        
        onLogin(newUser);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    // Reset fields if needed, or keep email for convenience
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-105">
            <Wallet size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Wise Wallet</h1>
          <p className="text-slate-500 mt-2">Smart finance tracking made simple.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm text-center animate-[shake_0.5s_ease-in-out]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
             <div className="animate-[slideDown_0.2s_ease-out]">
                <Input 
                  label="Username" 
                  type="text" 
                  placeholder="e.g. Alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  icon={<UserIcon size={16} className="text-slate-400" />}
                />
             </div>
          )}

          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          
          {!isLogin && (
            <div className="animate-[slideDown_0.2s_ease-out]">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                Preferred Currency
              </label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none text-slate-700"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 ml-1">
                Your transactions and goals will use this currency.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode}
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
