import { apiClient } from './api';
import type { DashboardData } from '@/types/dashboard';

export const dashboardService = {
  get: () => apiClient.get<DashboardData>('/dashboard'),
};
