import React from 'react';
import Navigation from '../Navigation/Navigation';
import SearchForm from '../SearchForm/SearchForm';
import './Header.css';

function Header({
  isLoggedIn,
  onLogin,
  onLogout,
  currentUser,
  currentPath,
  onSearch,
  isLoading,
  savedArticles,
  totalArticles,
}) {
  const isHomePage = currentPath === '/';
  const isSavedNewsPage = currentPath === '/saved-news';

  const getUniqueKeywords = () => {
    const keywords = savedArticles
      .map((article) => {
        if (article.searchTerm) return article.searchTerm;
        if (article.originalArticle?.searchTerm) return article.originalArticle.searchTerm;

        if (article.keyword) return article.keyword;
        if (article.originalArticle?.keyword) return article.originalArticle.keyword;

        const titleWords = article.title?.split(' ') || [];
        if (titleWords.length > 0) {
          return titleWords.slice(0, 2).join(' ');
        }
        return 'General';
      })
      .filter(Boolean);

    const unique = [...new Set(keywords)];
    return unique.slice(0, 3);
  };

  const keywords = getUniqueKeywords();
  const keywordCount = savedArticles.length - keywords.length;

  return (
    <header
      className={`header ${isSavedNewsPage ? 'header_saved' : ''} ${!isHomePage && !isSavedNewsPage ? 'header_dark' : ''}`}
    >
      <div className="header__container">
        <Navigation
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}
          onLogout={onLogout}
          currentUser={currentUser}
          isDark={isSavedNewsPage || !isHomePage}
        />

        {isHomePage && (
          <div className="header__hero">
            <h1 className="header__title">What's going on in the world?</h1>
            <p className="header__subtitle">
              Find the latest news on any topic and save them in your personal account.
            </p>
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>
        )}

        {isSavedNewsPage && isLoggedIn && (
          <div className="header__saved">
            <p className="header__saved-subtitle">Saved articles</p>
            <h1 className="header__saved-title">
              {currentUser?.name || 'User'}, you have {totalArticles} saved articles.
            </h1>
            <div className="header-news__header">
              {keywords.length > 0 && (
                <p className="header__saved-news__keywords">
                  By keywords:
                  <span className="header__saved-news__keywords-bold">
                    {' '}
                    {keywords.join(', ')}
                    {keywordCount > 0 && `, and ${keywordCount} other`}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
