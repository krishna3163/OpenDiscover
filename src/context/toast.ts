import { createContext, useContext } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  /** Milliseconds before it disappears. `0` keeps it until dismissed. */
  duration: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id' | 'variant' | 'duration'> & { variant?: ToastVariant; duration?: number }) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/** Show transient feedback instead of using `window.alert`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}
