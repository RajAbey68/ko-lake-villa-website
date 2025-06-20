#!/bin/bash

# Emergency startup script to bypass configuration issues
echo "🚀 Emergency Ko Lake Villa startup..."

# Kill any existing processes
pkill -f "node.*5000" || true
pkill -f "vite" || true
sleep 2

# Start the development server directly
echo "Starting Ko Lake Villa development server..."
NODE_ENV=development npx tsx server/index.ts &

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:5000/api/rooms > /dev/null; then
    echo "✅ Ko Lake Villa is running on http://localhost:5000"
else
    echo "❌ Server failed to start"
fi