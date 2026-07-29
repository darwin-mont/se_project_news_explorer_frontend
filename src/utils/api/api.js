import { mockArticles } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get the current user ID from localStorage
const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // Try to get user data from localStorage
  try {
    const userData = localStorage.getItem('user_data_' + token);
    if (userData) {
      const user = JSON.parse(userData);
      return user._id;
    }
  } catch {
    return null;
  }
  return null;
};

// Get saved articles for the current user
const getSavedArticlesFromStorage = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const storageKey = `saved_articles_${userId}`;
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save articles for the current user
const saveArticlesToStorage = (articles) => {
  const userId = getCurrentUserId();
  if (!userId) return;

  const storageKey = `saved_articles_${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(articles));
};

// Initialize from localStorage for current user
let savedArticles = getSavedArticlesFromStorage();

// Get all saved articles for the current user
export function getItems() {
  return new Promise((resolve) => {
    delay(500).then(() => {
      // Refresh from localStorage to ensure latest data
      savedArticles = getSavedArticlesFromStorage();

      const formattedArticles = savedArticles.map((article) => ({
        _id: article._id,
        title: article.title || 'Untitled Article',
        text: article.text || article.description || 'No description available',
        date: article.date || article.publishedAt || new Date().toISOString(),
        url: article.url || '#',
        image: article.image || article.urlToImage || '',
        source: article.source || article.source?.name || 'Unknown Source',
        keyword: article.keyword || 'General',
        originalArticle: article.originalArticle || article,
      }));
      resolve(formattedArticles);
    });
  });
}

export function saveArticle(article) {
  return new Promise((resolve, reject) => {
    delay(600).then(() => {
      // Refresh from localStorage
      savedArticles = getSavedArticlesFromStorage();

      // Check if article already exists
      const exists = savedArticles.some((saved) => saved.url === article.url);

      if (exists) {
        reject(new Error('Article already saved'));
        return;
      }

      // Create saved article with _id
      const savedArticle = {
        _id: 'saved_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        title: article.title || 'Untitled Article',
        text: article.text || article.description || 'No description available',
        date: article.date || article.publishedAt || new Date().toISOString(),
        url: article.url || '#',
        image: article.image || article.urlToImage || '',
        source: article.source || article.source?.name || 'Unknown Source',
        keyword: article.keyword || 'General',
        searchTerm: article.searchTerm || article.keyword || 'General', // ✅ Add this line
        owner: {
          _id: getCurrentUserId() || 'unknown',
          name: 'User',
        },
        originalArticle: article,
      };

      savedArticles.push(savedArticle);
      saveArticlesToStorage(savedArticles);
      resolve(savedArticle);
    });
  });
}

export function removeArticle(articleId) {
  return new Promise((resolve, reject) => {
    delay(400).then(() => {
      // Refresh from localStorage
      savedArticles = getSavedArticlesFromStorage();

      const index = savedArticles.findIndex((article) => article._id === articleId);

      if (index === -1) {
        reject(new Error('Article not found'));
        return;
      }

      const removed = savedArticles.splice(index, 1)[0];
      saveArticlesToStorage(savedArticles);
      resolve({
        message: 'Article removed successfully',
        article: removed,
      });
    });
  });
}

// Get a specific article by ID
export function getArticleById(articleId) {
  return new Promise((resolve, reject) => {
    delay(300).then(() => {
      // Refresh from localStorage
      savedArticles = getSavedArticlesFromStorage();

      const article = savedArticles.find((article) => article._id === articleId);

      if (!article) {
        reject(new Error('Article not found'));
        return;
      }

      resolve(article);
    });
  });
}

export function clearSavedArticles() {
  return new Promise((resolve) => {
    delay(200).then(() => {
      savedArticles = [];
      saveArticlesToStorage(savedArticles);
      resolve({ message: 'All articles cleared' });
    });
  });
}

// Get count of saved articles for the current user
export function getSavedArticlesCount() {
  savedArticles = getSavedArticlesFromStorage();
  return savedArticles.length;
}

// Clear saved articles when user logs out
export function clearUserSavedArticles() {
  savedArticles = [];
}
