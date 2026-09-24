import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Projects.scss';

export default function ProjectCard({ project, index }) {
  const { id, slug, name, status, description, image, gridSpan, liveUrl } = project;
  // 1st, 3rd, 5th -> odd (light variant) | 2nd, 4th, 6th -> even (blue variant)
  const isEven = (index + 1) % 2 === 0;
  const projectUrl = liveUrl || `https://${slug}.murtihub.co.in`;

  return (
    <article
      className={`project-editorial-card ${gridSpan || ''} ${
        isEven ? 'is-blue-variant' : 'is-light-variant'
      } card-idx-${index}`}
      data-project-id={id}
    >
      {/* Decorative backdrop elements positioned absolutely within the article card */}
      <div className="card-ambient-glow" aria-hidden="true" />
      <div className="card-blueprint-grid" aria-hidden="true" />
      <div className="card-accent-beam" aria-hidden="true" />

      <a
        href={projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="project-card-link"
        aria-label={`Open live deployment for ${name}`}
      >
        {/* Visual Media Container */}
        <div className="project-media-wrapper">
          <img
            src={image}
            alt={name}
            className="project-image"
            loading="lazy"
          />
          <div className="project-image-gradient" aria-hidden="true" />

          <div className="project-overlay-header">
            <span className="project-index-num">{id}</span>
            <div className={`status-beacon ${status?.toUpperCase() === 'LIVE' || status?.toUpperCase() === 'DEPLOYED' ? 'status-live' : ''}`}>
              <span className="live-pulse-dot" aria-hidden="true" />
              <span className="status-text">{status}</span>
            </div>
          </div>
        </div>

        {/* Editorial Information Block: Name, Description & Live Site Action */}
        <div className="project-body-content">
          <div className="project-header">
            <h3 className="project-headline">{name}</h3>
          </div>

          <p className="project-summary">{description}</p>

          <div className="project-live-action">
            <span className="project-live-link">
              <span>View Live Site</span>
              <ArrowUpRight size={15} className="live-link-icon" aria-hidden="true" />
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}