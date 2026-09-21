import React, { useState } from 'react';
import { Shield, Cpu, Database, Layout, ArrowRight, CheckCircle2 } from 'lucide-react';
import { architectureData } from '../../data/architectureData';
import './TopologyVisualizer.scss';

export default function TopologyVisualizer() {
  const [activeNodeId, setActiveNodeId] = useState('ingress');

  const nodeIcons = {
    ingress: Shield,
    mesh: Cpu,
    storage: Database,
    client: Layout
  };

  const activeNode =
    architectureData.topologyNodes.find((n) => n.id === activeNodeId) ||
    architectureData.topologyNodes[0];

  return (
    <div className="topology-visualizer-card">
      <div className="topology-card-header">
        <div className="topology-status-line">
          <span className="topology-beacon"></span>
          <span className="topology-status-text">
            ARCHITECTURAL SYSTEMS TOPOLOGY // ZERO-TRUST ACTIVE
            Architectural Systems Topology // Zero-Trust Active
          </span>
        </div>
        <div className="topology-metrics-meta">
          <span>LATENCY: &lt;1ms</span>
          <span>Latency: &lt;1ms</span>
          <span>•</span>
          <span>PROTOCOL: mTLS v1.3</span>
          <span>Protocol: mTLS v1.3</span>
        </div>
      </div>

      {/* Interactive Topology Diagram */}
      <div className="topology-stage">
        {/* SVG Flowing Interconnection Lines */}
        <svg
          className="topology-svg-grid"
          viewBox="0 0 800 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Base Connection Lines */}
          <path
            d="M 120 100 L 290 100"
            stroke="rgba(37, 99, 235, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 330 100 L 500 100"
            stroke="rgba(37, 99, 235, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M 540 100 L 710 100"
            stroke="rgba(37, 99, 235, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animated Energy Pulses */}
          <circle r="4" fill="#2563EB">
            <animateMotion path="M 120 100 L 290 100" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="4" fill="#2563EB">
            <animateMotion path="M 330 100 L 500 100" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="4" fill="#2563EB">
            <animateMotion path="M 540 100 L 710 100" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Nodes Grid */}
        <div className="topology-nodes-grid">
          {architectureData.topologyNodes.map((node, index) => {
            const Icon = nodeIcons[node.id] || Cpu;
            const isSelected = node.id === activeNodeId;

            return (
              <button
                key={node.id}
                type="button"
                className={`topology-node-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setActiveNodeId(node.id)}
                aria-pressed={isSelected}
              >
                <div className="node-icon-wrapper">
                  <Icon size={20} />
                </div>
                <div className="node-info">
                  <span className="node-seq">0{index + 1}</span>
                  <h4 className="node-title">{node.title}</h4>
                  <span className="node-proto">{node.protocols.split('//')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Technical Inspector Panel for Selected Node */}
      <div className="topology-inspector-panel">
        <div className="inspector-left">
          <span className="inspector-tag">ACTIVE COMPONENT TELEMETRY</span>
          <span className="inspector-tag">Active Component Telemetry</span>
          <h3 className="inspector-title">{activeNode.title}</h3>
          <p className="inspector-desc">{activeNode.description}</p>
        </div>

        <div className="inspector-right">
          <div className="inspector-spec-box">
            <span className="spec-label">ENFORCED PROTOCOLS</span>
            <span className="spec-label">Enforced Protocols</span>
            <span className="spec-value">{activeNode.protocols}</span>
          </div>
          <div className="inspector-verification">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>Deterministic state verification enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

