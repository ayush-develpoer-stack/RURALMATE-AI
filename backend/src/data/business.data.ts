import type { AnalysisScores, BusinessCategory } from '../types/business';

export interface BusinessBlueprint {
  key: string;
  category: BusinessCategory;
  recommendedBusiness: string;
  feasibilityScore: number;
  baseScores: AnalysisScores;
  dataConfidence: number;
  reasons: string[];
  estimatedProjectCost: number;
}

/**
 * Structured demo intelligence. Real datasets can be connected through
 * the same service layer without changing the UI.
 */
export const BUSINESS_BLUEPRINTS: BusinessBlueprint[] = [
  {
    key: 'dairy',
    category: 'agriculture',
    recommendedBusiness: 'Dairy Business',
    feasibilityScore: 82,
    baseScores: { localDemand: 82, competition: 61, accessibility: 76, capitalFit: 91, seasonality: 70 },
    dataConfidence: 71,
    reasons: [
      'Strong local demand signals for milk and dairy products',
      'Moderate competition leaves room for a quality-focused entrant',
      'Good capital fit for a small-to-medium dairy setup',
      'Accessible local market with nearby collection and sale points',
    ],
    estimatedProjectCost: 300000,
  },
  {
    key: 'food-processing',
    category: 'food-processing',
    recommendedBusiness: 'Food Processing Unit',
    feasibilityScore: 74,
    baseScores: { localDemand: 78, competition: 55, accessibility: 68, capitalFit: 74, seasonality: 64 },
    dataConfidence: 68,
    reasons: [
      'Rising demand for packaged and processed local produce',
      'Value addition improves margins over raw produce sale',
      'Government focus on rural food-processing enterprises',
      'Seasonal raw material availability requires planning',
    ],
    estimatedProjectCost: 450000,
  },
  {
    key: 'handicraft',
    category: 'handicraft',
    recommendedBusiness: 'Handicraft & Bamboo Products',
    feasibilityScore: 76,
    baseScores: { localDemand: 66, competition: 48, accessibility: 60, capitalFit: 95, seasonality: 80 },
    dataConfidence: 65,
    reasons: [
      'Low capital requirement suits available funds well',
      'Growing eco-friendly and handmade product demand',
      'Strong online and B2B market linkage potential',
      'Local raw material availability keeps costs low',
    ],
    estimatedProjectCost: 120000,
  },
  {
    key: 'retail',
    category: 'retail',
    recommendedBusiness: 'Rural Retail / Kirana Store',
    feasibilityScore: 80,
    baseScores: { localDemand: 85, competition: 72, accessibility: 88, capitalFit: 88, seasonality: 85 },
    dataConfidence: 70,
    reasons: [
      'Consistent year-round demand for daily essentials',
      'High accessibility within the local community',
      'Competition is present but demand supports multiple stores',
      'Steady cash flow with low seasonality risk',
    ],
    estimatedProjectCost: 250000,
  },
];

export const DEFAULT_BLUEPRINT_KEY = 'dairy';

/**
 * Demo geo-context for Rural Madhya Pradesh (illustrative coordinates).
 */
export const DEMO_LOCATION = {
  label: 'Rural Madhya Pradesh',
  lat: 23.2599,
  lng: 77.4126,
};
