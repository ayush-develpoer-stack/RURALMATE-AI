import {
  FiMapPin,
  FiActivity,
  FiShield,
  FiFileText,
  FiUsers,
} from 'react-icons/fi';
import './DashboardPreview.css';

const TILES = [
  { icon: <FiMapPin />, label: 'Business Opportunity', value: 'Dairy', sub: '82/100', accent: 'green' },
  { icon: <FiActivity />, label: 'Financial Readiness', value: '68%', sub: 'On track', accent: 'blue' },
  { icon: <FiShield />, label: 'Potential Support', value: '3', sub: 'Opportunities', accent: 'teal' },
  { icon: <FiFileText />, label: 'Business Plan', value: 'Ready', sub: 'Generated', accent: 'green' },
  { icon: <FiUsers />, label: 'Market Opportunities', value: '12', sub: 'Channels', accent: 'blue' },
];

export default function DashboardPreview() {
  return (
    <section className="dashprev">
      <div className="container">
        <div className="dashprev__frame">
          <div className="dashprev__bar">
            <span className="dashprev__dot" />
            <span className="dashprev__dot" />
            <span className="dashprev__dot" />
            <span className="dashprev__bar-title">RuralMate AI · Dashboard</span>
          </div>
          <div className="dashprev__body">
            <div className="dashprev__welcome">
              <div>
                <span className="dashprev__hi">Welcome back, Ravi</span>
                <h3 className="dashprev__heading">Your Business Journey</h3>
              </div>
              <span className="dashprev__badge">All modules connected</span>
            </div>
            <div className="dashprev__tiles">
              {TILES.map((t) => (
                <div key={t.label} className="dashprev__tile">
                  <span className={`dashprev__tile-icon dashprev__tile-icon--${t.accent}`}>
                    {t.icon}
                  </span>
                  <span className="dashprev__tile-label">{t.label}</span>
                  <span className="dashprev__tile-value">{t.value}</span>
                  <span className="dashprev__tile-sub">{t.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
