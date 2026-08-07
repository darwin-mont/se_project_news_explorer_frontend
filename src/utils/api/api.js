import { mockArticles } from './mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const userData = localStorage.getItem('user_data_' + token);
    if (userData) {
      const user = JSON.parse(userData);
      return user._id;
    }
  } catch {
    return null;
  }
};

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

export function getItems() {
  return new Promise((resolve) => {
    delay(500).then(() => {
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
        searchTerm: article.searchTerm || article.keyword || 'General', //
        originalArticle: article.originalArticle || article,
      }));
      resolve(formattedArticles);
    });
  });
}

export function saveArticle(article) {
  return new Promise((resolve, reject) => {
    delay(600).then(() => {
      savedArticles = getSavedArticlesFromStorage();

      const exists = savedArticles.some((saved) => saved.url === article.url);

      if (exists) {
        reject(new Error('Article already saved'));
        return;
      }

      const savedArticle = {
        _id: 'saved_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        title: article.title || 'Untitled Article',
        text: article.text || article.description || 'No description available',
        date: article.date || article.publishedAt || new Date().toISOString(),
        url: article.url || '#',
        image: article.image || article.urlToImage || '',
        source: article.source || article.source?.name || 'Unknown Source',
        keyword: article.keyword || 'General',
        searchTerm: article.searchTerm || article.keyword || 'General',
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

// Remove an article
export function removeArticle(articleId) {
  return new Promise((resolve, reject) => {
    delay(400).then(() => {
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

// Clear all saved articles
export function clearSavedArticles() {
  return new Promise((resolve) => {
    delay(200).then(() => {
      savedArticles = [];
      saveArticlesToStorage(savedArticles);
      resolve({ message: 'All articles cleared' });
    });
  });
}

// Get count of saved articles
export function getSavedArticlesCount() {
  savedArticles = getSavedArticlesFromStorage();
  return savedArticles.length;
}

// Clear saved articles when user logs out
export function clearUserSavedArticles() {
  savedArticles = [];
}
