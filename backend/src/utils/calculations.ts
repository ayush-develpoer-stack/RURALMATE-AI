import type { CashFlowPoint } from '../types/finance';

/**
 * Deterministic financial calculations.
 * AI must NEVER be used for these numbers.
 */

export function calculateFinancingGap(projectCost: number, ownCapital: number): number {
  return Math.max(0, Math.round(projectCost - ownCapital));
}

export function calculateMonthlySurplus(monthlyRevenue: number, monthlyExpenses: number): number {
  return Math.round(monthlyRevenue - monthlyExpenses);
}

/**
 * Standard reducing-balance EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where r = monthly interest rate, n = tenure in months.
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualInterestRate <= 0) {
    return Math.round(principal / tenureMonths);
  }
  const r = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Break-even in months: how long until cumulative monthly surplus
 * (after EMI) recovers the entrepreneur's own capital invested.
 * Returns null if the business never breaks even (non-positive net cash flow).
 */
export function calculateBreakEvenMonths(
  ownCapital: number,
  monthlySurplus: number,
  emi: number,
): number | null {
  const net = monthlySurplus - emi;
  if (net <= 0) return null;
  return Math.ceil(ownCapital / net);
}

export function calculateTotalInterest(emi: number, tenureMonths: number, principal: number): number {
  if (emi <= 0) return 0;
  return Math.max(0, Math.round(emi * tenureMonths - principal));
}

export function buildCashFlow(
  monthlySurplus: number,
  emi: number,
  tenureMonths: number,
  ownCapital: number,
): CashFlowPoint[] {
  const netCashFlow = monthlySurplus - emi;
  const points: CashFlowPoint[] = [];
  const horizon = Math.min(Math.max(tenureMonths, 12), 24);
  let cumulative = -ownCapital;
  for (let month = 1; month <= horizon; month++) {
    const activeEmi = month <= tenureMonths ? emi : 0;
    const monthNet = monthlySurplus - activeEmi;
    cumulative += monthNet;
    points.push({
      month,
      cumulativeSurplus: Math.round(cumulative),
      emi: activeEmi,
      netCashFlow: Math.round(month <= tenureMonths ? netCashFlow : monthlySurplus),
    });
  }
  return points;
}
