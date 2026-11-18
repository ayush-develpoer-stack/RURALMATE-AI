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
  // Human-readable location label (composed from the structured fields below;
  // kept for display and backward compatibility with single-string profiles).
  location: string;
  // Structured location (persisted to dedicated columns). All optional so older
  // single-string profiles keep working.
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

export interface AnalysisScores {
  localDemand: number;
  competition: number;
  accessibility: number;
  capitalFit: number;
  seasonality: number;
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
  location: {
    label: string;
    lat: number;
    lng: number;
  };
  mapMarkers: MapMarker[];
  estimatedProjectCost: number;
}

export interface MapMarker {
  id: string;
  label: string;
  type: 'user' | 'market' | 'competitor' | 'supplier';
  lat: number;
  lng: number;
  detail?: string;
}
