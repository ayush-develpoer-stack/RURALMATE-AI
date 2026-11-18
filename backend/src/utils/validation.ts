export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v);
}

export function toNumber(v: unknown, fallback = 0): number {
  if (isNumber(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProfile(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  if (!isNonEmptyString(body.name)) errors.push('Name is required');
  // Location may be supplied as structured fields (state/district/…) or, for
  // backward compatibility, as a single free-text `location` string.
  const hasStructuredLocation =
    isNonEmptyString(body.state) ||
    isNonEmptyString(body.district) ||
    isNonEmptyString(body.town) ||
    isNonEmptyString(body.village);
  if (!hasStructuredLocation && !isNonEmptyString(body.location)) {
    errors.push('Location is required (at least State)');
  }
  if (!isNonEmptyString(body.category)) errors.push('Business category is required');
  if (!isNumber(body.capital) || (body.capital as number) < 0) {
    errors.push('Valid available capital is required');
  }
  return { valid: errors.length === 0, errors };
}

export function validateFinanceInput(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  if (!isNumber(body.projectCost) || (body.projectCost as number) <= 0) {
    errors.push('Valid project cost is required');
  }
  if (!isNumber(body.ownCapital) || (body.ownCapital as number) < 0) {
    errors.push('Valid own capital is required');
  }
  return { valid: errors.length === 0, errors };
}
