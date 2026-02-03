#!/bin/bash
# Clickresto Development Servers Starter
# Run this script to start both landing page and back-office servers

echo "==================================="
echo "Clickresto Development Environment"
echo "==================================="
echo ""

# Check if backoffice dependencies are installed
if [ ! -d "backoffice/node_modules" ]; then
  echo "Installing back-office dependencies..."
  cd backoffice && npm install && cd ..
  echo ""
fi

echo "Starting development servers..."
echo ""
echo "Landing page: http://localhost:8080"
echo "Back-office:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start back-office in background
cd backoffice && npm run dev &
BACKOFFICE_PID=$!

# Return to root
cd ..

# Start landing page server
python -m http.server 8080 || npx http-server -p 8080

# Cleanup: kill back-office server on exit
trap "kill $BACKOFFICE_PID" EXIT
