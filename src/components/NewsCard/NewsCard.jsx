// src/components/NewsCard/NewsCard.jsx
import React, { useState } from 'react';
import './NewsCard.css';
import bookmarkNormal from '../../assets/icons/bookmark-normal.svg';
import bookmarkMarked from '../../assets/icons/bookmark-marked.svg';
import bookmarkHover from '../../assets/icons/bookmark-hover.svg';
import deleteIcon from '../../assets/icons/delete.svg';

function NewsCard({ article, isLoggedIn, isSaved, onSave, variant = 'default' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Handle save/delete button click
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      onSave();
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    if (!isLoggedIn) {
      setShowTooltip(true);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setIsHovered(false);
  };

  const isDeleteVariant = variant === 'delete';

  // ✅ Get keyword from article
  const getKeyword = () => {
    if (article.keyword) return article.keyword;
    if (article.originalArticle?.keyword) return article.originalArticle.keyword;
    if (article.section) return article.section;
    if (article.category) return article.category;
    const titleWords = article.title?.split(' ') || [];
    if (titleWords.length > 0) {
      return titleWords.slice(0, 2).join(' ');
    }
    return 'News';
  };

  // Determine which bookmark icon to show
  const getBookmarkIcon = () => {
    if (isSaved) return bookmarkMarked;
    if (isHovered && isLoggedIn) return bookmarkHover;
    return bookmarkNormal;
  };

  return (
    <article className="news-card">
      <div className="news-card__image-wrapper">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title || 'News article'}
            className="news-card__image"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60';
            }}
          />
        ) : (
          <div className="news-card__image-placeholder">
            <span>📰</span>
          </div>
        )}
        {isDeleteVariant && <div className="news-card__keyword">{getKeyword()}</div>}

        <div
          className={`news-card__save-icon ${isSaved && !isDeleteVariant ? 'news-card__save-icon_saved' : ''} ${!isLoggedIn ? 'news-card__save-icon_inactive' : ''} ${isDeleteVariant ? 'news-card__save-icon_delete' : ''}`}
          onClick={handleSaveClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label={
            isDeleteVariant ? 'Remove from saved' : isSaved ? 'Remove from saved' : 'Save article'
          }
          title={
            !isLoggedIn
              ? 'Sign in to save articles'
              : isDeleteVariant
                ? 'Remove from saved'
                : isSaved
                  ? 'Remove from saved'
                  : 'Save article'
          }
        >
          {isDeleteVariant ? (
            <img src={deleteIcon} alt="Delete" className="news-card__icon news-card__icon_delete" />
          ) : (
            <img
              src={getBookmarkIcon()}
              alt="Save"
              className={`news-card__icon ${
                isSaved
                  ? 'news-card__icon_marked'
                  : isHovered && isLoggedIn
                    ? 'news-card__icon_hover'
                    : 'news-card__icon_normal'
              }`}
            />
          )}

          {isLoggedIn && (
            <div className="news-card__tooltip">
              {isDeleteVariant
                ? 'Remove from saved'
                : isSaved
                  ? 'Remove from saved'
                  : 'Save article'}
            </div>
          )}
          {!isLoggedIn && showTooltip && (
            <div className="news-card__tooltip">Sign in to save articles</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="news-card__content">
        <p className="news-card__date">{formatDate(article.publishedAt)}</p>
        <h3 className="news-card__title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title || 'Untitled Article'}
          </a>
        </h3>
        <p className="news-card__description">{truncateDescription(article.description)}</p>
        <p className="news-card__source">{article.source?.name || 'Unknown Source'}</p>
      </div>
    </article>
  );
}

export default NewsCard;
