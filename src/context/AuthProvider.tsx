import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isDemoStaff } from '../config/demo';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import { AuthContext, type AuthContextValue, type User } from './auth';

function loadInitialUser(): User | null {
  // Lazy initialiser: reading localStorage during the first render avoids the
  // extra render pass (and the cascading-update lint error) an effect causes.
  if (typeof window === 'undefined') return null;
  const stored = readStorage<User | null>(STORAGE_KEYS.user, null);
  return stored && typeof stored.name === 'string' ? stored : null;
}

/**
 * Demo authentication provider.
 *
 * ⚠️ This is **not** real auth: state lives in `localStorage` and there is no
 * server, no password verification and no session. See SECURITY.md before you
 * put anything sensitive behind it.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadInitialUser);

  // Persist to the external store; never sets state from an effect.
  useEffect(() => {
    if (user) writeStorage(STORAGE_KEYS.user, user);
    else removeStorage(STORAGE_KEYS.user);
  }, [user]);

  const login = useCallback((nextUser: User) => {
    setUser({
      ...nextUser,
      role: isDemoStaff(nextUser.name) ? 'staff' : 'guest',
      joinedAt: nextUser.joinedAt ?? new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isStaff: isDemoStaff(user?.name),
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
