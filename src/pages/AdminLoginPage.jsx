import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminLoginPage.scss';

export default function AdminLoginPage() {
  const { login } = useAuth();

  // Mode: 'login' | 'forgot_email' | 'verify_otp'
  const [mode, setMode] = useState('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend Timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ============================================================
  // 1. STANDARD LOGIN HANDLER
  // ============================================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both administrative email and password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 2. FORGOT PASSWORD — DISPATCH REAL OTP TO EMAIL
  // ============================================================
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered administrative email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.auth.forgotPassword(email.trim());
      setSuccess(res.message || 'A 6-digit verification code has been dispatched to your email.');
      setMode('verify_otp');
      setResendCooldown(60); // 60-second cooldown
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 3. RESEND OTP CODE
  // ============================================================
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.forgotPassword(email.trim());
      setSuccess(res.message || 'A new verification code has been dispatched.');
      setResendCooldown(60);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 4. VERIFY OTP & RESET PASSWORD
  // ============================================================
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code received in your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.resetPassword(email.trim(), otp.trim(), newPassword);
      setSuccess(res.message || 'Password updated successfully! You can now log in.');
      setMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setError('');
    setSuccess('');
    setMode('login');
  };

  return (
    <div className="admin-login-screen">
      <div className="login-card-container">
        <div className="login-header">
          <div className="brand-badge-row">
            <div className="login-emblem-wrap">
              <img src="/images/MHLOGO.png" alt="MurtiHub Logo" className="login-emblem" />
            </div>
          </div>
          <h1 className="login-title">
            {mode === 'login' && 'Administrative Gateway'}
            {mode === 'forgot_email' && 'Recover Access Key'}
            {mode === 'verify_otp' && 'Verify Code & Set Password'}
          </h1>
          <p className="login-subtitle">
            {mode === 'login' && 'Institutional CMS & Role-Based Access Control'}
            {mode === 'forgot_email' && 'Enter your administrator email to receive a 6-digit security code via email.'}
            {mode === 'verify_otp' && `Code dispatched to ${email}. Check your inbox and spam folder.`}
          </p>
        </div>

        {error && (
          <div className="login-alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="login-alert-success" role="status">
            <span>{success}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: REGULAR LOGIN FORM */}
        {/* ============================================================ */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label" htmlFor="admin-email">
                Administrative Email
              </label>
              <div className="login-input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@murtihub.co.in"
                  className="login-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="admin-password">
                Access Key / Password
              </label>
              <div className="login-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="login-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-sub-actions">
              <button
                type="button"
                className="forgot-link-btn"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setMode('forgot_email');
                }}
              >
                Forgot Password / Access Key?
              </button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Establish Session'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: FORGOT PASSWORD (EMAIL PROMPT) */}
        {/* ============================================================ */}
        {mode === 'forgot_email' && (
          <form onSubmit={handleForgotSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label" htmlFor="forgot-email">
                Registered Administrator Email
              </label>
              <div className="login-input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@murtihub.co.in"
                  className="login-input"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              <span>{loading ? 'Dispatching OTP Code...' : 'Send Verification Code'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="secondary-action-btn"
              onClick={switchToLogin}
              disabled={loading}
            >
              <ArrowLeft size={15} />
              <span>Back to Login</span>
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: VERIFY REAL OTP & RESET PASSWORD */}
        {/* ============================================================ */}
        {mode === 'verify_otp' && (
          <form onSubmit={handleResetSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label" htmlFor="reset-otp">
                6-Digit Email Verification Code (OTP)
              </label>
              <div className="login-input-wrap">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="reset-otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="login-input otp-field-input"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="reset-new-password">
                New Access Key (Min. 6 characters)
              </label>
              <div className="login-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="reset-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="login-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="reset-confirm-password">
                Confirm New Access Key
              </label>
              <div className="login-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="login-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              <CheckCircle2 size={16} />
              <span>{loading ? 'Verifying & Updating...' : 'Verify Code & Set Password'}</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="secondary-action-btn"
                style={{ flex: 1 }}
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
              >
                <RotateCw size={14} />
                <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}</span>
              </button>

              <button
                type="button"
                className="secondary-action-btn"
                style={{ flex: 1 }}
                onClick={switchToLogin}
                disabled={loading}
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}

        <div className="login-footer">
          <div className="demo-credentials-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>Default Super Admin: <code>admin@murtihub.co.in</code></span>
          </div>

          <Link to="/" className="back-to-site-link">
            <ArrowLeft size={14} />
            <span>Return to MurtiHub Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
