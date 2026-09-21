import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import './ContactForm.scss';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Agentic & Generative AI Solutions',
    message: ''
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypes = [
    'Agentic & Generative AI Solutions',
    'Web Development',
    'Application Development',
    'CMS Websites',
    'CRM & Enterprise Systems',
    'UI/UX Design',
    'General Partner Inquiry'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        state: 'error',
        message: 'Please complete all required fields (Name, Email, Message).'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ state: 'idle', message: '' });

    try {
      const res = await cmsService.submitContactForm(formData);
      setStatus({
        state: 'success',
        message:
          res.message ||
          'Inquiry logged successfully. A designated partner or senior architect will respond within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'Agentic & Generative AI Solutions',
        message: ''
      });
    } catch (err) {
      console.error('Submission error:', err);
      setStatus({
        state: 'error',
        message: err.message || 'An error occurred while submitting your consultation inquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="enterprise-contact-form" onSubmit={handleSubmit} noValidate>
      {status.state === 'success' && (
        <div className="form-status-alert alert-success" role="alert">
          <CheckCircle2 size={20} className="alert-icon" />
          <div>
            <strong className="alert-title">Consultation Logged</strong>
            <p className="alert-body">{status.message}</p>
          </div>
        </div>
      )}

      {status.state === 'error' && (
        <div className="form-status-alert alert-error" role="alert">
          <AlertCircle size={20} className="alert-icon" />
          <div>
            <strong className="alert-title">Input Required</strong>
            <p className="alert-body">{status.message}</p>
          </div>
        </div>
      )}

      <div className="form-grid-2">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Name <span className="req">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-input"
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email <span className="req">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-grid-2">
        {/* Company Field */}
        <div className="form-group">
          <label htmlFor="contact-company" className="form-label">
            Company / Organization
          </label>
          <input
            id="contact-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="form-input"
          />
        </div>

        {/* Project Type */}
        <div className="form-group">
          <label htmlFor="contact-project-type" className="form-label">
            Service Required
          </label>
          <div className="select-wrapper">
            <select
              id="contact-project-type"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="form-select"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">
          Message <span className="req">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows="5"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message..."
          className="form-textarea"
        ></textarea>
      </div>

      {/* Privacy note & Submit */}
      <div className="form-submit-row">
        <p className="confidentiality-note">
          Institutional Non-Disclosure & Complete Cryptographic Confidentiality Guaranteed.
        </p>

        <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Transmit Inquiry'}</span>
          <ArrowRight size={16} className="btn-hover-arrow" />
        </button>
      </div>
    </form>
  );
}

