#!/bin/bash

# Ko Lake Villa - Vercel Deployment Script

echo "🚀 Deploying Ko Lake Villa to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set up project
echo "⚙️ Setting up Vercel project..."
vercel link

# Set environment variables
echo "🔧 Setting environment variables..."
vercel env add NEXT_PUBLIC_API_URL production
vercel env add ADMIN_TOKEN production
vercel env add DATABASE_URL production

# Deploy to production
echo "🌟 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your Ko Lake Villa website is now live on Vercel!"
echo "📊 Check your deployment at: https://vercel.com/dashboard"
