import {
  NEWS_API_BASE_URL,
  NEWS_API_KEY,
  ENDPOINTS,
  DEFAULT_PARAMS,
  getDateSevenDaysAgo,
  getTodayDate,
} from './config';
import { mockArticles } from './mockData';

const fetchFromNewsApi = async (endpoint, params = {}) => {
  const url = new URL(`${NEWS_API_BASE_URL}${endpoint}`);

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  try {
    console.log(`Fetching: ${url.toString()}`);

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
    console.error(' NewsAPI fetch error:', error);
    throw error;
  }
};

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
    articles: filtered.map((article) => ({
      ...article,
      searchTerm: query.trim(),
    })),
  };
};

// Helper function to capitalize first letter
const capitalizeFirst = (str) => {
  if (!str) return 'General';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Improved keyword extraction - only returns category names
const extractKeyword = (article) => {
  // Valid categories list
  const validCategories = [
    'technology',
    'science',
    'health',
    'business',
    'environment',
    'entertainment',
    'sports',
    'education',
    'politics',
    'world',
    'general',
  ];

  // Check for existing category fields
  if (article.category && validCategories.includes(article.category.toLowerCase())) {
    return capitalizeFirst(article.category);
  }
  if (article.section && validCategories.includes(article.section.toLowerCase())) {
    return capitalizeFirst(article.section);
  }
  if (article.keyword && validCategories.includes(article.keyword.toLowerCase())) {
    return capitalizeFirst(article.keyword);
  }

  // Check if source has a category
  if (article.source?.category && validCategories.includes(article.source.category.toLowerCase())) {
    return capitalizeFirst(article.source.category);
  }

  const sourceName = article.source?.name?.toLowerCase() || '';
  const sourceCategoryMap = {
    tech: 'Technology',
    innovation: 'Technology',
    science: 'Science',
    health: 'Health',
    medical: 'Health',
    business: 'Business',
    finance: 'Business',
    economy: 'Business',
    environment: 'Environment',
    nature: 'Environment',
    entertainment: 'Entertainment',
    sports: 'Sports',
    education: 'Education',
    politics: 'Politics',
    world: 'World',
  };

  for (const [sourceKeyword, category] of Object.entries(sourceCategoryMap)) {
    if (sourceName.includes(sourceKeyword)) {
      return category;
    }
  }

  return 'General';
};

export const searchNews = async (query, params = {}) => {
  if (!query || query.trim() === '') {
    throw new Error('Please enter a keyword');
  }

  if (!NEWS_API_KEY) {
    console.warn(' No API key found, falling back to mock data');
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
        ? data.articles.map((article, index) => {
            const keyword = extractKeyword(article);
            return {
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
              keyword: keyword,
              searchTerm: query.trim(),
            };
          })
        : [],
    };
  } catch (error) {
    console.error('Search API error:', error);
    console.warn('Falling back to mock data for search');
    return searchNewsMock(query);
  }
};

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
        ? data.articles.map((article, index) => {
            const keyword = extractKeyword(article);
            return {
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
              keyword: keyword,
            };
          })
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

export function getApiStatus() {
  return {
    hasKey: !!NEWS_API_KEY && NEWS_API_KEY !== '',
    keyPreview: NEWS_API_KEY ? `${NEWS_API_KEY.substring(0, 8)}...` : 'No key',
    isUsingRealApi: !!NEWS_API_KEY && NEWS_API_KEY !== '',
    baseUrl: NEWS_API_BASE_URL,
  };
}

const newsApi = {
  searchNews,
  getTopHeadlines,
  getApiStatus,
};

export default newsApi;
