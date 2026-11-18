import type { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export default function StatCard({
  icon,
  label,
  value,
  sublabel,
  accent = 'primary',
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {sublabel && <span className="stat-card__sublabel">{sublabel}</span>}
      </div>
    </div>
  );
}
