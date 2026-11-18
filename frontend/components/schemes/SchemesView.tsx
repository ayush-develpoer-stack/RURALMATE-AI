'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FiShield, FiArrowRight, FiInfo } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import SchemeCard from './SchemeCard';
import { useBusiness } from '@/context/BusinessContext';
import { schemeService } from '@/services/scheme.service';
import { ApiRequestError } from '@/services/api';
import type { SchemeMatchResult } from '@/types/scheme';
import './SchemesView.css';

export default function SchemesView() {
  const { profile, analysis, finance, hydrated } = useBusiness();
  const [result, setResult] = useState<SchemeMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const projectCost = finance?.projectCost ?? analysis?.estimatedProjectCost;
      const data = await schemeService.match({
        category: profile?.category,
        businessStatus: profile?.businessStatus,
        projectCost,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to load schemes.');
    } finally {
      setLoading(false);
    }
  }, [profile, analysis, finance]);

  useEffect(() => {
    if (!hydrated) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (loading) return <LoadingState message="Matching relevant government schemes..." />;
  if (error) return <ErrorState title="Unable to load schemes" message={error} onRetry={load} />;
  if (!result) return null;

  return (
    <div className="schemes">
      <div className="schemes__disclaimer">
        <FiInfo />
        <span>{result.disclaimer}</span>
      </div>

      <div className="schemes__list">
        {result.matches.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>

      <div className="schemes__next">
        <Link href="/business-plan">
          <Button rightIcon={<FiArrowRight />}>Generate Business Plan</Button>
        </Link>
      </div>
    </div>
  );
}
