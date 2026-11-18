import { apiClient } from './api';
import type { BusinessPlan } from '@/types/product';
import type { AnalysisResult, EntrepreneurProfile } from '@/types/business';
import type { FinanceResult } from '@/types/finance';
import type { SchemeMatch } from '@/types/scheme';

export interface BusinessPlanInput {
  profile: Partial<EntrepreneurProfile>;
  analysis?: Partial<AnalysisResult>;
  financials?: Partial<FinanceResult>;
  topScheme?: Partial<SchemeMatch>;
}

export type ChatType =
  | 'text'
  | 'feasibility'
  | 'financial_summary'
  | 'scheme'
  | 'comparison';

export interface ChatInsight {
  label: string;
  value: number;
  unit?: string;
}
export interface ChatChart {
  type: 'bar' | 'line';
  title: string;
  data: { label: string; value: number }[];
}
export interface ChatFinancialItem {
  label: string;
  value: string;
}
export interface ChatAction {
  label: string;
  href: string;
}
export interface ChatResponse {
  type: ChatType;
  mode: 'ai' | 'demo';
  message: string;
  insights?: ChatInsight[];
  chart?: ChatChart;
  financial?: ChatFinancialItem[];
  actions?: ChatAction[];
}

export interface SavedBusinessPlan {
  id: string;
  title: string;
  subtitle: string;
  generatedBy: 'ai' | 'demo';
  sections: { title: string; body: string }[];
  createdAt: string;
}

export const aiService = {
  generateBusinessPlan: (input: BusinessPlanInput) =>
    apiClient.post<BusinessPlan & { saved?: boolean }>('/ai/business-plan', input),

  listBusinessPlans: () =>
    apiClient.get<{ plans: SavedBusinessPlan[] }>('/ai/business-plans'),

  deleteBusinessPlan: (id: string) =>
    apiClient.del<{ deleted: boolean }>(`/ai/business-plans/${encodeURIComponent(id)}`),

  chat: (message: string) => apiClient.post<ChatResponse>('/ai/chat', { message }),
};
