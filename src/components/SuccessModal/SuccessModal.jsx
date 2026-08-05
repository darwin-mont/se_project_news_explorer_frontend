import React, { useEffect } from 'react';
import { useModalClose } from '../../utils/hooks/useModalClose';
import './SuccessModal.css';

function SuccessModal({ isOpen, onClose, onSignIn }) {
  const { handleOverlayClick } = useModalClose({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div className="success-modal" onClick={handleOverlayClick}>
      <div className="success-modal__content">
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
