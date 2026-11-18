import type { FinanceInput, FinanceResult } from '../types/finance';
import {
  buildCashFlow,
  calculateBreakEvenMonths,
  calculateEMI,
  calculateFinancingGap,
  calculateMonthlySurplus,
  calculateTotalInterest,
} from '../utils/calculations';

export function computeFinance(input: FinanceInput): FinanceResult {
  const projectCost = Math.max(0, input.projectCost);
  const ownCapital = Math.max(0, input.ownCapital);
  const monthlyRevenue = Math.max(0, input.monthlyRevenue);
  const monthlyExpenses = Math.max(0, input.monthlyExpenses);
  const annualInterestRate = input.annualInterestRate > 0 ? input.annualInterestRate : 10;
  const loanTenureMonths = input.loanTenureMonths > 0 ? input.loanTenureMonths : 60;

  const financingGap = calculateFinancingGap(projectCost, ownCapital);
  const monthlySurplus = calculateMonthlySurplus(monthlyRevenue, monthlyExpenses);
  const estimatedEmi = calculateEMI(financingGap, annualInterestRate, loanTenureMonths);
  const netMonthlyAfterEmi = monthlySurplus - estimatedEmi;
  const breakEvenMonths = calculateBreakEvenMonths(ownCapital, monthlySurplus, estimatedEmi);
  const totalInterest = calculateTotalInterest(estimatedEmi, loanTenureMonths, financingGap);
  const cashFlow = buildCashFlow(monthlySurplus, estimatedEmi, loanTenureMonths, ownCapital);

  return {
    projectCost,
    ownCapital,
    financingGap,
    monthlyRevenue,
    monthlyExpenses,
    monthlySurplus,
    estimatedEmi,
    netMonthlyAfterEmi,
    breakEvenMonths,
    totalInterest,
    annualInterestRate,
    loanTenureMonths,
    cashFlow,
  };
}
