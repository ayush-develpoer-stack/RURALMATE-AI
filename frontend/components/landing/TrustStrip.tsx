import { FiCpu, FiMapPin, FiDollarSign, FiShield } from 'react-icons/fi';
import './TrustStrip.css';

const ITEMS = [
  { icon: <FiCpu />, label: 'AI-Powered Decisions' },
  { icon: <FiMapPin />, label: 'Hyper-Local Insights' },
  { icon: <FiDollarSign />, label: 'Financial Clarity' },
  { icon: <FiShield />, label: 'Government Support' },
];

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="container trust-strip__inner">
        {ITEMS.map((it) => (
          <div key={it.label} className="trust-strip__item">
            <span className="trust-strip__icon">{it.icon}</span>
            <span className="trust-strip__label">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
