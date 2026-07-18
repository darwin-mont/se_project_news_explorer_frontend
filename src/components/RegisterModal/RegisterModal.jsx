// src/components/RegisterModal/RegisterModal.jsx
import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      onRegister({ email, password, username });
      setIsLoading(false);
      // Clear form
      setEmail('');
      setPassword('');
      setUsername('');
    }, 500);
  };

  // Handle Enter key to submit form
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Sign up"
      onSubmit={handleSubmit}
      buttonText="Sign up"
      isLoading={isLoading}
      footerContent={
        <div className="register-modal__footer">
          <span className="register-modal__footer-text">or</span>
          <button type="button" className="register-modal__switch-button" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </div>
      }
    >
      <div className="register-modal__field">
        <label className="register-modal__label">Email</label>
        <input
          type="email"
          className="register-modal__input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
      </div>

      <div className="register-modal__field">
        <label className="register-modal__label">Password</label>
        <input
          type="password"
          className="register-modal__input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          minLength="8"
        />
      </div>

      <div className="register-modal__field">
        <label className="register-modal__label">Username</label>
        <input
          type="text"
          className="register-modal__input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          autoFocus={isOpen}
        />
      </div>
    </ModalWithForm>
  );
}

export default RegisterModal;
