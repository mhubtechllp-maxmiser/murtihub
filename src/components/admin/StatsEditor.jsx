import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatsEditor() {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const current = cmsService.getTrustStats();
    setStats(current || []);

    const unsub = cmsService.subscribe('trust_stats', (newStats) => {
      if (newStats) setStats(newStats);
    });
    return unsub;
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...stats];
    updated[index] = {
      ...updated[index],
      [field]: field === 'number' ? (value === '' ? '' : Number(value)) : value,
    };
    setStats(updated);
  };

  const handleAddStat = () => {
    const newStat = {
      id: `stat-${Date.now()}`,
      number: 10,
      suffix: '+',
      label: 'New Strategic Metric',
      description: 'Institutional capability or delivery milestone achieved.',
    };
    setStats([...stats, newStat]);
    setAlert({ type: 'success', message: 'New stat card added. Click Save to persist to MongoDB.' });
  };

  const handleDeleteStat = (index) => {
    if (stats.length <= 1) {
      alert('At least one statistic must remain on the website.');
      return;
    }
    const updated = stats.filter((_, i) => i !== index);
    setStats(updated);
    setAlert({ type: 'success', message: 'Statistic removed. Click Save to persist to MongoDB.' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', message: '' });

    try {
      await cmsService.updateTrustStats(stats);
      setAlert({ type: 'success', message: 'Trust Statistics updated and saved to MongoDB!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save statistics' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-card" style={{ background: '#ffffff', border: '1px solid rgba(18, 58, 114, 0.15)', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
      <div className="editor-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
            Trust Statistics (2x2 StatStrip)
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            Update live homepage metrics and milestones rendered across all devices.
          </p>
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddStat} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} />
          <span>Add New Metric</span>
        </button>
      </div>

      {alert.message && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: alert.type === 'success' ? '#f0fdf4' : '#fef2f2', border: alert.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca', color: alert.type === 'success' ? '#15803d' : '#b91c1c' }}>
          {alert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="stats-editor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {stats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '18px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>
                  Metric #{idx + 1}
                </span>

                {stats.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '4px' }}
                    title="Delete metric"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '11px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Number Value
                  </label>
                  <input
                    type="number"
                    value={stat.number}
                    onChange={(e) => handleChange(idx, 'number', e.target.value)}
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => handleChange(idx, 'suffix', e.target.value)}
                    style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', color: '#0284c7', fontSize: '16px', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Label Headline
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleChange(idx, 'label', e.target.value)}
                  style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', color: '#0f172a', fontSize: '13.5px', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#334155', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={stat.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', color: '#334155', fontSize: '12.5px', resize: 'vertical' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Syncing to MongoDB...' : 'Save All Statistics'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
