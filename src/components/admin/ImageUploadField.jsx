import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, AlertCircle, X, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import './ImageUploadField.scss';

export default function ImageUploadField({
  value = '',
  onChange,
  label = 'Asset Image',
  hint = 'Supports PNG, JPG, WebP, SVG (Up to 15MB)',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if needed
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, SVG)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image exceeds maximum size of 15MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await api.upload(base64Data, file.name);
          if (res.success && res.url) {
            onChange(res.url);
            setSuccessMsg(`Uploaded: ${res.filename}`);
            setTimeout(() => setSuccessMsg(''), 3000);
          } else {
            setError(res.message || 'Upload failed');
          }
        } catch (uploadErr) {
          setError(uploadErr.message || 'Error communicating with upload service');
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file from disk');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || 'Failed to initiate upload');
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      <div className="iuf-header">
        <label className="iuf-label">{label}</label>
        {hint && <span className="iuf-hint">{hint}</span>}
      </div>

      <div className="iuf-body">
        {/* Preview Box */}
        <div className="iuf-preview-box">
          {value ? (
            <img
              src={value}
              alt="Asset Preview"
              className="iuf-preview-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="iuf-preview-empty">
              <ImageIcon size={28} />
              <span>No image selected</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="iuf-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            style={{ display: 'none' }}
          />

          <div className="iuf-btn-row">
            <button
              type="button"
              className="btn btn-primary btn-sm iuf-upload-btn"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>Uploading Asset...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={14} />
                  <span>Upload Image File</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                className="btn btn-outline btn-sm iuf-clear-btn"
                onClick={() => onChange('')}
                title="Clear image"
              >
                <X size={14} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="iuf-url-wrap">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/... or /uploads/... or https://..."
              className="iuf-url-input"
            />
          </div>

          {error && (
            <div className="iuf-msg iuf-msg-error">
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="iuf-msg iuf-msg-success">
              <Check size={13} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

