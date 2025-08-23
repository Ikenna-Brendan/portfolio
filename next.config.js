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
    // Don't use the default path for static export
    path: '',
  },
  
  // Add trailing slashes to URLs
  trailingSlash: true,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Copy files plugin for Webpack
    if (!isServer) {
      config.plugins.push(
        new (require('copy-webpack-plugin'))({
          patterns: [
            {
              from: 'public/uploads',
              to: 'uploads',
              noErrorOnMissing: true,
            },
          ],
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
