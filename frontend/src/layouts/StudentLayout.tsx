import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { Tooltip } from '../components/common/Tooltip';
import { notificationService } from '../services/notificationService';
import { studentService, type DemoStudent } from '../services/studentService';
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Wrench,
  Bell,
  LogOut,
  Briefcase,
  Menu,
  X,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoadingAuth, isAuthenticated, isStudent, logout, selectDemoStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [demoStudents, setDemoStudents] = useState<DemoStudent[]>([]);

  useEffect(() => {
    if (user?.id) {
      notificationService
        .getNotifications(user.id)
        .then((items) => {
          const unread = items.filter((n) => !n.read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [user?.id, location.pathname]);

  useEffect(() => {
    studentService.getStudents().then(setDemoStudents).catch(() => {});
  }, []);

  // Route protection (wait for backend session validation first)
  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6C4CE3]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isStudent) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-md">
          <ShieldAlert className="mx-auto h-12 w-12 text-[#E05252] mb-4" />
          <h2 className="text-xl font-bold text-[#25243A] mb-2">{t('student:roleGuard.title')}</h2>
          <p className="text-sm text-[#73758A] mb-6">
            {t('student:roleGuard.desc')}
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/employer/dashboard"
              className="w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5638C5]"
            >
              {t('student:roleGuard.backToEmployer')}
            </Link>
            <Tooltip content={t('common:tooltips.logout')}>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full rounded-xl border border-[#E9EAF1] px-4 py-2 text-xs font-medium text-[#73758A] hover:bg-gray-50 cursor-pointer"
              >
                {t('student:roleGuard.switchAccount')}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: t('nav.dashboard'), path: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: t('nav.findJobs'), path: '/jobs', icon: <Search className="h-5 w-5" /> },
    { label: t('student:applications.title'), path: '/student/applications', icon: <FileText className="h-5 w-5" /> },
    { label: t('student:profile.title'), path: '/student/profile', icon: <User className="h-5 w-5" /> },
    { label: t('student:skills.title'), path: '/student/skills', icon: <Wrench className="h-5 w-5" /> },
    {
      label: t('student:notifications.title'),
      path: '/student/notifications',
      icon: <Bell className="h-5 w-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <div className="flex flex-1">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#25243A]/40 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E9EAF1] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo & Header */}
          <div className="flex h-16 items-center justify-between border-b border-[#E9EAF1] px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C4CE3] text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-[#25243A]">JobBoard</span>
                <span className="ml-1 text-[10px] font-medium text-[#6C4CE3] bg-[#F0ECFF] px-1.5 py-0.5 rounded">
                  {t('nav.studentRole')}
                </span>
              </div>
            </Link>
            <Tooltip content={t('common:tooltips.closeMenu')}>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label={t('common:tooltips.closeMenu')}
                className="lg:hidden rounded-lg p-1 text-[#73758A] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>

          {/* User info snippet */}
          <div className="border-b border-[#E9EAF1] p-4 bg-gray-50/50">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-xl border border-[#E9EAF1] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C4CE3] font-semibold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold text-[#25243A]">{user?.name}</p>
                <p className="truncate text-[11px] text-[#73758A]">{user?.email}</p>
                {user?.studentId && (
                  <span className="inline-block mt-0.5 text-[10px] text-[#6C4CE3] font-medium bg-[#F0ECFF] px-1.5 py-0.2 rounded">
                    {t('auth:register.studentIdLabel')}: {user.studentId}
                  </span>
                )}
              </div>
            </div>
            <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-[#73758A]" htmlFor="demo-student">
              Demo profile
            </label>
            <select
              id="demo-student"
              value={user?.id || ''}
              onChange={(event) => {
                const student = demoStudents.find((item) => String(item.student_id) === event.target.value);
                if (student) selectDemoStudent({ id: String(student.student_id), name: student.name, email: student.email || '' });
              }}
              className="mt-1 w-full rounded-lg border border-[#E9EAF1] bg-white px-2 py-1.5 text-xs text-[#25243A] outline-none focus:border-[#6C4CE3]"
            >
              {!demoStudents.some((student) => String(student.student_id) === user?.id) && user?.id && (
                <option value={user.id}>{user.name} (ID {user.id})</option>
              )}
              {demoStudents.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} (ID {student.student_id})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] leading-4 text-[#73758A]">Demo only — this is not a secure login.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition ${
                    active
                      ? 'bg-[#F0ECFF] text-[#6C4CE3] font-semibold'
                      : 'text-[#73758A] hover:bg-gray-50 hover:text-[#25243A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-[#6C4CE3]' : 'text-[#A0A2B3]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E05252] text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-[#E9EAF1] p-3 space-y-1">
            <Tooltip content={t('common:tooltips.logout')}>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#E05252] transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('common:nav.logout')}</span>
              </button>
            </Tooltip>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar for Mobile & Quick Actions */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E9EAF1] bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Tooltip content={t('common:tooltips.openMenu')}>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden rounded-lg p-2 text-[#73758A] hover:bg-gray-100"
                  aria-label={t('common:tooltips.openMenu')}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </Tooltip>
              <h1 className="text-base font-semibold text-[#25243A]">
                {navItems.find((n) => n.path === location.pathname)?.label || t('student:dashboard.badge')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Tooltip content={t('common:tooltips.search')}>
                <Link
                  to="/jobs"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-3 py-1.5 text-xs font-medium text-[#25243A] hover:bg-gray-50 transition"
                >
                  <Search className="h-3.5 w-3.5 text-[#6C4CE3]" />
                  {t('common:nav.findJobs')}
                </Link>
              </Tooltip>
              <Tooltip content={t('common:tooltips.notifications')}>
                <Link
                  to="/student/notifications"
                  className="relative rounded-xl border border-[#E9EAF1] p-2 text-[#73758A] hover:bg-gray-50 transition"
                  aria-label={t('common:tooltips.notifications')}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E05252] text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </Tooltip>
            </div>
          </header>

          {/* Main Outlet */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
