import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Tooltip } from '../../components/common/Tooltip';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Briefcase, User, Building2, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Student fields
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t('auth:register.errorEmail'));
      return;
    }

    // 2. Password security check
    if (password.length < 6) {
      setError(t('auth:register.errorPasswordLength'));
      return;
    }

    // 3. Confirm password matching
    if (password !== confirmPassword) {
      setError(t('auth:register.errorPasswordMismatch'));
      return;
    }

    // 4. Terms and conditions acceptance
    if (!agreeTerms) {
      setError(t('auth:register.errorTerms'));
      return;
    }

    try {
      setLoading(true);

      if (role === 'student') {
        if (!studentName.trim()) {
          setError(t('auth:register.errorStudentName'));
          setLoading(false);
          return;
        }

        await register({
          role: 'student',
          name: studentName.trim(),
          email: email.trim(),
          password,
          studentId: studentId.trim() || undefined,
        });

        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      } else {
        if (!companyName.trim()) {
          setError(t('auth:register.errorCompanyName'));
          setLoading(false);
          return;
        }
        if (!contactPerson.trim()) {
          setError(t('auth:register.errorContactPerson'));
          setLoading(false);
          return;
        }
        if (!companyInfo.trim() || companyInfo.trim().length < 10) {
          setError(t('auth:register.errorCompanyInfo'));
          setLoading(false);
          return;
        }

        await register({
          role: 'employer',
          name: contactPerson.trim(),
          email: email.trim(),
          password,
          companyName: companyName.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim() || undefined,
          companyInfo: companyInfo.trim(),
        });

        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate('/employer/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-white shadow-md shadow-purple-200">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#25243A]">{t('auth:register.title')}</h1>
            <p className="mt-1 text-xs text-[#73758A]">
              {t('auth:register.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-[#E05252]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Registration Button & Divider */}
          <GoogleAuthButton
            label={t('auth:register.googleBtn')}
            dividerText={t('auth:register.divider')}
            returnPath={from}
            disabled={loading}
            onError={(msg) => setError(msg || null)}
          />

          {/* Account Type Selector Tabs for Email/Password Registration */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F9FC] p-1.5 border border-[#E9EAF1]">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-[#6C4CE3] shadow-xs'
                  : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              <User className="h-4 w-4" />
              {t('auth:register.studentTab')}
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('employer');
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer ${
                role === 'employer'
                  ? 'bg-white text-[#5638C5] shadow-xs'
                  : 'text-[#73758A] hover:text-[#25243A]'
              }`}
            >
              <Building2 className="h-4 w-4" />
              {t('auth:register.employerTab')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'student' ? (
              <>
                <Input
                  label={t('auth:register.studentNameLabel')}
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={t('auth:register.studentNamePlaceholder')}
                />
                <Input
                  label={t('auth:register.studentIdLabel')}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder={t('auth:register.studentIdPlaceholder')}
                  helperText={t('auth:register.studentIdHelper')}
                />
              </>
            ) : (
              <>
                <Input
                  label={t('auth:register.companyNameLabel')}
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t('auth:register.companyNamePlaceholder')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label={t('auth:register.contactPersonLabel')}
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder={t('auth:register.contactPersonPlaceholder')}
                  />
                  <Input
                    label={t('auth:register.phoneLabel')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('auth:register.phonePlaceholder')}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#25243A]">
                    {t('auth:register.companyInfoLabel')} <span className="text-[#E05252]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                    placeholder={t('auth:register.companyInfoPlaceholder')}
                    className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
                  />
                </div>
              </>
            )}

            <Input
              label={t('auth:register.emailLabel')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'student@university.ac.th' : 'hr@company.com'}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  label={t('auth:register.passwordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth:register.passwordPlaceholder')}
                  rightIcon={
                    <Tooltip content={showPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-[#73758A] hover:text-[#25243A] cursor-pointer"
                        aria-label={showPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </Tooltip>
                  }
                />
              </div>
              <div className="relative">
                <Input
                  label={t('auth:register.confirmPasswordLabel')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth:register.confirmPasswordPlaceholder')}
                  rightIcon={
                    <Tooltip content={showConfirmPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-[#73758A] hover:text-[#25243A] cursor-pointer"
                        aria-label={showConfirmPassword ? t('common:tooltips.hidePassword') : t('common:tooltips.showPassword')}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </Tooltip>
                  }
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-[#73758A] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#6C4CE3] focus:ring-[#6C4CE3]"
              />
              <span>
                {t('auth:register.termsAgree')}{' '}
                <span className="font-semibold text-[#6C4CE3] underline">{t('auth:register.termsLink')}</span>{' '}
                {t('auth:register.and')}{' '}
                <span className="font-semibold text-[#6C4CE3] underline">
                  {t('auth:register.privacyLink')}
                </span>{' '}
                {t('auth:register.termsEnd')}
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              {t('auth:register.submitBtn', {
                role: role === 'student' ? t('auth:register.studentRoleLabel') : t('auth:register.employerRoleLabel'),
              })}
            </Button>
          </form>

          <div className="border-t border-[#E9EAF1] mt-6 pt-4 text-center text-xs text-[#73758A]">
            {t('auth:register.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-[#6C4CE3] hover:underline">
              {t('auth:register.loginLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
