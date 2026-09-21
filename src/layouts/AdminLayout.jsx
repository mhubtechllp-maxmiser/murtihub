import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminLoginPage from '../pages/AdminLoginPage';
import './AdminLayout.scss';

export default function AdminLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1d', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p>Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand-cluster">
            <div className="admin-emblem-wrap">
              <img src="/images/MHLOGO.png" alt="MurtiHub Logo" className="admin-emblem" />
            </div>
            <div>
              <span className="admin-brand-name">MurtiHub</span>
              <span className="admin-brand-sub">CMS & Governance Studio</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="admin-user-badge">
              <div className="user-icon-wrap">
                <User size={14} />
              </div>
              <div className="user-text-info">
                <span className="user-name">{user?.name || 'Administrator'}</span>
                <span className={`user-role-tag role-${user?.role}`}>
                  {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'editor' ? 'Editor' : 'Viewer'}
                </span>
              </div>
            </div>

            <div className="admin-live-badge">
              <span className="live-dot"></span>
              <span>MongoDB Atlas Connected</span>
            </div>

            <Link to="/" className="btn btn-outline btn-sm admin-exit-btn">
              <ArrowLeft size={14} />
              <span>Public Website</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="btn btn-outline btn-sm admin-logout-btn"
              title="End Session"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
