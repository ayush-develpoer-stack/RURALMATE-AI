import type { BusinessCategory } from '../types/business';
import type { Scheme, SchemeMatch, SchemeMatchResult } from '../types/scheme';
import { SCHEMES, SCHEME_DISCLAIMER } from '../data/schemes.data';

export interface SchemeMatchInput {
  category?: BusinessCategory;
  businessStatus?: 'new' | 'existing';
  projectCost?: number;
}

/**
 * Deterministic matching rules. AI is only used later to explain results,
 * never to decide eligibility.
 */
function scoreScheme(scheme: Scheme, input: SchemeMatchInput): { score: number; reasons: string[] } {
  let score = 40; // baseline relevance
  const reasons: string[] = [];

  // Category fit
  if (scheme.categories === 'all') {
    score += 15;
    reasons.push('Open to all business categories');
  } else if (input.category && scheme.categories.includes(input.category)) {
    score += 30;
    reasons.push('Directly relevant to your business category');
  } else if (input.category) {
    score -= 10;
  }

  // Business status fit
  if (input.businessStatus && scheme.forStatus.includes(input.businessStatus)) {
    score += 20;
    reasons.push(
      input.businessStatus === 'new'
        ? 'Supports new enterprises'
        : 'Supports existing enterprises',
    );
  }

  // Project cost fit
  if (typeof input.projectCost === 'number' && input.projectCost > 0) {
    if (input.projectCost >= scheme.minProjectCost && input.projectCost <= scheme.maxProjectCost) {
      score += 15;
      reasons.push('Project cost is within the scheme range');
    } else {
      score -= 10;
    }
  }

  score = Math.max(20, Math.min(97, score));
  return { score, reasons };
}

function labelFor(score: number): SchemeMatch['matchLabel'] {
  if (score >= 80) return 'Strong Potential Match';
  if (score >= 60) return 'Potential Match';
  return 'Possible Match';
}

export function matchSchemes(input: SchemeMatchInput): SchemeMatchResult {
  const matches: SchemeMatch[] = SCHEMES.map((scheme) => {
    const { score, reasons } = scoreScheme(scheme, input);
    return {
      ...scheme,
      matchScore: score,
      matchLabel: labelFor(score),
      matchReasons: reasons.length ? reasons : ['General relevance based on your profile'],
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return { matches, disclaimer: SCHEME_DISCLAIMER };
}
