// src/components/ModalWithForm/ModalWithForm.jsx
import React, { useEffect } from 'react';
import './ModalWithForm.css';
import closeIcon from '../../assets/icons/close.svg'; // ✅ Import close icon

function ModalWithForm({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  buttonText,
  isLoading,
  footerContent,
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle body scroll lock
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Close modal when clicking on overlay (outside the modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleOverlayClick}>
      {/* ✅ Close button - using SVG icon */}
      <button className="modal__close-button" onClick={onClose} aria-label="Close modal">
        <img src={closeIcon} alt="Close" className="modal__close-icon" />
      </button>

      <div className="modal__content">
        {/* Modal Title */}
        <h2 className="modal__title">{title}</h2>

        {/* Form */}
        <form className="modal__form" onSubmit={onSubmit}>
          {children}

          {/* Submit Button */}
          <button type="submit" className="modal__submit-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : buttonText}
          </button>
        </form>

        {/* Footer Content (for switching between login/register) */}
        {footerContent && <div className="modal__footer">{footerContent}</div>}
      </div>
    </div>
  );
}

export default ModalWithForm;
