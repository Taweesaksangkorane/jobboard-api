import { createClient, SupabaseClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '../types';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('YOUR_') &&
    !supabaseAnonKey.includes('YOUR_') &&
    supabaseAnonKey.length > 15
);

/**
 * Active Supabase client if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.
 * Never uses service-role keys on the client.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    })
  : null;

export const OAUTH_RETURN_PATH_KEY = 'jobboard_oauth_return_to';

export class SupabaseConfigError extends Error {
  code = 'MISSING_SUPABASE_CONFIG';
  constructor(message?: string) {
    super(
      message ||
        'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
    this.name = 'SupabaseConfigError';
  }
}

export class PopupBlockedError extends Error {
  code = 'POPUP_BLOCKED';
  constructor() {
    super('Popup window was blocked by the browser.');
    this.name = 'PopupBlockedError';
  }
}

function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Initiates Google OAuth 2.0 authentication via Supabase Auth.
 * - In standalone tabs: performs standard Supabase OAuth redirect to /auth/callback.
 * - Inside cross-origin iframes (e.g. preview environments where accounts.google.com sets X-Frame-Options: DENY):
 *   uses skipBrowserRedirect to open the Supabase Google OAuth provider URL in a popup and relays the callback back.
 */
export async function signInWithGoogleOAuth(options?: {
  redirectTo?: string;
  returnPath?: string;
}): Promise<{ usedPopup: boolean; url?: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseConfigError();
  }

  try {
    if (options?.returnPath) {
      sessionStorage.setItem(OAUTH_RETURN_PATH_KEY, options.returnPath);
    } else {
      sessionStorage.removeItem(OAUTH_RETURN_PATH_KEY);
    }
  } catch {
    // ignore storage restrictions
  }

  const callbackUrl = options?.redirectTo || `${window.location.origin}/auth/callback`;
  const inIframe = isRunningInIframe();

  if (!inIframe) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw error;
    }

    return { usedPopup: false, url: data.url };
  }

  // Inside cross-origin iframe: open provider URL directly in popup to avoid X-Frame-Options block
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error('Failed to generate Google OAuth authorization URL.');
  }

  const width = 520;
  const height = 660;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

  const popup = window.open(
    data.url,
    'supabase_google_oauth',
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no`
  );

  if (!popup) {
    throw new PopupBlockedError();
  }

  return { usedPopup: true, url: data.url };
}

/**
 * Extracts Google user display metadata from a verified Supabase User object.
 */
export function extractGoogleUserMetadata(sbUser: SupabaseUser): {
  supabaseId: string;
  email: string;
  name: string;
  avatarUrl: string;
} {
  const meta = sbUser.user_metadata || {};
  return {
    supabaseId: sbUser.id,
    email: (sbUser.email || meta.email || '').trim().toLowerCase(),
    name: (meta.full_name || meta.name || '').trim(),
    avatarUrl: (meta.avatar_url || meta.picture || '').trim(),
  };
}

/**
 * Establishes or retrieves the active Supabase session from callback URL parameters/hash.
 */
export async function resolveSupabaseCallbackSession(
  searchStr: string,
  hashStr: string
): Promise<{ session: Session; user: SupabaseUser }> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseConfigError();
  }

  const searchParams = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
  const hashParams = new URLSearchParams(hashStr.startsWith('#') ? hashStr.slice(1) : hashStr);

  // Check OAuth error returned by Supabase or Google
  const oauthError =
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    searchParams.get('error') ||
    hashParams.get('error');

  if (oauthError) {
    throw new Error(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
  }

  // 1. Implicit hash tokens (e.g. #access_token=...&refresh_token=...)
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    if (data.session && data.user) {
      return { session: data.session, user: data.user };
    }
  }

  // 2. PKCE authorization code (e.g. ?code=...)
  const code = searchParams.get('code');
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    if (data.session && data.user) {
      return { session: data.session, user: data.user };
    }
  }

  // 3. Existing session already parsed by detectSessionInUrl
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  if (sessionData.session) {
    const { data: userData, error: userError } = await supabase.auth.getUser(
      sessionData.session.access_token
    );
    if (userError) throw userError;
    if (userData.user) {
      return { session: sessionData.session, user: userData.user };
    }
  }

  throw new Error('No active authentication session found. Please sign in again.');
}

/**
 * Attempts to read the user's profile from Supabase `public.profiles` table (with RLS).
 * Returns null if no profile row exists yet or if the `profiles` table has not been provisioned yet.
 */
export async function fetchSupabaseProfile(userId: string): Promise<User | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  if (data.role !== 'student' && data.role !== 'employer') {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role as UserRole,
    name: data.name,
    studentId: data.student_id || undefined,
    companyName: data.company_name || undefined,
    contactPerson: data.contact_person || undefined,
    phone: data.phone || undefined,
    bio: data.company_info || undefined,
    avatarUrl: data.avatar_url || undefined,
  };
}

/**
 * Saves or updates the user's profile in Supabase `public.profiles` (when provisioned)
 * and updates Supabase Auth user_metadata as a secondary record.
 */
export async function saveSupabaseProfile(params: {
  supabaseId: string;
  email: string;
  role: UserRole;
  name: string;
  studentId?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  companyInfo?: string;
  avatarUrl?: string;
}): Promise<void> {
  if (!supabase) return;

  // Attempt upsert into public.profiles (protected by RLS)
  try {
    await supabase.from('profiles').upsert(
      {
        id: params.supabaseId,
        email: params.email,
        role: params.role,
        name: params.name,
        student_id: params.studentId || null,
        company_name: params.companyName || null,
        contact_person: params.contactPerson || null,
        phone: params.phone || null,
        company_info: params.companyInfo || null,
        avatar_url: params.avatarUrl || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch {
    // profiles table may not be created yet
  }

  // Also store JobBoard profile metadata on the authenticated Supabase user
  try {
    await supabase.auth.updateUser({
      data: {
        jobboard_role: params.role,
        jobboard_name: params.name,
        student_id: params.studentId || null,
        company_name: params.companyName || null,
        contact_person: params.contactPerson || null,
        phone: params.phone || null,
        company_info: params.companyInfo || null,
      },
    });
  } catch {
    // ignore metadata update error
  }
}
