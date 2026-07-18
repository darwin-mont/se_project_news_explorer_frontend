// src/utils/api/newsApi.js
import {
  NEWS_API_BASE_URL,
  NEWS_API_KEY,
  ENDPOINTS,
  DEFAULT_PARAMS,
  getDateSevenDaysAgo,
  getTodayDate,
} from './config';
import { mockArticles } from './mockData';

// Helper function to make API calls
const fetchFromNewsApi = async (endpoint, params = {}) => {
  const url = new URL(`${NEWS_API_BASE_URL}${endpoint}`);

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  try {
    console.log(`📡 Fetching: ${url.toString()}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'API returned an error');
    }

    return data;
  } catch (error) {
    console.error('NewsAPI fetch error:', error);
    throw error;
  }
};

// Search for news with proper parameters
export const searchNews = async (query, params = {}) => {
  if (!query || query.trim() === '') {
    throw new Error('Please enter a keyword');
  }

  if (!NEWS_API_KEY) {
    console.warn('No API key found, falling back to mock data');
    return searchNewsMock(query);
  }

  try {
    const searchParams = {
      q: query.trim(),
      from: getDateSevenDaysAgo(),
      to: getTodayDate(),
      pageSize: DEFAULT_PARAMS.pageSize,
      language: DEFAULT_PARAMS.language,
      sortBy: DEFAULT_PARAMS.sortBy,
      apiKey: NEWS_API_KEY,
      ...params,
    };

    const data = await fetchFromNewsApi(ENDPOINTS.EVERYTHING, searchParams);

    return {
      status: 'ok',
      totalResults: data.totalResults || 0,
      articles: data.articles
        ? data.articles.map((article, index) => ({
            id: index + 1,
            _id: `news_${Date.now()}_${index}`,
            title: article.title || 'No title',
            description: article.description || 'No description available',
            url: article.url || '#',
            urlToImage:
              article.urlToImage ||
              'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: {
              name: article.source?.name || 'Unknown Source',
              id: article.source?.id || 'unknown',
            },
            author: article.author || 'Unknown Author',
            content: article.content || '',
            keyword: 'search',
          }))
        : [],
    };
  } catch (error) {
    console.error('Search API error:', error);
    console.warn('Falling back to mock data for search');
    return searchNewsMock(query);
  }
};

// Mock search fallback
const searchNewsMock = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const searchTerm = query.toLowerCase().trim();
  const filtered = mockArticles.filter((article) => {
    return (
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      (article.content && article.content.toLowerCase().includes(searchTerm))
    );
  });

  return {
    status: 'ok',
    totalResults: filtered.length,
    articles: filtered,
  };
};

// Get top headlines
export const getTopHeadlines = async (params = {}) => {
  if (!NEWS_API_KEY) {
    console.warn('No API key found, using mock data');
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
    };
  }

  try {
    const searchParams = {
      country: 'us',
      pageSize: DEFAULT_PARAMS.pageSize,
      apiKey: NEWS_API_KEY,
      ...params,
    };

    const data = await fetchFromNewsApi(ENDPOINTS.TOP_HEADLINES, searchParams);

    return {
      status: 'ok',
      totalResults: data.totalResults || 0,
      articles: data.articles
        ? data.articles.map((article, index) => ({
            id: index + 1,
            _id: `news_${Date.now()}_${index}`,
            title: article.title || 'No title',
            description: article.description || 'No description available',
            url: article.url || '#',
            urlToImage:
              article.urlToImage ||
              'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: {
              name: article.source?.name || 'Unknown Source',
              id: article.source?.id || 'unknown',
            },
            author: article.author || 'Unknown Author',
            content: article.content || '',
            keyword: 'headlines',
          }))
        : [],
    };
  } catch (error) {
    console.error('Top headlines API error:', error);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
    };
  }
};

// ✅ ADD THIS - Get API status
export const getApiStatus = () => {
  return {
    hasKey: !!NEWS_API_KEY && NEWS_API_KEY !== '',
    keyPreview: NEWS_API_KEY ? `${NEWS_API_KEY.substring(0, 8)}...` : 'No key',
    isUsingRealApi: !!NEWS_API_KEY && NEWS_API_KEY !== '',
    baseUrl: NEWS_API_BASE_URL,
  };
};

// ✅ ADD THIS - Check if real API is configured
export const isRealApiConfigured = () => {
  return !!NEWS_API_KEY && NEWS_API_KEY !== '';
};

// ✅ ADD THIS - Get news by category
export const getNewsByCategory = async (category, params = {}) => {
  if (!NEWS_API_KEY) {
    console.warn('No API key found, using mock data for category');
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = mockArticles;
    if (category && category !== 'all') {
      const categoryMap = {
        technology: ['technology', 'tech', 'software', 'ai', 'digital'],
        science: ['science', 'space', 'research', 'discovery'],
        health: ['health', 'medical', 'wellness', 'diet'],
        business: ['business', 'economy', 'finance', 'market'],
        environment: ['environment', 'climate', 'sustainable', 'green'],
        entertainment: ['entertainment', 'celebrity', 'movie', 'music'],
        sports: ['sports', 'athletics', 'game', 'tournament'],
      };
      const keywords = categoryMap[category] || [category];
      filtered = mockArticles.filter((article) => {
        const text =
          `${article.title} ${article.description} ${article.keyword || ''}`.toLowerCase();
        return keywords.some((keyword) => text.includes(keyword));
      });
    }
    return {
      status: 'ok',
      totalResults: filtered.length,
      articles: filtered,
    };
  }

  try {
    const searchParams = {
      category: category,
      country: 'us',
      pageSize: DEFAULT_PARAMS.pageSize,
      apiKey: NEWS_API_KEY,
      ...params,
    };

    const data = await fetchFromNewsApi(ENDPOINTS.TOP_HEADLINES, searchParams);

    return {
      status: 'ok',
      totalResults: data.totalResults || 0,
      articles: data.articles
        ? data.articles.map((article, index) => ({
            id: index + 1,
            _id: `news_${Date.now()}_${index}`,
            title: article.title || 'No title',
            description: article.description || 'No description available',
            url: article.url || '#',
            urlToImage:
              article.urlToImage ||
              'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: {
              name: article.source?.name || 'Unknown Source',
              id: article.source?.id || 'unknown',
            },
            author: article.author || 'Unknown Author',
            content: article.content || '',
            keyword: category,
          }))
        : [],
    };
  } catch (error) {
    console.error('Category API error:', error);
    // Fallback to mock data
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      status: 'ok',
      totalResults: mockArticles.length,
      articles: mockArticles,
    };
  }
};
