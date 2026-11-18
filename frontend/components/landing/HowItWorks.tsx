import {
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiShield,
  FiFileText,
  FiUsers,
} from 'react-icons/fi';
import './HowItWorks.css';

const STEPS = [
  { n: '01', icon: <FiUser />, title: 'Tell us about your business', desc: 'Share your capital, location, category and goal.' },
  { n: '02', icon: <FiMapPin />, title: 'Understand your local opportunity', desc: 'Get a feasibility score from local demand & competition.' },
  { n: '03', icon: <FiDollarSign />, title: 'Structure your finances', desc: 'See funding gap, EMI, surplus and break-even.' },
  { n: '04', icon: <FiShield />, title: 'Discover potential support', desc: 'Find potentially relevant government schemes.' },
  { n: '05', icon: <FiFileText />, title: 'Create your business plan', desc: 'Generate a practical, data-backed plan.' },
  { n: '06', icon: <FiUsers />, title: 'Find potential markets', desc: 'Identify buyers — retail, wholesale, B2B, online.' },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="container">
        <div className="how__head">
          <span className="how__eyebrow">How It Works</span>
          <h2 className="how__title">From idea to sustainable growth, step by step</h2>
        </div>
        <div className="how__timeline">
          {STEPS.map((s) => (
            <div key={s.n} className="how__step">
              <div className="how__step-marker">
                <span className="how__step-icon">{s.icon}</span>
                <span className="how__step-num">{s.n}</span>
              </div>
              <div className="how__step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
