import {
  FiMapPin,
  FiDollarSign,
  FiShield,
  FiFileText,
  FiCamera,
  FiUsers,
} from 'react-icons/fi';
import './FeaturesSection.css';

const FEATURES = [
  {
    icon: <FiMapPin />,
    title: 'Hyper-Local Business Analysis',
    desc: 'Understand potential opportunities using location, demand, competition, accessibility and capital fit.',
    accent: 'green',
  },
  {
    icon: <FiDollarSign />,
    title: 'Financial Structuring',
    desc: 'See project cost, own capital, funding gap, revenue, expenses, profit, EMI and break-even.',
    accent: 'blue',
  },
  {
    icon: <FiShield />,
    title: 'Government Scheme Intelligence',
    desc: 'Discover potentially relevant government schemes based on the entrepreneur profile.',
    accent: 'teal',
  },
  {
    icon: <FiFileText />,
    title: 'AI Business Plan',
    desc: 'Generate a practical business plan based on the user’s actual inputs and numbers.',
    accent: 'green',
  },
  {
    icon: <FiCamera />,
    title: 'Product AI',
    desc: 'Upload a product image and generate a name, category, description, tags and suggested price.',
    accent: 'blue',
  },
  {
    icon: <FiUsers />,
    title: 'Market Linkage',
    desc: 'Discover potential local retailers, wholesalers, B2B buyers, online and institutional buyers.',
    accent: 'teal',
  },
];

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features__head">
          <span className="features__eyebrow">Features</span>
          <h2 className="features__title">One connected platform, end to end</h2>
          <p className="features__sub">
            We don&apos;t just tell you what to do — we show you where to start and how to grow.
          </p>
        </div>
        <div className="features__grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="features__card">
              <span className={`features__icon features__icon--${f.accent}`}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
