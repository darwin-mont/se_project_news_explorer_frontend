import React from 'react';
import './ModalWithForm.css';
import closeIcon from '../../assets/icons/close.svg';
import { useModalClose } from '../../utils/hooks/useModalClose';

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
  const { handleOverlayClick } = useModalClose({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal__wrapper">
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
    </div>
  );
}

export default ModalWithForm;
