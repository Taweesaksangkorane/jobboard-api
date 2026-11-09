import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

type AuthValue = {
  user: User | null;
  isLoadingAuth: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isEmployer: boolean;
  refreshSession: () => Promise<User | null>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<User>;
};

const AuthContext = createContext<AuthValue | null>(null);
const activeRoleKey = 'jobboard_active_role';

function roleForCurrentTab(): User['role'] | undefined {
  const path = window.location.pathname;
  if (path.startsWith('/student/')) return 'student';
  if (path.startsWith('/employer/')) return 'employer';
  const stored = window.sessionStorage.getItem(activeRoleKey);
  return stored === 'student' || stored === 'employer' ? stored : undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      const expectedRole = roleForCurrentTab();
      const account = await authService.me(expectedRole);
      setUser(account);
      return account;
    } catch {
      setUser(null);
      window.sessionStorage.removeItem(activeRoleKey);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    refreshSession().finally(() => {
      if (active) setIsLoadingAuth(false);
    });
    return () => { active = false; };
  }, [refreshSession]);

  useEffect(() => {
    const syncSession = () => { void refreshSession(); };
    const syncOnVisible = () => {
      if (document.visibilityState === 'visible') syncSession();
    };
    window.addEventListener('focus', syncSession);
    window.addEventListener('jobboard:session-changed', syncSession);
    document.addEventListener('visibilitychange', syncOnVisible);
    return () => {
      window.removeEventListener('focus', syncSession);
      window.removeEventListener('jobboard:session-changed', syncSession);
      document.removeEventListener('visibilitychange', syncOnVisible);
    };
  }, [refreshSession]);

  const value = useMemo<AuthValue>(() => ({
    user,
    isLoadingAuth,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === 'student',
    isEmployer: user?.role === 'employer',
    refreshSession,
    login: async (email, password) => {
      const account = await authService.login(email, password);
      window.sessionStorage.setItem(activeRoleKey, account.role);
      setUser(account);
      return account;
    },
    logout: async () => {
      try { if (user) await authService.logout(user.role); } finally {
        window.sessionStorage.removeItem(activeRoleKey);
        setUser(null);
      }
    },
    updateProfile: async (patch: Partial<User>) => {
      const updated = { ...(user as User), ...patch };
      setUser(updated);
      return updated;
    },
  }), [isLoadingAuth, refreshSession, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
