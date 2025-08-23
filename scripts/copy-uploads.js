const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting uploads directory copy...');

const sourceDir = path.join(process.cwd(), 'public', 'uploads');
const destDir = path.join(process.cwd(), 'out', 'uploads');

// Ensure source directory exists
if (!fs.existsSync(sourceDir)) {
  console.log('Source uploads directory does not exist, creating...');
  fs.mkdirSync(sourceDir, { recursive: true });
  // Create .gitkeep to ensure directory is tracked
  fs.writeFileSync(path.join(sourceDir, '.gitkeep'), '');
}

// Copy uploads directory to out directory
console.log(`Copying uploads from ${sourceDir} to ${destDir}...`);
try {
  // Use xcopy for Windows
  if (process.platform === 'win32') {
    execSync(`xcopy "${sourceDir}\\*" "${destDir}\\*" /E /I /Y /H`, { stdio: 'inherit' });
  } else {
    // For non-Windows, use rsync if available, otherwise cp
    try {
      execSync(`rsync -a "${sourceDir}/" "${destDir}/"`, { stdio: 'inherit' });
    } catch {
      execSync(`cp -r "${sourceDir}/." "${destDir}/"`, { stdio: 'inherit' });
    }
  }
  console.log('Successfully copied uploads directory');
} catch (error) {
  console.error('Error copying uploads directory:', error);
  process.exit(1);
}
