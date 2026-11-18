import type { AnalysisResult } from './business';
import type { FinanceResult } from './finance';
import type { SchemeMatch } from './scheme';
import type { MarketOpportunity } from './product';

export interface DashboardProfileSummary {
  name: string;
  location: string;
  category: string;
  capital: number;
  goal: string;
}

export interface NextAction {
  title: string;
  reason: string;
  ctaLabel: string;
  href: string;
}

export interface JourneyStage {
  key: string;
  label: string;
  status: 'complete' | 'available' | 'not-started';
  detail?: string;
}

export interface RecentActivityItem {
  type: 'plan' | 'product' | 'analysis' | 'finance';
  title: string;
  subtitle?: string;
  at: string;
  href: string;
}

export interface DashboardData {
  profile: DashboardProfileSummary;
  analysis: AnalysisResult;
  finance: FinanceResult;
  schemes: SchemeMatch[];
  markets: MarketOpportunity[];
  product: null | {
    productName: string;
    category: string;
    suggestedPriceMin: number;
    suggestedPriceMax: number;
    tags: string[];
  };
  journey: JourneyStage[];
  nextAction: NextAction;
  recentActivity: RecentActivityItem[];
  stats: { businessPlans: number; products: number };
  meta: { demo: boolean; dataConfidence: number };
}
