@echo off
setlocal enabledelayedexpansion

echo [*] Starting GitHub Pages deployment...

REM Generate a unique build ID for cache busting
set BUILD_ID=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set BUILD_ID=!BUILD_ID: =0!

REM Create data directory if it doesn't exist
if not exist "public\data" mkdir "public\data"

REM Export content from localStorage if available
if exist "node_modules\.bin\npx.cmd" (
    echo [*] Exporting content from localStorage...
    call npm run dev -- -p 0 
    timeout /t 5 >nul
    start "" "http://localhost:3000/export-content.html"
    timeout /t 5 >nul
    taskkill /f /im node.exe >nul 2>&1
    
    if exist "public\data\content-export.json" (
        echo [+] Successfully exported content from localStorage
        move /Y "public\data\content-export.json" "public\data\content.json"
    ) else (
        echo [!] No content found in localStorage, using existing content.json if available
    )
)

REM Update the build version in a file that will be used by the app
echo {"buildId": "!BUILD_ID!"} > public\build-info.json

REM Build the project
echo [*] Building project...
call npm run build

REM Export the project for static hosting
echo [*] Exporting project...
call npm run export

REM Remove old docs (be careful if you have custom files)
echo [*] Cleaning up old files...
if exist "docs" rmdir /S /Q docs
mkdir docs

REM Copy all exported files, including hidden and system files
echo [*] Copying files to docs...
xcopy out\* docs /E /I /Y /H

REM Copy additional static assets that might not be in the export
if exist "public\favicon.ico" (
    echo [*] Copying favicon.ico...
    copy "public\favicon.ico" "docs\favicon.ico"
)
if exist "public\icon-192x192.png" (
    echo [*] Copying PWA icons...
    copy "public\icon-192x192.png" "docs\icon-192x192.png"
)
if exist "public\icon-512x512.png" (
    copy "public\icon-512x512.png" "docs\icon-512x512.png"
)

REM Ensure data directory exists in docs
if not exist "docs\data" mkdir "docs\data"

REM Copy content files to docs directory with cache busting
if exist "public\data" (
    if exist "public\data\content.json" (
        echo [*] Updating content files...
        
        REM First, remove any old content-*.json files
        del /Q "docs\data\content-*.json" 2>nul
        
        REM Copy the main content file
        copy /Y "public\data\content.json" "docs\data\content.json"
        
        REM Create a versioned copy for cache busting
        copy /Y "public\data\content.json" "docs\data\content-!BUILD_ID!.json"
        
        echo [+] Content files updated successfully
    ) else (
        echo [!] No content.json found in public\data
    )
) else (
    echo [!] public\data directory not found
)

REM Create .nojekyll file for GitHub Pages
echo [*] Creating .nojekyll file...
echo # This file tells GitHub Pages not to process this site with Jekyll > docs\.nojekyll

REM Create a _headers file for Netlify/Cloudflare to set cache control
echo [*] Setting cache control headers...
echo /* > docs\_headers

echo   Cache-Control: public, max-age=0, must-revalidate >> docs\_headers

echo   X-Build-ID: !BUILD_ID! >> docs\_headers

echo /data/* >> docs\_headers

echo   Cache-Control: public, max-age=0, must-revalidate >> docs\_headers

echo   X-Build-ID: !BUILD_ID! >> docs\_headers

REM Add docs directory to git
echo [*] Adding files to git...
git add docs/

REM Commit changes with build ID
echo [*] Committing changes...
git commit -m "Deploy to GitHub Pages [BUILD:!BUILD_ID!]"

REM Push to GitHub
echo [*] Pushing to GitHub...
git push origin main

echo.
echo [+] Deployment complete!
echo [*] Your site will be available at: https://ikenna-brendan.github.io/portfolio
echo [*] Build ID: !BUILD_ID!
echo [*] It may take a few minutes for changes to appear.
echo [*] To force refresh, append ?v=!BUILD_ID! to the URL
echo.

REM Open the site in browser
start "" "https://ikenna-brendan.github.io/portfolio?v=!BUILD_ID!"

pause
