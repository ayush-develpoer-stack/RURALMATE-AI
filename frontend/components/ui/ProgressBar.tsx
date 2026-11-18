'use client';

import { useEffect, useState } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  invert?: boolean;
  showValue?: boolean;
}

function colorFor(pct: number, invert?: boolean): string {
  const p = invert ? 100 - pct : pct;
  if (p >= 70) return 'var(--color-success)';
  if (p >= 45) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  invert,
  showValue = true,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="progress-bar">
      <div className="progress-bar__head">
        <span className="progress-bar__label">{label}</span>
        {showValue && <span className="progress-bar__value">{Math.round(value)}</span>}
      </div>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${width}%`, background: colorFor(pct, invert) }}
        />
      </div>
    </div>
  );
}
