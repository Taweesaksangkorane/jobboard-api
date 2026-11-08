import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import { LoadingSkeleton, EmptyState, ErrorState } from '../../components/common/FeedbackStates';
import { Button } from '../../components/common/Button';
import { Tooltip } from '../../components/common/Tooltip';
import { formatDate } from '../../utils/dateFormatter';
import {
  Bell,
  Clock,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation(['student', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
    const interval = window.setInterval(() => { void loadNotifications(false); }, 15_000);
    return () => window.clearInterval(interval);
  }, [user?.id]);

  const loadNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      if (!user?.id) {
        setNotifications([]);
      if (showLoading) setLoading(false);
        return;
      }
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (user?.id && !item.read) {
      try {
        await notificationService.markAsRead(item.id, user.id);
        setNotifications((current) => current.map((notification) => (
          notification.id === item.id ? { ...notification, read: true } : notification
        )));
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
        return;
      }
    }
    if (item.related_application_id) {
      navigate(`/student/applications/${item.related_application_id}`);
    } else {
      navigate('/student/applications');
    }
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#25243A]">{t('student:notifications.title')}</h1>
          <p className="mt-1 text-xs text-[#73758A]">
            {t('student:notifications.subtitle')}
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Tooltip content={t('student:notifications.markAllRead')}>
            <Button variant="outline" size="sm" onClick={markAllRead}>
              {t('student:notifications.markAllRead')}
            </Button>
          </Tooltip>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title={t('student:notifications.empty')}
          description={t('student:notifications.emptyDesc')}
          icon={<Bell className="h-8 w-8 text-[#6C4CE3]" />}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const formattedTime = formatDate(item.created_at, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group flex items-start justify-between gap-4 rounded-2xl border p-4 transition cursor-pointer ${
                  !item.read
                    ? 'border-purple-200 bg-[#F0ECFF]/30 hover:bg-[#F0ECFF]/50'
                    : 'border-[#E9EAF1] bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      !item.read ? 'bg-[#6C4CE3] text-white' : 'bg-gray-100 text-[#73758A]'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm ${
                          !item.read ? 'font-bold text-[#25243A]' : 'font-medium text-[#73758A]'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-[#6C4CE3]"></span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#73758A] leading-relaxed">
                      {item.message}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#A0A2B3]">
                      <Clock className="h-3 w-3" />
                      {formattedTime}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <ArrowRight className="h-4 w-4 text-[#A0A2B3] group-hover:text-[#6C4CE3] transition group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
