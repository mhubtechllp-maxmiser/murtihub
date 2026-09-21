import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { useCounter } from '../../hooks/useCounter';
import './StatStrip.scss';

function StatItem({ stat, isLast }) {
  const [count, elementRef] = useCounter(stat.number, 1.8);

  return (
    <div className="stat-item" ref={elementRef}>
      <div className="stat-figure">
        <span className="stat-number">{count}</span>
        <span className="stat-suffix">{stat.suffix}</span>
      </div>
      <div className="stat-meta">
        <span className="stat-label">{stat.label}</span>
        <p className="stat-desc">{stat.description}</p>
      </div>
      {!isLast && <div className="stat-separator" aria-hidden="true"></div>}
    </div>
  );
}

export default function StatStrip({ stats: initialStats, theme = 'light' }) {
  const [stats, setStats] = useState(initialStats || cmsService.getTrustStats());

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      return;
    }
    setStats(cmsService.getTrustStats());
    const unsub = cmsService.subscribe('trust_stats', (newStats) => {
      if (newStats) setStats(newStats);
    });
    return unsub;
  }, [initialStats]);

  return (
    <section className={`stat-strip-section theme-${theme}`} aria-label="Institutional Key Statistics">
      <div className="container">
        <div className="stat-strip-container">
          {stats.map((stat, idx) => (
            <StatItem
              key={stat.id || idx}
              stat={stat}
              isLast={idx === stats.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

