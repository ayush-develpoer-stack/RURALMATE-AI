const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiSuccess<T> {
  success: true;
  data: T;
}
interface ApiError {
  success: false;
  message: string;
}
type ApiResponse<T> = ApiSuccess<T> | ApiError;

export class ApiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const TOKEN_KEY = 'ruralmate:token';

/** Broadcast when an authenticated request is rejected with 401 (expired/invalid session). */
export const SESSION_EXPIRED_EVENT = 'ruralmate:session-expired';
const EXPIRED_FLAG_KEY = 'ruralmate:session-expired';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

/**
 * Handle an expired/invalid session centrally: clear the stored token, leave a
 * one-shot flag the login screen reads to explain what happened, and notify the
 * app (AuthContext) so it can drop the user and let the route guards redirect.
 */
function handleSessionExpired(): void {
  tokenStore.clear();
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(EXPIRED_FLAG_KEY, '1');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

/** Read-and-clear the "your session expired" flag (used by the login screen). */
export function consumeSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const had = sessionStorage.getItem(EXPIRED_FLAG_KEY) === '1';
    if (had) sessionStorage.removeItem(EXPIRED_FLAG_KEY);
    return had;
  } catch {
    return false;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStore.get();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (e) {
    throw new ApiRequestError(
      'Cannot reach the RuralMate AI server. Please make sure the backend is running.',
    );
  }

  let json: ApiResponse<T> | null = null;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError('Received an invalid response from the server.');
  }

  if (!res.ok || !json || json.success === false) {
    // An authenticated request rejected with 401 means the session token is
    // expired/invalid. Only trigger the global sign-out when a token was
    // actually sent — a 401 from login (wrong password) must not sign the user
    // out or show a "session expired" message.
    if (res.status === 401 && token) {
      handleSessionExpired();
    }
    const message =
      json && json.success === false ? json.message : 'Something went wrong. Please try again.';
    throw new ApiRequestError(message, res.status);
  }

  return json.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  health: async (): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  },
};

export { API_URL };
