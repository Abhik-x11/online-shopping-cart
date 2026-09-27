import React, { useEffect } from 'react';
import './Toast.css';

/**
 * Toast Component
 * Displays temporary animated action feedback.
 */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="cart-toast-banner" role="status" aria-live="polite">
      <span className="toast-text">{toast}</span>
      <button 
        type="button" 
        className="toast-close-x" 
        onClick={onClose}
        aria-label="Dismiss toast"
      >
        ✕
      </button>
    </div>
  );
}
