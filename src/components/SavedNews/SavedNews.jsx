// src/components/SavedNews/SavedNews.jsx
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import './SavedNews.css';

function SavedNews({ savedArticles, currentUser, onRemoveArticle }) {
  const totalArticles = savedArticles.length;

  return (
    <section className="saved-news">
      {totalArticles > 0 ? (
        <div className="saved-news__list">
          {savedArticles.map((article) => {
            const articleData = article.originalArticle || article;
            return (
              <NewsCard
                key={article._id || article.id || Math.random()}
                article={articleData}
                isLoggedIn={true}
                isSaved={true}
                onSave={() => onRemoveArticle(article._id || article.id)}
                variant="delete"
              />
            );
          })}
        </div>
      ) : (
        <div className="saved-news__empty">
          <p>📭 No saved articles yet.</p>
          <p>Start exploring news and save your favorites!</p>
        </div>
      )}
    </section>
  );
}

export default SavedNews;
