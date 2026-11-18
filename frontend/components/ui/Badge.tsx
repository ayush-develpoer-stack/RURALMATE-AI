import type { ReactNode } from 'react';
import './Badge.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'neutral', icon, size = 'md' }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
}
