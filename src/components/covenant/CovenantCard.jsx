import React from 'react';
import { Check } from 'lucide-react';
import './CovenantCard.scss';

export default function CovenantCard({ principle, index }) {
  const { number, name, summary, details } = principle;

  return (
    <article className="covenant-principle-card">
      <div className="card-numeric-header">
        <span className="principle-number">{number}</span>
        <span className="principle-tier-tag">Foundational Principle</span>
      </div>

      <h3 className="principle-name">{name}</h3>
      <p className="principle-summary">{summary}</p>

      <ul className="principle-details-list">
        {details.map((detail, idx) => (
          <li key={idx} className="principle-detail-item">
            <Check size={16} className="detail-check-icon" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      <div className="card-accent-bar"></div>
    </article>
  );
}

