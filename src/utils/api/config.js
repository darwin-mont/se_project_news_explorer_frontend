export const BASE_URL = import.meta.env.VITE_API_URL || 'https://newsapi.org/v2';
export const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const isProduction = import.meta.env.PROD || process.env.NODE_ENV === 'production';

// Use the proxy URL in production, direct URL in development
export const NEWS_API_BASE_URL = isProduction
  ? 'https://nomoreparties.co/news/v2' // Production proxy URL
  : 'https://newsapi.org/v2'; // Development direct URL

export const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

// API Endpoints
export const ENDPOINTS = {
  EVERYTHING: '/everything',
  TOP_HEADLINES: '/top-headlines',
};

// Default parameters
export const DEFAULT_PARAMS = {
  pageSize: 100, // Max for free version
  language: 'en',
  sortBy: 'relevancy',
};

// Helper to get date 7 days ago
export const getDateSevenDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper to get current date
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
};
