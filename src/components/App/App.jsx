import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import SavedNews from '../SavedNews/SavedNews';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import SuccessModal from '../SuccessModal/SuccessModal';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { authorize, register, checkToken, logout } from '../../utils/api/auth';
import { getItems, saveArticle, removeArticle } from '../../utils/api/api';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const loadSavedArticles = async () => {
    try {
      console.log('Loading saved articles...');
      const articles = await getItems();
      console.log('Articles loaded:', articles);
      setSavedArticles(articles);
      return articles;
    } catch (error) {
      console.error('Failed to load saved articles:', error);
      return [];
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token found:', token);
    if (token) {
      checkToken(token)
        .then((res) => {
          console.log('Token check response:', res);
          setCurrentUser(res.data);
          setIsLoggedIn(true);
          // Load saved articles
          loadSavedArticles();
        })
        .catch((error) => {
          console.error('Token check failed:', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      console.log('Login attempt:', email);
      const result = await authorize(email, password);
      console.log('Login result:', result);
      if (result.token) {
        setIsLoggedIn(true);
        setCurrentUser(result.data);
        localStorage.setItem('token', result.token);
        setIsLoginModalOpen(false);
        // Load saved articles after login
        const articles = await loadSavedArticles();
        console.log('Saved articles loaded after login:', articles);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, password, username }) => {
    try {
      setLoading(true);
      console.log('Register attempt:', email, username);
      const result = await register(email, password, username);
      console.log('Register result:', result);
      if (result.token) {
        setIsLoggedIn(true);
        setCurrentUser(result.data);
        localStorage.setItem('token', result.token);
        setIsRegisterModalOpen(false);
        setIsSuccessModalOpen(true);

        await loadSavedArticles();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessSignIn = () => {
    setIsSuccessModalOpen(false);
    // Open the login modal
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setSavedArticles([]);
      localStorage.removeItem('token');
      console.log('Logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // src/components/App/App.jsx (excerpt)
  const handleSaveArticle = async (article) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      // Check if already saved by URL
      const isSaved = savedArticles.some((saved) => saved.url === article.url);

      if (!isSaved) {
        const savedArticle = await saveArticle(article);
        setSavedArticles((prev) => [...prev, savedArticle]);
        console.log('Article saved:', article.title);
      } else {
        // Find and remove the article
        const articleToRemove = savedArticles.find((saved) => saved.url === article.url);
        if (articleToRemove) {
          await removeArticle(articleToRemove._id);
          setSavedArticles((prev) => prev.filter((saved) => saved._id !== articleToRemove._id));
          console.log('Article removed:', article.title);
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert(error.message || 'Failed to save article. Please try again.');
    }
  };

  const handleRemoveArticle = async (articleId) => {
    console.log('handleRemoveArticle called with id:', articleId);
    try {
      await removeArticle(articleId);
      // Immediately update state
      setSavedArticles((prev) => {
        const newList = prev.filter((article) => article._id !== articleId);
        console.log('Updated saved articles (remove):', newList);
        return newList;
      });
      // Reload to be safe
      await loadSavedArticles();
    } catch (error) {
      console.error('Failed to remove article:', error);
      alert(error.message || 'Failed to remove article. Please try again.');
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const totalArticles = savedArticles.length;

  return (
    <div className="app">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={openLoginModal}
        onLogout={handleLogout}
        currentUser={currentUser}
        currentPath={location.pathname}
        onSearch={handleSearch}
        isLoading={loading}
        savedArticles={savedArticles}
        totalArticles={totalArticles}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Main
              isLoggedIn={isLoggedIn}
              savedArticles={savedArticles}
              onSaveArticle={handleSaveArticle}
              searchQuery={searchQuery}
            />
          }
        />
        <Route
          path="/saved-news"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SavedNews
                savedArticles={savedArticles}
                currentUser={currentUser}
                onRemoveArticle={handleRemoveArticle}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onLogin={handleLogin}
        onSwitchToRegister={openRegisterModal}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeModals}
        onRegister={handleRegister}
        onSwitchToLogin={openLoginModal}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onSignIn={handleSuccessSignIn}
      />
    </div>
  );
}

export default App;
