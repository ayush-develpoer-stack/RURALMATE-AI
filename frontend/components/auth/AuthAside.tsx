import { FiCheck } from 'react-icons/fi';
import Logo from '@/components/layout/Logo';

const POINTS = [
  'Hyper-local feasibility scoring',
  'Deterministic financial structuring',
  'Government scheme intelligence',
  'AI business plans & product listings',
];

export default function AuthAside() {
  return (
    <aside className="auth__aside">
      <div className="auth__aside-top">
        <Logo />
      </div>
      <div className="auth__aside-body">
        <h2>From business idea to sustainable growth.</h2>
        <p>
          Join RuralMate AI — the intelligent decision-support platform built for rural
          micro-entrepreneurs.
        </p>
        <ul className="auth__points">
          {POINTS.map((p) => (
            <li key={p}>
              <FiCheck /> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="auth__aside-foot">SIH 2026 · Team Globalantic Innovators</div>
    </aside>
  );
}
