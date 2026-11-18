import Link from 'next/link';
import type { ReactNode } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import './InsightCard.css';

interface InsightCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: 'green' | 'blue' | 'teal' | 'amber';
  href: string;
  cta: string;
  children?: ReactNode;
}

export default function InsightCard({
  icon,
  label,
  value,
  sub,
  accent = 'green',
  href,
  cta,
  children,
}: InsightCardProps) {
  return (
    <div className="insight-card">
      <div className="insight-card__top">
        <span className={`insight-card__icon insight-card__icon--${accent}`}>{icon}</span>
        <span className="insight-card__label">{label}</span>
      </div>
      <span className="insight-card__value">{value}</span>
      {sub && <span className="insight-card__sub">{sub}</span>}
      {children}
      <Link href={href} className="insight-card__cta">
        {cta} <FiArrowRight />
      </Link>
    </div>
  );
}
