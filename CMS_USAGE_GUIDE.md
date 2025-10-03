# CMS Usage Guide

## Overview
Your portfolio includes a built-in CMS (Content Management System) that allows you to add, edit, and manage projects directly through a web interface.

## How to Access the CMS

### Development Mode (Recommended for Editing)
1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Open your browser** and go to: `http://localhost:3001`
3. **Navigate to the CMS**: Look for the CMS/Admin section or go directly to `/admin` if available

### Production Mode (View Only)
- Visit: https://ikenna-brendan.github.io/portfolio/
- Note: Image uploads and content editing only work in development mode

## Adding/Editing Projects

### Step 1: Start Development Server
```bash
cd "C:\Users\AFF Computers\Documents\Personal-Portfolio\bolt-version\portfolio"
npm run dev
```

### Step 2: Access CMS Interface
- Open http://localhost:3001 in your browser
- Navigate to the projects section

### Step 3: Add/Edit Project
1. **Fill in project details**:
   - Title
   - Company
   - Description
   - Technologies used
   - Features
   - Impact/Results

2. **Upload project image**:
   - Click the image upload area
   - Select an image file (JPG, PNG, GIF)
   - Max file size: 2MB
   - Image will be saved to `/public/uploads/`

### Step 4: Save Changes
- Click "Save" or "Update" button
- Changes are saved to `public/data/content.json`

## Deploying Changes

After making changes in the CMS, follow this workflow:

### Option 1: Quick Deploy (Recommended)
```bash
# Save your changes to Git
git add .
git commit -m "feat: update project content via CMS"
git push

# Deploy to live site
npm run quick-deploy
```

### Option 2: Manual Deploy
```bash
# Fix image paths for production
npm run fix-paths

# Commit and push changes
git add docs/data/
git commit -m "fix: update image paths for production"
git push
```

## Image Management

### Supported Formats
- JPG/JPEG
- PNG
- GIF
- WebP

### File Size Limits
- Maximum: 2MB per image
- Recommended: Under 500KB for better performance

### Image Storage
- **Development**: Images saved to `public/uploads/`
- **Production**: Images copied to `docs/uploads/` during deployment

### Image Path Handling
- **Development**: `/uploads/image.jpg`
- **Production**: `/portfolio/uploads/image.jpg` (automatically handled)

## Troubleshooting

### "Error handling upload" Message
**Cause**: API routes don't work in static export mode
**Solution**: 
1. Ensure you're in development mode (`npm run dev`)
2. Check that the dev server is running on localhost
3. Try refreshing the page and uploading again

### Images Not Showing in Production
**Cause**: Image paths need `/portfolio/` prefix for GitHub Pages
**Solution**: Run `npm run quick-deploy` after making changes

### CMS Not Loading
**Cause**: Development server not running
**Solution**: 
1. Stop any running processes: `Ctrl+C`
2. Clear build cache: `rm -rf .next` (or delete .next folder)
3. Restart: `npm run dev`

### File Upload Fails
**Possible causes**:
- File too large (>2MB)
- Invalid file format
- Insufficient disk space
- Permissions issue

**Solutions**:
- Compress image before uploading
- Use JPG/PNG format
- Free up disk space
- Run as administrator if needed

## Best Practices

### Image Optimization
1. **Compress images** before uploading
2. **Use descriptive filenames** (will be renamed automatically)
3. **Optimal dimensions**: 800x600px or 1200x800px
4. **Format choice**: JPG for photos, PNG for graphics with transparency

### Content Guidelines
1. **Project titles**: Keep concise but descriptive
2. **Descriptions**: 2-3 sentences highlighting key aspects
3. **Technologies**: List most relevant/impressive technologies
4. **Impact**: Include quantifiable results when possible

### Workflow
1. **Always work in development mode** for content changes
2. **Test locally** before deploying
3. **Use quick-deploy** for fastest updates
4. **Keep backups** of important content

## File Locations

```
portfolio/
├── public/
│   ├── data/
│   │   └── content.json          # Source content (edited by CMS)
│   └── uploads/                  # Uploaded images (development)
├── docs/
│   ├── data/
│   │   ├── content.json          # Deployed content
│   │   └── content-*.json        # Versioned content
│   └── uploads/                  # Deployed images (production)
└── scripts/
    └── update-content-paths.js   # Path fixing script
```

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Fix image paths
npm run fix-paths

# Quick deploy changes
npm run quick-deploy

# View current content
cat public/data/content.json
```
