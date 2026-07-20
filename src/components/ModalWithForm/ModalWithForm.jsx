import React, { useEffect } from 'react';
import './ModalWithForm.css';
import closeIcon from '../../assets/icons/close.svg';

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
    <div className="modal" onClick={handleOverlayClick}>
      <button className="modal__close-button" onClick={onClose} aria-label="Close modal">
        <img src={closeIcon} alt="Close" className="modal__close-icon" />
      </button>

      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>

        <form className="modal__form" onSubmit={onSubmit}>
          {children}

          <button type="submit" className="modal__submit-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : buttonText}
          </button>
        </form>

        {footerContent && <div className="modal__footer">{footerContent}</div>}
      </div>
    </div>
  );
}

export default ModalWithForm;
