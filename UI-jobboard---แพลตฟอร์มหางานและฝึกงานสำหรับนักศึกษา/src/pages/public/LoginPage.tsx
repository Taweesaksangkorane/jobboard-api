import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Tooltip } from '../../components/common/Tooltip';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Briefcase, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const from = (location.state as { from?: string })?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(t('auth:login.errorEmpty'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth:login.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-xl">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-white shadow-md shadow-purple-200">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#25243A]">{t('auth:login.title')}</h1>
            <p className="mt-1 text-xs text-[#73758A]">
              {t('auth:login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-[#E05252]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button & Divider */}
          <GoogleAuthButton
            label={t('auth:login.googleBtn')}
            dividerText={t('auth:login.divider')}
            returnPath={from}
            disabled={loading}
            onError={(msg) => setError(msg || null)}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth:login.emailLabel')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth:login.emailPlaceholder')}
            />

            <div className="relative">
              <Input
                label={t('auth:login.passwordLabel')}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth:login.passwordPlaceholder')}
                rightIcon={
                  <Tooltip content={showPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-[#73758A] hover:text-[#25243A] focus:outline-none cursor-pointer"
                      aria-label={showPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Tooltip>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#73758A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#6C4CE3] focus:ring-[#6C4CE3]"
                />
                <span>{t('auth:login.rememberMe')}</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotSubmitted(false);
                  setIsForgotPasswordOpen(true);
                }}
                className="font-medium text-[#6C4CE3] hover:underline cursor-pointer"
              >
                {t('auth:login.forgotPassword')}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              {t('auth:login.submitBtn')}
            </Button>
          </form>

          {/* Test Accounts Info Notice */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-[#F8F9FC] p-3 text-[11px] text-[#73758A] space-y-1">
            <div className="font-semibold text-[#25243A]">{t('auth:login.testAccounts')}</div>
            <div>• {t('auth:login.testStudent')}: <span className="font-mono text-[#6C4CE3]">somchai.rak@university.ac.th</span> / <span className="font-mono">password123</span></div>
            <div>• {t('auth:login.testEmployer')}: <span className="font-mono text-[#5638C5]">recruitment@techforward.co.th</span> / <span className="font-mono">password123</span></div>
          </div>

          <div className="border-t border-[#E9EAF1] mt-6 pt-4 text-center text-xs text-[#73758A]">
            {t('auth:login.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-[#6C4CE3] hover:underline">
              {t('auth:login.registerLink')}
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title={t('auth:forgotPassword.title')}
        maxWidth="sm"
      >
        {!forgotSubmitted ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#6C4CE3]">
                <KeyRound className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-[#25243A]">{t('auth:forgotPassword.heading')}</h4>
              <p className="text-xs text-[#73758A] mt-1">
                {t('auth:forgotPassword.desc')}
              </p>
            </div>

            <Input
              label={t('auth:forgotPassword.emailLabel')}
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <div className="flex gap-2 pt-2">
              <Tooltip content={t('common:tooltips.cancel')}>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="flex-1"
                >
                  {t('auth:forgotPassword.cancelBtn')}
                </Button>
              </Tooltip>
              <Button type="submit" variant="primary" size="md" className="flex-1">
                {t('auth:forgotPassword.submitBtn')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#16A36A]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-[#25243A]">{t('auth:forgotPassword.successTitle')}</h4>
            <p className="text-xs text-[#73758A] leading-relaxed">
              {t('auth:forgotPassword.successDesc', { email: forgotEmail })}
            </p>
            <Tooltip content={t('common:tooltips.close')}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="mt-4"
              >
                {t('auth:forgotPassword.closeBtn')}
              </Button>
            </Tooltip>
          </div>
        )}
      </Modal>
    </div>
  );
};
