/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Set base path for GitHub Pages
  basePath: isGithubPages ? '/portfolio' : '',
  assetPrefix: isGithubPages ? '/portfolio/' : '',
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization configuration
  images: {
    unoptimized: true,
    // Ensure images are loaded from the correct path in production
    path: isGithubPages ? '/portfolio/uploads' : '/uploads',
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
  
  // Copy the uploads directory during export
  async exportPathMap(defaultPathMap, { dev, dir, outDir }) {
    if (dev) return defaultPathMap;
    
    // Copy uploads directory to out directory
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(dir, 'public', 'uploads');
    const outUploadsDir = path.join(outDir, 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      if (!fs.existsSync(outUploadsDir)) {
        fs.mkdirSync(outUploadsDir, { recursive: true });
      }
      
      // Copy all files from public/uploads to out/uploads
      const { execSync } = require('child_process');
      try {
        execSync(`xcopy "${uploadsDir}\\*" "${outUploadsDir}\\*" /E /I /Y /H`);
        console.log('Successfully copied uploads directory to out directory');
      } catch (error) {
        console.error('Error copying uploads directory:', error);
      }
    }
    
    return defaultPathMap;
  },
};

module.exports = nextConfig;
