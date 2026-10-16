import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const isCloudinaryConfigured = () => {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && (config.api_key || process.env.CLOUDINARY_URL));
};

/**
 * Upload an image (base64 string, file path, or buffer data URI) to Cloudinary
 * @param {string} fileSource - base64 data URI, remote URL, or local file path
 * @param {object} options - optional Cloudinary upload options (folder, public_id, tags)
 * @returns {Promise<object>} upload result with secure_url, public_id, etc.
 */
export const uploadToCloudinary = async (fileSource, options = {}) => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in environment.'
    );
  }

  const defaultOptions = {
    folder: 'murtihub',
    resource_type: 'image',
    overwrite: true,
    invalidate: true,
  };

  const uploadOptions = {
    ...defaultOptions,
    ...options,
  };

  return cloudinary.uploader.upload(fileSource, uploadOptions);
};

/**
 * Fetch / list media resources from Cloudinary
 * @param {object} options - folder, max_results, next_cursor
 * @returns {Promise<object>} list of resources and pagination cursor
 */
export const fetchCloudinaryMedia = async (options = {}) => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured.');
  }

  const { folder = 'murtihub', max_results = 50, next_cursor } = options;

  const queryOptions = {
    type: 'upload',
    max_results: Number(max_results) || 50,
  };

  if (folder) {
    queryOptions.prefix = folder.endsWith('/') ? folder : `${folder}/`;
  }

  if (next_cursor) {
    queryOptions.next_cursor = next_cursor;
  }

  const response = await cloudinary.api.resources(queryOptions);

  return {
    resources: (response.resources || []).map((item) => ({
      public_id: item.public_id,
      url: item.secure_url || item.url,
      secure_url: item.secure_url || item.url,
      format: item.format,
      width: item.width,
      height: item.height,
      bytes: item.bytes,
      created_at: item.created_at,
      folder: item.folder,
      storage: 'cloudinary',
    })),
    next_cursor: response.next_cursor || null,
    total_count: response.resources?.length || 0,
  };
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured.');
  }
  return cloudinary.uploader.destroy(publicId);
};

export { cloudinary };
