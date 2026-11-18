'use client';

import Link from 'next/link';
import {
  FiArrowRight,
  FiMessageSquare,
  FiCheck,
  FiTrendingUp,
  FiShield,
  FiActivity,
  FiMapPin,
  FiGrid,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import './Hero.css';

const BARS = [
  { label: 'Demand', value: 82 },
  { label: 'Competition', value: 61 },
  { label: 'Capital Fit', value: 91 },
];

export default function Hero() {
  const { isAuthenticated, loading } = useAuth();
  const authed = isAuthenticated && !loading;
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text animate-fade-up">
          <span className="hero__badge">
            <FiActivity /> AI-Driven Rural Business Advisory
          </span>
          <h1 className="hero__title">
            Your <span className="hero__title-grad">AI-powered</span> rural business advisor
          </h1>
          <p className="hero__desc">
            RuralMate AI helps rural entrepreneurs discover viable business opportunities, understand
            local market conditions, structure finances, find relevant government support and create
            practical growth plans — all in one intelligent platform.
          </p>

          <div className="hero__cta">
            {authed ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" leftIcon={<FiGrid />}>
                    Continue to Dashboard
                  </Button>
                </Link>
                <Link href="/advisor">
                  <Button size="lg" variant="outline" leftIcon={<FiMessageSquare />}>
                    Open AI Advisor
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" rightIcon={<FiArrowRight />}>
                    Start Business Analysis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" leftIcon={<FiMessageSquare />}>
                    Talk to AI
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="hero__trust">
            {['Deterministic finance', 'Hyper-local insights', 'Scheme intelligence'].map((t) => (
              <span key={t} className="hero__trust-item">
                <FiCheck /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hero__visual animate-fade-up">
          <div className="hero__panel">
            <div className="hero__panel-top">
              <span className="hero__panel-eyebrow">
                <FiMapPin /> Business Opportunity
              </span>
              <span className="hero__panel-chip">HIGH</span>
            </div>
            <div className="hero__panel-main">
              <div>
                <h3 className="hero__panel-business">Dairy Business</h3>
                <p className="hero__panel-loc">Rural Madhya Pradesh</p>
              </div>
              <div className="hero__panel-score">
                <span className="hero__panel-score-num">82</span>
                <span className="hero__panel-score-max">/100</span>
                <span className="hero__panel-score-label">Feasibility</span>
              </div>
            </div>
            <div className="hero__panel-bars">
              {BARS.map((b) => (
                <div key={b.label} className="hero__bar">
                  <div className="hero__bar-head">
                    <span>{b.label}</span>
                    <strong>{b.value}</strong>
                  </div>
                  <div className="hero__bar-track">
                    <div className="hero__bar-fill" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="hero__panel-foot">
              <span>Demo intelligence · Confidence 71%</span>
            </div>
          </div>

          <div className="hero__float hero__float--support">
            <div className="hero__float-icon hero__float-icon--green">
              <FiShield />
            </div>
            <div>
              <span className="hero__float-label">Potential Support</span>
              <span className="hero__float-value">₹2,00,000</span>
            </div>
          </div>

          <div className="hero__float hero__float--surplus">
            <div className="hero__float-icon hero__float-icon--blue">
              <FiTrendingUp />
            </div>
            <div>
              <span className="hero__float-label">Monthly Surplus</span>
              <span className="hero__float-value">₹27,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
