import React, { useState, useEffect } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useFormAndValidation } from '../../utils/hooks/useFormAndValidation';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }) {
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
    handleChange(e); // Update values using the hook
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const emailError = validateEmail(values.email || '');
    const passwordError = validatePassword(values.password || '');

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      await onLogin({ email: values.email, password: values.password });
      resetForm({}, {}, false);
      setTouched({});
      setErrors({});
    } catch (error) {
      setGeneralError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          name="email"
          className={`login-modal__input ${errors.email && touched.email ? 'login-modal__input_error' : ''}`}
          placeholder="Enter your email"
          value={values.email || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
          name="password"
          className={`login-modal__input ${errors.password && touched.password ? 'login-modal__input_error' : ''}`}
          placeholder="Enter your password"
          value={values.password || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
