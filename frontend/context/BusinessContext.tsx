'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EntrepreneurProfile, AnalysisResult } from '@/types/business';
import type { FinanceResult } from '@/types/finance';

interface BusinessState {
  profile: EntrepreneurProfile | null;
  analysis: AnalysisResult | null;
  finance: FinanceResult | null;
  setProfile: (p: EntrepreneurProfile) => void;
  setAnalysis: (a: AnalysisResult) => void;
  setFinance: (f: FinanceResult) => void;
  reset: () => void;
  hydrated: boolean;
}

const STORAGE_KEY = 'ruralmate:business';

const BusinessContext = createContext<BusinessState | undefined>(undefined);

export const DEMO_PROFILE: EntrepreneurProfile = {
  name: 'Ravi',
  businessStatus: 'new',
  category: 'agriculture',
  location: 'Rural Madhya Pradesh',
  village: 'Nasrullaganj',
  town: 'Nasrullaganj',
  district: 'Sehore',
  state: 'Madhya Pradesh',
  capital: 200000,
  experience: 'beginner',
  goal: 'I want to start a profitable rural business.',
  monthlyRevenue: 75000,
  monthlyExpenses: 48000,
  existingLoans: 0,
};

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<EntrepreneurProfile | null>(null);
  const [analysis, setAnalysisState] = useState<AnalysisResult | null>(null);
  const [finance, setFinanceState] = useState<FinanceResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile) setProfileState(parsed.profile);
        if (parsed.analysis) setAnalysisState(parsed.analysis);
        if (parsed.finance) setFinanceState(parsed.finance);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, analysis, finance }));
    } catch {
      /* ignore */
    }
  }, [profile, analysis, finance, hydrated]);

  const value: BusinessState = {
    profile,
    analysis,
    finance,
    setProfile: setProfileState,
    setAnalysis: setAnalysisState,
    setFinance: setFinanceState,
    reset: () => {
      setProfileState(null);
      setAnalysisState(null);
      setFinanceState(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
    hydrated,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessState {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
  return ctx;
}
