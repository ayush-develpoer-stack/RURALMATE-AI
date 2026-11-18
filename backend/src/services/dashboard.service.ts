import type { EntrepreneurProfile } from '../types/business';
import type { DashboardData, JourneyStage, NextAction, RecentActivityItem } from '../types/dashboard';
import { generateAnalysis } from './analysis.service';
import { computeFinance } from './finance.service';
import { matchSchemes } from './scheme.service';
import { getProfile, listBusinessPlans, listUserProducts } from './userData.service';
import { MARKET_OPPORTUNITIES } from '../data/markets.data';

/**
 * Canonical demo entrepreneur used when the authenticated user has no profile yet
 * (e.g. a fresh demo account) so the dashboard is never blank.
 */
const DEMO_PROFILE: EntrepreneurProfile = {
  name: 'Ravi',
  businessStatus: 'new',
  category: 'agriculture',
  location: 'Rural Madhya Pradesh',
  capital: 200000,
  experience: 'beginner',
  goal: 'I want to start a profitable rural business.',
  monthlyRevenue: 75000,
  monthlyExpenses: 48000,
  existingLoans: 0,
};

/**
 * Own capital committed to the project: capped at ~1/3 of project cost so a
 * conservative equity contribution leaves a realistic financing gap.
 */
export function defaultOwnCapital(capital: number, projectCost: number): number {
  return Math.min(capital, Math.round(projectCost / 3));
}

function buildJourney(hasProfile: boolean, hasFundingGap: boolean): JourneyStage[] {
  return [
    { key: 'profile', label: 'Profile', status: hasProfile ? 'complete' : 'available' },
    { key: 'analysis', label: 'Business Analysis', status: hasProfile ? 'complete' : 'available' },
    { key: 'finance', label: 'Financial Plan', status: hasProfile ? 'complete' : 'available' },
    {
      key: 'schemes',
      label: 'Government Support',
      status: 'available',
      detail: hasFundingGap ? 'Potential matches' : 'Review',
    },
    { key: 'plan', label: 'Business Plan', status: 'available', detail: 'Ready to generate' },
    { key: 'product', label: 'Product Catalog', status: 'not-started' },
    { key: 'market', label: 'Market Linkage', status: 'available' },
    { key: 'grow', label: 'Grow', status: 'not-started' },
  ];
}

function computeNextAction(hasProfile: boolean, fundingGap: number): NextAction {
  if (!hasProfile) {
    return {
      title: 'Complete your entrepreneur profile',
      reason: 'Tell us about your capital, location and goal so we can analyze your opportunity.',
      ctaLabel: 'Complete Profile',
      href: '/profile',
    };
  }
  if (fundingGap > 0) {
    return {
      title: 'Review your financing options',
      reason:
        'Your opportunity analysis is complete, but your current capital leaves a financing gap.',
      ctaLabel: 'View Financial Plan',
      href: '/finance',
    };
  }
  return {
    title: 'Explore potential government support',
    reason: 'Your finances look covered — check which schemes may be relevant to you.',
    ctaLabel: 'Explore Support',
    href: '/schemes',
  };
}

/**
 * Aggregated dashboard for the authenticated user. Loads the user's own profile
 * from the database (falls back to the demo profile for fresh accounts),
 * computes deterministic analysis/finance, persists snapshots, and returns.
 */
export async function getDashboard(userId?: string): Promise<DashboardData> {
  const stored = userId ? await getProfile(userId) : null;
  const hasProfile = stored !== null;
  const profile = stored ?? DEMO_PROFILE;

  const analysis = generateAnalysis(profile);
  const projectCost = analysis.estimatedProjectCost;
  const ownCapital = defaultOwnCapital(profile.capital, projectCost);
  const finance = computeFinance({
    projectCost,
    ownCapital,
    monthlyRevenue: profile.monthlyRevenue ?? 75000,
    monthlyExpenses: profile.monthlyExpenses ?? 48000,
    annualInterestRate: 10,
    loanTenureMonths: 60,
  });

  const schemes = matchSchemes({
    category: profile.category,
    businessStatus: profile.businessStatus,
    projectCost,
  }).matches.slice(0, 3);

  // The dashboard is a read-only aggregation. Analysis/finance snapshots are
  // persisted by their own explicit user actions (Analysis page, Finance
  // calculate) — writing here on every load would create unbounded duplicate
  // rows for the same user.

  // Recent activity — real persisted artifacts for the authenticated user.
  const plans = userId ? await listBusinessPlans(userId, 5).catch(() => []) : [];
  const products = userId ? await listUserProducts(userId, 5).catch(() => []) : [];
  const recentActivity: RecentActivityItem[] = [
    ...plans.map((p) => ({
      type: 'plan' as const,
      title: p.title,
      subtitle: p.generatedBy === 'ai' ? 'AI-generated plan' : 'Deterministic plan',
      at: p.createdAt,
      href: '/business-plan',
    })),
    ...products.map((p) => ({
      type: 'product' as const,
      title: p.productName,
      subtitle: `${p.category} · ${p.suggestedPrice}`,
      at: p.createdAt,
      href: '/catalog',
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return {
    profile: {
      name: profile.name,
      location: profile.location,
      category: profile.category,
      capital: profile.capital,
      goal: profile.goal,
    },
    analysis,
    finance,
    schemes,
    markets: MARKET_OPPORTUNITIES,
    product: null,
    journey: buildJourney(hasProfile, finance.financingGap > 0),
    nextAction: computeNextAction(hasProfile, finance.financingGap),
    recentActivity,
    stats: { businessPlans: plans.length, products: products.length },
    meta: { demo: !hasProfile, dataConfidence: analysis.dataConfidence },
  };
}
