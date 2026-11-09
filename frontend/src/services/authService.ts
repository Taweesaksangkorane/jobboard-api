import { apiRequest } from './apiClient';
import type { User } from '../types';

export const authService = {
  login(email: string, password: string) {
    return apiRequest<User>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  me(role?: User['role']) {
    const suffix = role ? `?role=${encodeURIComponent(role)}` : '';
    return apiRequest<User>(`/api/auth/me${suffix}`);
  },
  logout(role: User['role']) {
    return apiRequest<null>('/api/auth/logout', { method: 'POST', body: JSON.stringify({ role }) });
  },
};
