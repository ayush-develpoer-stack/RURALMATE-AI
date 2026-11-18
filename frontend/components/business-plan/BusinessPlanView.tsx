'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiFileText,
  FiDownload,
  FiZap,
  FiArrowRight,
  FiCpu,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeader from '@/components/ui/SectionHeader';
import { useBusiness } from '@/context/BusinessContext';
import { aiService, type SavedBusinessPlan } from '@/services/ai.service';
import { schemeService } from '@/services/scheme.service';
import { ApiRequestError } from '@/services/api';
import type { BusinessPlan } from '@/types/product';
import './BusinessPlanView.css';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function BusinessPlanView() {
  const { profile, analysis, finance } = useBusiness();
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [viewingSaved, setViewingSaved] = useState(false);
  const [history, setHistory] = useState<SavedBusinessPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refreshHistory = () => {
    aiService
      .listBusinessPlans()
      .then((r) => setHistory(r.plans))
      .catch(() => setHistory([]));
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      let topScheme;
      try {
        const schemes = await schemeService.match({
          category: profile?.category,
          businessStatus: profile?.businessStatus,
          projectCost: finance?.projectCost ?? analysis?.estimatedProjectCost,
        });
        topScheme = schemes.matches[0];
      } catch {
        topScheme = undefined;
      }

      const result = await aiService.generateBusinessPlan({
        profile: profile ?? {},
        analysis: analysis ?? {},
        financials: finance ?? {},
        topScheme,
      });
      setPlan(result);
      setSaved(Boolean(result.saved));
      setViewingSaved(false);
      setActiveId(null);
      refreshHistory();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Unable to generate business plan.');
    } finally {
      setLoading(false);
    }
  };

  const removePlan = async (id: string) => {
    setDeletingId(id);
    try {
      await aiService.deleteBusinessPlan(id);
      if (activeId === id) {
        setPlan(null);
        setActiveId(null);
      }
      refreshHistory();
    } catch {
      /* keep the plan in the list if deletion failed */
    } finally {
      setDeletingId(null);
    }
  };

  const openSaved = (h: SavedBusinessPlan) => {
    setPlan({
      generatedBy: h.generatedBy,
      title: h.title,
      subtitle: h.subtitle,
      sections: h.sections,
    });
    setSaved(true);
    setViewingSaved(true);
    setActiveId(h.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const historyPanel =
    history.length > 0 ? (
      <div className="business-plan__history">
        <SectionHeader
          eyebrow="History"
          icon={<FiClock />}
          title="Your Business Plans"
          subtitle="Plans saved to your account. Open a previous plan or generate a new one."
        />
        <div className="business-plan__history-grid">
          {history.map((h) => (
            <Card
              key={h.id}
              className={`business-plan__history-item${
                activeId === h.id ? ' business-plan__history-item--active' : ''
              }`}
            >
              <div className="business-plan__history-head">
                <Badge variant={h.generatedBy === 'ai' ? 'secondary' : 'primary'} size="sm" icon={<FiCpu />}>
                  {h.generatedBy === 'ai' ? 'AI' : 'Demo'}
                </Badge>
                <span className="business-plan__history-date">{formatDate(h.createdAt)}</span>
              </div>
              <h4 className="business-plan__history-title">{h.title}</h4>
              {h.subtitle && <p className="business-plan__history-sub">{h.subtitle}</p>}
              <div className="business-plan__history-actions">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FiEye />}
                  onClick={() => openSaved(h)}
                  disabled={activeId === h.id}
                >
                  {activeId === h.id ? 'Opened' : 'Open'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiTrash2 />}
                  onClick={() => removePlan(h.id)}
                  loading={deletingId === h.id}
                  aria-label={`Delete ${h.title}`}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ) : null;

  if (!plan) {
    return (
      <div className="business-plan">
        <Card>
          <EmptyState
            icon={<FiFileText />}
            title="Generate your AI business plan"
            message="We combine your profile, hyper-local analysis, financial structure and scheme match into a market-ready plan. Financial numbers come from the deterministic finance engine — the AI only formats and explains them."
            action={
              <div className="business-plan__cta">
                <Button loading={loading} leftIcon={<FiZap />} size="lg" onClick={generate}>
                  Generate My Business Plan
                </Button>
                {error && <p className="business-plan__error">{error}</p>}
              </div>
            }
          />
        </Card>
        {historyPanel}
      </div>
    );
  }

  return (
    <div className="business-plan">
      <div className="business-plan__toolbar">
        <div className="business-plan__toolbar-status">
          <Badge variant={plan.generatedBy === 'ai' ? 'secondary' : 'primary'} icon={<FiCpu />}>
            {plan.generatedBy === 'ai' ? 'AI-generated' : 'Deterministic demo generator'}
          </Badge>
          {saved && (
            <Badge variant="success" icon={<FiCheckCircle />}>
              {viewingSaved ? 'Saved plan' : 'Saved to your account'}
              {!viewingSaved && history.length ? ` · ${history.length} generated` : ''}
            </Badge>
          )}
        </div>
        <div className="business-plan__toolbar-actions">
          <Button variant="outline" size="sm" leftIcon={<FiPlus />} onClick={generate} loading={loading}>
            {viewingSaved ? 'Generate New' : 'Regenerate'}
          </Button>
          <Button size="sm" leftIcon={<FiDownload />} onClick={() => window.print()}>
            Download / Export
          </Button>
        </div>
      </div>

      <Card className="business-plan__report" id="business-plan-report">
        <div className="business-plan__report-head">
          <h2>{plan.title}</h2>
          <p>{plan.subtitle}</p>
          <span className="business-plan__stamp">RuralMate AI · Business Plan</span>
        </div>
        <div className="business-plan__sections">
          {plan.sections.map((s, i) => (
            <section key={i} className="business-plan__section">
              <h3>
                <span className="business-plan__section-num">{i + 1}</span>
                {s.title}
              </h3>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
        <div className="business-plan__report-foot">
          Financial figures are produced by the deterministic finance engine. This is
          decision-support information, not a loan approval or guaranteed recommendation.
        </div>
      </Card>

      <div className="business-plan__next">
        <Link href="/catalog">
          <Button variant="outline" rightIcon={<FiArrowRight />}>
            Create Product Catalog
          </Button>
        </Link>
      </div>

      {historyPanel}
    </div>
  );
}
