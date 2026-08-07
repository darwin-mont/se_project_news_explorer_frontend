import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if text is entered
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a keyword');
      return;
    }

    // Clear error and submit
    setError('');
    onSearch(trimmedQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="search-form__wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`search-form__input ${error ? 'search-form__input_error' : ''}`}
          placeholder="Enter topic"
          value={query}
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="Search for news"
        />
        <button type="submit" className="search-form__button" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <p className="search-form__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SearchForm;
