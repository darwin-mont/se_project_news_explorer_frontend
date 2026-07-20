import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
      // Clear form
      setEmail('');
      setPassword('');
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
      title="Sign in"
      onSubmit={handleSubmit}
      buttonText="Sign in"
      isLoading={isLoading}
      footerContent={
        <div className="login-modal__footer">
          <span className="login-modal__footer-text">or</span>
          <button type="button" className="login-modal__switch-button" onClick={onSwitchToRegister}>
            Sign up
          </button>
        </div>
      }
    >
      <div className="login-modal__field">
        <label className="login-modal__label">Email</label>
        <input
          type="email"
          className="login-modal__input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          autoFocus={isOpen}
        />
      </div>

      <div className="login-modal__field">
        <label className="login-modal__label">Password</label>
        <input
          type="password"
          className="login-modal__input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          minLength="6"
        />
      </div>
    </ModalWithForm>
  );
}

export default LoginModal;
