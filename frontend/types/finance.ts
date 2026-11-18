export interface FinanceInput {
  projectCost: number;
  ownCapital: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  annualInterestRate: number;
  loanTenureMonths: number;
}

export interface CashFlowPoint {
  month: number;
  cumulativeSurplus: number;
  emi: number;
  netCashFlow: number;
}

export interface FinanceResult {
  projectCost: number;
  ownCapital: number;
  financingGap: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  estimatedEmi: number;
  netMonthlyAfterEmi: number;
  breakEvenMonths: number | null;
  totalInterest: number;
  annualInterestRate: number;
  loanTenureMonths: number;
  cashFlow: CashFlowPoint[];
}
