import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import {
  validateRegisterForm,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../utils/validation';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validate form
    const validationErrors = validateRegisterForm(email, password, username);
    setErrors(validationErrors);
    setTouched({ email: true, password: true, username: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await onRegister({ email, password, username });
      setEmail('');
      setPassword('');
      setUsername('');
      setErrors({});
      setTouched({});
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      const error = validateEmail(value);
      setErrors({ ...errors, email: error });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      const error = validatePassword(value);
      setErrors({ ...errors, password: error });
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (touched.username) {
      const error = validateUsername(value);
      setErrors({ ...errors, username: error });
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
        <label className="register-modal__label">Username</label>
        <input
          type="text"
          className={`register-modal__input ${errors.username && touched.username ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          onBlur={() => handleBlur('username')}
          required
          autoFocus={isOpen}
        />
        {errors.username && touched.username && (
          <span className="register-modal__error">{errors.username}</span>
        )}
      </div>

      <div className="register-modal__field">
        <label className="register-modal__label">Email</label>
        <input
          type="email"
          className={`register-modal__input ${errors.email && touched.email ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          required
        />
        {errors.email && touched.email && (
          <span className="register-modal__error">{errors.email}</span>
        )}
      </div>

      <div className="register-modal__field">
        <label className="register-modal__label">Password</label>
        <input
          type="password"
          className={`register-modal__input ${errors.password && touched.password ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your password (min 8 characters)"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          required
          minLength="8"
        />
        {errors.password && touched.password && (
          <span className="register-modal__error">{errors.password}</span>
        )}
      </div>

      {generalError && <div className="register-modal__general-error">{generalError}</div>}
    </ModalWithForm>
  );
}

export default RegisterModal;
