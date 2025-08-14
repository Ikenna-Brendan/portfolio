const fs = require('fs');
const path = require('path');

// Source and destination paths
const srcPath = path.join(__dirname, '../public/data/content.json');
const destDir = path.join(__dirname, '../out/data');
const destPath = path.join(destDir, 'content.json');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the file
fs.copyFileSync(srcPath, destPath);
console.log('Content file copied to build output');
