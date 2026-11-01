import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { SupabaseConfigError, PopupBlockedError } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  label: string;
  dividerText: string;
  returnPath?: string;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export const GoogleLogoIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  label,
  dividerText,
  returnPath,
  disabled = false,
  onError,
}) => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [isStartingOAuth, setIsStartingOAuth] = useState(false);

  // Listen for OAuth popup completion when running inside an iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin || '';
      const isTrustedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');

      if (!isTrustedOrigin) return;

      if (event.data?.type === 'SUPABASE_OAUTH_CALLBACK') {
        setIsStartingOAuth(false);
        const search = typeof event.data.search === 'string' ? event.data.search : '';
        const hash = typeof event.data.hash === 'string' ? event.data.hash : '';
        navigate(`/auth/callback${search}${hash}`, { replace: true });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const handleGoogleClick = async () => {
    if (onError) onError('');

    try {
      setIsStartingOAuth(true);
      const { usedPopup } = await loginWithGoogle({
        redirectTo: `${window.location.origin}/auth/callback`,
        returnPath,
      });

      // If popup was opened, reset spinner after reasonable timeout if user closes popup manually
      if (usedPopup) {
        setTimeout(() => {
          setIsStartingOAuth(false);
        }, 45000);
      }
    } catch (err) {
      setIsStartingOAuth(false);
      if (
        err instanceof SupabaseConfigError ||
        (err instanceof Error && err.message.includes('MISSING_SUPABASE_CONFIG'))
      ) {
        onError?.(t('auth:google.oauthFailed'));
        return;
      }

      if (err instanceof PopupBlockedError) {
        onError?.(t('auth:google.popupBlocked'));
        return;
      }

      onError?.(err instanceof Error ? err.message : t('auth:google.oauthFailed'));
    }
  };

  return (
    <div className="space-y-4 mb-5">
      <button
        type="button"
        disabled={disabled || isStartingOAuth}
        onClick={handleGoogleClick}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E9EAF1] bg-white px-4 py-3 text-sm font-semibold text-[#25243A] shadow-2xs transition-all duration-150 hover:border-[#D4D6E4] hover:bg-[#F8F9FC] focus:outline-none focus:ring-2 focus:ring-[#6C4CE3]/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {isStartingOAuth ? (
          <Loader2 className="h-5 w-5 animate-spin text-[#6C4CE3]" />
        ) : (
          <GoogleLogoIcon className="h-5 w-5 shrink-0" />
        )}
        <span>{label}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="grow border-t border-[#E9EAF1]" />
        <span className="mx-3 shrink-0 text-xs font-medium text-[#73758A]">
          {dividerText}
        </span>
        <div className="grow border-t border-[#E9EAF1]" />
      </div>
    </div>
  );
};
