import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import {
  supabase,
  isSupabaseConfigured,
  extractGoogleUserMetadata,
  OAUTH_RETURN_PATH_KEY,
} from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Tooltip } from '../../components/common/Tooltip';
import { GoogleLogoIcon } from '../../components/auth/GoogleAuthButton';
import {
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
} from 'lucide-react';

export const SelectRolePage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { setAuthenticatedUser, logout } = useAuth();

  // Session & verification state
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [supabaseAccessToken, setSupabaseAccessToken] = useState<string>('');
  const [supabaseId, setSupabaseId] = useState<string>('');
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [googleAvatar, setGoogleAvatar] = useState<string>('');

  // Explicit role selection — MUST start null (never auto-assign a default role)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Student fields
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  // Employer fields
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const verifyGoogleSession = async () => {
      if (!isSupabaseConfigured || !supabase) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr || !sessionData.session) {
          navigate('/login', { replace: true });
          return;
        }

        const token = sessionData.session.access_token;
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user || !userData.user.email) {
          navigate('/login', { replace: true });
          return;
        }

        // Check if this Google user already has a completed profile/role (prevent duplicate accounts)
        const syncRes = await authService.syncGoogleUser(token);
        if (!syncRes.isNew && syncRes.user && syncRes.token) {
          if (!cancelled) {
            setAuthenticatedUser(syncRes.user, syncRes.token);
            navigate(
              syncRes.user.role === 'employer'
                ? '/employer/dashboard'
                : '/student/dashboard',
              { replace: true }
            );
          }
          return;
        }

        const meta = extractGoogleUserMetadata(userData.user);
        if (!cancelled) {
          setSupabaseAccessToken(token);
          setSupabaseId(meta.supabaseId);
          setGoogleEmail(meta.email);
          setGoogleAvatar(meta.avatarUrl);
          if (meta.name) {
            setStudentName(meta.name);
            setContactPerson(meta.name);
          }
          setVerifyingSession(false);
        }
      } catch {
        if (!cancelled) {
          navigate('/login', { replace: true });
        }
      }
    };

    verifyGoogleSession();

    return () => {
      cancelled = true;
    };
  }, [navigate, setAuthenticatedUser]);

  const handleCancelAndSwitch = async () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError(t('auth:selectRole.errorSelectRole'));
      return;
    }

    if (selectedRole === 'student') {
      if (!studentName.trim()) {
        setError(t('auth:register.errorStudentName'));
        return;
      }
    } else {
      if (!companyName.trim()) {
        setError(t('auth:register.errorCompanyName'));
        return;
      }
      if (!contactPerson.trim()) {
        setError(t('auth:register.errorContactPerson'));
        return;
      }
      if (!companyInfo.trim() || companyInfo.trim().length < 10) {
        setError(t('auth:register.errorCompanyInfo'));
        return;
      }
    }

    try {
      setSubmitting(true);
      const createdUser = await authService.completeGoogleRegistration(
        supabaseAccessToken,
        {
          role: selectedRole,
          email: googleEmail,
          name:
            selectedRole === 'student'
              ? studentName.trim()
              : contactPerson.trim(),
          studentId:
            selectedRole === 'student'
              ? studentId.trim() || undefined
              : undefined,
          companyName:
            selectedRole === 'employer' ? companyName.trim() : undefined,
          contactPerson:
            selectedRole === 'employer' ? contactPerson.trim() : undefined,
          phone:
            selectedRole === 'employer' ? phone.trim() || undefined : undefined,
          companyInfo:
            selectedRole === 'employer' ? companyInfo.trim() : undefined,
          avatarUrl: googleAvatar || undefined,
          supabaseId,
        }
      );

      setAuthenticatedUser(createdUser, authService.getToken() || undefined);
      setCompletedSuccess(true);

      let savedReturnPath: string | null = null;
      try {
        savedReturnPath = sessionStorage.getItem(OAUTH_RETURN_PATH_KEY);
        sessionStorage.removeItem(OAUTH_RETURN_PATH_KEY);
      } catch {
        // ignore
      }

      const destination =
        createdUser.role === 'employer'
          ? savedReturnPath && savedReturnPath.startsWith('/employer')
            ? savedReturnPath
            : '/employer/dashboard'
          : savedReturnPath && !savedReturnPath.startsWith('/employer')
            ? savedReturnPath
            : '/student/dashboard';

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 600);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('auth:google.oauthFailed')
      );
      setSubmitting(false);
    }
  };

  if (verifyingSession) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E9EAF1] bg-white p-8 text-center shadow-xl">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#6C4CE3]" />
          <p className="mt-3 text-xs font-medium text-[#73758A]">
            {t('auth:google.callbackLoadingSubtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-white shadow-md shadow-purple-200">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#25243A]">
              {t('auth:selectRole.title')}
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-[#73758A]">
              {t('auth:selectRole.subtitle')}
            </p>
          </div>

          {/* Verified Google Account Summary Pill */}
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#E9EAF1] bg-[#F8F9FC] p-3.5">
            <div className="flex items-center gap-3 overflow-hidden">
              {googleAvatar ? (
                <img
                  src={googleAvatar}
                  alt={googleEmail}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-full border border-[#E9EAF1] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C4CE3] text-sm font-bold text-white">
                  {googleEmail.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#16A36A]">
                  <GoogleLogoIcon className="h-3.5 w-3.5" />
                  <span>{t('auth:selectRole.verifiedGoogleAccount')}</span>
                </div>
                <p className="truncate text-xs font-medium text-[#25243A]">
                  {googleEmail}
                </p>
              </div>
            </div>

            <Tooltip content={t('common:tooltips.switchAccount')}>
              <button
                type="button"
                onClick={handleCancelAndSwitch}
                aria-label={t('common:tooltips.switchAccount')}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-[#73758A] hover:bg-white hover:text-[#E05252] transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('auth:selectRole.switchAccountBtn')}</span>
              </button>
            </Tooltip>
          </div>

          {completedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#16A36A]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-[#25243A]">
                {t('auth:google.registerSuccess')}
              </h2>
              <p className="text-xs text-[#73758A]">
                {t('auth:google.redirectingDashboard')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-[#E05252]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Role Selection Cards */}
              <div>
                <label className="mb-2.5 block text-xs font-semibold text-[#25243A]">
                  {t('auth:selectRole.chooseRoleLabel')} <span className="text-[#E05252]">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Student Role Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('student');
                      setError(null);
                    }}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                      selectedRole === 'student'
                        ? 'border-[#6C4CE3] bg-[#F0ECFF]/60 ring-2 ring-[#6C4CE3]/20'
                        : 'border-[#E9EAF1] bg-white hover:border-[#D4D6E4] hover:bg-[#F8F9FC]'
                    }`}
                  >
                    <div className="mb-2.5 flex w-full items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          selectedRole === 'student'
                            ? 'bg-[#6C4CE3] text-white'
                            : 'bg-[#F0ECFF] text-[#6C4CE3]'
                        }`}
                      >
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      {selectedRole === 'student' && (
                        <CheckCircle2 className="h-4 w-4 text-[#6C4CE3]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#25243A]">
                      {t('auth:selectRole.studentCardTitle')}
                    </span>
                    <span className="mt-1 text-[11px] leading-relaxed text-[#73758A]">
                      {t('auth:selectRole.studentCardDesc')}
                    </span>
                  </button>

                  {/* Employer Role Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('employer');
                      setError(null);
                    }}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-left transition cursor-pointer ${
                      selectedRole === 'employer'
                        ? 'border-[#6C4CE3] bg-[#F0ECFF]/60 ring-2 ring-[#6C4CE3]/20'
                        : 'border-[#E9EAF1] bg-white hover:border-[#D4D6E4] hover:bg-[#F8F9FC]'
                    }`}
                  >
                    <div className="mb-2.5 flex w-full items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          selectedRole === 'employer'
                            ? 'bg-[#6C4CE3] text-white'
                            : 'bg-[#F0ECFF] text-[#6C4CE3]'
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>
                      {selectedRole === 'employer' && (
                        <CheckCircle2 className="h-4 w-4 text-[#6C4CE3]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#25243A]">
                      {t('auth:selectRole.employerCardTitle')}
                    </span>
                    <span className="mt-1 text-[11px] leading-relaxed text-[#73758A]">
                      {t('auth:selectRole.employerCardDesc')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Role-Specific Profile Details */}
              {selectedRole === 'student' && (
                <div className="space-y-4 border-t border-[#E9EAF1] pt-5">
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
                  <Input
                    label={t('auth:register.emailLabel')}
                    type="email"
                    value={googleEmail}
                    disabled
                    helperText={t('auth:selectRole.emailReadOnlyHelper')}
                    className="bg-gray-50 text-[#73758A]"
                  />
                </div>
              )}

              {selectedRole === 'employer' && (
                <div className="space-y-4 border-t border-[#E9EAF1] pt-5">
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
                      {t('auth:register.companyInfoLabel')}{' '}
                      <span className="text-[#E05252]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={companyInfo}
                      onChange={(e) => setCompanyInfo(e.target.value)}
                      placeholder={t('auth:register.companyInfoPlaceholder')}
                      className="w-full rounded-xl border border-[#E9EAF1] bg-white px-3.5 py-2 text-xs text-[#25243A] placeholder-[#A0A2B3] focus:border-[#6C4CE3] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20"
                    />
                  </div>
                  <Input
                    label={t('auth:register.emailLabel')}
                    type="email"
                    value={googleEmail}
                    disabled
                    helperText={t('auth:selectRole.emailReadOnlyHelper')}
                    className="bg-gray-50 text-[#73758A]"
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                disabled={!selectedRole}
                className="w-full"
              >
                {t('auth:selectRole.completeBtn')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
