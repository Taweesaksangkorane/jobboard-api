import { apiRequest } from './apiClient';
import type { User } from '../types';

export const authService = {
  login(email: string, password: string) {
    return apiRequest<User>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  me() {
    return apiRequest<User>('/api/auth/me');
  },
  logout() {
    return apiRequest<null>('/api/auth/logout', { method: 'POST' });
  },
};
