import React from 'react';
import './LeaderProfile.scss';

export default function LeaderProfile({ leader, index = 0 }) {
  if (!leader) return null;
  // Alternating: 1st card light, 2nd card dark
  const isDark = index % 2 === 1;

  const bioList = Array.isArray(leader.bio) ? leader.bio : [leader.bio || ''];
  const quoteText = leader.quotes?.leadership || leader.quotes?.about || 'Engineering systems with institutional integrity.';

  return (
    <article className={`leader-profile-card ${isDark ? 'is-dark-variant' : 'is-light-variant'}`}>
      <div className="leader-profile-grid">
        {/* Executive Portrait */}
        <div className="leader-media-column">
          <div className="leader-image-frame">
            <img
              src={leader.image}
              alt={`${leader.name} — ${leader.title}`}
              className="leader-portrait-img"
              loading="lazy"
            />
            <div className="leader-frame-overlay" />
          </div>
          <div className="leader-designation-badge">
            <span className="badge-tag">Executive Leadership</span>
            <span className="badge-title">{leader.title}</span>
          </div>
        </div>

        {/* Biography & Governance Details */}
        <div className="leader-info-column">
          <div className="leader-name-header">
            <span className="leader-role-track">{leader.role}</span>
            <h2 className="leader-name text-h2">{leader.name}</h2>
          </div>

          <div className="leader-bio-paragraphs">
            {bioList.map((para, idx) => (
              <p key={idx} className="leader-bio-p">
                {para}
              </p>
            ))}
          </div>

          {/* Key Leadership Quote */}
          {quoteText && (
            <blockquote className="editorial-quote leader-quote">
              <p>"{quoteText}"</p>
              <footer className="quote-attribution">
                — {leader.name}, {leader.title}
              </footer>
            </blockquote>
          )}
        </div>
      </div>
    </article>
  );
}