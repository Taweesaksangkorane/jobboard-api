import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { Tooltip } from '../components/common/Tooltip';
import { Briefcase, Menu, X, LogIn, UserPlus } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isStudent, isEmployer, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FC]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E9EAF1] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to={isAuthenticated ? '/' : '/login'} className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C4CE3] text-white shadow-sm shadow-[#6C4CE3]/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#25243A]">JobBoard</span>
              <span className="ml-1 text-[11px] font-medium text-[#6C4CE3] bg-[#F0ECFF] px-1.5 py-0.5 rounded-md">
                {t('brand.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to={isAuthenticated ? '/' : '/login'}
              className={`text-sm font-medium transition ${
                isActive('/') ? 'text-[#6C4CE3]' : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-medium transition ${
                isActive('/jobs') ? 'text-[#6C4CE3]' : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              {t('nav.findJobs')}
            </Link>
            <Link
              to={isAuthenticated && isEmployer ? '/employer/dashboard' : '/login?role=employer'}
              className={`text-sm font-medium transition ${
                location.pathname.startsWith('/employer') ? 'text-[#6C4CE3]' : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              {t('nav.forEmployers')}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Bilingual Language Switcher */}
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isEmployer ? '/employer/dashboard' : '/student/dashboard'}
                  className="flex items-center gap-2 rounded-xl border border-[#E9EAF1] bg-gray-50/80 px-3.5 py-1.5 text-xs font-semibold text-[#25243A] hover:bg-gray-100 transition"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6C4CE3] text-white text-[11px]">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span>{user?.name}</span>
                  <span className="rounded bg-[#F0ECFF] px-1.5 py-0.5 text-[10px] text-[#6C4CE3]">
                    {isEmployer ? t('nav.employerRole') : t('nav.studentRole')}
                  </span>
                </Link>
                <Tooltip content={t('common:tooltips.logout')}>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="text-xs text-[#73758A] hover:text-[#E05252] transition font-medium cursor-pointer"
                  >
                    {t('common:nav.logout')}
                  </button>
                </Tooltip>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 rounded-xl border border-[#E9EAF1] bg-white px-4 py-2 text-sm font-medium text-[#25243A] hover:bg-gray-50 transition shadow-2xs"
                >
                  <LogIn className="h-4 w-4 text-[#73758A]" />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-[#6C4CE3] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#6C4CE3]/25 hover:bg-[#5638C5] transition"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Tooltip content={mobileMenuOpen ? t('common:tooltips.closeMenu') : t('common:tooltips.openMenu')}>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-[#73758A] hover:bg-gray-100"
                aria-label={mobileMenuOpen ? t('common:tooltips.closeMenu') : t('common:tooltips.openMenu')}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-[#E9EAF1] bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#25243A] hover:bg-gray-50"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#25243A] hover:bg-gray-50"
              >
                {t('nav.findJobs')}
              </Link>
              <Link
                to={isAuthenticated && isEmployer ? '/employer/dashboard' : '/login?role=employer'}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#25243A] hover:bg-gray-50"
              >
                {t('nav.forEmployers')}
              </Link>

              <div className="border-t border-[#E9EAF1] pt-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to={isEmployer ? '/employer/dashboard' : '/student/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-center text-sm font-medium text-white"
                    >
                      {t('nav.dashboard')} ({user?.name})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full rounded-xl border border-gray-200 px-4 py-2 text-center text-xs text-[#E05252]"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#E9EAF1] px-4 py-2.5 text-center text-sm font-medium text-[#25243A]"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs"
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E9EAF1] bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C4CE3] text-white">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-[#25243A]">JobBoard</span>
              </div>
              <p className="text-xs text-[#73758A] leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#25243A] mb-3">
                {t('footer.forStudents')}
              </h4>
              <ul className="space-y-2 text-xs text-[#73758A]">
                <li><Link to="/jobs" className="hover:text-[#6C4CE3]">{t('footer.studentLinks.internships')}</Link></li>
                <li><Link to="/jobs" className="hover:text-[#6C4CE3]">{t('footer.studentLinks.newGrads')}</Link></li>
                <li><Link to="/student/applications" className="hover:text-[#6C4CE3]">{t('footer.studentLinks.track')}</Link></li>
                <li><Link to="/student/skills" className="hover:text-[#6C4CE3]">{t('footer.studentLinks.skills')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#25243A] mb-3">
                {t('footer.forEmployers')}
              </h4>
              <ul className="space-y-2 text-xs text-[#73758A]">
                <li><Link to="/employer/jobs/create" className="hover:text-[#6C4CE3]">{t('footer.employerLinks.postJob')}</Link></li>
                <li><Link to="/employer/jobs" className="hover:text-[#6C4CE3]">{t('footer.employerLinks.manageJobs')}</Link></li>
                <li><Link to="/employer/applicants" className="hover:text-[#6C4CE3]">{t('footer.employerLinks.reviewCandidates')}</Link></li>
                <li><Link to="/employer/dashboard" className="hover:text-[#6C4CE3]">{t('footer.employerLinks.stats')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#25243A] mb-3">
                {t('footer.about')}
              </h4>
              <ul className="space-y-2 text-xs text-[#73758A]">
                <li><span className="cursor-pointer hover:text-[#6C4CE3]">{t('footer.aboutLinks.aboutUs')}</span></li>
                <li><span className="cursor-pointer hover:text-[#6C4CE3]">{t('footer.aboutLinks.contact')}</span></li>
                <li><span className="cursor-pointer hover:text-[#6C4CE3]">{t('footer.aboutLinks.privacy')}</span></li>
                <li><span className="cursor-pointer hover:text-[#6C4CE3]">{t('footer.aboutLinks.terms')}</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E9EAF1] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A0A2B3]">
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
