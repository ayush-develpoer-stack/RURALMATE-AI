import { apiClient } from './api';
import type { SchemeMatchResult } from '@/types/scheme';
import type { BusinessCategory, BusinessStatus } from '@/types/business';

export interface SchemeMatchInput {
  category?: BusinessCategory;
  businessStatus?: BusinessStatus;
  projectCost?: number;
}

export const schemeService = {
  getSchemes: () => apiClient.get<SchemeMatchResult>('/schemes'),
  match: (input: SchemeMatchInput) =>
    apiClient.post<SchemeMatchResult>('/schemes/match', input),
};
