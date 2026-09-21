import React from 'react';
import './SectionHeading.scss';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  alignment = 'left', // 'left', 'center', 'split'
  theme = 'light', // 'light' or 'dark'
  className = ''
}) {
  return (
    <div className={`section-heading align-${alignment} theme-${theme} ${className}`}>
      {eyebrow && (
        <div className="section-eyebrow">
          <span className="eyebrow-dash"></span>
          <span className="eyebrow-text">{eyebrow}</span>
        </div>
      )}

      {alignment === 'split' ? (
        <div className="section-heading-split">
          <h2 className="section-title text-h1">{title}</h2>
          <div className="section-description-wrap">
            {subtitle && <h3 className="section-subtitle">{subtitle}</h3>}
            {description && <p className="section-description lead-paragraph">{description}</p>}
          </div>
        </div>
      ) : (
        <>
          <h2 className="section-title text-h1">{title}</h2>
          {subtitle && <h3 className="section-subtitle">{subtitle}</h3>}
          {description && <p className="section-description lead-paragraph">{description}</p>}
        </>
      )}

      <div className="section-accent-line"></div>
    </div>
  );
}

