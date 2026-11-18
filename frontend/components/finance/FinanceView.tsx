'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiClock,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import LoadingState from '@/components/ui/LoadingState';
import { useBusiness } from '@/context/BusinessContext';
import { financeService } from '@/services/finance.service';
import { ApiRequestError } from '@/services/api';
import { formatINR, formatINRShort, formatMonths } from '@/lib/format';
import type { FinanceInput } from '@/types/finance';
import './FinanceView.css';

export default function FinanceView() {
  const { profile, analysis, finance, setFinance, hydrated } = useBusiness();

  const defaults = useMemo<FinanceInput>(() => {
    const projectCost = analysis?.estimatedProjectCost ?? 300000;
    // Conservative own-equity default (~1/3 of project cost) matches the dashboard.
    const ownCapital = Math.min(profile?.capital ?? 100000, Math.round(projectCost / 3));
    return {
      projectCost,
      ownCapital,
      monthlyRevenue: profile?.monthlyRevenue ?? 75000,
      monthlyExpenses: profile?.monthlyExpenses ?? 48000,
      annualInterestRate: 10,
      loanTenureMonths: 60,
    };
  }, [analysis, profile]);

  const [form, setForm] = useState<FinanceInput>(defaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof FinanceInput, value: string) => {
    setForm((f) => ({ ...f, [key]: Number(value) || 0 }));
  };

  const calculate = useCallback(
    async (input: FinanceInput) => {
      setLoading(true);
      setError('');
      try {
        const result = await financeService.calculate(input);
        setFinance(result);
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : 'Unable to calculate finances.');
      } finally {
        setLoading(false);
      }
    },
    [setFinance],
  );

  useEffect(() => {
    if (!hydrated) return;
    setForm(defaults);
    if (!finance) calculate(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const f = finance;

  return (
    <div className="finance">
      <Card className="finance__form-card">
        <h3 className="finance__form-title">Financing Inputs</h3>
        <div className="finance__form-grid">
          <Input
            label="Project Cost"
            type="number"
            prefix="₹"
            value={String(form.projectCost)}
            onChange={(e) => update('projectCost', e.target.value)}
          />
          <Input
            label="Own Capital"
            type="number"
            prefix="₹"
            value={String(form.ownCapital)}
            onChange={(e) => update('ownCapital', e.target.value)}
          />
          <Input
            label="Monthly Revenue"
            type="number"
            prefix="₹"
            value={String(form.monthlyRevenue)}
            onChange={(e) => update('monthlyRevenue', e.target.value)}
          />
          <Input
            label="Monthly Expenses"
            type="number"
            prefix="₹"
            value={String(form.monthlyExpenses)}
            onChange={(e) => update('monthlyExpenses', e.target.value)}
          />
          <Input
            label="Interest Rate (%/yr)"
            type="number"
            value={String(form.annualInterestRate)}
            onChange={(e) => update('annualInterestRate', e.target.value)}
          />
          <Input
            label="Loan Tenure (months)"
            type="number"
            value={String(form.loanTenureMonths)}
            onChange={(e) => update('loanTenureMonths', e.target.value)}
          />
        </div>
        <div className="finance__form-actions">
          <Button
            onClick={() => calculate(form)}
            loading={loading}
            leftIcon={<FiPieChart />}
          >
            Calculate Structure
          </Button>
        </div>
      </Card>

      {loading && !f ? (
        <LoadingState message="Structuring your finances..." />
      ) : error ? (
        <Card>
          <p className="finance__error">
            <FiAlertCircle /> {error}
          </p>
        </Card>
      ) : f ? (
        <>
          <div className="finance__stats grid grid-3">
            <StatCard
              icon={<FiDollarSign />}
              label="Project Cost"
              value={formatINR(f.projectCost)}
              accent="primary"
            />
            <StatCard
              icon={<FiDollarSign />}
              label="Own Capital"
              value={formatINR(f.ownCapital)}
              accent="secondary"
            />
            <StatCard
              icon={<FiTrendingDown />}
              label="Financing Gap"
              value={formatINR(f.financingGap)}
              sublabel="Loan required"
              accent="warning"
            />
            <StatCard
              icon={<FiTrendingUp />}
              label="Monthly Surplus"
              value={formatINR(f.monthlySurplus)}
              sublabel="Revenue − Expenses"
              accent={f.monthlySurplus >= 0 ? 'success' : 'danger'}
            />
            <StatCard
              icon={<FiPieChart />}
              label="Estimated EMI"
              value={formatINR(f.estimatedEmi)}
              sublabel={`${f.annualInterestRate}% · ${f.loanTenureMonths} mo`}
              accent="primary"
            />
            <StatCard
              icon={<FiClock />}
              label="Break-even"
              value={formatMonths(f.breakEvenMonths)}
              sublabel="To recover own capital"
              accent="success"
            />
          </div>

          <Card className="finance__scenario">
            <h3 className="finance__section-title">Financing Scenario</h3>
            <div className="finance__flow">
              <div className="finance__flow-step">
                <span className="finance__flow-label">Project Cost</span>
                <span className="finance__flow-value">{formatINR(f.projectCost)}</span>
              </div>
              <div className="finance__flow-op">−</div>
              <div className="finance__flow-step">
                <span className="finance__flow-label">Own Capital</span>
                <span className="finance__flow-value">{formatINR(f.ownCapital)}</span>
              </div>
              <div className="finance__flow-op">=</div>
              <div className="finance__flow-step finance__flow-step--accent">
                <span className="finance__flow-label">Financing Gap</span>
                <span className="finance__flow-value">{formatINR(f.financingGap)}</span>
              </div>
            </div>
            <div className="finance__net">
              <span>Net monthly cash flow after EMI</span>
              <Badge variant={f.netMonthlyAfterEmi >= 0 ? 'success' : 'danger'}>
                {formatINR(f.netMonthlyAfterEmi)} / month
              </Badge>
            </div>
          </Card>

          <Card>
            <h3 className="finance__section-title">
              <FiTrendingUp className="finance__inline-icon" /> Cumulative Cash Flow Projection
            </h3>
            <p className="finance__chart-note">
              Starting from your own-capital investment, this shows how cumulative cash flow builds
              over time. The point it crosses zero is your break-even.
            </p>
            <div className="finance__chart">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={f.cashFlow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1f7a4d" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1f7a4d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) => `M${m}`}
                    tick={{ fontSize: 12, fill: '#8a978f' }}
                  />
                  <YAxis
                    tickFormatter={(v) => formatINRShort(v)}
                    tick={{ fontSize: 12, fill: '#8a978f' }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatINR(v), 'Cumulative']}
                    labelFormatter={(m) => `Month ${m}`}
                  />
                  <ReferenceLine y={0} stroke="#dc3545" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSurplus"
                    stroke="#1f7a4d"
                    strokeWidth={2.5}
                    fill="url(#cashGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="finance__disclaimer">
            <FiAlertCircle />
            This is decision-support information, not a loan approval or guaranteed financial
            recommendation.
          </div>

          <div className="finance__next">
            <Link href="/schemes">
              <Button variant="outline" rightIcon={<FiArrowRight />}>
                Find Government Support
              </Button>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
