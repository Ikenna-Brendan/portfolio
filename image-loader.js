/**
 * Custom image loader for Next.js static export
 * Handles different image sources and optimizations
 */
const path = require('path');
const fs = require('fs');

module.exports = function customLoader({ src, width, quality }) {
  // Base path from environment or default to empty string
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
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
  
  // Add base path for production
  imagePath = basePath ? `${basePath}${imagePath}` : imagePath;
  
  // Ensure proper path formatting (no double slashes)
  imagePath = imagePath.replace(/([^:]\/)\/+/g, '$1');
  
  // Add optimization parameters
  const params = new URLSearchParams();
  
  // Only add width if it's a number and not too small
  if (width && !isNaN(width) && width > 0) {
    params.append('w', Math.min(Number(width), 3840)); // Max width 3840px (4K)
  }
  
  // Add quality if specified (default to 75%)
  const q = quality || 75;
  if (q > 0 && q <= 100) {
    params.append('q', q);
  }
  
  // Add auto format if supported
  params.append('auto', 'format');
  
  // Add query string if we have any parameters
  const queryString = params.toString();
  return queryString ? `${imagePath}?${queryString}` : imagePath;
};
