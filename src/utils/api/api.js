// src/utils/api/api.js - Updated with console logs
import { mockArticles } from './mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let savedArticles = [];

// Initialize with some test data
const initializeSavedArticles = () => {
  if (savedArticles.length === 0) {
    savedArticles = [
      {
        _id: '65f7368dfb74bd6a92114c01',
        title: 'AI Breakthrough: New Model Achieves Human-Level Understanding',
        text: 'Researchers have developed a revolutionary AI model...',
        date: '2026-07-11T10:30:00Z',
        url: 'https://example.com/ai-breakthrough',
        image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
        source: 'Tech Innovation Today',
        keyword: 'technology',
        owner: {
          _id: '65f7368dfb74bd6a92114c80',
          name: 'John Doe',
        },
        originalArticle: mockArticles[0],
      },
      {
        _id: '65f7368dfb74bd6a92114c02',
        title: 'New Study Reveals Health Benefits of Plant-Based Diets',
        text: 'A comprehensive 10-year study confirms significant health benefits...',
        date: '2026-07-10T22:45:00Z',
        url: 'https://example.com/health-study',
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
        source: 'Health Science Journal',
        keyword: 'health',
        owner: {
          _id: '65f7368dfb74bd6a92114c80',
          name: 'John Doe',
        },
        originalArticle: mockArticles[2],
      },
    ];
  }
};

initializeSavedArticles();

export function getItems() {
  console.log('getItems called, returning:', savedArticles);
  return new Promise((resolve, reject) => {
    delay(500).then(() => {
      const formattedArticles = savedArticles.map((article) => ({
        _id: article._id,
        title: article.title || 'Untitled Article',
        text: article.text || article.description || 'No description available',
        date: article.date || article.publishedAt || new Date().toISOString(),
        url: article.url || '#',
        image: article.image || article.urlToImage || '',
        source: article.source || article.source?.name || 'Unknown Source',
        keyword: article.keyword || 'general',
        owner: article.owner || {
          _id: '65f7368dfb74bd6a92114c80',
          name: 'John Doe',
        },
        originalArticle: article.originalArticle || article,
      }));
      console.log('Formatted articles:', formattedArticles);
      resolve(formattedArticles);
    });
  });
}

export function saveArticle(article) {
  console.log('saveArticle called with:', article);
  return new Promise((resolve, reject) => {
    delay(600).then(() => {
      // Check if article already exists
      const exists = savedArticles.some((saved) => saved.url === article.url);

      if (exists) {
        console.log('Article already exists');
        reject(new Error('Article already saved'));
        return;
      }

      // Create saved article with _id
      const savedArticle = {
        _id: '65f7368dfb74bd6a92114c' + Math.floor(Math.random() * 1000) + Date.now(),
        title: article.title || 'Untitled Article',
        text: article.text || article.description || 'No description available',
        date: article.date || article.publishedAt || new Date().toISOString(),
        url: article.url || '#',
        image: article.image || article.urlToImage || '',
        source: article.source || article.source?.name || 'Unknown Source',
        keyword: article.keyword || 'general',
        owner: {
          _id: '65f7368dfb74bd6a92114c80',
          name: 'John Doe',
        },
        originalArticle: article,
      };

      savedArticles.push(savedArticle);
      console.log('Article saved, new list:', savedArticles);
      resolve(savedArticle);
    });
  });
}

export function removeArticle(articleId) {
  console.log('removeArticle called with id:', articleId);
  return new Promise((resolve, reject) => {
    delay(400).then(() => {
      const index = savedArticles.findIndex((article) => article._id === articleId);

      if (index === -1) {
        console.log('Article not found');
        reject(new Error('Article not found'));
        return;
      }

      const removed = savedArticles.splice(index, 1);
      console.log('Article removed, remaining:', savedArticles);
      resolve({
        message: 'Article removed successfully',
        article: removed[0],
      });
    });
  });
}

// Add a function to get saved articles count
export function getSavedArticlesCount() {
  return savedArticles.length;
}

// Add a function to clear all saved articles (for testing)
export function clearSavedArticles() {
  return new Promise((resolve) => {
    delay(200).then(() => {
      savedArticles = [];
      console.log('All articles cleared');
      resolve({ message: 'All articles cleared' });
    });
  });
}
