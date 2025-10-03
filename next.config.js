/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production';
const basePath = isGithubPages ? '/portfolio' : '';
const assetPrefix = isGithubPages ? '/portfolio/' : '';

/** @type {import('next').NextConfig} */
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
    loader: 'custom',
    loaderFile: './image-loader.js',
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Add trailing slashes to URLs
  trailingSlash: true,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Copy files plugin for Webpack
    if (!isServer) {
      const CopyWebpackPlugin = require('copy-webpack-plugin');
      
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            // Copy images first
            {
              from: 'public/images',
              to: 'images',
              noErrorOnMissing: true,
              globOptions: {
                ignore: ['**/.DS_Store', '**/Thumbs.db'],
              },
            },
            // Then copy uploads (with lower priority)
            {
              from: 'public/uploads',
              to: 'uploads',
              noErrorOnMissing: true,
              globOptions: {
                ignore: ['**/.DS_Store', '**/Thumbs.db'],
              },
            },
          ],
        })
      );
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
