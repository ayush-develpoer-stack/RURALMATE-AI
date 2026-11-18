import { FiCheck } from 'react-icons/fi';
import type { JourneyStage } from '@/types/dashboard';
import './JourneyProgress.css';

const STATUS_LABEL: Record<JourneyStage['status'], string> = {
  complete: 'Complete',
  available: 'Available',
  'not-started': 'Not started',
};

export default function JourneyProgress({ stages }: { stages: JourneyStage[] }) {
  const completed = stages.filter((s) => s.status === 'complete').length;
  const pct = Math.round((completed / stages.length) * 100);

  return (
    <div className="journey">
      <div className="journey__head">
        <h3 className="journey__title">Your Business Journey</h3>
        <span className="journey__count">
          {completed}/{stages.length} stages
        </span>
      </div>
      <div className="journey__track">
        <div className="journey__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="journey__stages">
        {stages.map((s) => (
          <div key={s.key} className={`journey__stage journey__stage--${s.status}`}>
            <span className="journey__dot">
              {s.status === 'complete' && <FiCheck />}
            </span>
            <span className="journey__label">{s.label}</span>
            <span className="journey__status">{s.detail ?? STATUS_LABEL[s.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
