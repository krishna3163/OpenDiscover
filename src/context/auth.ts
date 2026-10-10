import { createContext, useContext } from 'react';

export interface User {
  name: string;
  email: string;
  /** Demo-only role. There is no real authorisation in a client-only build. */
  role?: 'guest' | 'staff';
  /** ISO date the local session was created. */
  joinedAt?: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True when the signed-in display name is in the demo staff list. */
  isStaff: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Read the current auth state.
 *
 * Kept in its own (non-component) module so `AuthProvider.tsx` only exports a
 * component — that keeps React Fast Refresh working during development.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
