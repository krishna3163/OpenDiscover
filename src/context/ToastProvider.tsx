import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext, type Toast, type ToastContextValue } from './toast';
import { ToastViewport } from '../components/ToastViewport';

let counter = 0;
const nextId = () => `toast_${Date.now().toString(36)}_${(counter += 1)}`;

/**
 * Tiny toast system: `const toast = useToast(); toast.success('Saved')`.
 * Replaces the `alert()` calls that block the main thread and cannot be styled.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback<ToastContextValue['push']>(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      const id = nextId();
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant, duration }]);

      if (duration > 0) {
        const timer = window.setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      dismiss,
      success: (title, description) => push({ title, description, variant: 'success' }),
      error: (title, description) => push({ title, description, variant: 'error', duration: 6000 }),
      info: (title, description) => push({ title, description, variant: 'info' }),
    }),
    [toasts, push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
