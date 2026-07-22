// src/components/Header/Header.jsx
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

  // ✅ Helper function to extract proper category keywords
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

    // Check article keyword
    if (article.keyword && validCategories.includes(article.keyword.toLowerCase())) {
      return capitalizeFirst(article.keyword);
    }

    if (
      article.originalArticle?.keyword &&
      validCategories.includes(article.originalArticle.keyword.toLowerCase())
    ) {
      return capitalizeFirst(article.originalArticle.keyword);
    }

    if (article.section && validCategories.includes(article.section.toLowerCase())) {
      return capitalizeFirst(article.section);
    }

    if (article.category && validCategories.includes(article.category.toLowerCase())) {
      return capitalizeFirst(article.category);
    }

    // Try to extract from title using category keywords
    const titleText = article.title?.toLowerCase() || '';
    const descriptionText = article.description?.toLowerCase() || '';
    const combinedText = titleText + ' ' + descriptionText;

    const categoryPatterns = [
      {
        category: 'Technology',
        keywords: [
          'tech',
          'software',
          'ai',
          'digital',
          'computer',
          'internet',
          'app',
          'code',
          'programming',
          'cyber',
          'data',
          'robot',
        ],
      },
      {
        category: 'Science',
        keywords: [
          'science',
          'research',
          'discovery',
          'scientist',
          'lab',
          'experiment',
          'space',
          'nasa',
          'physics',
          'biology',
          'chemistry',
        ],
      },
      {
        category: 'Health',
        keywords: [
          'health',
          'medical',
          'doctor',
          'hospital',
          'disease',
          'treatment',
          'cancer',
          'heart',
          'wellness',
          'fitness',
          'nutrition',
        ],
      },
      {
        category: 'Business',
        keywords: [
          'business',
          'economy',
          'market',
          'finance',
          'bank',
          'invest',
          'stock',
          'trade',
          'company',
          'profit',
          'ceo',
        ],
      },
      {
        category: 'Environment',
        keywords: [
          'environment',
          'climate',
          'green',
          'solar',
          'energy',
          'renewable',
          'nature',
          'wildlife',
          'pollution',
          'conservation',
        ],
      },
      {
        category: 'Entertainment',
        keywords: [
          'entertainment',
          'movie',
          'music',
          'film',
          'celebrity',
          'show',
          'hollywood',
          'netflix',
          'actor',
          'singer',
        ],
      },
      {
        category: 'Sports',
        keywords: [
          'sports',
          'football',
          'basketball',
          'soccer',
          'baseball',
          'tennis',
          'golf',
          'olympic',
          'nfl',
          'nba',
          'athlete',
        ],
      },
      {
        category: 'Education',
        keywords: [
          'education',
          'school',
          'university',
          'student',
          'teacher',
          'college',
          'learn',
          'curriculum',
          'academic',
        ],
      },
      {
        category: 'Politics',
        keywords: [
          'politics',
          'government',
          'election',
          'president',
          'congress',
          'senate',
          'policy',
          'vote',
        ],
      },
      {
        category: 'World',
        keywords: ['world', 'global', 'international', 'foreign', 'europe', 'asia', 'africa'],
      },
    ];

    for (const pattern of categoryPatterns) {
      for (const keyword of pattern.keywords) {
        if (combinedText.includes(keyword)) {
          return pattern.category;
        }
      }
    }

    // Try using the source name
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

  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => {
    if (!str) return 'General';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // ✅ Get unique keywords from saved articles using the category extractor
  const getUniqueKeywords = () => {
    const keywords = savedArticles
      .map((article) => {
        return extractKeyword(article);
      })
      .filter(Boolean);

    // Get unique keywords (limit to 3 for display)
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
