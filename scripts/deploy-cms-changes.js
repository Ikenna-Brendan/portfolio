#!/usr/bin/env node

/**
 * Script to deploy CMS changes including new images and content updates
 * This handles the complete workflow from development to production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function copyNewImages() {
  const publicUploads = 'public/uploads';
  const docsUploads = 'docs/uploads';
  
  if (!fs.existsSync(publicUploads)) {
    log('No public uploads directory found', 'warning');
    return [];
  }
  
  if (!fs.existsSync(docsUploads)) {
    fs.mkdirSync(docsUploads, { recursive: true });
    log('Created docs/uploads directory', 'info');
  }
  
  const publicFiles = fs.readdirSync(publicUploads);
  const docsFiles = fs.readdirSync(docsUploads);
  
  const newFiles = publicFiles.filter(file => 
    file !== '.gitkeep' && !docsFiles.includes(file)
  );
  
  if (newFiles.length === 0) {
    log('No new images to copy', 'info');
    return [];
  }
  
  newFiles.forEach(file => {
    const sourcePath = path.join(publicUploads, file);
    const destPath = path.join(docsUploads, file);
    
    try {
      fs.copyFileSync(sourcePath, destPath);
      log(`Copied image: ${file}`, 'success');
    } catch (error) {
      log(`Failed to copy ${file}: ${error.message}`, 'error');
    }
  });
  
  return newFiles;
}

function updateContentFiles() {
  const publicContent = 'public/data/content.json';
  const docsContent = 'docs/data/content.json';
  
  if (!fs.existsSync(publicContent)) {
    log('No public content.json found', 'error');
    return false;
  }
  
  try {
    // Ensure docs/data directory exists
    const docsDataDir = path.dirname(docsContent);
    if (!fs.existsSync(docsDataDir)) {
      fs.mkdirSync(docsDataDir, { recursive: true });
      log('Created docs/data directory', 'info');
    }
    
    // Copy content file
    fs.copyFileSync(publicContent, docsContent);
    log('Updated docs/data/content.json', 'success');
    return true;
  } catch (error) {
    log(`Failed to update content: ${error.message}`, 'error');
    return false;
  }
}

function runGitCommands() {
  try {
    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!status.trim()) {
      log('No changes to commit', 'info');
      return true;
    }
    
    log('Adding changes to git...', 'info');
    execSync('git add docs/', { stdio: 'inherit' });
    
    log('Committing changes...', 'info');
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_');
    execSync(`git commit -m "deploy: CMS changes [${timestamp}]"`, { stdio: 'inherit' });
    
    log('Pushing to GitHub...', 'info');
    execSync('git push', { stdio: 'inherit' });
    
    log('Successfully deployed to GitHub Pages!', 'success');
    return true;
  } catch (error) {
    log(`Git operation failed: ${error.message}`, 'error');
    return false;
  }
}

function main() {
  log('🚀 Starting CMS deployment process...\n');
  
  // Step 1: Copy new images
  log('Step 1: Copying new images...', 'info');
  const newImages = copyNewImages();
  
  // Step 2: Update content files
  log('Step 2: Updating content files...', 'info');
  const contentUpdated = updateContentFiles();
  
  // Step 3: Deploy changes
  if (newImages.length > 0 || contentUpdated) {
    log('Step 3: Deploying changes...', 'info');
    const deployed = runGitCommands();
    
    if (deployed) {
      log('\n🎉 Deployment completed successfully!', 'success');
      log('Your changes should be live in 2-3 minutes at:', 'info');
      log('https://ikenna-brendan.github.io/portfolio/', 'info');
      
      if (newImages.length > 0) {
        log(`\n📸 New images deployed: ${newImages.join(', ')}`, 'success');
      }
    } else {
      log('\n💥 Deployment failed. Please check the errors above.', 'error');
      process.exit(1);
    }
  } else {
    log('\n✨ No changes detected. Everything is up to date!', 'info');
  }
}

if (require.main === module) {
  main();
}

module.exports = { copyNewImages, updateContentFiles, runGitCommands };
