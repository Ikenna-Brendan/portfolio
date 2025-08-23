// Custom image loader for Next.js static export
// This ensures image paths are correct in both development and production

module.exports = function customLoader({ src, width, quality }) {
  // For production (GitHub Pages), use the base path
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/portfolio' : '';
  
  // If the image is from the uploads directory, use the correct path
  if (src.startsWith('/uploads/')) {
    return `${basePath}${src}`;
  }
  
  // If the image is from _next/static/media, handle it specially
  if (src.includes('_next/static/media')) {
    return `${basePath}${src}`;
  }
  
  // For other images, use the default behavior with quality parameter
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (quality) params.append('q', quality);
  
  const queryString = params.toString();
  return queryString ? `${basePath}${src}?${queryString}` : `${basePath}${src}`;
};
