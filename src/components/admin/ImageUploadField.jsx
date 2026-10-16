import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  FolderOpen,
  Search,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import './ImageUploadField.scss';

export default function ImageUploadField({
  value = '',
  onChange,
  label = 'Asset Image',
  hint = 'Supports PNG, JPG, WebP, SVG (Up to 15MB) — Hosted on Cloudinary',
  folder = 'murtihub',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Media Library state
  const [showGallery, setShowGallery] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [galleryError, setGalleryError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolderFilter, setActiveFolderFilter] = useState(folder || 'murtihub');

  // Handle direct file upload
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
          const res = await api.upload(base64Data, file.name, folder);
          if (res.success && res.url) {
            onChange(res.url);
            setSuccessMsg(
              `Uploaded to ${res.storage === 'cloudinary' ? 'Cloudinary' : 'Server'}: ${res.filename || 'Success'}`
            );
            setTimeout(() => setSuccessMsg(''), 4000);
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

  // Fetch Media from Cloudinary
  const fetchMedia = async (targetFolder = activeFolderFilter) => {
    setGalleryLoading(true);
    setGalleryError('');
    try {
      const res = await api.getMedia(targetFolder, 100);
      if (res.success && Array.isArray(res.media)) {
        setGalleryMedia(res.media);
      } else {
        setGalleryError(res.message || 'Failed to fetch media from Cloudinary');
      }
    } catch (err) {
      setGalleryError(err.message || 'Network error fetching Cloudinary media');
    } finally {
      setGalleryLoading(false);
    }
  };

  const openGallery = () => {
    setShowGallery(true);
    fetchMedia(activeFolderFilter);
  };

  const handleSelectFromGallery = (url) => {
    onChange(url);
    setShowGallery(false);
    setSuccessMsg('Selected asset from Cloudinary');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredMedia = galleryMedia.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.public_id && item.public_id.toLowerCase().includes(q)) ||
      (item.url && item.url.toLowerCase().includes(q))
    );
  });

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
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={14} />
                  <span>Upload to Cloudinary</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm iuf-browse-btn"
              onClick={openGallery}
              title="Browse and fetch uploaded Cloudinary media"
            >
              <FolderOpen size={14} />
              <span>Browse Cloudinary</span>
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
              placeholder="https://res.cloudinary.com/... or /images/..."
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

      {/* Cloudinary Media Gallery Modal */}
      {showGallery && (
        <div className="iuf-modal-overlay" onClick={() => setShowGallery(false)}>
          <div className="iuf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="iuf-modal-header">
              <div className="iuf-modal-title">
                <FolderOpen size={18} />
                <h3>Cloudinary Media Library</h3>
                <span className="iuf-modal-badge">{galleryMedia.length} assets</span>
              </div>
              <button
                type="button"
                className="iuf-modal-close"
                onClick={() => setShowGallery(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="iuf-modal-toolbar">
              <div className="iuf-modal-search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Filter media by name / public ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="iuf-clear-search">
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="iuf-modal-filters">
                <button
                  type="button"
                  className={`iuf-filter-btn ${activeFolderFilter === 'murtihub' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFolderFilter('murtihub');
                    fetchMedia('murtihub');
                  }}
                >
                  All MurtiHub
                </button>
                <button
                  type="button"
                  className={`iuf-filter-btn ${activeFolderFilter === 'murtihub/leadership' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFolderFilter('murtihub/leadership');
                    fetchMedia('murtihub/leadership');
                  }}
                >
                  Leadership
                </button>
                <button
                  type="button"
                  className={`iuf-filter-btn ${activeFolderFilter === 'murtihub/projects' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFolderFilter('murtihub/projects');
                    fetchMedia('murtihub/projects');
                  }}
                >
                  Projects
                </button>

                <button
                  type="button"
                  className="iuf-reload-btn"
                  onClick={() => fetchMedia(activeFolderFilter)}
                  disabled={galleryLoading}
                  title="Refresh Cloudinary assets"
                >
                  <RefreshCw size={14} className={galleryLoading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            <div className="iuf-modal-body">
              {galleryLoading ? (
                <div className="iuf-gallery-state">
                  <RefreshCw size={24} className="spin" />
                  <p>Fetching assets from Cloudinary...</p>
                </div>
              ) : galleryError ? (
                <div className="iuf-gallery-state error">
                  <AlertCircle size={24} />
                  <p>{galleryError}</p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => fetchMedia(activeFolderFilter)}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="iuf-gallery-state">
                  <ImageIcon size={32} />
                  <p>No media files found in this folder.</p>
                </div>
              ) : (
                <div className="iuf-gallery-grid">
                  {filteredMedia.map((item) => {
                    const isSelected = value === item.secure_url || value === item.url;
                    return (
                      <div
                        key={item.public_id}
                        className={`iuf-gallery-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectFromGallery(item.secure_url || item.url)}
                      >
                        <div className="iuf-card-thumb">
                          <img
                            src={item.secure_url || item.url}
                            alt={item.public_id}
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="iuf-card-badge">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                        <div className="iuf-card-info">
                          <span className="iuf-card-name" title={item.public_id}>
                            {item.public_id.split('/').pop()}
                          </span>
                          <div className="iuf-card-meta">
                            <span>{item.format?.toUpperCase()}</span>
                            {item.width && item.height && (
                              <span>{`${item.width}×${item.height}`}</span>
                            )}
                            {item.bytes && (
                              <span>{(item.bytes / 1024).toFixed(0)} KB</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="iuf-modal-footer">
              <span className="iuf-footer-info">
                Click any asset to select and link it to this field.
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowGallery(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
