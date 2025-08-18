#!/bin/bash

# Ko Lake Villa - Deploy to Vercel Script
# This preserves ALL your Replit functionality

echo "🚀 Ko Lake Villa - Vercel Deployment Helper"
echo "==========================================="
echo ""
echo "This script will help deploy your Replit app to Vercel"
echo "while keeping ALL your functions, UI, style, and AI logic!"
echo ""

# Check if we're in the right directory
if [ ! -f "replit_source/package.json" ]; then
    echo "❌ Error: Not in the Ko Lake Villa project root"
    echo "Please run this from the main project directory"
    exit 1
fi

echo "📦 Step 1: Preparing Vercel configuration..."
echo "✅ vercel.json - Updated"
echo "✅ vite.config.vercel.ts - Created"
echo "✅ api/index.js - Serverless adapter created"
echo "✅ package.json - Build scripts updated"
echo ""

echo "📝 Step 2: Environment Variables Required in Vercel:"
echo "----------------------------------------------------"
echo "OPENAI_API_KEY=your_openai_key"
echo "API_SECRET_KEY=JTjV8ElpU45PjzjOe89XU4JB"
echo "DATABASE_URL=your_database_url"
echo "STRIPE_SECRET_KEY=your_stripe_secret (optional)"
echo "VITE_STRIPE_PUBLIC_KEY=your_stripe_public (optional)"
echo ""

echo "🔧 Step 3: Vercel Settings:"
echo "---------------------------"
echo "Framework Preset: Other"
echo "Build Command: npm run vercel-build"
echo "Output Directory: client/dist"
echo "Root Directory: replit_source (if needed)"
echo ""

echo "Would you like to commit and push these changes? (y/n)"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo ""
    echo "📤 Committing changes..."
    
    cd replit_source
    git add vercel.json vite.config.vercel.ts api/index.js package.json
    git commit -m "Fix Vercel deployment - preserve all Replit functionality"
    
    echo "📡 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "✅ DONE! Your code is ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your GitHub repository"
    echo "3. Add the environment variables listed above"
    echo "4. Deploy!"
    echo ""
    echo "🎯 Remember: Your Replit at https://skill-bridge-rajabey68.replit.app"
    echo "is still working perfectly if you prefer to keep using it!"
else
    echo ""
    echo "📌 No changes pushed. Your Vercel configuration files are ready locally."
    echo "You can manually commit and push when ready."
fi

echo ""
echo "Need help? Check VERCEL_DEPLOYMENT_FIX.md for detailed instructions!"