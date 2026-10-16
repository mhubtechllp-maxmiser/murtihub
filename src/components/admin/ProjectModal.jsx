import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import './ProjectModal.scss';

export default function ProjectModal({ project, isOpen, onClose, onSave }) {
  const isEditing = Boolean(project && (project.slug || project.id));

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'Live',
    image: '/images/hero/hero-1.jpg',
    liveUrl: 'https://murtihub.co.in',
    description: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        slug: project.slug || '',
        status: project.status || 'Live',
        image: project.image || '/images/hero/hero-1.jpg',
        liveUrl: project.liveUrl || 'https://murtihub.co.in',
        description: project.description || '',
      });
    } else {
      // Blank template for new project
      setFormData({
        name: '',
        slug: '',
        status: 'Live',
        image: '/images/hero/hero-1.jpg',
        liveUrl: 'https://murtihub.co.in',
        description: '',
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide a project name');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please provide a project description');
      return;
    }

    const generatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const payload = {
      ...(project || {}),
      name: formData.name.trim(),
      title: formData.name.trim(),
      slug: generatedSlug,
      status: formData.status,
      image: formData.image,
      liveUrl: formData.liveUrl.trim(),
      description: formData.description.trim(),
      gridSpan: 'span-6',
    };

    onSave(payload);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div>
            <h3 className="modal-title">
              {isEditing ? 'Edit Production Project' : 'Add New Production Project'}
            </h3>
            <p className="modal-subtitle">
              {isEditing
                ? `Modify details and cover image for ${formData.name || 'project'}`
                : 'Publish a new project card to the website'}
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
              <label>Live Platform URL</label>
              <input
                type="text"
                placeholder="https://aksharcanvas.com"
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
            hint="Upload custom screenshot or graphic. Hosted permanently on Cloudinary CDN."
            folder="murtihub/projects"
          />

          <div className="modal-form-group">
            <label>Description (Card Summary) *</label>
            <textarea
              rows={4}
              required
              placeholder="Concise overview rendered on project cards..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="modal-textarea"
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