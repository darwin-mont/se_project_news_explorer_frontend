import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { validateLoginForm, validateEmail, validatePassword } from '../../utils/validation';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validate form
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await onLogin({ email, password });
      setEmail('');
      setPassword('');
      setErrors({});
      setTouched({});
    } catch (error) {
      setGeneralError(error.message || 'Login failed. Please try again.');
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
          className={`login-modal__input ${errors.email && touched.email ? 'login-modal__input_error' : ''}`}
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          required
          autoFocus={isOpen}
        />
        {errors.email && touched.email && (
          <span className="login-modal__error">{errors.email}</span>
        )}
      </div>

      <div className="login-modal__field">
        <label className="login-modal__label">Password</label>
        <input
          type="password"
          className={`login-modal__input ${errors.password && touched.password ? 'login-modal__input_error' : ''}`}
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          required
        />
        {errors.password && touched.password && (
          <span className="login-modal__error">{errors.password}</span>
        )}
      </div>

      {generalError && <div className="login-modal__general-error">{generalError}</div>}
    </ModalWithForm>
  );
}

export default LoginModal;
