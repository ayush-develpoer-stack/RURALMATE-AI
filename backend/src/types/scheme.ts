import type { BusinessCategory } from './business';

export interface Scheme {
  id: string;
  name: string;
  fullName: string;
  ministry: string;
  summary: string;
  categories: BusinessCategory[] | 'all';
  forStatus: ('new' | 'existing')[];
  maxProjectCost: number;
  minProjectCost: number;
  subsidyInfo: string;
  keyEligibility: string[];
  documents: string[];
  supportInfo: string;
  officialSource: string;
}

export interface SchemeMatch extends Scheme {
  matchScore: number;
  matchLabel: 'Strong Potential Match' | 'Potential Match' | 'Possible Match';
  matchReasons: string[];
}

export interface SchemeMatchResult {
  matches: SchemeMatch[];
  disclaimer: string;
}
