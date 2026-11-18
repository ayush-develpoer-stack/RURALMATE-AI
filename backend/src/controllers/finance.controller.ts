import type { Request, Response } from 'express';
import { success, failure } from '../utils/response';
import { toNumber, validateFinanceInput } from '../utils/validation';
import { computeFinance } from '../services/finance.service';
import { saveFinance } from '../services/userData.service';
import type { FinanceInput } from '../types/finance';

export async function calculateFinance(req: Request, res: Response): Promise<Response> {
  const body = req.body as Record<string, unknown>;
  const parsed: Record<string, unknown> = {
    projectCost: toNumber(body.projectCost),
    ownCapital: toNumber(body.ownCapital),
  };

  const { valid, errors } = validateFinanceInput(parsed);
  if (!valid) return failure(res, errors.join(', '), 422);

  const input: FinanceInput = {
    projectCost: toNumber(body.projectCost),
    ownCapital: toNumber(body.ownCapital),
    monthlyRevenue: toNumber(body.monthlyRevenue),
    monthlyExpenses: toNumber(body.monthlyExpenses),
    annualInterestRate: toNumber(body.annualInterestRate, 10),
    loanTenureMonths: toNumber(body.loanTenureMonths, 60),
  };

  // Deterministic calculation (never AI). Persist a snapshot for the user.
  const result = computeFinance(input);
  if (req.user?.sub) await saveFinance(req.user.sub, result);
  return success(res, result);
}
