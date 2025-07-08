#!/bin/bash

echo "🔄 Restarting Ko Lake Villa development server..."

# Kill any existing dev servers
pkill -f "npm run dev" || true
pkill -f "next dev" || true

# Wait a moment
sleep 2

# Clear build cache
echo "🧹 Clearing build cache..."
rm -rf .next

# Start fresh
echo "🚀 Starting development server..."
npm run dev 