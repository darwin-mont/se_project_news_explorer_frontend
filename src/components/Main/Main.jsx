import React, { useState, useEffect } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import About from '../About/About';
import Preloader from '../Preloader/Preloader';
import { searchNews, getApiStatus } from '../../utils/api/newsApi';
import notFoundIcon from '../../assets/icons/not-found.svg';
import './Main.css';

function Main({ isLoggedIn, savedArticles, onSaveArticle, searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [totalArticles, setTotalArticles] = useState(0);
  const [apiStatus, setApiStatus] = useState(null);

  const ARTICLES_PER_PAGE = 3;

  useEffect(() => {
    const status = getApiStatus();
    setApiStatus(status);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }

    if (!searchQuery) {
      setArticles([]);
      setDisplayedArticles([]);
      setHasSearched(false);
      setSearchError('');
      setError(null);
      setTotalArticles(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (articles.length > 0) {
      setDisplayedArticles(articles.slice(0, visibleCount));
    } else {
      setDisplayedArticles([]);
    }
  }, [articles, visibleCount]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchError('');
    setHasSearched(true);
    setVisibleCount(ARTICLES_PER_PAGE);

    try {
      const response = await searchNews(query);

      if (response && response.articles) {
        const articlesData = response.articles;
        setTotalArticles(articlesData.length);
        setArticles(articlesData);

        if (articlesData.length === 0) {
          setSearchError('Nothing found');
        }
      } else {
        setArticles([]);
        setTotalArticles(0);
        setSearchError('Nothing found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Sorry, something went wrong during the request. Please try again later.');
      setArticles([]);
      setTotalArticles(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + ARTICLES_PER_PAGE, totalArticles));
  };

  const isArticleSaved = (article) => {
    return savedArticles.some((saved) => saved.url === article.url);
  };

  const showMoreButton = () => {
    return visibleCount < totalArticles && totalArticles > 0;
  };

  return (
    <main className="main">
      <div className="search-results">
        {isLoading && <Preloader />}

        {!isLoading && hasSearched && (
          <>
            {error && (
              <div className="search-results__error">
                <p>{error}</p>
              </div>
            )}

            {!error && searchError && articles.length === 0 && (
              <div className="search-results__nothing-found">
                <img
                  src={notFoundIcon}
                  alt="No Results found"
                  className="search-result__nothing-found-img"
                />
                <p className="search-result__nothing-found-title">{searchError}</p>
                <p className="search-result__nothing-found-subtitle">
                  Sorry, but nothing matched your search terms
                </p>
              </div>
            )}

            {!error && !searchError && articles.length > 0 && (
              <>
                <h2 className="main__results-title">Search results</h2>

                <div className="main__results">
                  {displayedArticles.map((article) => (
                    <NewsCard
                      key={article._id || article.id}
                      article={article}
                      isLoggedIn={isLoggedIn}
                      isSaved={isArticleSaved(article)}
                      onSave={() => onSaveArticle(article)}
                    />
                  ))}
                </div>

                {showMoreButton() && (
                  <button className="main__show-more-btn" onClick={handleShowMore}>
                    Show more
                  </button>
                )}

                {!showMoreButton() && totalArticles > ARTICLES_PER_PAGE && (
                  <p className="main__all-shown">All {totalArticles} articles shown</p>
                )}
              </>
            )}
          </>
        )}

        {!hasSearched && !isLoading && <div className="search-results__empty"></div>}
      </div>

      <About />
    </main>
  );
}

export default Main;
