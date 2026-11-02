import { NotificationItem } from '../types';
import { apiRequest } from './apiClient';

export const notificationService = {
  async getNotifications(recipientId: string): Promise<NotificationItem[]> {
    return apiRequest<NotificationItem[]>(`/api/notifications?recipient_id=${encodeURIComponent(recipientId)}`);
  },
};
