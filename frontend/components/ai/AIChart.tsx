'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChatChart } from '@/services/ai.service';
import './AIChart.css';

function colorFor(label: string, value: number): string {
  const l = label.toLowerCase();
  if (value < 0) return '#dc3545';
  if (/rev/.test(l)) return '#1f7a4d';
  if (/expens|cost/.test(l)) return '#d98a04';
  if (/profit|surplus/.test(l)) return '#2563eb';
  if (/competition/.test(l)) return '#d98a04';
  return '#0d9488';
}

export default function AIChart({ chart }: { chart: ChatChart }) {
  const compact = (v: number) => {
    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return String(v);
  };

  return (
    <div className="aichart">
      <span className="aichart__title">{chart.title}</span>
      <div className="aichart__canvas">
        <ResponsiveContainer width="100%" height={190}>
          {chart.type === 'line' ? (
            <LineChart data={chart.data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8a978f' }} />
              <YAxis tickFormatter={compact} tick={{ fontSize: 11, fill: '#8a978f' }} width={40} />
              <Tooltip formatter={(v: number) => v.toLocaleString('en-IN')} />
              <Line type="monotone" dataKey="value" stroke="#1f7a4d" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={chart.data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e9e4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8a978f' }} interval={0} />
              <YAxis tickFormatter={compact} tick={{ fontSize: 11, fill: '#8a978f' }} width={40} />
              <Tooltip formatter={(v: number) => v.toLocaleString('en-IN')} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {chart.data.map((d) => (
                  <Cell key={d.label} fill={colorFor(d.label, d.value)} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
