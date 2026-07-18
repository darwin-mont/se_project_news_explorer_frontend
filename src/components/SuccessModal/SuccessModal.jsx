// src/components/SuccessModal/SuccessModal.jsx
import React, { useEffect } from 'react';
import './SuccessModal.css';

function SuccessModal({ isOpen, onClose, onSignIn }) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="success-modal" onClick={handleOverlayClick}>
      <div className="success-modal__content">
        {/* Success Icon */}
        <div className="success-modal__icon"></div>

        <h2 className="success-modal__title">Registration successfully completed!</h2>

        <button className="success-modal__button" onClick={onSignIn}>
          Sign in
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
