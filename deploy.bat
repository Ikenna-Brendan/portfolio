@echo off
echo 🚀 Starting GitHub Pages deployment...

REM Build the project
echo 📦 Building project...
call npm run build

REM Create docs directory if it doesn't exist
echo 📁 Creating docs directory...
if not exist "docs" mkdir docs

REM Copy build files to docs directory
echo 📋 Copying build files...
xcopy "out\*" "docs\" /E /I /Y

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
echo 🌐 Your site will be available at: https://your-username.github.io/portfolio
echo ⏰ It may take a few minutes for changes to appear.
pause 