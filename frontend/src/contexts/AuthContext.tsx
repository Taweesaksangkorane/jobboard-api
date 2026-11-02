import React, { createContext, useContext, useMemo, useState } from 'react';
import { User, UserRole } from '../types';

type AuthValue = {
  user: User | null;
  isLoadingAuth: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isEmployer: boolean;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => Promise<User>;
  selectRole: (role: UserRole) => void;
};

const users: Record<UserRole, User> = {
  student: { id: '4', name: 'Demo Student', email: 'student@example.com', role: 'student', studentId: '4' },
  employer: { id: '1', name: 'Demo Employer', email: 'employer@example.com', role: 'employer', companyName: 'Demo Employer' },
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialRole = (localStorage.getItem('demoRole') as UserRole) || 'student';
  const [user, setUser] = useState<User | null>(users[initialRole] || users.student);

  const value = useMemo<AuthValue>(() => ({
    user,
    isLoadingAuth: false,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === 'student',
    isEmployer: user?.role === 'employer',
    logout: () => setUser(null),
    updateProfile: async (patch) => {
      const updated = { ...(user || users.student), ...patch };
      setUser(updated);
      return updated;
    },
    selectRole: (role) => {
      localStorage.setItem('demoRole', role);
      setUser(users[role]);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
