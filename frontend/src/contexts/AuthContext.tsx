import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const refreshSession = async (): Promise<User | null> => {
    try {
      const account = await authService.me();
      setUser(account);
      return account;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let active = true;
    refreshSession().finally(() => {
      if (active) setIsLoadingAuth(false);
    });
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    isLoadingAuth,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === 'student',
    isEmployer: user?.role === 'employer',
    refreshSession,
    login: async (email, password) => {
      const account = await authService.login(email, password);
      setUser(account);
      return account;
    },
    logout: async () => {
      try { await authService.logout(); } finally { setUser(null); }
    },
    updateProfile: async (patch: Partial<User>) => {
      const updated = { ...(user as User), ...patch };
      setUser(updated);
      return updated;
    },
  }), [isLoadingAuth, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
