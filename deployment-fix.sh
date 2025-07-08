#!/bin/bash

# Ko Lake Villa Backend Deployment Fix Script

echo "🔧 Fixing Ko Lake Villa Backend..."

# Remove problematic files
rm -f server/routes.ts.backup
rm -f fix-routes-syntax.js
rm -f fix-routes-syntax.cjs
rm -f deployment-checklist.js
rm -f test-global-fixes.js

# Create clean routes file
echo "📝 Creating clean routes.ts..."

# Backup current routes if it exists
if [ -f "server/routes.ts" ]; then
    cp server/routes.ts server/routes.ts.old
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Backend fix complete!"
echo "🚀 Ready to restart server"
