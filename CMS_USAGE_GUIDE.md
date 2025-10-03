# CMS Usage Guide

## Overview
Your portfolio includes a built-in CMS (Content Management System) that allows you to add, edit, and manage projects, hero content, and about sections directly through a web interface. The system is fully automated and handles image uploads, path corrections, and deployment seamlessly.

## How to Access the CMS

### Development Mode (Required for Editing)
1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Open your browser** and go to: `http://localhost:3001` (or the port shown in terminal)
3. **Navigate to the CMS**: The CMS interface is integrated into your portfolio site

### Production Mode (View Only)
- Visit: https://ikenna-brendan.github.io/portfolio/
- Note: Content editing and image uploads only work in development mode

## Adding/Editing Content

### Step 1: Start Development Server
```bash
cd "C:\Users\AFF Computers\Documents\Personal-Portfolio\bolt-version\portfolio"
npm run dev
```

### Step 2: Access CMS Interface
- Open http://localhost:3001 in your browser (or the port shown in terminal)
- The CMS interface is integrated into your portfolio site

### Step 3: Edit Content
You can edit the following sections:

#### **Hero Section**
- Name and title
- Tagline and bio
- Resume URL and location

#### **About Section**
- Professional summary
- Career highlights
- Skills and experience

#### **Projects**
1. **Add/Edit project details**:
   - Title and company
   - Description
   - Technologies used
   - Features and impact

2. **Upload project images**:
   - Click the image upload area
   - Select an image file (JPG, PNG, GIF, WebP)
   - Max file size: 2MB
   - Images automatically get correct paths for production

### Step 4: Save Changes
- Click "Save" or "Update" button
- Changes are automatically saved to `public/data/content.json`

## Deploying Changes

After making changes in the CMS, use the automated deployment:

### ✅ Recommended: Automated Deploy
```bash
npm run deploy-cms
```

This single command:
- ✅ Copies new images to production directory
- ✅ Updates production content files
- ✅ Commits changes with timestamp
- ✅ Pushes to GitHub Pages
- ✅ Provides detailed progress logging

### Alternative: Manual Steps (if needed)
```bash
# Save your changes to Git first
git add .
git commit -m "feat: update content via CMS"
git push

# Then deploy
npm run deploy-cms
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

### Image Storage & Paths
- **Development**: Images saved to `public/uploads/`
- **Production**: Images automatically copied to `docs/uploads/` during deployment
- **Path Handling**: CMS now automatically generates correct `/portfolio/uploads/` paths
- **No Manual Fixing**: Image paths work correctly without intervention

## Troubleshooting

### "Error handling upload" Message
**Cause**: API routes only work in development mode
**Solution**: 
1. Ensure you're in development mode (`npm run dev`)
2. Check that the dev server is running on localhost
3. Try refreshing the page and uploading again
4. Check terminal for any error messages

### Images Not Showing After Deployment
**Cause**: Usually resolved automatically, but check:
**Solution**: 
1. Wait 2-3 minutes for GitHub Pages to update
2. Clear browser cache (Ctrl+F5)
3. Check that `npm run deploy-cms` completed successfully
4. Verify images exist in `docs/uploads/` directory

### CMS Not Loading
**Cause**: Development server not running
**Solution**: 
1. Stop any running processes: `Ctrl+C`
2. Clear build cache: Delete `.next` folder if it exists
3. Restart: `npm run dev`
4. Check the port number in terminal output

### Deployment Script Fails
**Possible causes**:
- Uncommitted changes in git
- Network connectivity issues
- File permission problems

**Solutions**:
1. Check git status: `git status`
2. Commit any pending changes first
3. Ensure internet connection is stable
4. Try running the script again

### File Upload Fails
**Possible causes**:
- File too large (>2MB)
- Invalid file format
- Network timeout
- Insufficient disk space

**Solutions**:
- Compress image before uploading (use online tools)
- Use standard formats: JPG, PNG, GIF, WebP
- Check internet connection
- Free up disk space
- Try a smaller image first

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
5. **Hero/About sections**: Keep professional and engaging
6. **Consistency**: Maintain consistent tone across all sections

### Workflow Best Practices
1. **Always work in development mode** for content changes
2. **Test locally** before deploying (check localhost preview)
3. **Use automated deployment** (`npm run deploy-cms`)
4. **Make incremental changes** rather than large bulk updates
5. **Keep backups** of important content (git history serves as backup)

## System Architecture

### File Structure
```
portfolio/
├── public/
│   ├── data/
│   │   └── content.json          # Source content (edited by CMS)
│   └── uploads/                  # Uploaded images (development)
├── docs/
│   ├── data/
│   │   ├── content.json          # Deployed content (production)
│   │   └── content-*.json        # Versioned content backups
│   └── uploads/                  # Deployed images (production)
├── app/api/
│   ├── upload/route.ts           # Image upload API (dev only)
│   └── update-content/route.ts   # Content update API (dev only)
└── scripts/
    ├── deploy-cms-changes.js     # Automated deployment script
    └── update-content-paths.js   # Legacy path fixing script
```

### Data Flow
```
CMS Interface → API Routes → public/data/content.json → deploy-cms script → docs/ → GitHub Pages
```

## Quick Reference Commands

```bash
# Start development server (required for CMS)
npm run dev

# Deploy CMS changes (recommended)
npm run deploy-cms

# Legacy commands (still available)
npm run fix-paths      # Fix image paths only
npm run quick-deploy   # Legacy deployment method

# View current content
cat public/data/content.json    # Source content
cat docs/data/content.json      # Production content

# Git operations (handled automatically by deploy-cms)
git status                      # Check for changes
git add .                       # Stage changes
git commit -m "message"         # Commit changes
git push                        # Push to GitHub
```

## Summary

Your CMS is now fully automated and production-ready:

✅ **Image uploads** work correctly with proper paths  
✅ **Content editing** supports hero, about, and projects sections  
✅ **Deployment** is fully automated with one command  
✅ **Path handling** is automatic (no manual fixing needed)  
✅ **Error handling** provides clear feedback and logging  
✅ **Git operations** are handled automatically  

**Simple workflow**: Edit in CMS → `npm run deploy-cms` → Live in 2-3 minutes!
