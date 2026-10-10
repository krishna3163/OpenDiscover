import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast, type ToastVariant } from '../context/toast';

const VARIANT_ICON: Record<ToastVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '⛔',
};

/**
 * Fixed-position stack of transient messages.
 * Uses `role="status"` so screen readers announce additions politely.
 */
export const ToastViewport: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-viewport" role="status" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
            className={`toast toast-${toast.variant}`}
          >
            <span aria-hidden="true" className="toast-icon">
              {VARIANT_ICON[toast.variant]}
            </span>
            <div className="toast-body">
              <strong>{toast.title}</strong>
              {toast.description ? <span>{toast.description}</span> : null}
            </div>
            <button type="button" className="toast-close" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
