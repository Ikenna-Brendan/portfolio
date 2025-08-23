// Custom image loader for Next.js static export
// This ensures image paths are correct in production

module.exports = function customLoader({ src, width, quality }) {
  // For production (GitHub Pages), use the base path
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/portfolio' : '';
  
  // If the image is from the uploads directory, use the correct path
  if (src.startsWith('/uploads/')) {
    return `${basePath}${src}`;
  }
  
  // For other images, use the default behavior
  return `${basePath}${src}?w=${width}&q=${quality || 75}`;
};
