import React from 'react';
import { Cpu, Database, Check } from 'lucide-react';
import { techArsenalData } from '../../data/techArsenalData';
import './TechModuleGrid.scss';

function ModuleCard({ mod }) {
  return (
    <div className="tech-module-card">
      <div className="module-top">
        <span className="module-category">{mod.category}</span>
        <span className="module-status-tag">{mod.status}</span>
      </div>

      <h4 className="module-name">{mod.name}</h4>
      <p className="module-role">{mod.role}</p>

      <div className="module-strengths">
        <span className="strengths-label">Architectural Benchmarks:</span>
        <ul className="strengths-list">
          {mod.strengths.map((str, idx) => (
            <li key={idx} className="strength-item">
              <Check size={13} className="text-accent" />
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="module-bottom-line"></div>
    </div>
  );
}

export default function TechModuleGrid() {
  const { applicationTier, persistenceTier } = techArsenalData;

  return (
    <div className="tech-tiers-stack">
      {/* Application Tier */}
      <div className="tech-tier-section">
        <div className="tier-header">
          <div className="tier-icon-wrap">
            <Cpu size={22} />
          </div>
          <div>
            <span className="tier-badge">Runtimes & Protocols</span>
            <h3 className="tier-title text-h2">{applicationTier.title}</h3>
            <p className="tier-desc lead-paragraph">{applicationTier.description}</p>
          </div>
        </div>

        <div className="modules-grid">
          {applicationTier.modules.map((mod) => (
            <ModuleCard key={mod.name} mod={mod} />
          ))}
        </div>
      </div>

      <div className="hairline my-tier-divider"></div>

      {/* Persistence Tier */}
      <div className="tech-tier-section">
        <div className="tier-header">
          <div className="tier-icon-wrap">
            <Database size={22} />
          </div>
          <div>
            <span className="tier-badge">Durability & Event Streams</span>
            <h3 className="tier-title text-h2">{persistenceTier.title}</h3>
            <p className="tier-desc lead-paragraph">{persistenceTier.description}</p>
          </div>
        </div>

        <div className="modules-grid">
          {persistenceTier.modules.map((mod) => (
            <ModuleCard key={mod.name} mod={mod} />
          ))}
        </div>
      </div>
    </div>
  );
}

