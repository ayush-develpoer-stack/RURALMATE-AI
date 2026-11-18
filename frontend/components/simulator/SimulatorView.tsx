'use client';

import { useMemo, useState } from 'react';
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
import { FiTrendingUp, FiTrendingDown, FiActivity, FiInfo } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { useBusiness } from '@/context/BusinessContext';
import { formatINR } from '@/lib/format';
import './SimulatorView.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, prefix, onChange }: SliderProps) {
  return (
    <div className="sim__slider">
      <div className="sim__slider-head">
        <span>{label}</span>
        <strong>
          {prefix}
          {value.toLocaleString('en-IN')}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function SimulatorView() {
  const { finance, profile } = useBusiness();

  const [price, setPrice] = useState(700);
  const [customers, setCustomers] = useState(150);
  const [rawCost, setRawCost] = useState(350);
  const [fixedCost, setFixedCost] = useState(profile?.monthlyExpenses ?? 20000);

  const emi = finance?.estimatedEmi ?? 0;
  const ownCapital = finance?.ownCapital ?? profile?.capital ?? 100000;

  const calc = useMemo(() => {
    const revenue = price * customers;
    const variableCost = rawCost * customers;
    const totalExpenses = variableCost + fixedCost + emi;
    const profit = revenue - totalExpenses;
    const contributionMargin = price - rawCost;
    const breakEvenUnits =
      contributionMargin > 0 ? Math.ceil((fixedCost + emi) / contributionMargin) : null;
    const capitalRecoveryMonths = profit > 0 ? Math.ceil(ownCapital / profit) : null;
    const emiAffordable = profit + emi > 0 ? (emi === 0 ? true : profit >= 0) : false;
    return {
      revenue,
      variableCost,
      totalExpenses,
      profit,
      breakEvenUnits,
      capitalRecoveryMonths,
      emiAffordable,
    };
  }, [price, customers, rawCost, fixedCost, emi, ownCapital]);

  const chartData = [
    { name: 'Revenue', value: calc.revenue, color: '#1f7a4d' },
    { name: 'Expenses', value: calc.totalExpenses, color: '#d98a04' },
    { name: 'Profit', value: Math.max(0, calc.profit), color: '#2563eb' },
  ];

  return (
    <div className="sim">
      <div className="sim__grid">
        <Card className="sim__inputs">
          <h3 className="sim__title">
            <FiActivity className="sim__title-icon" /> Adjust the Levers
          </h3>
          <Slider
            label="Product Price (per unit)"
            value={price}
            min={100}
            max={2000}
            step={10}
            prefix="₹"
            onChange={setPrice}
          />
          <Slider
            label="Customers / Month"
            value={customers}
            min={10}
            max={800}
            step={5}
            onChange={setCustomers}
          />
          <Slider
            label="Raw Material Cost (per unit)"
            value={rawCost}
            min={0}
            max={1500}
            step={10}
            prefix="₹"
            onChange={setRawCost}
          />
          <Slider
            label="Fixed Monthly Cost"
            value={fixedCost}
            min={0}
            max={100000}
            step={1000}
            prefix="₹"
            onChange={setFixedCost}
          />
          {emi > 0 && (
            <div className="sim__emi-note">
              <FiInfo /> Includes your estimated EMI of {formatINR(emi)}/month from Finance.
            </div>
          )}
        </Card>

        <div className="sim__results">
          <div className="sim__stats">
            <StatCard
              icon={<FiTrendingUp />}
              label="Monthly Revenue"
              value={formatINR(calc.revenue)}
              accent="primary"
            />
            <StatCard
              icon={<FiTrendingDown />}
              label="Monthly Expenses"
              value={formatINR(calc.totalExpenses)}
              accent="warning"
            />
            <StatCard
              icon={<FiActivity />}
              label="Monthly Profit"
              value={formatINR(calc.profit)}
              accent={calc.profit >= 0 ? 'success' : 'danger'}
            />
          </div>

          <Card>
            <div className="sim__chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8a978f' }} />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 12, fill: '#8a978f' }}
                    width={55}
                  />
                  <Tooltip formatter={(v: number) => formatINR(v)} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="sim__insights">
            <Card className="sim__insight">
              <span className="sim__insight-label">Break-even</span>
              <span className="sim__insight-value">
                {calc.breakEvenUnits ? `${calc.breakEvenUnits} units / month` : 'Not reachable'}
              </span>
              <span className="sim__insight-sub">
                {calc.breakEvenUnits && customers >= calc.breakEvenUnits ? (
                  <Badge variant="success" size="sm">
                    Above break-even
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm">
                    Below break-even
                  </Badge>
                )}
              </span>
            </Card>
            <Card className="sim__insight">
              <span className="sim__insight-label">Capital Recovery</span>
              <span className="sim__insight-value">
                {calc.capitalRecoveryMonths
                  ? `${calc.capitalRecoveryMonths} months`
                  : 'Not reachable'}
              </span>
              <span className="sim__insight-sub text-muted">To recover own capital</span>
            </Card>
            <Card className="sim__insight">
              <span className="sim__insight-label">EMI Affordability</span>
              <span className="sim__insight-value">
                {emi === 0 ? 'No loan' : calc.emiAffordable ? 'Affordable' : 'Tight'}
              </span>
              <span className="sim__insight-sub">
                <Badge variant={calc.emiAffordable ? 'success' : 'danger'} size="sm">
                  {emi === 0 ? '—' : calc.emiAffordable ? 'Positive after EMI' : 'Negative profit'}
                </Badge>
              </span>
            </Card>
          </div>
        </div>
      </div>

      <div className="sim__disclaimer">
        <FiInfo /> All values are calculated deterministically from your inputs. This is a
        decision-support simulator, not a financial guarantee.
      </div>
    </div>
  );
}
