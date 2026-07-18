// src/components/Navigation/Navigation.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';
import logoutIcon from '../../assets/icons/logout.svg';

function Navigation({ isLoggedIn, onLogin, onLogout, currentUser, isDark }) {
  return (
    <nav className={`navigation ${isDark ? 'navigation_dark' : ''}`}>
      <Link to="/" className={`navigation__logo ${isDark ? 'navigation__logo_dark' : ''}`}>
        NewsExplorer
      </Link>
      <ul className="navigation__list">
        <li className="navigation__item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navigation__link ${isActive ? 'navigation__link_active' : ''} ${isDark ? 'navigation__link_dark' : ''}`
            }
            end
          >
            Home
          </NavLink>
        </li>
        {isLoggedIn && (
          <li className="navigation__item">
            <NavLink
              to="/saved-news"
              className={({ isActive }) =>
                `navigation__link ${isActive ? 'navigation__link_active' : ''} ${isDark ? 'navigation__link_dark' : ''}`
              }
            >
              Saved Articles
            </NavLink>
          </li>
        )}
        <li className="navigation__item">
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className={`navigation__button ${isDark ? 'navigation__button_dark' : 'navigation__button_logout'}`}
            >
              <span className="navigation__username">{currentUser?.name || 'User'}</span>

              <img src={logoutIcon} alt="Logout" className="navigation__logout-icon" />
            </button>
          ) : (
            <button
              onClick={onLogin}
              className={`navigation__button ${isDark ? 'navigation__button_dark' : 'navigation__button_login'}`}
            >
              Sign in
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
