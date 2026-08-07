import React from 'react';
import { Link } from 'react-router-dom';
import linkedinIcon from '../../assets/images/linkedin.svg';
import gitHubIcon from '../../assets/images/GitHub.svg';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top-row">
          <div className="footer__links">
            <Link to="/" className="footer__link">
              Home
            </Link>
            <a
              href="https://tripleten.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              TripleTen
            </a>
          </div>

          <div className="footer__link-icons">
            <a
              href="https://github.com/darwin-mont"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__github-link"
              aria-label="GitHub Profile"
            >
              <img src={gitHubIcon} alt="GitHub" className="footer__link-icon" />
            </a>
            <a
              href="https://www.linkedin.com/in/darwin-montaleza-b93b9b9a"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__linkedin-link"
              aria-label="LinkedIn Profile"
            >
              <img src={linkedinIcon} alt="LinkedIn" className="footer__link-icon" />
            </a>
          </div>
        </div>

        <p className="footer__text">© {currentYear} Supersite, Powered by News API</p>
      </div>
    </footer>
  );
}

export default Footer;
