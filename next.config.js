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
  
  // Copy the uploads directory during export
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir }) {
    if (dev) return defaultPathMap;
    
    const fs = require('fs');
    const path = require('path');
    const { promisify } = require('util');
    const copyFile = promisify(fs.copyFile);
    const mkdir = promisify(fs.mkdir);
    const readdir = promisify(fs.readdir);
    const stat = promisify(fs.stat);

    // Function to copy directory recursively
    async function copyDir(src, dest) {
      await mkdir(dest, { recursive: true });
      const entries = await readdir(src, { withFileTypes: true });

      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await copyFile(srcPath, destPath);
        }
      }
    }

    try {
      // Copy uploads directory
      const uploadsSrc = path.join(dir, 'public', 'uploads');
      const uploadsDest = path.join(outDir, 'uploads');
      
      if (fs.existsSync(uploadsSrc)) {
        console.log(`Copying uploads from ${uploadsSrc} to ${uploadsDest}`);
        await copyDir(uploadsSrc, uploadsDest);
      }

      // Also copy to _next/static/media for image optimization
      const mediaDest = path.join(outDir, '_next', 'static', 'media');
      if (fs.existsSync(uploadsSrc)) {
        console.log(`Copying uploads to ${mediaDest}`);
        await copyDir(uploadsSrc, mediaDest);
      }
      
    } catch (error) {
      console.error('Error during export:', error);
      process.exit(1);
    }
    
    return defaultPathMap;
  },
};

module.exports = nextConfig;
