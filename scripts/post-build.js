const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

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

async function main() {
  try {
    const uploadsSrc = path.join(process.cwd(), 'public', 'uploads');
    const outDir = path.join(process.cwd(), 'out');
    
    // Copy to /uploads
    const uploadsDest = path.join(outDir, 'uploads');
    if (fs.existsSync(uploadsSrc)) {
      console.log(`Copying uploads from ${uploadsSrc} to ${uploadsDest}`);
      await copyDir(uploadsSrc, uploadsDest);
    }

    // Also copy to /_next/static/media for image optimization
    const mediaDest = path.join(outDir, '_next', 'static', 'media');
    if (fs.existsSync(uploadsSrc)) {
      console.log(`Copying uploads to ${mediaDest}`);
      await copyDir(uploadsSrc, mediaDest);
    }
    
    console.log('Post-build copy completed successfully');
  } catch (error) {
    console.error('Error during post-build copy:', error);
    process.exit(1);
  }
}

main();
