
import { Transaction, User, Budget, SavingsGoal } from '../types';
import { APP_ID } from '../constants';

// NOTE: In a real production environment with valid Firebase keys, 
// this would be replaced by the actual Firestore SDK methods.
// For this demo, we use LocalStorage to ensure the app works immediately 
// for the user without requiring external configuration.

const getTxKey = (userId: string) => `artifacts/${APP_ID}/users/${userId}/transactions`;
const getBudgetsKey = (userId: string) => `artifacts/${APP_ID}/users/${userId}/budgets`;
const getSavingsKey = (userId: string) => `artifacts/${APP_ID}/users/${userId}/savings`;
const PROFILES_KEY = `artifacts/${APP_ID}/profiles`;

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const storageService = {
  // Utility
  generateId,

  // --- User Profiles (Persistence) ---
  saveUserProfile: (user: User) => {
    try {
      const profilesStr = localStorage.getItem(PROFILES_KEY);
      const profiles = profilesStr ? JSON.parse(profilesStr) : {};
      profiles[user.email] = user;
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error("Failed to save user profile", e);
    }
  },

  getUserProfile: (email: string): User | null => {
    try {
      const profilesStr = localStorage.getItem(PROFILES_KEY);
      const profiles = profilesStr ? JSON.parse(profilesStr) : {};
      return profiles[email] || null;
    } catch (e) {
      console.error("Failed to get user profile", e);
      return null;
    }
  },

  // --- Transactions ---
  subscribeToTransactions: (user: User, callback: (data: Transaction[]) => void) => {
    const key = getTxKey(user.uid);
    
    const loadData = () => {
      try {
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : [];
        // Sort by date descending
        data.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());
        callback(data);
      } catch (e) {
        console.error("Failed to load transactions", e);
        callback([]);
      }
    };

    loadData();

    const handleStorageChange = (e: StorageEvent) => { if (e.key === key) loadData(); };
    const handleLocalChange = () => loadData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleLocalChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleLocalChange);
    };
  },

  addTransaction: async (user: User, transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const key = getTxKey(user.uid);
    const stored = localStorage.getItem(key);
    const currentData: Transaction[] = stored ? JSON.parse(stored) : [];

    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      timestamp: Date.now(),
    };

    const newData = [newTransaction, ...currentData];
    localStorage.setItem(key, JSON.stringify(newData));
    window.dispatchEvent(new Event('local-storage-update'));
    
    return newTransaction;
  },

  deleteTransaction: async (user: User, id: string) => {
    const key = getTxKey(user.uid);
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const currentData: Transaction[] = JSON.parse(stored);
    const newData = currentData.filter(t => t.id !== id);
    localStorage.setItem(key, JSON.stringify(newData));

    window.dispatchEvent(new Event('local-storage-update'));
  },

  // --- Budgets ---
  subscribeToBudgets: (user: User, callback: (data: Budget[]) => void) => {
    const key = getBudgetsKey(user.uid);
    const loadData = () => {
      try {
        const stored = localStorage.getItem(key);
        callback(stored ? JSON.parse(stored) : []);
      } catch (e) { callback([]); }
    };
    loadData();
    const handler = () => loadData();
    window.addEventListener('local-storage-budgets-update', handler);
    return () => window.removeEventListener('local-storage-budgets-update', handler);
  },

  saveBudget: async (user: User, budget: Budget) => {
    const key = getBudgetsKey(user.uid);
    const stored = localStorage.getItem(key);
    let budgets: Budget[] = stored ? JSON.parse(stored) : [];
    
    // Update existing or add new
    const existingIndex = budgets.findIndex(b => b.category === budget.category);
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    
    localStorage.setItem(key, JSON.stringify(budgets));
    window.dispatchEvent(new Event('local-storage-budgets-update'));
  },

  deleteBudget: async (user: User, category: string) => {
    const key = getBudgetsKey(user.uid);
    const stored = localStorage.getItem(key);
    if (!stored) return;
    let budgets: Budget[] = JSON.parse(stored);
    budgets = budgets.filter(b => b.category !== category);
    localStorage.setItem(key, JSON.stringify(budgets));
    window.dispatchEvent(new Event('local-storage-budgets-update'));
  },

  // --- Savings Goals ---
  subscribeToSavings: (user: User, callback: (data: SavingsGoal[]) => void) => {
    const key = getSavingsKey(user.uid);
    const loadData = () => {
      try {
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : [];
        callback(data);
      } catch (e) { 
        console.error("Error loading savings", e);
        callback([]); 
      }
    };
    // Initial load
    loadData();
    
    // Listen for updates
    const handler = () => loadData();
    window.addEventListener('local-storage-savings-update', handler);
    return () => window.removeEventListener('local-storage-savings-update', handler);
  },

  saveSavingsGoal: async (user: User, goal: SavingsGoal) => {
    const key = getSavingsKey(user.uid);
    const stored = localStorage.getItem(key);
    let goals: SavingsGoal[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = goals.findIndex(g => g.id === goal.id);
    if (existingIndex >= 0) {
      goals[existingIndex] = goal;
    } else {
      goals.push(goal);
    }
    
    localStorage.setItem(key, JSON.stringify(goals));
    window.dispatchEvent(new Event('local-storage-savings-update'));
  },

  deleteSavingsGoal: async (user: User, id: string) => {
    const key = getSavingsKey(user.uid);
    const stored = localStorage.getItem(key);
    if (!stored) return;
    
    try {
      const goals: SavingsGoal[] = JSON.parse(stored);
      // Ensure we compare strings to avoid potential type coercion issues
      const newGoals = goals.filter(g => String(g.id) !== String(id));
      
      localStorage.setItem(key, JSON.stringify(newGoals));
      
      // Dispatch event to trigger subscribers and sync UI
      window.dispatchEvent(new Event('local-storage-savings-update'));
    } catch (e) {
      console.error("Error deleting savings goal", e);
    }
  }
};
