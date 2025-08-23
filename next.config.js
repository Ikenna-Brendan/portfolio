/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production';
const basePath = isGithubPages ? '/portfolio' : '';
const assetPrefix = isGithubPages ? '/portfolio/' : '';

const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Set base path for GitHub Pages
  basePath,
  assetPrefix,
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    unoptimized: true,
    // Disable image optimization since we're using static export
    loader: 'custom',
    loaderFile: './image-loader.js',
    // Ensure images are loaded from the correct path in production
    path: isGithubPages ? `${basePath}/_next/static/media` : '/_next/static/media',
  },
  
  // Add trailing slashes to URLs
  trailingSlash: true,
  
  // Webpack configuration
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
