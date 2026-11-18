import { FiActivity } from 'react-icons/fi';
import './Logo.css';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo">
      <span className="logo__mark">
        <FiActivity />
      </span>
      {!compact && (
        <span className="logo__text">
          RuralMate <span className="logo__accent">AI</span>
        </span>
      )}
    </span>
  );
}
