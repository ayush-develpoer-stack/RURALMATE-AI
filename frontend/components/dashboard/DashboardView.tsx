'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FiMapPin,
  FiDollarSign,
  FiShield,
  FiFileText,
  FiUsers,
  FiArrowRight,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiInfo,
  FiCheckCircle,
  FiActivity,
  FiShoppingBag,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ScoreRing from '@/components/ui/ScoreRing';
import StatCard from '@/components/ui/StatCard';
import SectionHeader from '@/components/ui/SectionHeader';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import SchemeCard from '@/components/schemes/SchemeCard';
import MarketOpportunities from '@/components/catalog/MarketOpportunities';
import AIChat from '@/components/ai/AIChat';
import DashboardHeader from './DashboardHeader';
import JourneyProgress from './JourneyProgress';
import RecommendedAction from './RecommendedAction';
import InsightCard from './InsightCard';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/services/api';
import { formatINR, formatINRShort, formatMonths } from '@/lib/format';
import type { DashboardData } from '@/types/dashboard';
import './DashboardView.css';

const MapView = dynamic(() => import('@/components/analysis/MapView'), {
  ssr: false,
  loading: () => <div className="dash__map-loading">Loading map…</div>,
});

const BAR_COLORS: Record<string, string> = {
  'Local Demand': '#1f7a4d',
  Competition: '#d98a04',
  Accessibility: '#2563eb',
  'Capital Fit': '#0d9488',
  Seasonality: '#1f9d55',
};

