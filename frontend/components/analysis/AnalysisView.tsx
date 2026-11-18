'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  FiMapPin,
  FiTrendingUp,
  FiInfo,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ScoreRing from '@/components/ui/ScoreRing';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { useBusiness } from '@/context/BusinessContext';
import { analysisService } from '@/services/analysis.service';
import { ApiRequestError } from '@/services/api';
import { formatINR } from '@/lib/format';
import type { AnalysisResult } from '@/types/business';
import './AnalysisView.css';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="analysis__map-loading">Loading map…</div>,
});

function feasibilityLabel(score: number): { text: string; variant: 'success' | 'warning' | 'danger' } {
  if (score >= 75) return { text: 'HIGH FEASIBILITY', variant: 'success' };
  if (score >= 50) return { text: 'MODERATE FEASIBILITY', variant: 'warning' };
  return { text: 'LOW FEASIBILITY', variant: 'danger' };
}

export default function AnalysisView() {
  const { profile, analysis, setAnalysis, hydrated } = useBusiness();
  const [loading, setLoading] = useState(!analysis);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analysisService.analyze(profile ?? undefined);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to load analysis.');
    } finally {
      setLoading(false);
    }
  }, [profile, setAnalysis]);

  useEffect(() => {
    if (!hydrated) return;
    if (!analysis) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated || loading) {
    return <LoadingState message="Analyzing your local business opportunity..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load analysis"
        message={error}
        onRetry={load}
      />
    );
  }

  if (!analysis) {
    return (
      <EmptyState
        title="No business analysis available yet"
        message="Complete your profile to generate a hyper-local analysis."
        action={
          <Link href="/profile">
            <Button>Go to Profile</Button>
          </Link>
        }
      />
    );
  }

  const a: AnalysisResult = analysis;
  const label = feasibilityLabel(a.feasibilityScore);

  const breakdown = [
    { label: 'Local Demand', value: a.localDemand, invert: false },
    { label: 'Competition', value: a.competition, invert: true },
    { label: 'Accessibility', value: a.accessibility, invert: false },
    { label: 'Capital Fit', value: a.capitalFit, invert: false },
    { label: 'Seasonality', value: a.seasonality, invert: false },
  ];

  return (
    <div className="analysis">
      <Card className="analysis__hero">
        <div className="analysis__hero-left">
          <Badge variant="primary" icon={<FiZap />}>
            Recommended for {profile?.name || 'you'}
          </Badge>
          <h2 className="analysis__business">{a.recommendedBusiness}</h2>
          <p className="analysis__location">
            <FiMapPin /> {a.location.label}
          </p>
          <div className="analysis__hero-stats">
            <div>
              <span className="analysis__stat-label">Est. Project Cost</span>
              <span className="analysis__stat-value">{formatINR(a.estimatedProjectCost)}</span>
            </div>
            <div>
              <span className="analysis__stat-label">Your Capital</span>
              <span className="analysis__stat-value">{formatINR(profile?.capital)}</span>
            </div>
          </div>
          <Link href="/finance">
            <Button rightIcon={<FiArrowRight />}>Structure the Finances</Button>
          </Link>
        </div>
        <div className="analysis__hero-right">
          <ScoreRing score={a.feasibilityScore} size={210} />
          <Badge variant={label.variant} size="md">
            {label.text}
          </Badge>
        </div>
      </Card>

      <div className="analysis__row">
        <Card className="analysis__breakdown">
          <div className="analysis__card-head">
            <FiTrendingUp />
            <h3>Feasibility Breakdown</h3>
          </div>
          <div className="analysis__bars">
            {breakdown.map((b) => (
              <ProgressBar key={b.label} label={b.label} value={b.value} invert={b.invert} />
            ))}
          </div>
        </Card>

        <Card className="analysis__confidence">
          <div className="analysis__card-head">
            <FiInfo />
            <h3>Data Transparency</h3>
          </div>
          <div className="analysis__confidence-ring">
            <ScoreRing score={a.dataConfidence} size={140} label="Confidence" />
          </div>
          <div className="analysis__demo-note">
            <strong>Demo intelligence</strong> — real datasets can be connected through the same
            service layer without changing this screen.
          </div>
        </Card>
      </div>

      <div className="analysis__reasons">
        <div className="analysis__card-head">
          <FiCheckCircle />
          <h3>Why this recommendation?</h3>
        </div>
        <div className="analysis__reason-grid">
          {a.reasons.map((reason, i) => (
            <Card key={i} hover className="analysis__reason-card">
              <span className="analysis__reason-num">{i + 1}</span>
              <p>{reason}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card padded={false} className="analysis__map-card">
        <div className="analysis__map-head">
          <div className="analysis__card-head">
            <FiMapPin />
            <h3>Local Market Map</h3>
          </div>
          <div className="analysis__legend">
            <span className="analysis__legend-item">
              <i style={{ background: '#1f7a4d' }} /> You
            </span>
            <span className="analysis__legend-item">
              <i style={{ background: '#2563eb' }} /> Markets
            </span>
            <span className="analysis__legend-item">
              <i style={{ background: '#dc3545' }} /> Competitors
            </span>
            <span className="analysis__legend-item">
              <i style={{ background: '#d98a04' }} /> Suppliers
            </span>
          </div>
        </div>
        <div className="analysis__map">
          <MapView center={{ lat: a.location.lat, lng: a.location.lng }} markers={a.mapMarkers} />
        </div>
      </Card>
    </div>
  );
}
