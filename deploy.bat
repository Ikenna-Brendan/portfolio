@echo off
echo 🚀 Starting GitHub Pages deployment...

REM Build the project
echo 📦 Building project...
call npm run build

REM Export the project for static hosting
echo 📤 Exporting project...
call npm run export

REM Remove old docs (be careful if you have custom files)
rmdir /S /Q docs
mkdir docs

REM Copy all exported files, including hidden and system files
xcopy out docs /E /I /Y /H

REM Copy additional static assets that might not be in the export
if exist "public\favicon.ico" (
    echo 📋 Copying favicon.ico...
    copy "public\favicon.ico" "docs\favicon.ico"
)
if exist "public\icon-192x192.png" (
    echo 📋 Copying PWA icons...
    copy "public\icon-192x192.png" "docs\icon-192x192.png"
)
if exist "public\icon-512x512.png" (
    copy "public\icon-512x512.png" "docs\icon-512x512.png"
)

REM Create .nojekyll file for GitHub Pages
echo Creating .nojekyll file...
echo # This file tells GitHub Pages not to process this site with Jekyll > docs\.nojekyll

REM Add docs directory to git
echo 📝 Adding docs to git...
git add docs/

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy to GitHub Pages"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deployment complete!
echo 🌐 Your site will be available at: https://ikenna-brendan.github.io/portfolio
echo ⏰ It may take a few minutes for changes to appear.
pause 