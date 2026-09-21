import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Shield, ShieldCheck, ShieldAlert, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import './AdminUserManager.scss';

export default function AdminUserManager() {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // New admin form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.admins.list();
      if (res.success && res.admins) {
        setAdmins(res.admins);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to fetch admin users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setStatus({ type: 'error', message: 'Name, email, and password are required' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.admins.create(formData);
      setStatus({ type: 'success', message: res.message || 'Admin created successfully' });
      setFormData({ name: '', email: '', password: '', role: 'editor' });
      setShowAddForm(false);
      fetchAdmins();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to create admin' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (adminId, newRole) => {
    try {
      await api.admins.update(adminId, { role: newRole });
      setStatus({ type: 'success', message: `Admin role updated to ${newRole}` });
      fetchAdmins();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update role' });
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to permanently revoke and delete admin ${adminName}?`)) {
      return;
    }

    try {
      await api.admins.delete(adminId);
      setStatus({ type: 'success', message: 'Admin deleted successfully' });
      fetchAdmins();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete admin' });
    }
  };

  return (
    <div className="admin-user-manager">
      <div className="aum-header">
        <div>
          <h2 className="aum-title">Administrative Role & Access Management</h2>
          <p className="aum-subtitle">
            Manage authorized portal administrators and configure Role-Based Access Control (RBAC).
          </p>
        </div>

        <div className="aum-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={fetchAdmins}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <UserPlus size={14} />
            <span>{showAddForm ? 'Cancel' : 'Add New Admin'}</span>
          </button>
        </div>
      </div>

      {status.message && (
        <div className={`aum-alert aum-alert-${status.type}`}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{status.message}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreateAdmin} className="aum-create-card">
          <h3 className="aum-create-title">Register New Portal Administrator</h3>
          <div className="aum-form-grid">
            <div className="aum-form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Elena Rostova"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="aum-input"
              />
            </div>

            <div className="aum-form-group">
              <label>Administrative Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. elena@murtihub.co.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="aum-input"
              />
            </div>

            <div className="aum-form-group">
              <label>Initial Password *</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="aum-input"
              />
            </div>

            <div className="aum-form-group">
              <label>Assigned Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="aum-select"
              >
                <option value="superadmin">Super Admin (Full Control + Add Admins)</option>
                <option value="editor">Editor (Modify Website Content & Inquiries)</option>
                <option value="viewer">Viewer (Read-Only Access)</option>
              </select>
            </div>
          </div>

          <div className="aum-form-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              <span>{submitting ? 'Creating Administrator...' : 'Confirm & Save Administrator'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="aum-table-card">
        {loading && admins.length === 0 ? (
          <div className="aum-loading">Loading administrators...</div>
        ) : (
          <table className="aum-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isSelf = admin._id === currentUser?.id || admin._id === currentUser?._id;
                return (
                  <tr key={admin._id} className={isSelf ? 'row-self' : ''}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="admin-name">
                            {admin.name} {isSelf && <span className="self-tag">(You)</span>}
                          </div>
                          <div className="admin-date">
                            Added {new Date(admin.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-email-cell">{admin.email}</td>
                    <td>
                      <div className="role-selector-wrap">
                        <select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                          disabled={isSelf && admin.role === 'superadmin'}
                          className={`role-badge role-${admin.role}`}
                        >
                          <option value="superadmin">Super Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${admin.isActive ? 'active' : 'inactive'}`}>
                        {admin.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="aum-row-actions">
                        {!isSelf && (
                          <button
                            type="button"
                            className="btn-icon-danger"
                            title="Delete Admin"
                            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

