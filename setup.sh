#!/bin/bash
echo "🚀 Setting up Ko Lake Villa..."

# Install dependencies
npm install

# Install shadcn components
npx shadcn@latest add button card badge input label textarea select tabs alert

# Start development server
npm run dev

echo "✅ Ko Lake Villa is ready!"
echo "🌐 Open http://localhost:3000 to view your site"
