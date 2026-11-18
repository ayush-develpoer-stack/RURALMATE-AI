import { apiClient } from './api';
import type { AnalysisResult, EntrepreneurProfile } from '@/types/business';

export const analysisService = {
  submitProfile: (profile: EntrepreneurProfile) =>
    apiClient.post<{ profile: EntrepreneurProfile }>('/analysis/profile', profile),

  getAnalysis: () => apiClient.get<AnalysisResult>('/analysis'),

  analyze: (profile?: Partial<EntrepreneurProfile>) =>
    apiClient.post<AnalysisResult>('/analysis', profile ?? {}),
};
