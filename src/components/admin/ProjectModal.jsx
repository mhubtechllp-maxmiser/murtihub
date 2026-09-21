import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import './ProjectModal.scss';

export default function ProjectModal({ project, isOpen, onClose, onSave }) {
  const isEditing = Boolean(project && (project.slug || project.id));

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    slug: '',
    status: 'Live',
    image: '/images/hero/hero-1.jpg',
    liveUrl: 'https://murtihub.co.in',
    description: '',
    overview: '',
    challenge: '',
    engineeringApproach: '',
    metrics: [
      { value: '100%', label: 'Delivery Integrity', sub: 'Verified' },
      { value: 'Zero', label: 'Downtime', sub: 'Redundant Architecture' },
    ],
    stack: 'React, Node.js, SCSS',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        title: project.title || '',
        slug: project.slug || '',
        status: project.status || 'Live',
        image: project.image || '/images/hero/hero-1.jpg',
        liveUrl: project.liveUrl || 'https://murtihub.co.in',
        description: project.description || '',
        overview: project.overview || '',
        challenge: project.challenge || '',
        engineeringApproach: project.engineeringApproach || '',
        metrics: project.metrics && project.metrics.length > 0 ? project.metrics : [
          { value: '100%', label: 'Delivery Integrity', sub: 'Verified' },
        ],
        stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || ''),
      });
    } else {
      // Blank template for new project
      setFormData({
        name: '',
        title: '',
        slug: '',
        status: 'Live',
        image: '/images/hero/hero-1.jpg',
        liveUrl: 'https://murtihub.co.in',
        description: '',
        overview: '',
        challenge: '',
        engineeringApproach: '',
        metrics: [
          { value: '100%', label: 'Delivery Integrity', sub: 'Verified' },
        ],
        stack: 'React, Node.js, SCSS',
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleMetricChange = (index, field, val) => {
    const updated = [...formData.metrics];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, metrics: updated });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { value: '', label: '', sub: '' }],
    });
  };

  const removeMetric = (index) => {
    if (formData.metrics.length <= 1) return;
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.title.trim()) {
      alert('Please provide project name and title');
      return;
    }

    const payload = {
      ...formData,
      stack: formData.stack.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onSave(payload);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div>
            <h3 className="modal-title">{isEditing ? 'Edit Production Project' : 'Add New Production Project'}</h3>
            <p className="modal-subtitle">
              {isEditing ? `Modify details, parameters, and cover image for ${formData.name}` : 'Publish a new institutional case study to the website'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Project Brand / Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Akshar Canvas"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="modal-input"
              />
            </div>

            <div className="modal-form-group">
              <label>URL Slug</label>
              <input
                type="text"
                placeholder="e.g. akshar-canvas (auto-generated if blank)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          <div className="modal-form-group">
            <label>Headline Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distraction-Free Publishing & Prose Architecture"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="modal-input"
            />
          </div>

          <div className="form-grid-2">
            <div className="modal-form-group">
              <label>Project Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="modal-select"
              >
                <option value="Live">Live (Active Production Deployment)</option>
                <option value="Deployed">Deployed (Enterprise Monolith)</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label>Live URL</label>
              <input
                type="text"
                placeholder="https://client-site.com"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="modal-input"
              />
            </div>
          </div>

          {/* Project Cover Image with direct File Upload */}
          <ImageUploadField
            label="Project Cover Image"
            value={formData.image}
            onChange={(newUrl) => setFormData({ ...formData, image: newUrl })}
            hint="Upload custom screenshot or graphic. Saved to /uploads/"
          />

          <div className="modal-form-group">
            <label>Short Description (Card Summary) *</label>
            <textarea
              rows={3}
              required
              placeholder="Concise overview rendered on project cards..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="modal-textarea"
            />
          </div>

          <div className="modal-form-group">
            <label>Detailed Architectural Overview</label>
            <textarea
              rows={3}
              placeholder="In-depth problem statement and system context..."
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className="modal-textarea"
            />
          </div>

          {/* Key Metrics */}
          <div className="modal-metrics-section">
            <div className="metrics-header-row">
              <label className="section-label">Key Highlight Metrics</label>
              <button type="button" className="btn btn-outline btn-sm" onClick={addMetric}>
                <Plus size={13} />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="metrics-list">
              {formData.metrics.map((m, idx) => (
                <div key={idx} className="metric-row">
                  <input
                    type="text"
                    placeholder="Value (e.g. 10K+)"
                    value={m.value}
                    onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                    className="modal-input metric-val"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Words / Day)"
                    value={m.label}
                    onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                    className="modal-input metric-label"
                  />
                  <input
                    type="text"
                    placeholder="Subtext (e.g. Average)"
                    value={m.sub || ''}
                    onChange={(e) => handleMetricChange(idx, 'sub', e.target.value)}
                    className="modal-input metric-sub"
                  />
                  {formData.metrics.length > 1 && (
                    <button
                      type="button"
                      className="metric-del-btn"
                      onClick={() => removeMetric(idx)}
                      title="Remove metric"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-form-group">
            <label>Technology Stack (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB Atlas, Redis"
              value={formData.stack}
              onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
              className="modal-input"
            />
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

