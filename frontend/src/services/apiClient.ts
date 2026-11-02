const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !body?.success) {
    throw new Error(body?.error || `API request failed (${response.status})`);
  }

  return body.data;
}
