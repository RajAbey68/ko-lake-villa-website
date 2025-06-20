#!/bin/bash

# Ko Lake Villa - Replit Deployment Fix
echo "🚀 Fixing Ko Lake Villa deployment configuration..."

# Kill any existing processes
pkill -f "tsx.*server" 2>/dev/null || true
pkill -f "node.*5000" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait for processes to stop
sleep 3

# Create minimal production build
echo "Building frontend..."
npx vite build --mode production

# Build server with simplified config
echo "Building server..."
npx esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --external:pg-native \
  --external:@neondatabase/serverless

# Copy essential files
cp package.json dist/
cp -r uploads dist/ 2>/dev/null || true

echo "✅ Build completed successfully"
echo "📋 Your Ko Lake Villa website is ready for deployment"
echo ""
echo "Next steps:"
echo "1. Click the Deploy button in Replit interface"
echo "2. Your site will be live at [your-repl].replit.app"
echo "3. Admin access at [your-repl].replit.app/admin"