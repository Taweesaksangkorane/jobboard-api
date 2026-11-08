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
  selectDemoStudent: (student: Pick<User, 'id' | 'name' | 'email'>) => void;
  selectDemoEmployer: (employer: Pick<User, 'id' | 'companyName'>) => void;
};

const users: Record<UserRole, User> = {
  student: { id: '4', name: 'Demo Student', email: 'student@example.com', role: 'student', studentId: '4' },
  employer: { id: '1', name: 'Demo Employer', email: 'employer@example.com', role: 'employer', companyName: 'Demo Employer' },
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const savedStudent = localStorage.getItem('demoStudent');
  const savedEmployer = localStorage.getItem('demoEmployer');
  const initialStudent = savedStudent ? JSON.parse(savedStudent) as Pick<User, 'id' | 'name' | 'email'> : users.student;
  const initialEmployer = savedEmployer ? JSON.parse(savedEmployer) as Pick<User, 'id' | 'companyName'> : users.employer;
  // This is a demo selector, not persistent authentication. Always start signed out.
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthValue>(() => ({
    user,
    isLoadingAuth: false,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === 'student',
    isEmployer: user?.role === 'employer',
    logout: () => {
      localStorage.removeItem('demoRole');
      setUser(null);
    },
    updateProfile: async (patch) => {
      const updated = { ...(user || users.student), ...patch };
      setUser(updated);
      return updated;
    },
    selectRole: (role) => {
      localStorage.setItem('demoRole', role);
      if (role === 'student') {
        setUser({ ...initialStudent, role: 'student', studentId: initialStudent.id });
      } else {
        setUser({ ...users.employer, ...initialEmployer, name: initialEmployer.companyName || users.employer.name, role: 'employer' });
      }
    },
    selectDemoStudent: (student) => {
      const selected = { ...student, role: 'student' as const, studentId: student.id };
      localStorage.setItem('demoRole', 'student');
      localStorage.setItem('demoStudent', JSON.stringify(student));
      setUser(selected);
    },
    selectDemoEmployer: (employer) => {
      const selected = { ...users.employer, ...employer, name: employer.companyName || users.employer.name, role: 'employer' as const };
      localStorage.setItem('demoRole', 'employer');
      localStorage.setItem('demoEmployer', JSON.stringify(employer));
      setUser(selected);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
