@echo off
setlocal enabledelayedexpansion

echo [*] Starting GitHub Pages deployment...

REM Generate a unique build ID for cache busting
set BUILD_ID=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set BUILD_ID=!BUILD_ID: =0!

REM Create data directory if it doesn't exist
if not exist "public\data" mkdir "public\data"

REM Skipping legacy localStorage export step (handled by CMS/dev API now)

REM Update the build version in a file that will be used by the app
echo {"buildId": "!BUILD_ID!"} > public\build-info.json

REM Export the project for static hosting (includes build)
echo [*] Exporting project (build + export)...
call npm run export

REM Ensure content.json is included in the exported output
node scripts/copy-content.js

REM Remove old docs (be careful if you have custom files)
echo [*] Cleaning up old files...
if exist "docs" rmdir /S /Q docs
mkdir docs

REM Copy all exported files, including hidden and system files
echo [*] Copying files to docs...
xcopy out\* docs /E /I /Y /H

REM Ensure data and uploads directories exist in docs
if not exist "docs\data" mkdir "docs\data"
if not exist "docs\uploads" mkdir "docs\uploads"

REM Copy uploads directory (for local development)
if exist "public\uploads" (
    echo [*] Copying uploads directory...
    xcopy "public\uploads" "docs\uploads" /E /I /Y /H
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Warning: Failed to copy uploads directory
    )
)

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

REM Add docs directory and its contents to git
echo [*] Adding files to git...
git add docs/

REM Ensure the uploads directory is tracked in the repository
if exist "public\uploads" (
    echo [*] Ensuring uploads directory is tracked...
    git add -f public/uploads/
)

echo [*] Checking for changes...
git diff --cached --quiet --exit-code
if %errorlevel%==0 (
    echo [*] No changes to commit. Skipping commit and push.
) else (
    echo [*] Committing changes...
    git commit -m "Deploy to GitHub Pages [BUILD:!BUILD_ID!]"
    echo [*] Pushing to GitHub...
    git push origin main
)

echo.
echo [+] Deployment complete!
echo [*] Your site will be available at: https://ikenna-brendan.github.io/portfolio
echo [*] Build ID: !BUILD_ID!
echo [*] It may take a few minutes for changes to appear.
echo [*] Waiting for GitHub Pages to publish the new build (polling for content-!BUILD_ID!.json)...

set MAX_TRIES=60
set /a TRY=0
set PUBLISHED=0


:WAIT_LOOP
set /a TRY+=1
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try { (Invoke-WebRequest -Uri \"https://ikenna-brendan.github.io/portfolio/data/content-%BUILD_ID%.json\" -UseBasicParsing -Method Head -TimeoutSec 10).StatusCode } catch { 0 }"`) do set STATUS=%%A
if not defined STATUS set STATUS=0

if "%STATUS%"=="200" (
    set PUBLISHED=1
    echo [+] Detected published artifact: content-!BUILD_ID!.json is live.
    goto OPEN_SITE
)

if %TRY% GEQ %MAX_TRIES% (
    echo [!] Timed out waiting for GitHub Pages (waited %MAX_TRIES% cycles). Proceeding to open the site anyway.
    goto OPEN_SITE
)

echo [*] Not live yet (status %STATUS%). Waiting 5s... (Attempt %TRY%/%MAX_TRIES%)
timeout /t 5 >nul
goto WAIT_LOOP

:OPEN_SITE
echo [*] Opening with cache-busting and refresh flag: ?refresh=true&v=!BUILD_ID!
start "" "https://ikenna-brendan.github.io/portfolio?refresh=true&v=!BUILD_ID!"

pause