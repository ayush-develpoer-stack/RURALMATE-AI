import { apiClient } from './api';
import type { FinanceInput, FinanceResult } from '@/types/finance';

export const financeService = {
  calculate: (input: FinanceInput) =>
    apiClient.post<FinanceResult>('/finance/calculate', input),
};
