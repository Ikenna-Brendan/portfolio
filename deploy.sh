#!/bin/bash

# GitHub Pages Deployment Script
echo "🚀 Starting GitHub Pages deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Create docs directory if it doesn't exist
echo "📁 Creating docs directory..."
mkdir -p docs

# Copy build files to docs directory
echo "📋 Copying build files..."
cp -r out/* docs/

# Add docs directory to git
echo "📝 Adding docs to git..."
git add docs/

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://your-username.github.io/portfolio"
echo "⏰ It may take a few minutes for changes to appear." 