
import { Category } from './types';

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Other Income'];
export const EXPENSE_CATEGORIES: Category[] = [
  'Groceries', 
  'Housing', 
  'Transport', 
  'Entertainment', 
  'Utilities', 
  'Savings', 
  'Other'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Salary': '#10b981', // Emerald 500
  'Other Income': '#34d399', // Emerald 400
  'Groceries': '#f43f5e', // Rose 500
  'Housing': '#3b82f6', // Blue 500
  'Transport': '#f59e0b', // Amber 500
  'Entertainment': '#8b5cf6', // Violet 500
  'Utilities': '#06b6d4', // Cyan 500
  'Savings': '#14b8a6', // Teal 500
  'Other': '#64748b', // Slate 500
};

export const APP_ID = 'wise-wallet-v1';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
];