export default function DashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardService.get());
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState message="Building your business overview..." />;
  if (error) return <ErrorState title="Unable to load dashboard" message={error} onRetry={load} />;
  if (!data) {
    return (
      <EmptyState
        title="Let's build your business roadmap"
        message="Complete your profile to generate your dashboard."
        action={
          <Link href="/profile">
            <Button>Start Analysis</Button>
          </Link>
        }
      />
    );
  }

  const { profile, analysis, finance, schemes, markets, journey, nextAction, recentActivity, stats, meta } =
    data;
  const activityIcon = (t: string) =>
    t === 'plan' ? <FiFileText /> : t === 'product' ? <FiShoppingBag /> : <FiActivity />;
  const activityDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };
  const feasBadge =
    analysis.feasibilityScore >= 75
      ? { text: 'HIGH FEASIBILITY', variant: 'success' as const }
      : analysis.feasibilityScore >= 50
        ? { text: 'MODERATE', variant: 'warning' as const }
        : { text: 'LOW', variant: 'danger' as const };

  const feasChart = [
    { name: 'Local Demand', value: analysis.localDemand },
    { name: 'Competition', value: analysis.competition },
    { name: 'Accessibility', value: analysis.accessibility },
    { name: 'Capital Fit', value: analysis.capitalFit },
    { name: 'Seasonality', value: analysis.seasonality },
  ];
  const financeChart = [
    { name: 'Revenue', value: finance.monthlyRevenue },
    { name: 'Expenses', value: finance.monthlyExpenses },
    { name: 'Surplus', value: finance.monthlySurplus },
  ];
  const financeColors = ['#1f7a4d', '#d98a04', '#2563eb'];

  return (
    <div className="dash">
      <DashboardHeader name={user?.name || profile.name} location={profile.location} />

      {meta.demo && (
        <div className="dash__demo-banner">
          <FiInfo /> Illustrative demo data — real datasets can be connected through the same service
          layer.
        </div>
      )}

      <Card className="dash__hero">
        <div className="dash__hero-text">
          <h2>Turn your business idea into a clearer growth plan.</h2>
          <p>
            RuralMate AI brings your opportunity, finances, government support and market growth into
            one place.
          </p>
        </div>
        <div className="dash__hero-cta">
          <Link href="/analysis">
            <Button rightIcon={<FiArrowRight />}>Continue Business Analysis</Button>
          </Link>
          <Link href="/advisor">
            <Button variant="outline" leftIcon={<FiMessageSquare />}>
              Ask AI Advisor
            </Button>
          </Link>
        </div>
      </Card>

      <div className="dash__row dash__row--2">
        <RecommendedAction action={nextAction} />
        <JourneyProgress stages={journey} />
      </div>

      <div className="dash__insights">
        <InsightCard
          icon={<FiMapPin />}
          label="Business Opportunity"
          value={analysis.recommendedBusiness}
          sub={`Feasibility ${analysis.feasibilityScore}/100`}
          accent="green"
          href="/analysis"
          cta="View Analysis"
        />
        <InsightCard
          icon={<FiDollarSign />}
          label="Financial Readiness"
          value={formatINRShort(finance.ownCapital)}
          sub={`Funding gap ${formatINRShort(finance.financingGap)}`}
          accent="blue"
          href="/finance"
          cta="View Financial Plan"
        />
        <InsightCard
          icon={<FiShield />}
          label="Potential Support"
          value={`${schemes.length} matches`}
          sub={schemes[0] ? `${schemes[0].name} · ${schemes[0].matchScore}%` : 'Explore schemes'}
          accent="teal"
          href="/schemes"
          cta="Explore Schemes"
        />
        <InsightCard
          icon={<FiFileText />}
          label="Business Plan"
          value={stats.businessPlans > 0 ? `${stats.businessPlans} saved` : 'Ready'}
          sub={stats.businessPlans > 0 ? 'View or generate a new plan' : 'Generate anytime'}
          accent="amber"
          href="/business-plan"
          cta="Open Business Plan"
        />
        <InsightCard
          icon={<FiUsers />}
          label="Market Opportunities"
          value={`${markets.length} channels`}
          sub="Retail · B2B · Online"
          accent="green"
          href="/market"
          cta="Explore Markets"
        />
      </div>

      <SectionHeader eyebrow="Business Intelligence" icon={<FiMapPin />} title="Your recommended opportunity" />
      <div className="dash__row dash__bi">
        <Card className="dash__bi-score">
          <Badge variant="primary">{profile.category}</Badge>
          <h3 className="dash__bi-business">{analysis.recommendedBusiness}</h3>
          <p className="dash__bi-loc">
            <FiMapPin /> {analysis.location.label}
          </p>
          <ScoreRing score={analysis.feasibilityScore} size={190} />
          <Badge variant={feasBadge.variant}>{feasBadge.text}</Badge>
        </Card>

        <Card className="dash__bi-detail">
          <div className="dash__bi-chart">
            <div className="dash__bi-chart-head">
              <h4>Feasibility factors</h4>
              <span className="dash__confidence">
                <FiInfo title="Confidence depends on the quality and availability of the underlying data." />
                Data Confidence: {meta.dataConfidence}%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feasChart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8a978f' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8a978f' }} width={32} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {feasChart.map((d) => (
                    <Cell key={d.name} fill={BAR_COLORS[d.name] ?? '#1f7a4d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="dash__reasons">
            <h4>Why this recommendation?</h4>
            {analysis.reasons.map((r, i) => (
              <span key={i} className="dash__reason">
                <FiCheckCircle /> {r}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card padded={false} className="dash__map-card">
        <div className="dash__map-head">
          <h4>
            <FiMapPin /> Local Opportunity Map
          </h4>
          <div className="dash__legend">
            <span><i style={{ background: '#1f7a4d' }} /> You</span>
            <span><i style={{ background: '#2563eb' }} /> Markets</span>
            <span><i style={{ background: '#dc3545' }} /> Competitors</span>
            <span><i style={{ background: '#d98a04' }} /> Suppliers</span>
            <Badge variant="neutral" size="sm">Illustrative demo data</Badge>
          </div>
        </div>
        <div className="dash__map">
          <MapView center={{ lat: analysis.location.lat, lng: analysis.location.lng }} markers={analysis.mapMarkers} />
        </div>
      </Card>

      <SectionHeader eyebrow="Financial Intelligence" icon={<FiDollarSign />} title="Financial snapshot" />
      <div className="dash__fin-stats">
        <StatCard icon={<FiDollarSign />} label="Project Cost" value={formatINR(finance.projectCost)} accent="primary" />
        <StatCard icon={<FiDollarSign />} label="Own Capital" value={formatINR(finance.ownCapital)} accent="secondary" />
        <StatCard icon={<FiTrendingDown />} label="Funding Gap" value={formatINR(finance.financingGap)} accent="warning" />
        <StatCard icon={<FiTrendingUp />} label="Monthly Surplus" value={formatINR(finance.monthlySurplus)} accent="success" />
        <StatCard icon={<FiDollarSign />} label="Estimated EMI" value={formatINR(finance.estimatedEmi)} accent="primary" />
        <StatCard icon={<FiClock />} label="Break-even" value={formatMonths(finance.breakEvenMonths)} accent="success" />
      </div>
      <div className="dash__row dash__row--2">
        <Card className="dash__flow">
          <h4>Financing flow</h4>
          <div className="dash__flow-steps">
            {[
              ['Project Cost', formatINRShort(finance.projectCost)],
              ['Own Capital', formatINRShort(finance.ownCapital)],
              ['Funding Gap', formatINRShort(finance.financingGap)],
              ['Est. EMI', `${formatINRShort(finance.estimatedEmi)}/mo`],
              ['Break-even', formatMonths(finance.breakEvenMonths)],
            ].map(([label, val], i, arr) => (
              <div className="dash__flow-item" key={label}>
                <div className="dash__flow-box">
                  <span className="dash__flow-label">{label}</span>
                  <span className="dash__flow-val">{val}</span>
                </div>
                {i < arr.length - 1 && <FiArrowRight className="dash__flow-arrow" />}
              </div>
            ))}
          </div>
          <Link href="/finance" className="dash__flow-cta">
            Open full Financial Plan <FiArrowRight />
          </Link>
        </Card>
        <Card>
          <h4>Monthly cash flow</h4>
          <p className="dash__chart-note">Illustrative — from deterministic finance engine.</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={financeChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8a978f' }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8a978f' }} width={48} />
              <Tooltip formatter={(v: number) => formatINR(v)} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {financeChart.map((d, i) => (
                  <Cell key={d.name} fill={financeColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="dash__disclaimer">
        <FiInfo /> This is decision-support information, not a loan approval or guaranteed financial
        recommendation.
      </div>

      <SectionHeader
        eyebrow="Government Support"
        icon={<FiShield />}
        title="Potentially relevant schemes"
        action={
          <Link href="/schemes">
            <Button variant="ghost" size="sm" rightIcon={<FiArrowRight />}>
              View all
            </Button>
          </Link>
        }
      />
      <div className="dash__schemes">
        {schemes.slice(0, 2).map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </div>

      <SectionHeader eyebrow="Growth" icon={<FiUsers />} title="Potential market opportunities" />
      <MarketOpportunities opportunities={markets} />

      <SectionHeader
        eyebrow="Activity"
        icon={<FiActivity />}
        title="Recent activity"
        subtitle="Your saved business plans and product listings."
      />
      {recentActivity.length > 0 ? (
        <Card className="dash__activity">
          {recentActivity.map((a, i) => (
            <Link key={`${a.type}-${i}-${a.at}`} href={a.href} className="dash__activity-item">
              <span className={`dash__activity-icon dash__activity-icon--${a.type}`}>
                {activityIcon(a.type)}
              </span>
              <span className="dash__activity-text">
                <span className="dash__activity-title">{a.title}</span>
                {a.subtitle && <span className="dash__activity-sub">{a.subtitle}</span>}
              </span>
              <span className="dash__activity-date">{activityDate(a.at)}</span>
              <FiArrowRight className="dash__activity-arrow" />
            </Link>
          ))}
        </Card>
      ) : (
        <Card>
          <EmptyState
            icon={<FiActivity />}
            title="No activity yet"
            message="Generate a business plan or a product listing and it will appear here, saved to your account."
            action={
              <Link href="/business-plan">
                <Button>Generate a Business Plan</Button>
              </Link>
            }
          />
        </Card>
      )}

      <SectionHeader
        eyebrow="AI"
        icon={<FiMessageSquare />}
        title="Your RuralMate Advisor"
        subtitle="Ask about your business, finances, opportunities or next steps."
      />
      <AIChat />
    </div>
  );
}
