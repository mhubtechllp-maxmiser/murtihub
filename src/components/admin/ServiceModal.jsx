import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import './ProjectModal.scss'; // Share clean modal styling

export default function ServiceModal({ service, isOpen, onClose, onSave }) {
  const isEditing = Boolean(service && (service.slug || service.id));

  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    slug: '',
    description: '',
    longDescription: '',
    tags: 'Agentic AI, Generative AI, Cloud Systems',
    capabilities: '',
    technologies: 'Python, React, TypeScript',
    engineeringApproach: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        shortTitle: service.shortTitle || service.title || '',
        slug: service.slug || '',
        description: service.description || '',
        longDescription: service.longDescription || service.description || '',
        tags: Array.isArray(service.tags) ? service.tags.join(', ') : (service.tags || ''),
        capabilities: Array.isArray(service.capabilities) ? service.capabilities.join('\n') : (service.capabilities || ''),
        technologies: Array.isArray(service.technologies) ? service.technologies.join(', ') : (service.technologies || ''),
        engineeringApproach: service.engineeringApproach || '',
      });
    } else {
      setFormData({
        title: '',
        shortTitle: '',
        slug: '',
        description: '',
        longDescription: '',
        tags: 'Architecture, Cloud, Security',
        capabilities: 'Autonomous Workflow Design\nZero-Trust Infrastructure\nSub-50ms Latency Tuning',
        technologies: 'React, Node.js, TypeScript',
        engineeringApproach: '',
      });
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please provide title and description');
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      capabilities: formData.capabilities.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    onSave(payload);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div>
            <h3 className="modal-title">{isEditing ? 'Edit Engineering Discipline' : 'Add New Engineering Discipline'}</h3>
            <p className="modal-subtitle">
              {isEditing ? `Modify service definitions and capabilities for ${formData.title}` : 'Publish a new engineering service offering'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Service Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Agentic & Generative AI"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="modal-input"
              />
            </div>

            <div className="modal-form-group">
              <label>URL Slug</label>
              <input
                type="text"
                placeholder="e.g. agentic-generative-ai (auto-generated if blank)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          <div className="modal-form-group">
            <label>Short Title (Navbar & Mini Cards)</label>
            <input
              type="text"
              placeholder="e.g. Agentic AI"
              value={formData.shortTitle}
              onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
              className="modal-input"
            />
          </div>

          <div className="modal-form-group">
            <label>Card Description (Summary) *</label>
            <textarea
              rows={3}
              required
              placeholder="Concise overview rendered in service grids..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="modal-textarea"
            />
          </div>

          <div className="modal-form-group">
            <label>In-Depth Architectural Description</label>
            <textarea
              rows={4}
              placeholder="Comprehensive architectural narrative rendered on detailed service page..."
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="modal-textarea"
            />
          </div>

          <div className="modal-form-group">
            <label>Key Capabilities (One per line)</label>
            <textarea
              rows={4}
              placeholder="Autonomous Multi-Agent Workflow Orchestration&#10;Deterministic RAG & Vector Knowledge Retrieval&#10;Zero-Trust Tokenized Perimeter"
              value={formData.capabilities}
              onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
              className="modal-textarea"
            />
          </div>

          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Pill Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Agentic AI, Generative AI, RAG"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="modal-input"
              />
            </div>

            <div className="modal-form-group">
              <label>Technologies Used (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Python, LangGraph, FastAPI, Vite"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEditing ? 'Save Discipline' : 'Create Discipline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

