'use client';

import { useState } from 'react';
import {
  FiChevronDown,
  FiCheck,
  FiFileText,
  FiExternalLink,
  FiInfo,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { SchemeMatch } from '@/types/scheme';
import './SchemeCard.css';

function badgeVariant(label: SchemeMatch['matchLabel']): 'success' | 'primary' | 'neutral' {
  if (label === 'Strong Potential Match') return 'success';
  if (label === 'Potential Match') return 'primary';
  return 'neutral';
}

export default function SchemeCard({ scheme }: { scheme: SchemeMatch }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="scheme-card">
      <div className="scheme-card__head">
        <div className="scheme-card__title-wrap">
          <div className="scheme-card__name-row">
            <h3 className="scheme-card__name">{scheme.name}</h3>
            <Badge variant={badgeVariant(scheme.matchLabel)}>{scheme.matchLabel}</Badge>
          </div>
          <p className="scheme-card__full">{scheme.fullName}</p>
          <p className="scheme-card__ministry">{scheme.ministry}</p>
        </div>
        <div className="scheme-card__score">
          <span className="scheme-card__score-value">{scheme.matchScore}%</span>
          <span className="scheme-card__score-label">indicative match</span>
        </div>
      </div>

      <p className="scheme-card__summary">{scheme.summary}</p>

      <div className="scheme-card__reasons">
        {scheme.matchReasons.map((r, i) => (
          <span key={i} className="scheme-card__reason">
            <FiCheck /> {r}
          </span>
        ))}
      </div>

      <button className="scheme-card__toggle" onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide details' : 'View eligibility & documents'}
        <FiChevronDown className={`scheme-card__chev ${open ? 'scheme-card__chev--open' : ''}`} />
      </button>

      {open && (
        <div className="scheme-card__details">
          <div className="scheme-card__detail-block">
            <h4>
              <FiCheck /> Key Eligibility
            </h4>
            <ul>
              {scheme.keyEligibility.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
          <div className="scheme-card__detail-block">
            <h4>
              <FiFileText /> Documents
            </h4>
            <ul>
              {scheme.documents.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="scheme-card__detail-block">
            <h4>
              <FiInfo /> Support
            </h4>
            <p>{scheme.subsidyInfo}</p>
            <p className="text-secondary">{scheme.supportInfo}</p>
          </div>
          <a
            className="scheme-card__source"
            href={scheme.officialSource}
            target="_blank"
            rel="noopener noreferrer"
          >
            Official source <FiExternalLink />
          </a>
        </div>
      )}
    </Card>
  );
}
