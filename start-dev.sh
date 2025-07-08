#!/bin/bash

# Kill anything on port 5000
echo "🛑 Checking and killing any process on port 5000..."
kill -9 $(lsof -ti :5000) 2>/dev/null || true

# Wait 2 seconds for cleanup
sleep 2

# Start your dev server
echo "🚀 Starting development server..."
npm run dev
