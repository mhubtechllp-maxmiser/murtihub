import React from 'react';
import './Services.scss';

export default function ServiceCard({ service, index }) {
  const { id, title, description, tags, cardLayout } = service;
  // 1st, 3rd, 5th -> odd (light variant) | 2nd, 4th, 6th -> even (blue variant)
  const isEven = (index + 1) % 2 === 0;

  return (
    <article
      className={`service-card layout-${cardLayout || 'default'} ${
        isEven ? 'is-blue-variant' : 'is-light-variant'
      } card-index-${index}`}
      data-service-id={id}
    >
      <div className="service-card-inner">
        {/* Decorative backdrop elements */}
        <div className="card-ambient-glow" aria-hidden="true" />
        <div className="card-blueprint-grid" aria-hidden="true" />
        <div className="card-accent-beam" aria-hidden="true" />

        {/* Card Header & Technical Identifier */}
        <div className="card-top-spine">
          <span className="service-number-badge">{id}</span>
          <span className="service-side-label">MurtiHub // Discipline</span>
          <div className="card-top-line" aria-hidden="true" />
        </div>

        {/* Card Title & Content */}
        <div className="card-main-content">
          <h3 className="service-title">{title}</h3>
          <p className="service-desc">{description}</p>
        </div>

        {/* Card Bottom Meta: Tags */}
        <div className="card-footer-meta">
          <div className="service-tags-list">
            {tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span className="tag-text">{tag}</span>
                {idx < tags.length - 1 && <span className="tag-separator" aria-hidden="true">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}