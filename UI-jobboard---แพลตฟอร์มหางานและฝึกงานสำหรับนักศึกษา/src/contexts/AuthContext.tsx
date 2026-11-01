import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { signInWithGoogleOAuth, supabase } from '../lib/supabase';

export interface RegisterPayload {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  studentId?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  companyInfo?: string;
}

interface AuthContextType {
  user: User | null;
  isLoadingAuth: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isEmployer: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (options?: { redirectTo?: string; returnPath?: string }) => Promise<{ usedPopup: boolean }>;
  register: (data: RegisterPayload) => Promise<User>;
  setAuthenticatedUser: (user: User, token?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(() => Boolean(authService.getToken()));

  // Clear legacy demo session key and validate active session role on backend
  useEffect(() => {
    try {
      localStorage.removeItem('jobboard_current_user');
    } catch {
      // ignore
    }

    const token = authService.getToken();
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

    let cancelled = false;
    authService
      .verifySession()
      .then((verifiedUser) => {
        if (!cancelled) {
          setUser(verifiedUser);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingAuth(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const loginWithGoogle = async (options?: { redirectTo?: string; returnPath?: string }) => {
    const result = await signInWithGoogleOAuth(options);
    return { usedPopup: result.usedPopup };
  };

  const setAuthenticatedUser = (newUser: User, token?: string) => {
    authService.setCurrentUser(newUser, token);
    setUser(newUser);
  };

  const register = async (data: RegisterPayload) => {
    const registered = await authService.register(data);
    setUser(registered);
    return registered;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('กรุณาเข้าสู่ระบบก่อนแก้ไขข้อมูลโปรไฟล์');
    }
    const serverUser = await authService.updateUserProfile(data);
    setUser(serverUser);
    return serverUser;
  };

  const isAuthenticated = !!user && (user.role === 'student' || user.role === 'employer');
  const isStudent = user?.role === 'student';
  const isEmployer = user?.role === 'employer';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        isAuthenticated,
        isStudent,
        isEmployer,
        login,
        loginWithGoogle,
        register,
        setAuthenticatedUser,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
