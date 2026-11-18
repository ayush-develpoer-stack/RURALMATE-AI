import {
  FiUpload,
  FiCpu,
  FiArrowRight,
  FiTag,
  FiShoppingBag,
  FiTruck,
  FiBriefcase,
  FiGlobe,
  FiHome,
} from 'react-icons/fi';
import './ProductDemo.css';

const TAGS = ['Handmade', 'Bamboo', 'Eco-Friendly', 'Rural Craft'];
const MARKETS = [
  { icon: <FiShoppingBag />, label: 'Local Retailers' },
  { icon: <FiTruck />, label: 'Wholesalers' },
  { icon: <FiBriefcase />, label: 'B2B Buyers' },
  { icon: <FiGlobe />, label: 'Online' },
  { icon: <FiHome />, label: 'Institutional' },
];

export default function ProductDemo() {
  return (
    <section className="pdemo" id="product-demo">
      <div className="container">
        <div className="pdemo__head">
          <span className="pdemo__eyebrow">Product Intelligence</span>
          <h2 className="pdemo__title">Turn a product photo into a market-ready listing</h2>
          <p className="pdemo__sub">
            From <strong>what to sell</strong> to <strong>how to present it</strong> to{' '}
            <strong>where buyers may exist</strong>.
          </p>
        </div>

        <div className="pdemo__flow">
          <div className="pdemo__step">
            <div className="pdemo__upload">
              <FiUpload />
              <span>Upload product image</span>
            </div>
          </div>

          <div className="pdemo__arrow">
            <FiCpu />
            <FiArrowRight />
          </div>

          <div className="pdemo__card">
            <div className="pdemo__card-top">
              <span className="pdemo__chip">Home &amp; Lifestyle</span>
              <span className="pdemo__price">₹650–₹750</span>
            </div>
            <h3 className="pdemo__product">Handcrafted Bamboo Storage Basket</h3>
            <p className="pdemo__desc">
              A durable, handwoven bamboo storage basket crafted by skilled rural artisans —
              eco-friendly, sturdy and unique.
            </p>
            <div className="pdemo__tags">
              {TAGS.map((t) => (
                <span key={t} className="pdemo__tag">
                  <FiTag /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pdemo__markets">
          <span className="pdemo__markets-label">Potential markets</span>
          <div className="pdemo__markets-list">
            {MARKETS.map((m) => (
              <span key={m.label} className="pdemo__market">
                {m.icon} {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
