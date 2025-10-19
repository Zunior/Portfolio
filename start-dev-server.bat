@echo off
echo ========================================
echo   Portfolio - Development Server
echo   with LIVE RELOAD
echo ========================================
echo.
echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    echo After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Installing/checking dependencies...
call npm install
echo.
echo ========================================
echo   Starting Development Server
echo ========================================
echo.
echo Server will start at: http://localhost:8000
echo.
echo Features:
echo   - Auto-refresh on file changes
echo   - Browser will open automatically
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npx live-server --port=8000 --open=/index.html
