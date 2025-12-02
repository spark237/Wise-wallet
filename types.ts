
export type TransactionType = 'Income' | 'Expense';

export type Category = 
  | 'Salary' 
  | 'Other Income' 
  | 'Groceries' 
  | 'Housing' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Savings' 
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
  timestamp: number;
}

export interface User {
  uid: string;
  username: string;
  email: string;
  currency: string;
}

export interface ExpenseSummary {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string; // Hex color
  deadline?: string;
}

export type ViewName = 'dashboard' | 'budgets' | 'analytics' | 'savings' | 'export' | 'support';
