@echo off
setlocal
cd /d "%~dp0"
set "PATH=%~dp0runtime\node;%PATH%"
set "NODE_ENV=production"
set "PORT=3000"
if not exist "%~dp0runtime\node\node.exe" (
  echo Enercyra portable runtime is missing.
  echo Please keep the complete folder structure together on the USB drive.
  pause
  exit /b 1
)
if not exist "%~dp0dist\index.js" (
  echo Enercyra build files are missing.
  pause
  exit /b 1
)
echo Starting Enercyra locally...
start "Enercyra Server" /min "%~dp0runtime\node\node.exe" "%~dp0dist\index.js"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000/forecast"
echo Enercyra is running at http://localhost:3000/forecast
echo Keep this window open while using the site.
pause
endlocal
