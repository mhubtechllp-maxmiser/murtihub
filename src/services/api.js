// ============================================================================
// MURTIHUB TECHNOLOGIES — UNIFIED API CLIENT
// ============================================================================

const TOKEN_KEY = 'murtihub_admin_token';

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Error saving auth token:', e);
  }
};

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    async login(email, password) {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.token) {
        setAuthToken(res.token);
      }
      return res;
    },
    async me() {
      return request('/api/auth/me');
    },
    async forgotPassword(email) {
      return request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword(email, otp, newPassword) {
      return request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
    },
    async changePassword(currentPassword, newPassword) {
      return request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
    logout() {
      setAuthToken(null);
    },
  },

  // Admins RBAC API
  admins: {
    async list() {
      return request('/api/admins');
    },
    async create(adminData) {
      return request('/api/admins', {
        method: 'POST',
        body: JSON.stringify(adminData),
      });
    },
    async update(id, adminData) {
      return request(`/api/admins/${id}`, {
        method: 'PUT',
        body: JSON.stringify(adminData),
      });
    },
    async delete(id) {
      return request(`/api/admins/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Contact Inquiries API
  contact: {
    async submit(inquiryData) {
      return request('/api/contact', {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      });
    },
    async list() {
      return request('/api/contact');
    },
    async updateStatus(id, status) {
      return request(`/api/contact/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    async delete(id) {
      return request(`/api/contact/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // CMS Content API
  cms: {
    async getAll() {
      return request('/api/cms');
    },
    async get(key) {
      return request(`/api/cms/${key}`);
    },
    async update(key, data) {
      return request(`/api/cms/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ data }),
      });
    },
    async seed(payload) {
      return request('/api/cms/seed', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // File & Image Upload & Media API (Cloudinary / CDN)
  async upload(base64Data, filename, folder = 'murtihub') {
    return request('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image: base64Data, filename, folder }),
    });
  },

  async getMedia(folder = 'murtihub', maxResults = 50, nextCursor = null) {
    let url = `/api/upload?folder=${encodeURIComponent(folder)}&max_results=${maxResults}`;
    if (nextCursor) {
      url += `&next_cursor=${encodeURIComponent(nextCursor)}`;
    }
    return request(url);
  },

  async deleteMedia(publicId) {
    return request('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ public_id: publicId }),
    });
  },
};

