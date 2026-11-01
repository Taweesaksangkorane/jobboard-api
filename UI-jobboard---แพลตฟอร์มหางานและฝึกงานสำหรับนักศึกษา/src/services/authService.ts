import axios from 'axios';
import api from './api';
import { User, UserRole } from '../types';
import { saveSupabaseProfile } from '../lib/supabase';

const STORAGE_KEY = 'jobboard_authenticated_session';
const TOKEN_KEY = 'jobboard_auth_token';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface GoogleUserPreview {
  email: string;
  name: string;
  avatarUrl: string;
  supabaseId: string;
}

export const authService = {
  // Read cached user session from localStorage (never contains passwords; verified with /api/auth/me on boot)
  getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (token && saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.id &&
          parsed.email &&
          (parsed.role === 'student' || parsed.role === 'employer')
        ) {
          return parsed;
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  },

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null, token?: string): void {
    if (user && (user.role === 'student' || user.role === 'employer')) {
      const safeCopy: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        companyName: user.companyName,
        contactPerson: user.contactPerson,
        phone: user.phone,
        website: user.website,
        address: user.address,
        faculty: user.faculty,
        major: user.major,
        university: user.university,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCopy));
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // Authoritative backend verification of current session & role
  async verifySession(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      this.setCurrentUser(null);
      return null;
    }

    try {
      const res = await api.get<{ success: boolean; user: User }>('/api/auth/me');
      if (res.data?.success && res.data.user) {
        this.setCurrentUser(res.data.user);
        return res.data.user;
      }
      this.setCurrentUser(null);
      return null;
    } catch {
      this.setCurrentUser(null);
      return null;
    }
  },

  // Email & Password Login
  async login(email: string, password: string): Promise<User> {
    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        user: User;
        token: string;
      }>('/api/auth/login', {
        email: email.trim(),
        password,
      });

      const user = res.data.user;
      this.setCurrentUser(user, res.data.token);
      return user;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง';
      throw new Error(errorMsg);
    }
  },

  // Email & Password Registration
  async register(data: {
    role: UserRole;
    name: string;
    email: string;
    password: string;
    studentId?: string;
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    companyInfo?: string;
  }): Promise<User> {
    try {
      const res = await api.post<{
        success: boolean;
        message: string;
        user: User;
        token: string;
      }>('/api/auth/register', {
        role: data.role,
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        studentId: data.studentId?.trim(),
        companyName: data.companyName?.trim(),
        contactPerson: data.contactPerson?.trim(),
        phone: data.phone?.trim(),
        companyInfo: data.companyInfo?.trim(),
      });

      const user = res.data.user;
      this.setCurrentUser(user, res.data.token);
      return user;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง';
      throw new Error(errorMsg);
    }
  },

  // Verify Google OAuth Supabase JWT on backend & check if existing user profile/role exists
  async syncGoogleUser(supabaseAccessToken: string): Promise<{
    isNew: boolean;
    user?: User;
    token?: string;
    googleUser?: GoogleUserPreview;
  }> {
    try {
      const res = await axios.post<{
        success: boolean;
        isNew: boolean;
        user?: User;
        token?: string;
        googleUser?: GoogleUserPreview;
        message?: string;
      }>(
        `${BASE_URL}/api/auth/google/sync`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
          timeout: 10000,
        }
      );

      if (!res.data.isNew && res.data.user && res.data.token) {
        this.setCurrentUser(res.data.user, res.data.token);
      }

      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดในการตรวจสอบเซสชัน Google';
      throw new Error(errorMsg);
    }
  },

  // Complete Google Registration after explicit Role Selection
  async completeGoogleRegistration(
    supabaseAccessToken: string,
    data: {
      role: UserRole;
      email: string;
      name: string;
      studentId?: string;
      companyName?: string;
      contactPerson?: string;
      phone?: string;
      companyInfo?: string;
      avatarUrl?: string;
      supabaseId: string;
    }
  ): Promise<User> {
    try {
      // 1. Persist to Supabase `public.profiles` (with RLS) & user_metadata when available
      await saveSupabaseProfile({
        supabaseId: data.supabaseId,
        email: data.email,
        role: data.role,
        name: data.role === 'student' ? data.name.trim() : (data.contactPerson || data.name).trim(),
        studentId: data.studentId?.trim(),
        companyName: data.companyName?.trim(),
        contactPerson: data.contactPerson?.trim(),
        phone: data.phone?.trim(),
        companyInfo: data.companyInfo?.trim(),
        avatarUrl: data.avatarUrl,
      });

      // 2. Register & verify role on backend API
      const res = await axios.post<{
        success: boolean;
        message: string;
        user: User;
        token: string;
      }>(
        `${BASE_URL}/api/auth/google/complete-registration`,
        {
          role: data.role,
          name: data.name.trim(),
          studentId: data.studentId?.trim(),
          companyName: data.companyName?.trim(),
          contactPerson: data.contactPerson?.trim(),
          phone: data.phone?.trim(),
          companyInfo: data.companyInfo?.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
          timeout: 10000,
        }
      );

      const user = res.data.user;
      this.setCurrentUser(user, res.data.token);
      return user;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการลงทะเบียน';
      throw new Error(errorMsg);
    }
  },

  async updateUserProfile(data: Partial<User>): Promise<User> {
    const res = await api.patch<{ success: boolean; user: User }>('/api/auth/profile', data);
    this.setCurrentUser(res.data.user);
    return res.data.user;
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
