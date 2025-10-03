/**
 * Custom image loader for Next.js static export
 * Handles different image sources and optimizations
 */
const path = require('path');
const fs = require('fs');

module.exports = function customLoader({ src, width, quality }) {
  // Base path from environment or default to empty string
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Handle different source types
  if (!src) return '';
  
  // External URLs or data URIs - use as is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  
  // Handle local images
  let imagePath = src.startsWith('/') ? src : `/${src}`;
  
  // If the image is in uploads but we have it in images, use that instead
  if (imagePath.startsWith('/uploads/')) {
    const imageName = path.basename(imagePath);
    const imagesPath = path.join(process.cwd(), 'public', 'images', imageName);
    if (fs.existsSync(imagesPath)) {
      imagePath = `/images/${imageName}`;
    }
  }
  
  // Add base path for production (GitHub Pages)
  if (isProduction && basePath) {
    imagePath = `${basePath}${imagePath}`;
  }
  
  // Ensure proper path formatting (no double slashes)
  imagePath = imagePath.replace(/([^:]\/)\/+/g, '$1');
  
  // For static export, we don't need optimization parameters
  // Just return the clean path
  return imagePath;
};
