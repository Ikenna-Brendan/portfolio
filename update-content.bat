@echo off
echo 🔄 Content Update Helper
echo ========================

echo.
echo 📝 Instructions:
echo 1. Start dev server: npm run dev
echo 2. Go to http://localhost:3000
echo 3. Click CMS button and enter password: MyPortfolio2024!
echo 4. Make your changes and save
echo 5. Export content from CMS
echo 6. Run this script to update production
echo.

set /p choice="Have you exported the content from CMS? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo 📁 Please place the exported portfolio-content.json file in the project root
    echo.
    set /p confirm="Ready to update production content? (y/n): "
    if /i "%confirm%"=="y" (
        echo.
        echo 🔄 Updating content files...
        
        REM Copy exported content to data folder
        if exist "portfolio-content.json" (
            copy "portfolio-content.json" "data\content.json"
            echo ✅ Updated data/content.json
        ) else (
            echo ❌ portfolio-content.json not found in project root
            pause
            exit /b 1
        )
        
        REM Copy to public folder
        copy "data\content.json" "public\data\content.json"
        echo ✅ Updated public/data/content.json
        
        echo.
        echo 🚀 Deploying to production...
        call deploy.bat
        
        echo.
        echo ✅ Content update complete!
        echo 🌐 Your live site will be updated in a few minutes
    ) else (
        echo ❌ Update cancelled
    )
) else (
    echo.
    echo 📝 Please:
    echo 1. Start dev server: npm run dev
    echo 2. Make changes in CMS
    echo 3. Export content
    echo 4. Run this script again
)

echo.
pause 