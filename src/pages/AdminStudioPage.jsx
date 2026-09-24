import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Inbox,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Edit2,
  BarChart3,
  ShieldCheck,
  KeyRound,
  Save,
  Users,
} from 'lucide-react';
import { cmsService } from '../services/cmsService';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatsEditor from '../components/admin/StatsEditor';
import AdminUserManager from '../components/admin/AdminUserManager';
import AccountSecurityEditor from '../components/admin/AccountSecurityEditor';
import ProjectModal from '../components/admin/ProjectModal';
import LeadershipEditor from '../components/admin/LeadershipEditor';
import './AdminStudioPage.scss';

export default function AdminStudioPage() {
  const { user, isSuperAdmin, canEdit } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // Default to projects per user interest
  const [projects, setProjects] = useState(cmsService.getProjects());
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [brand, setBrand] = useState(cmsService.getBrand());
  const [brandForm, setBrandForm] = useState(cmsService.getBrand());
  const [savingBrand, setSavingBrand] = useState(false);
  const [saveAlert, setSaveAlert] = useState('');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


  // Hidden slide upload refs

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const subs = await cmsService.getSubmissions();
      setSubmissions(subs || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    const unsub = cmsService.subscribe('*', () => {
      setProjects(cmsService.getProjects());
      setBrand(cmsService.getBrand());
      const b = cmsService.getBrand();
      setBrand(b);
      setBrandForm(b);
    });
    return () => unsub();
  }, []);

  const triggerSaveNotification = (msg) => {
    setSaveAlert(msg);
    setTimeout(() => setSaveAlert(''), 3500);
  };

  // ==========================================
  // PROJECTS ACTIONS (ADD, EDIT, DELETE)
  // ==========================================
  const handleOpenAddProject = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setSelectedProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    if (!canEdit) return;
    try {
      if (selectedProject) {
        // Edit
        await cmsService.updateProject(selectedProject.slug || selectedProject.id, formData);
        triggerSaveNotification(`Project "${formData.name}" updated successfully.`);
      } else {
        // Add
        await cmsService.addProject(formData);
        triggerSaveNotification(`New project "${formData.name}" added successfully.`);
      }
      setProjects(cmsService.getProjects());
      setIsProjectModalOpen(false);
    } catch (err) {
      alert('Error saving project: ' + err.message);
    }
  };

  const handleDeleteProject = async (slugOrId, name) => {
    if (!canEdit) return;
    if (!window.confirm(`Are you sure you want to permanently delete project: "${name}"?`)) {
      return;
    }
    try {
      await cmsService.deleteProject(slugOrId);
      setProjects(cmsService.getProjects());
      triggerSaveNotification(`Project "${name}" deleted from MongoDB.`);
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleProjectStatusToggle = async (slug, newStatus) => {
    if (!canEdit) return;
    await cmsService.updateProject(slug, { status: newStatus });
    setProjects(cmsService.getProjects());
    triggerSaveNotification(`Project "${slug}" status set to ${newStatus}.`);
  };

  // ==========================================
  // SUBMISSIONS ACTIONS
  // ==========================================
  const handleMarkSubmission = async (id) => {
    const updated = await cmsService.markSubmissionHandled(id);
    setSubmissions(updated);
    triggerSaveNotification('Inquiry status updated to Handled in MongoDB.');
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm('Delete this inquiry from database?')) return;
    const updated = await cmsService.deleteSubmission(id);
    setSubmissions(updated);
    triggerSaveNotification('Inquiry deleted from MongoDB.');
  };

  // ==========================================
  // BRAND CONSTANTS ACTIONS
  // ==========================================
  const handleBrandChange = (field, value) => {
    setBrandForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBrand = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!canEdit) {
      alert('You do not have permission to modify institutional brand constants.');
      return;
    }
    setSavingBrand(true);
    try {
      await cmsService.updateBrand(brandForm);
      triggerSaveNotification('Brand constants saved and synchronized to MongoDB.');
    } catch (err) {
      alert('Failed to save brand constants: ' + err.message);
    } finally {
      setSavingBrand(false);
    }
  };

  return (
    <div className="admin-studio-container">
      <div className="container">
        {saveAlert && (
          <div className="admin-toast-alert" role="status">
            <CheckCircle2 size={16} />
            <span>{saveAlert}</span>
          </div>
        )}

        <div className="admin-layout-mosaic">
          {/* Left Navigation Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-group-title">Site CMS Modules</div>
            <nav className="admin-nav-menu">
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'projects' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FileText size={18} />
                <span>Production Projects ({projects.length})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'leadership' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('leadership')}
              >
                <Users size={18} />
                <span>Executive Leadership</span>
              </button>

              

              

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'stats' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                <BarChart3 size={18} />
                <span>Trust Statistics (2x2)</span>
              </button>

              

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'submissions' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                <Inbox size={18} />
                <span>Contact Inquiries ({submissions.length})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'brand' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('brand')}
              >
                <Settings size={18} />
                <span>Brand & Legal Standards</span>
              </button>

              <div className="sidebar-group-title" style={{ marginTop: '20px' }}>Security & Credentials</div>
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'security' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <KeyRound size={18} />
                <span>Account Security</span>
              </button>

              {isSuperAdmin && (
                <>
                  <div className="sidebar-group-title" style={{ marginTop: '20px' }}>Security & RBAC</div>
                  <button
                    type="button"
                    className={`admin-tab-btn tab-highlight ${activeTab === 'users' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <ShieldCheck size={18} />
                    <span>Portal Administrators</span>
                  </button>
                </>
              )}
            </nav>
          </aside>

          {/* Right Editor Work Area */}
          <section className="admin-work-area">
            {/* ========================================================= */}
            {/* 1. PROJECTS TAB (FULL ADD, EDIT, DELETE & IMAGE UPLOAD) */}
            {/* ========================================================= */}
            {activeTab === 'projects' && (
              <div className="editor-card">
                <div className="editor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="admin-tag">CMS MongoDB Repository</span>
                    <h2 className="editor-heading">Production Realities (Projects)</h2>
                    <p className="editor-sub">
                      Add, edit details, upload project cover images, and manage live/deployed statuses.
                    </p>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleOpenAddProject}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={15} />
                      <span>Add New Project</span>
                    </button>
                  )}
                </div>

                <div className="projects-admin-grid">
                  {projects.map((proj) => (
                    <div key={proj.slug || proj.id} className="project-admin-card" style={{ position: 'relative' }}>
                      <div className="proj-admin-thumb" style={{ position: 'relative' }}>
                        <img src={proj.image} alt={proj.title} />
                        <span className="proj-img-badge" style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '10px', padding: '3px 6px', borderRadius: '4px' }}>
                          Cover Image
                        </span>
                      </div>

                      <div className="proj-admin-content">
                        <div className="proj-admin-top" style={{ justifyContent: 'flex-end', marginBottom: '8px' }}>
                          <select
                            value={proj.status?.toUpperCase() === 'DEPLOYED' ? 'Deployed' : 'Live'}
                            disabled={!canEdit}
                            onChange={(e) => handleProjectStatusToggle(proj.slug || proj.id, e.target.value)}
                            className="proj-status-select"
                          >
                            <option value="Live">Live</option>
                            <option value="Deployed">Deployed</option>
                          </select>
                        </div>

                        <h4 className="proj-admin-title" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: '#071d49' }}>
                          {proj.name}
                        </h4>

                        <p className="proj-admin-desc" style={{ margin: '0 0 16px 0', fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                          {proj.description}
                        </p>

                        {/* Project Card Actions Bar */}
                        <div className="proj-card-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                          <a
                            href={proj.liveUrl || '/projects'}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-text-link"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#0284c7', textDecoration: 'none' }}
                          >
                            <span>Live Platform</span>
                            <ExternalLink size={12} />
                          </a>

                          {canEdit && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => handleOpenEditProject(proj)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '5px 10px' }}
                              >
                                <Edit2 size={13} />
                                <span>Edit & Upload</span>
                              </button>

                              <button
                                type="button"
                                className="btn-icon-danger"
                                onClick={() => handleDeleteProject(proj.slug || proj.id, proj.name)}
                                title="Delete Project"
                                style={{ background: 'transparent', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. STATS TAB */}
            {/* ========================================================= */}
            {activeTab === 'stats' && <StatsEditor />}

            {/* ========================================================= */}
            {/* 6. CONTACT SUBMISSIONS TAB */}
            {/* ========================================================= */}
            {activeTab === 'submissions' && (
              <div className="editor-card">
                <div className="editor-card-header">
                  <div>
                    <span className="admin-tag">MongoDB Collections</span>
                    <h2 className="editor-heading">Corporate Technical Inquiries</h2>
                    <p className="editor-sub">
                      Incoming consultations recorded in MongoDB and dispatched via Zoho Mail SMTP.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={loadSubmissions}
                    disabled={loadingSubmissions}
                  >
                    <RefreshCw size={14} className={loadingSubmissions ? 'spin' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingSubmissions && submissions.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    Loading inquiries from MongoDB...
                  </div>
                ) : submissions.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    No consultations received yet. Submissions from <code>/contact</code> will appear here.
                  </div>
                ) : (
                  <div className="submissions-list">
                    {submissions.map((sub) => {
                      const subId = sub._id || sub.id;
                      return (
                        <div
                          key={subId}
                          className={`submission-card ${sub.status === 'Handled' ? 'is-handled' : ''}`}
                        >
                          <div className="sub-top-bar">
                            <div>
                              <span className="sub-name">{sub.name}</span>
                              <span className="sub-company"> • {sub.company || 'Private Enterprise'}</span>
                            </div>
                            <div className="sub-meta-right">
                              <span className="sub-date">
                                {new Date(sub.createdAt || sub.timestamp || Date.now()).toLocaleDateString()}
                              </span>
                              <span className={`sub-status-tag status-${(sub.status || 'unread').toLowerCase()}`}>
                                {sub.status || 'Unread'}
                              </span>
                            </div>
                          </div>

                          <div className="sub-email-bar">
                            <span className="sub-type-badge">{sub.projectType}</span>
                            <a href={`mailto:${sub.email}`} className="sub-email">
                              {sub.email}
                            </a>
                            {sub.emailNotificationSent && (
                              <span style={{ fontSize: '11px', color: '#16a34a', marginLeft: 'auto', fontWeight: 'bold' }}>
                                ✓ Zoho SMTP Notified
                              </span>
                            )}
                          </div>

                          <p className="sub-message-text">{sub.message}</p>

                          <div className="sub-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {sub.status !== 'Handled' ? (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => handleMarkSubmission(subId)}
                              >
                                <CheckCircle2 size={14} />
                                <span>Mark as Handled</span>
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#64748b' }}>Handled by Executive Partner</span>
                            )}

                            {canEdit && (
                              <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                                onClick={() => handleDeleteSubmission(subId)}
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ========================================================= */}
            {/* 7. BRAND TAB (EDITABLE SYSTEM CONSTANTS & MONGODB SYNC) */}
            {/* ========================================================= */}
            {activeTab === 'brand' && (
              <div className="editor-card">
                <div className="editor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="admin-tag">System Constants</span>
                    <h2 className="editor-heading" style={{ margin: '6px 0 4px 0' }}>Brand Identity & Legal Structure</h2>
                    <p className="editor-sub" style={{ margin: 0 }}>
                      Institutional constants used across header, footer, inquiry routing, and legal disclaimers.
                    </p>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveBrand}
                      disabled={savingBrand}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                    >
                      <Save size={16} />
                      <span>{savingBrand ? 'Saving to MongoDB...' : 'Save Brand Constants'}</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveBrand} className="brand-admin-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Company Name</label>
                    <input
                      type="text"
                      value={brandForm.companyName || ''}
                      onChange={(e) => handleBrandChange('companyName', e.target.value)}
                      className="admin-inline-input"
                      placeholder="MurtiHub Technologies"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Tagline</label>
                    <input
                      type="text"
                      value={brandForm.tagline || ''}
                      onChange={(e) => handleBrandChange('tagline', e.target.value)}
                      className="admin-inline-input"
                      placeholder="Engineering A More Open Tomorrow"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Dispatch Email</label>
                    <input
                      type="email"
                      value={brandForm.email || ''}
                      onChange={(e) => handleBrandChange('email', e.target.value)}
                      className="admin-inline-input"
                      placeholder="enquiry@murtihub.co.in"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>SLA Response Time</label>
                    <input
                      type="text"
                      value={brandForm.responseSLA || ''}
                      onChange={(e) => handleBrandChange('responseSLA', e.target.value)}
                      className="admin-inline-input"
                      placeholder="< 24 Hours"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Legal Structure</label>
                    <input
                      type="text"
                      value={brandForm.legalStructure || ''}
                      onChange={(e) => handleBrandChange('legalStructure', e.target.value)}
                      className="admin-inline-input"
                      placeholder="Incorporated Enterprise"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Philosophy / Motto</label>
                    <input
                      type="text"
                      value={brandForm.motto || ''}
                      onChange={(e) => handleBrandChange('motto', e.target.value)}
                      className="admin-inline-input"
                      placeholder="Craftsmanship over commodity"
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="brand-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>Copyright Notice</label>
                    <input
                      type="text"
                      value={brandForm.copyright || ''}
                      onChange={(e) => handleBrandChange('copyright', e.target.value)}
                      className="admin-inline-input"
                      placeholder="© 2026 MurtiHub Technologies. All rights reserved."
                      disabled={!canEdit}
                    />
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* 8. RBAC ADMIN USERS TAB */}
            {/* 8. ACCOUNT SECURITY TAB (CHANGE PASSWORD) */}
            {/* ========================================================= */}
            {activeTab === 'leadership' && <LeadershipEditor />}

            {activeTab === 'security' && <AccountSecurityEditor />}

            {/* ========================================================= */}
            {/* 9. RBAC ADMIN USERS TAB */}
            {/* ========================================================= */}
            {activeTab === 'users' && isSuperAdmin && <AdminUserManager />}
          </section>
        </div>
      </div>

      {/* Project Add/Edit Modal with Image Upload */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        project={selectedProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />

      
    </div>
  );
}
