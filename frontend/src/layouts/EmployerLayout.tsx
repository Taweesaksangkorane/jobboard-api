import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { studentService, type DemoEmployer } from '../services/studentService';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Tooltip } from '../components/common/Tooltip';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export const EmployerLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoadingAuth, isAuthenticated, isEmployer, logout, selectDemoEmployer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoEmployers, setDemoEmployers] = useState<DemoEmployer[]>([]);

  useEffect(() => {
    studentService.getEmployers().then(setDemoEmployers).catch(() => {});
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

  if (!isEmployer) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-md">
          <ShieldAlert className="mx-auto h-12 w-12 text-[#E05252] mb-4" />
          <h2 className="text-xl font-bold text-[#25243A] mb-2">{t('employer:roleGuard.title')}</h2>
          <p className="text-sm text-[#73758A] mb-6">
            {t('employer:roleGuard.desc')}
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/student/dashboard"
              className="w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5638C5]"
            >
              {t('employer:roleGuard.backToStudent')}
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
                {t('employer:roleGuard.switchAccount')}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: t('employer:dashboard.badge'), path: '/employer/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: t('employer:manageJobs.title'), path: '/employer/jobs', icon: <Briefcase className="h-5 w-5" /> },
    { label: t('employer:jobForm.createTitle'), path: '/employer/jobs/create', icon: <PlusCircle className="h-5 w-5" /> },
    { label: t('employer:applicants.title'), path: '/employer/applicants', icon: <Users className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <div className="flex flex-1">
        {/* Mobile Backdrop */}
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
                <span className="ml-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {t('brand.employerTag')}
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

          {/* Company Card in Sidebar */}
          <div className="border-b border-[#E9EAF1] p-4 bg-gray-50/60">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.companyName || user.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-xl border border-[#E9EAF1] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#6C4CE3] font-bold text-sm">
                  {(user?.companyName || user?.name || 'CO').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold text-[#25243A]">{user?.companyName || user?.name}</p>
                <p className="truncate text-[11px] text-[#73758A]">{user?.contactPerson || user?.email}</p>
                <span className="inline-block mt-0.5 text-[10px] text-emerald-700 font-medium">
                  {t('employer:roleGuard.verifiedCompany')}
                </span>
              </div>
            </div>
            <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-[#73758A]" htmlFor="demo-employer">
              Demo company
            </label>
            <select
              id="demo-employer"
              value={user?.id || ''}
              onChange={(event) => {
                const employer = demoEmployers.find((item) => String(item.employer_id) === event.target.value);
                if (employer) selectDemoEmployer({ id: String(employer.employer_id), companyName: employer.company_name });
              }}
              className="mt-1 w-full rounded-lg border border-[#E9EAF1] bg-white px-2 py-1.5 text-xs text-[#25243A] outline-none focus:border-[#6C4CE3]"
            >
              {!demoEmployers.some((employer) => String(employer.employer_id) === user?.id) && user?.id && (
                <option value={user.id}>{user.companyName || user.name} (ID {user.id})</option>
              )}
              {demoEmployers.map((employer) => (
                <option key={employer.employer_id} value={employer.employer_id}>
                  {employer.company_name} (ID {employer.employer_id})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] leading-4 text-[#73758A]">Demo only — this is not a secure login.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path === '/employer/applicants' &&
                  location.pathname.startsWith('/employer/applicants/'));
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
                </Link>
              );
            })}
          </nav>

          {/* External Public View */}
          <div className="p-3 border-t border-[#E9EAF1]">
            <Tooltip content={t('common:tooltips.search')}>
              <Link
                to="/jobs"
                target="_blank"
                className="flex items-center justify-between rounded-xl border border-[#E9EAF1] bg-gray-50/50 px-3 py-2 text-xs font-medium text-[#73758A] hover:bg-gray-100 hover:text-[#25243A] transition"
              >
                <span>{t('common:nav.findJobs')}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Tooltip>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-[#E9EAF1] p-3">
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
          {/* Top Bar */}
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
                {location.pathname.startsWith('/employer/applicants/')
                  ? t('employer:applicantReview.pageBadge')
                  : navItems.find((n) => n.path === location.pathname)?.label ||
                    t('employer:dashboard.badge')}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 sm:inline">DEMO MODE</span>
              <LanguageSwitcher />

              <Tooltip content={t('common:tooltips.createJob')}>
                <Link
                  to="/employer/jobs/create"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#6C4CE3] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#5638C5] transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  {t('employer:dashboard.postJobBtn')}
                </Link>
              </Tooltip>
            </div>
          </header>

          {/* Main Outlet */}
          <main
            className={`flex-1 overflow-y-auto ${
              location.pathname === '/employer/jobs/create'
                ? 'p-4 sm:p-6 lg:py-8 lg:px-[3%] xl:px-[3.5%]'
                : 'p-4 sm:p-6 lg:p-8'
            }`}
          >
            <ErrorBoundary
              fallbackBackPath="/employer/applicants"
              fallbackBackLabel={t('employer:applicantReview.backToApplicants')}
            >
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
};
