import { apiClient, tokenStore } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const data = await apiClient.post<AuthResponse>('/auth/register', { name, email, password });
    tokenStore.set(data.token);
    return data.user;
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    tokenStore.set(data.token);
    return data.user;
  },

  async me(): Promise<AuthUser> {
    const data = await apiClient.get<{ user: AuthUser }>('/auth/me');
    return data.user;
  },

  logout(): void {
    tokenStore.clear();
  },

  hasToken(): boolean {
    return Boolean(tokenStore.get());
  },
};
