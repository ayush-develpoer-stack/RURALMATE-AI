import { FiTrendingUp, FiTrendingDown, FiTarget } from 'react-icons/fi';
import './FinancialIntelligence.css';

const FLOW = [
  { label: 'Project Cost', value: '₹3,00,000', tone: 'neutral' },
  { label: 'Own Capital', value: '₹1,00,000', tone: 'neutral' },
  { label: 'Funding Gap', value: '₹2,00,000', tone: 'accent' },
];

const BARS = [
  { label: 'Expected Revenue', value: '₹75,000/mo', pct: 100, color: 'var(--color-primary)' },
  { label: 'Expenses', value: '₹48,000/mo', pct: 64, color: 'var(--color-warning)' },
  { label: 'Monthly Surplus', value: '₹27,000/mo', pct: 36, color: 'var(--color-secondary)' },
];

export default function FinancialIntelligence() {
  return (
    <section className="fin" id="finance">
      <div className="container fin__grid">
        <div className="fin__text">
          <span className="fin__eyebrow">Financial Intelligence</span>
          <h2 className="fin__title">Clarity on every rupee — deterministically calculated</h2>
          <p className="fin__desc">
            RuralMate structures project cost, funding gap, revenue, expenses, surplus, EMI and
            break-even. Every number is computed by a deterministic finance engine — never guessed by
            AI.
          </p>
          <div className="fin__flow">
            {FLOW.map((f, i) => (
              <div key={f.label} className="fin__flow-wrap">
                <div className={`fin__flow-card ${f.tone === 'accent' ? 'fin__flow-card--accent' : ''}`}>
                  <span className="fin__flow-label">{f.label}</span>
                  <span className="fin__flow-value">{f.value}</span>
                </div>
                {i < FLOW.length - 1 && <span className="fin__flow-op">{i === 0 ? '−' : '='}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="fin__card">
          <div className="fin__card-head">
            <FiTarget />
            <span>Monthly cash flow</span>
          </div>
          <div className="fin__bars">
            {BARS.map((b) => (
              <div key={b.label} className="fin__bar">
                <div className="fin__bar-head">
                  <span>{b.label}</span>
                  <strong>{b.value}</strong>
                </div>
                <div className="fin__bar-track">
                  <div className="fin__bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="fin__stats">
            <div className="fin__stat">
              <FiTrendingUp className="fin__stat-icon fin__stat-icon--up" />
              <div>
                <span className="fin__stat-label">Estimated EMI</span>
                <span className="fin__stat-value">₹4,249/mo</span>
              </div>
            </div>
            <div className="fin__stat">
              <FiTrendingDown className="fin__stat-icon fin__stat-icon--down" />
              <div>
                <span className="fin__stat-label">Break-even</span>
                <span className="fin__stat-value">~5 months</span>
              </div>
            </div>
          </div>
          <p className="fin__note">
            Decision-support information, not a loan approval or guaranteed recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
