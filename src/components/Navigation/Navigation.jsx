import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navigation.css';
import logoutIcon from '../../assets/icons/logout.svg';
import closeIcon from '../../assets/icons/close.svg';
import menuLightIcon from '../../assets/icons/menu-light.svg'; //
import menuDarkIcon from '../../assets/icons/menu-dark.svg'; //

function Navigation({ isLoggedIn, onLogin, onLogout, currentUser, isDark }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getMenuIcon = () => {
    return isDark ? menuDarkIcon : menuLightIcon;
  };

  return (
    <nav className={`navigation ${isDark ? 'navigation_dark' : ''}`}>
      <div className="navigation__header">
        <Link
          to="/"
          className={`navigation__logo ${isDark ? 'navigation__logo_dark' : ''}`}
          onClick={closeMenu}
        >
          NewsExplorer
        </Link>

        <button
          className={`navigation__hamburger ${isMenuOpen ? 'navigation__hamburger_active' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            // Close icon - white when open
            <img src={closeIcon} alt="Close menu" className="navigation__close-icon" />
          ) : (
            // Menu icon - based on page
            <img src={getMenuIcon()} alt="Open menu" className="navigation__menu-icon" />
          )}
        </button>
      </div>

      {/*  Navigation List - Collapsible on mobile */}
      <ul className={`navigation__list ${isMenuOpen ? 'navigation__list_open' : ''}`}>
        <li className="navigation__item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navigation__link ${isActive ? 'navigation__link_active' : ''} ${isDark ? 'navigation__link_dark' : ''}`
            }
            end
            onClick={closeMenu}
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
              onClick={closeMenu}
            >
              Saved Articles
            </NavLink>
          </li>
        )}
        <li className="navigation__item">
          {isLoggedIn ? (
            <button
              onClick={() => {
                onLogout();
                closeMenu();
              }}
              className={`navigation__button ${isDark ? 'navigation__button_dark' : 'navigation__button_logout'}`}
            >
              <span className="navigation__username">{currentUser?.name || 'User'}</span>
              <img src={logoutIcon} alt="Logout" className="navigation__logout-icon" />
            </button>
          ) : (
            <button
              onClick={() => {
                onLogin();
                closeMenu();
              }}
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
