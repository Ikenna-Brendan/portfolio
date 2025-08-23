// Custom image loader for Next.js static export
// This ensures image paths are correct in both development and production

module.exports = function customLoader({ src, width, quality }) {
  // For production (GitHub Pages), use the base path
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/portfolio' : '';
  
  // Handle different source types
  if (src.startsWith('http') || src.startsWith('data:')) {
    // External URLs or data URIs - use as is
    return src;
  }
  
  // Handle absolute paths
  if (src.startsWith('/')) {
    // Remove leading slash if present
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    
    // For production, add the base path
    const prefixedSrc = isProd ? `${basePath}/${cleanSrc}` : `/${cleanSrc}`;
    
    // Add query parameters if needed
    const params = new URLSearchParams();
    if (width) params.append('w', width);
    if (quality) params.append('q', quality || 75);
    
    const queryString = params.toString();
    return queryString ? `${prefixedSrc}?${queryString}` : prefixedSrc;
  }
  
  // For relative paths, just add query parameters
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (quality) params.append('q', quality || 75);
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};
