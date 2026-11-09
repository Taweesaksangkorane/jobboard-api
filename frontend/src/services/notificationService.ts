import { NotificationItem } from '../types';
import { apiRequest } from './apiClient';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    return apiRequest<NotificationItem[]>('/api/notifications');
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiRequest(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  },

  async markAllAsRead(): Promise<void> {
    await apiRequest('/api/notifications/read-all', {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  },
};
