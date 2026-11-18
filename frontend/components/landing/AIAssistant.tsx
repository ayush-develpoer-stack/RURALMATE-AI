import { FiCpu, FiUser } from 'react-icons/fi';
import './AIAssistant.css';

export default function AIAssistant() {
  return (
    <section className="aiassist">
      <div className="container aiassist__grid">
        <div className="aiassist__chat">
          <div className="aiassist__msg aiassist__msg--user">
            <span className="aiassist__avatar aiassist__avatar--user">
              <FiUser />
            </span>
            <div className="aiassist__bubble aiassist__bubble--user">
              I have ₹2 lakh and want to start a business in my village.
            </div>
          </div>
          <div className="aiassist__msg aiassist__msg--ai">
            <span className="aiassist__avatar aiassist__avatar--ai">
              <FiCpu />
            </span>
            <div className="aiassist__bubble aiassist__bubble--ai">
              Based on your capital, location and goals, a{' '}
              <strong>Dairy Business</strong> appears potentially suitable (feasibility 82/100).
              Local demand is strong and your capital fits well. Here&apos;s how to structure the
              finances and which support schemes may apply…
            </div>
          </div>
        </div>

        <div className="aiassist__text">
          <span className="aiassist__eyebrow">AI Advisor</span>
          <h2 className="aiassist__title">An advisor that understands your business context</h2>
          <p className="aiassist__desc">
            RuralMate&apos;s AI doesn&apos;t just chat — it reads your profile, analysis and finances
            to give grounded, explainable guidance. It handles understanding and explanation, while
            deterministic engines handle the numbers.
          </p>
          <div className="aiassist__pills">
            <span>Context-aware</span>
            <span>Explainable</span>
            <span>Grounded in your data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
