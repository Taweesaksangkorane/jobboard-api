import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import {
  isSupabaseConfigured,
  resolveSupabaseCallbackSession,
  OAUTH_RETURN_PATH_KEY,
  SupabaseConfigError,
} from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { Loader2, AlertCircle, CheckCircle2, Briefcase } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticatedUser } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const processedRef = useRef(false);

  useEffect(() => {
    // If opened inside an OAuth popup window, relay parameters to opener and close
    try {
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(
          {
            type: 'SUPABASE_OAUTH_CALLBACK',
            search: window.location.search,
            hash: window.location.hash,
          },
          '*'
        );
        window.close();
        return;
      }
    } catch {
      // proceed normally if cross-window check fails
    }

    if (processedRef.current) return;
    processedRef.current = true;

    const handleAuthCallback = async () => {
      if (!isSupabaseConfigured) {
        setStatus('error');
        setErrorMessage(t('auth:google.oauthFailed'));
        return;
      }

      try {
        setStatus('loading');

        // 1. Validate & retrieve authenticated Supabase session
        const { session } = await resolveSupabaseCallbackSession(
          location.search || window.location.search,
          location.hash || window.location.hash
        );

        // Clean sensitive hash tokens from browser address bar
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // 2. Verify session with JobBoard backend & check existing profile/role
        const syncResult = await authService.syncGoogleUser(session.access_token);

        // 3. New user (no JobBoard profile/role yet) -> Redirect to Account Type Selection
        if (syncResult.isNew || !syncResult.user || !syncResult.token) {
          navigate('/auth/select-role', {
            replace: true,
            state: {
              googleUser: syncResult.googleUser,
            },
          });
          return;
        }

        // 4. Existing user -> Set authenticated state & redirect based on assigned role
        const verifiedUser = syncResult.user;
        setAuthenticatedUser(verifiedUser, syncResult.token);
        setStatus('success');

        let savedReturnPath: string | null = null;
        try {
          savedReturnPath = sessionStorage.getItem(OAUTH_RETURN_PATH_KEY);
          sessionStorage.removeItem(OAUTH_RETURN_PATH_KEY);
        } catch {
          // ignore
        }

        const destination =
          verifiedUser.role === 'employer'
            ? savedReturnPath && savedReturnPath.startsWith('/employer')
              ? savedReturnPath
              : '/employer/dashboard'
            : savedReturnPath && !savedReturnPath.startsWith('/employer')
              ? savedReturnPath
              : '/student/dashboard';

        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 500);
      } catch (err) {
        setStatus('error');
        if (err instanceof SupabaseConfigError) {
          setErrorMessage(t('auth:google.oauthFailed'));
        } else {
          setErrorMessage(
            err instanceof Error ? err.message : t('auth:google.oauthFailed')
          );
        }
      }
    };

    handleAuthCallback();
  }, [location.hash, location.search, navigate, setAuthenticatedUser, t]);

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#E9EAF1] bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C4CE3] text-white shadow-md shadow-purple-200">
          <Briefcase className="h-6 w-6" />
        </div>

        {status === 'loading' && (
          <div className="space-y-3 py-4">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#6C4CE3]" />
            <h1 className="text-lg font-bold text-[#25243A]">
              {t('auth:google.callbackLoadingTitle')}
            </h1>
            <p className="text-xs leading-relaxed text-[#73758A]">
              {t('auth:google.callbackLoadingSubtitle')}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#16A36A]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold text-[#25243A]">
              {t('auth:google.loginSuccess')}
            </h1>
            <p className="text-xs text-[#73758A]">
              {t('auth:google.redirectingDashboard')}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#E05252]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold text-[#25243A]">
              {t('auth:google.callbackErrorTitle')}
            </h1>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-left text-xs leading-relaxed text-[#E05252]">
              {errorMessage}
            </div>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" size="md" className="w-full">
                  {t('auth:google.backToLogin')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
