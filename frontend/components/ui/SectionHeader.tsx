import type { ReactNode } from 'react';
import './SectionHeader.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  center?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  action,
  center,
}: SectionHeaderProps) {
  return (
    <div className={`section-header ${center ? 'section-header--center' : ''}`}>
      <div className="section-header__text">
        {eyebrow && (
          <span className="section-header__eyebrow">
            {icon && <span className="section-header__icon">{icon}</span>}
            {eyebrow}
          </span>
        )}
        <h2 className="section-header__title">{title}</h2>
        {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-header__action">{action}</div>}
    </div>
  );
}
