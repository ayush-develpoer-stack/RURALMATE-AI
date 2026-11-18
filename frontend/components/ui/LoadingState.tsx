import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
  rows?: number;
}

export default function LoadingState({
  message = 'Loading...',
  variant = 'spinner',
  rows = 3,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="loading-skeleton">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="loading-skeleton__row" />
        ))}
      </div>
    );
  }
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <p className="loading-state__message">{message}</p>
    </div>
  );
}
