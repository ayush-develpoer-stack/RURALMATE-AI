'use client';

import { useEffect, useState } from 'react';
import './ScoreRing.css';

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

function colorFor(pct: number): string {
  if (pct >= 75) return 'var(--color-success)';
  if (pct >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export default function ScoreRing({
  score,
  max = 100,
  size = 200,
  label,
  sublabel,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(0);
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-alt)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorFor(pct)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-ring__center">
        <span className="score-ring__value" style={{ color: colorFor(pct) }}>
          {Math.round(score)}
        </span>
        <span className="score-ring__max">/ {max}</span>
        {label && <span className="score-ring__label">{label}</span>}
        {sublabel && <span className="score-ring__sublabel">{sublabel}</span>}
      </div>
    </div>
  );
}
