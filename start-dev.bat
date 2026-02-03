@echo off
REM Clickresto Development Servers Starter (Windows)
REM Run this script to start both landing page and back-office servers

echo ===================================
echo Clickresto Development Environment
echo ===================================
echo.

REM Check if backoffice dependencies are installed
if not exist "backoffice\node_modules" (
  echo Installing back-office dependencies...
  cd backoffice
  call npm install
  cd ..
  echo.
)

echo Starting development servers...
echo.
echo Landing page: http://localhost:8080
echo Back-office:  http://localhost:3000
echo.
echo Press Ctrl+C to stop servers
echo.

REM Start back-office in new window
start "Clickresto Back-office" cmd /k "cd backoffice && npm run dev"

REM Wait a moment for back-office to start
timeout /t 2 /nobreak > nul

REM Start landing page server
python -m http.server 8080
if errorlevel 1 (
  npx http-server -p 8080
)
