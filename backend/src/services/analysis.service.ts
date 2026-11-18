import type { AnalysisResult, EntrepreneurProfile, BusinessCategory } from '../types/business';
import {
  BUSINESS_BLUEPRINTS,
  DEFAULT_BLUEPRINT_KEY,
  DEMO_LOCATION,
  type BusinessBlueprint,
} from '../data/business.data';
import { buildMapMarkers } from '../data/markets.data';

// Simple in-memory demo store for the current profile.
let currentProfile: EntrepreneurProfile | null = null;

export function saveProfile(profile: EntrepreneurProfile): EntrepreneurProfile {
  currentProfile = profile;
  return profile;
}

export function getProfile(): EntrepreneurProfile | null {
  return currentProfile;
}

function pickBlueprint(category?: BusinessCategory): BusinessBlueprint {
  if (category) {
    const match = BUSINESS_BLUEPRINTS.find((b) => b.category === category);
    if (match) return match;
  }
  return (
    BUSINESS_BLUEPRINTS.find((b) => b.key === DEFAULT_BLUEPRINT_KEY) ?? BUSINESS_BLUEPRINTS[0]
  );
}

/**
 * Adjust capital fit deterministically based on how the entrepreneur's capital
 * compares to the estimated project cost. Keeps demo intelligence responsive
 * to the actual profile without inventing real-world data.
 */
function adjustCapitalFit(base: number, capital: number, projectCost: number): number {
  if (!capital || !projectCost) return base;
  const ratio = capital / projectCost;
  let adjusted = base;
  if (ratio >= 0.5) adjusted = Math.min(98, base + 6);
  else if (ratio >= 0.33) adjusted = base;
  else if (ratio >= 0.2) adjusted = base - 8;
  else adjusted = base - 16;
  return Math.max(30, Math.min(99, Math.round(adjusted)));
}

function computeFeasibility(scores: {
  localDemand: number;
  competition: number;
  accessibility: number;
  capitalFit: number;
  seasonality: number;
}): number {
  // Competition is inverted: lower competition is better.
  const competitionFactor = 100 - scores.competition;
  const weighted =
    scores.localDemand * 0.3 +
    competitionFactor * 0.15 +
    scores.accessibility * 0.2 +
    scores.capitalFit * 0.25 +
    scores.seasonality * 0.1;
  return Math.round(weighted);
}

export function generateAnalysis(profile?: EntrepreneurProfile | null): AnalysisResult {
  const p = profile ?? currentProfile ?? undefined;
  const blueprint = pickBlueprint(p?.category);

  // Canonical breakdown from the blueprint keeps the demo consistent across
  // Analysis, Dashboard and AI Advisor. computeFeasibility()/adjustCapitalFit()
  // remain available for when live data replaces the demo blueprints.
  const scores = { ...blueprint.baseScores };
  const feasibilityScore = blueprint.feasibilityScore;
  void computeFeasibility;
  void adjustCapitalFit;

  const composedLocation = [p?.village, p?.town, p?.district, p?.state]
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .join(', ');
  const label = p?.location?.trim()
    ? p.location
    : composedLocation || DEMO_LOCATION.label;
  const location = {
    label,
    lat: DEMO_LOCATION.lat,
    lng: DEMO_LOCATION.lng,
  };

  return {
    recommendedBusiness: blueprint.recommendedBusiness,
    feasibilityScore,
    localDemand: scores.localDemand,
    competition: scores.competition,
    accessibility: scores.accessibility,
    capitalFit: scores.capitalFit,
    seasonality: scores.seasonality,
    dataConfidence: blueprint.dataConfidence,
    reasons: blueprint.reasons,
    location,
    mapMarkers: buildMapMarkers(location.lat, location.lng, location.label),
    estimatedProjectCost: blueprint.estimatedProjectCost,
  };
}
