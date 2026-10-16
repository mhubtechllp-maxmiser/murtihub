import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

export default function LeadershipEditor() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const current = cmsService.getLeadership();
    setData(current);

    const unsub = cmsService.subscribe('leadership', (newData) => {
      setData(newData);
    });
    return unsub;
  }, []);

  if (!data || !data.leaders) {
    return <div style={{ color: '#94a3b8', padding: '20px' }}>Loading leadership data...</div>;
  }

  const handleLeaderChange = (index, field, value) => {
    const updatedLeaders = [...data.leaders];
    updatedLeaders[index] = {
      ...updatedLeaders[index],
      [field]: value,
    };
    setData({
      ...data,
      leaders: updatedLeaders,
    });
  };

  const handleAddLeader = () => {
    const newLeader = {
      id: `leader-${Date.now()}`,
      name: 'New Executive Partner',
      title: 'Designated Partner',
      role: 'Partner | Architecture | Strategy',
      image: '/images/leader.jpg',
      bio: ['Executive bio paragraph describing institutional background and responsibilities.'],
      quotes: {
        about: 'Engineering systems with institutional integrity.',
        leadership: 'Engineering systems with institutional integrity.',
      },
      values: [],
    };

    setData({
      ...data,
      leaders: [...data.leaders, newLeader],
    });
  };

  const handleDeleteLeader = (index, name) => {
    if (data.leaders.length <= 1) {
      window.alert('You must have at least one executive leader.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove executive profile: "${name}"?`)) {
      return;
    }
    setData({
      ...data,
      leaders: data.leaders.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', message: '' });

    try {
      await cmsService.updateLeadership(data);
      setAlert({ type: 'success', message: 'Leadership profiles saved and synchronized successfully.' });
      setTimeout(() => setAlert({ type: '', message: '' }), 4000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save leadership profiles' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-card" style={{ background: '#ffffff', border: '1px solid rgba(18, 58, 114, 0.15)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
      <div className="editor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="admin-tag" style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#0284c7', background: 'rgba(2, 132, 199, 0.08)', padding: '3px 8px', borderRadius: '4px', marginBottom: '6px', textTransform: 'uppercase' }}>
            Executive Governance Module
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
            Leadership & Executive Profiles
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Manage partner biographies, roles, institutional statements, and upload official photos.
          </p>
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddLeader} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} />
          <span>Add Executive Leader</span>
        </button>
      </div>

      {alert.message && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: alert.type === 'success' ? '#f0fdf4' : '#fef2f2', border: alert.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca', color: alert.type === 'success' ? '#15803d' : '#b91c1c' }}>
          {alert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
          {data.leaders.map((leader, idx) => (
            <div
              key={leader.id || idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '24px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Executive Leader #{idx + 1}
                </span>

                {data.leaders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLeader(idx, leader.name)}
                    style={{ background: 'transparent', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Leader</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leader.name}
                    onChange={(e) => handleLeaderChange(idx, 'name', e.target.value)}
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 12px', color: '#0f172a', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Executive Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={leader.title}
                    onChange={(e) => handleLeaderChange(idx, 'title', e.target.value)}
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 12px', color: '#0284c7', fontSize: '14px', fontWeight: '600' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Role Domains
                  </label>
                  <input
                    type="text"
                    value={leader.role || ''}
                    onChange={(e) => handleLeaderChange(idx, 'role', e.target.value)}
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 12px', color: '#334155', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              {/* Leader Photo with ImageUploadField */}
              <div style={{ marginBottom: '16px' }}>
                <ImageUploadField
                  label="Executive Portrait / Photo"
                  value={leader.image}
                  onChange={(newUrl) => handleLeaderChange(idx, 'image', newUrl)}
                  hint="Upload portrait photo. Hosted permanently on Cloudinary CDN."
                  folder="murtihub/leadership"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Executive Biography (Primary Narrative)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(leader.bio) ? leader.bio.join('\n\n') : (leader.bio || '')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean);
                    handleLeaderChange(idx, 'bio', paragraphs);
                  }}
                  placeholder="Enter biography paragraphs (separate paragraphs with blank lines)..."
                  style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', color: '#0f172a', fontSize: '13.5px', lineHeight: '1.5' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Institutional Quote
                </label>
                <input
                  type="text"
                  value={leader.quotes?.about || leader.quotes?.leadership || ''}
                  onChange={(e) => {
                    const currentQuotes = leader.quotes || {};
                    handleLeaderChange(idx, 'quotes', {
                      ...currentQuotes,
                      about: e.target.value,
                      leadership: e.target.value,
                    });
                  }}
                  placeholder="e.g. True technological progress is measured by the trust it inspires."
                  style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 12px', color: '#334155', fontSize: '13.5px', fontStyle: 'italic' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Syncing to MongoDB...' : 'Save All Leadership Profiles'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}