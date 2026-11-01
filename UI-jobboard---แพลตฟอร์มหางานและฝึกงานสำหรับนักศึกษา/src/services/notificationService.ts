import api from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  // GET /api/notifications?recipient_id=...
  async getNotifications(recipientId: string): Promise<NotificationItem[]> {
    const res = await api.get<{ success: boolean; data: NotificationItem[] }>(
      `/api/notifications?recipient_id=${encodeURIComponent(recipientId)}`
    );
    return res.data.data;
  },

  // POST /api/integration/notifications
  async sendNotification(payload: {
    recipient_id: string;
    title: string;
    message: string;
    type?: 'status_change' | 'new_application' | 'system';
    related_application_id?: string;
  }): Promise<NotificationItem> {
    const res = await api.post<{ success: boolean; data: NotificationItem; message: string }>(
      '/api/integration/notifications',
      payload
    );
    return res.data.data;
  },

  // POST /api/webhooks/notification
  async triggerWebhook(payload: Record<string, unknown>) {
    const res = await api.post('/api/webhooks/notification', payload);
    return res.data;
  },
};
