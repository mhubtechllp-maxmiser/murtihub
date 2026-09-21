import React from 'react';
import { architectureData } from '../../data/architectureData';
import './DisciplinesBlock.scss';

export default function DisciplinesBlock({ theme = 'light' }) {
  const { disciplines } = architectureData;

  return (
    <div className={`disciplines-container theme-${theme}`}>
      <div className="disciplines-header">
        <span className="disciplines-status-badge">ACTIVE TELEMETRY VERIFIED</span>
        <span className="disciplines-status-badge">Active Telemetry Verified</span>
        <h3 className="disciplines-title">{disciplines.heading}</h3>
        <p className="disciplines-sub">{disciplines.subheading}</p>
        <p className="disciplines-desc lead-paragraph">{disciplines.description}</p>
      </div>

      <div className="disciplines-indicators-grid">
        {disciplines.indicators.map((ind, idx) => (
          <div key={idx} className="indicator-card">
            <div className="indicator-value">{ind.value}</div>
            <div className="indicator-label">{ind.label}</div>
            <div className="indicator-note">{ind.note}</div>
            <div className="indicator-hairline"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

