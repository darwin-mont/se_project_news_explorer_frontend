import React, { useState, useEffect } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';
import { useFormAndValidation } from '../../utils/hooks/useFormAndValidation';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }) {
  const { values, handleChange, errors, isValid, resetForm, setErrors } = useFormAndValidation();

  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      resetForm({}, {}, false);
      setTouched({});
      setGeneralError('');
      setErrors({});
    }
  }, [isOpen, resetForm, setErrors]);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    } else if (name === 'username') {
      error = validateUsername(value);
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true, username: true });

    const emailError = validateEmail(values.email || '');
    const passwordError = validatePassword(values.password || '');
    const usernameError = validateUsername(values.username || '');

    setErrors({
      email: emailError,
      password: passwordError,
      username: usernameError,
    });

    if (emailError || passwordError || usernameError) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await onRegister({
        email: values.email,
        password: values.password,
        username: values.username,
      });
      resetForm({}, {}, false);
      setTouched({});
      setErrors({});
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          name="username"
          className={`register-modal__input ${errors.username && touched.username ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your username"
          value={values.username || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
          name="email"
          className={`register-modal__input ${errors.email && touched.email ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your email"
          value={values.email || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
          name="password"
          className={`register-modal__input ${errors.password && touched.password ? 'register-modal__input_error' : ''}`}
          placeholder="Enter your password (min 8 characters)"
          value={values.password || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
