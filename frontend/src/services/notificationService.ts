import { NotificationItem } from '../types';
import { apiRequest } from './apiClient';

export const notificationService = {
  async getNotifications(recipientId: string): Promise<NotificationItem[]> {
    return apiRequest<NotificationItem[]>(`/api/notifications?recipient_id=${encodeURIComponent(recipientId)}`);
  },

  async markAsRead(notificationId: string, recipientId: string): Promise<void> {
    await apiRequest(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ recipient_id: recipientId }),
    });
  },

  async markAllAsRead(recipientId: string): Promise<void> {
    await apiRequest('/api/notifications/read-all', {
      method: 'PATCH',
      body: JSON.stringify({ recipient_id: recipientId }),
    });
  },
};
