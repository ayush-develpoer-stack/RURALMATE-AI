import { FiShield, FiCheck, FiFileText, FiInfo } from 'react-icons/fi';
import './GovSupport.css';

const WHY = ['New enterprise', 'Rural business', 'Project size fits', 'Business category'];
const DOCS = ['Aadhaar card', 'Project report', 'Bank account details'];

export default function GovSupport() {
  return (
    <section className="gov" id="gov-support">
      <div className="container gov__grid">
        <div className="gov__text">
          <span className="gov__eyebrow">Government Support</span>
          <h2 className="gov__title">Find schemes that may fit — without the paperwork maze</h2>
          <p className="gov__desc">
            RuralMate matches your profile against curated government schemes using deterministic
            rules, then explains why each one may be relevant. We never claim guaranteed eligibility.
          </p>
          <ul className="gov__points">
            <li>
              <FiCheck /> Deterministic matching, transparent scoring
            </li>
            <li>
              <FiCheck /> Eligibility, documents and support details
            </li>
            <li>
              <FiCheck /> Direct links to official sources
            </li>
          </ul>
        </div>

        <div className="gov__card">
          <div className="gov__card-head">
            <span className="gov__relevant">Potentially Relevant</span>
            <span className="gov__match">86% match</span>
          </div>
          <div className="gov__scheme">
            <span className="gov__scheme-icon">
              <FiShield />
            </span>
            <div>
              <h3>PMEGP</h3>
              <p>Prime Minister&apos;s Employment Generation Programme</p>
            </div>
          </div>
          <div className="gov__block">
            <h4>Why it may match</h4>
            <div className="gov__chips">
              {WHY.map((w) => (
                <span key={w} className="gov__chip">
                  <FiCheck /> {w}
                </span>
              ))}
            </div>
          </div>
          <div className="gov__block">
            <h4>
              <FiFileText /> Documents
            </h4>
            <div className="gov__docs">
              {DOCS.map((d) => (
                <span key={d} className="gov__doc">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <p className="gov__note">
            <FiInfo /> Potentially relevant based on the information provided.
          </p>
        </div>
      </div>
    </section>
  );
}
