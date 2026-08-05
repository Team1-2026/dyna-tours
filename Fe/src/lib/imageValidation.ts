/**
 * Helper utility for validating uploaded image files
 * Requirements:
 * 1. Formats: WebP, SVG, PNG (plus JPEG for backwards compatibility)
 * 2. Maximum file size: 1 MB (1,048,576 bytes)
 */

export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

export const ALLOWED_IMAGE_TYPES = [
  'image/webp',
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

export const ALLOWED_EXTENSIONS = ['.webp', '.svg', '.png', '.jpeg', '.jpg'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  // File size check (Up to 1MB)
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File "${file.name}" is ${sizeMb} MB. Maximum allowed image size is 1 MB.`
    };
  }

  // File format check
  const fileType = file.type?.toLowerCase();
  const fileName = file.name?.toLowerCase();
  const hasAllowedExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasAllowedExt && !ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return {
      isValid: false,
      error: `Invalid file format for "${file.name}". Only WebP, SVG, and PNG images (up to 1 MB) are supported.`
    };
  }

  return { isValid: true };
}
