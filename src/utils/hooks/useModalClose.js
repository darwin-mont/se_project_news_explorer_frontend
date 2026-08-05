import { useEffect, useCallback } from 'react';

export function useModalClose({
  isOpen,
  onClose,
  onOpen,
  closeOnEsc = true,
  closeOnOverlay = true,
  preventScroll = true,
}) {
  // Handle Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      //  Call onOpen callback if provided
      if (onOpen) {
        onOpen();
      }

      document.addEventListener('keydown', handleEsc);

      // Prevent body scroll when modal is open
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);

      // Restore body scroll when modal closes
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose, onOpen, closeOnEsc, preventScroll]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlay, onClose]
  );

  return { handleOverlayClick };
}
