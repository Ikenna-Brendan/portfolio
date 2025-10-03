#!/usr/bin/env node

/**
 * Script to automatically update image paths in content.json files
 * for GitHub Pages deployment compatibility
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILES = [
  'public/data/content.json',
  'docs/data/content.json',
  'docs/data/content-*.json'
];

const BASE_PATH = '/portfolio';

function updateImagePaths(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let data;
    
    try {
      data = JSON.parse(content);
    } catch (e) {
      console.error(`❌ Invalid JSON in ${filePath}:`, e.message);
      return false;
    }

    let updated = false;

    // Update project images
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.forEach(project => {
        if (project.image && typeof project.image === 'string') {
          // Only update if it doesn't already have the base path
          if (project.image.startsWith('/uploads/') || project.image.startsWith('/images/')) {
            if (!project.image.startsWith(BASE_PATH)) {
              project.image = BASE_PATH + project.image;
              updated = true;
            }
          }
        }
      });
    }

    // Update blog images
    if (data.blog && Array.isArray(data.blog)) {
      data.blog.forEach(post => {
        if (post.image && typeof post.image === 'string') {
          if (post.image.startsWith('/uploads/') || post.image.startsWith('/images/')) {
            if (!post.image.startsWith(BASE_PATH)) {
              post.image = BASE_PATH + post.image;
              updated = true;
            }
          }
        }
      });
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Updated image paths in: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No updates needed for: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findContentFiles() {
  const files = [];
  
  // Add specific files
  files.push('public/data/content.json');
  files.push('docs/data/content.json');
  
  // Find versioned content files in docs
  const docsDataDir = 'docs/data';
  if (fs.existsSync(docsDataDir)) {
    const docsFiles = fs.readdirSync(docsDataDir);
    docsFiles.forEach(file => {
      if (file.startsWith('content-') && file.endsWith('.json')) {
        files.push(path.join(docsDataDir, file));
      }
    });
  }
  
  return files.filter(file => fs.existsSync(file));
}

function main() {
  console.log('🔄 Starting content path update...\n');
  
  const files = findContentFiles();
  let totalUpdated = 0;
  
  if (files.length === 0) {
    console.log('⚠️  No content files found to update');
    return;
  }
  
  files.forEach(file => {
    if (updateImagePaths(file)) {
      totalUpdated++;
    }
  });
  
  console.log(`\n📊 Summary: Updated ${totalUpdated} out of ${files.length} files`);
  
  if (totalUpdated > 0) {
    console.log('\n🚀 Next steps:');
    console.log('   1. git add docs/data/');
    console.log('   2. git commit -m "fix: update image paths for production"');
    console.log('   3. git push');
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateImagePaths, findContentFiles };
