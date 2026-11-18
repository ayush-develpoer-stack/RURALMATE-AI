import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padded?: boolean;
  gradient?: boolean;
}

export default function Card({
  children,
  hover,
  padded = true,
  gradient,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`card ${hover ? 'card--hover' : ''} ${padded ? 'card--padded' : ''} ${
        gradient ? 'card--gradient' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
