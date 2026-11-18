export type BusinessStatus = 'new' | 'existing';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';
export type BusinessCategory =
  | 'agriculture'
  | 'dairy'
  | 'food-processing'
  | 'handicraft'
  | 'retail'
  | 'services'
  | 'textile'
  | 'other';

export interface EntrepreneurProfile {
  name: string;
  businessStatus: BusinessStatus;
  category: BusinessCategory;
  // Composed display label (kept for backward compatibility / display).
  location: string;
  village?: string;
  town?: string;
  district?: string;
  state?: string;
  capital: number;
  experience: ExperienceLevel;
  goal: string;
  monthlyRevenue?: number;
  monthlyExpenses?: number;
  existingLoans?: number;
  products?: string[];
}

export interface MapMarker {
  id: string;
  label: string;
  type: 'user' | 'market' | 'competitor' | 'supplier';
  lat: number;
  lng: number;
  detail?: string;
}

export interface AnalysisResult {
  recommendedBusiness: string;
  feasibilityScore: number;
  localDemand: number;
  competition: number;
  accessibility: number;
  capitalFit: number;
  seasonality: number;
  dataConfidence: number;
  reasons: string[];
  location: { label: string; lat: number; lng: number };
  mapMarkers: MapMarker[];
  estimatedProjectCost: number;
}
