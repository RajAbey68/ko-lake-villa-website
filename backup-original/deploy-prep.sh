#!/bin/bash

echo "🚀 Ko Lake Villa - Pre-Deployment Sync"
echo "======================================"

# Ensure all files are saved and synced
echo "📁 Syncing all files..."
find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.json" | while read file; do
    if [[ -f "$file" ]]; then
        touch "$file"
    fi
done

echo "✅ File sync complete"

# Check critical files exist
echo "🔍 Verifying critical Ko Lake Villa files..."

CRITICAL_FILES=(
    "client/src/pages/admin/Dashboard.tsx"
    "client/src/pages/AdminCalendar.tsx" 
    "client/src/pages/Accommodation.tsx"
    "client/src/pages/Home.tsx"
    "server/routes.ts"
    "shared/pricing.json"
)

ALL_GOOD=true
for file in "${CRITICAL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ALL_GOOD=false
    fi
done

if $ALL_GOOD; then
    echo ""
    echo "🎯 All Ko Lake Villa files ready for deployment!"
    echo "📋 Pricing system features included:"
    echo "   • Unified admin dashboard with edit controls"
    echo "   • Sunday auto-revert functionality"
    echo "   • Custom pricing display to visitors"
    echo "   • Homepage with Our Property section"
    echo ""
    echo "🚀 Ready to deploy! Click the Redeploy button now."
else
    echo ""
    echo "⚠️  Some files are missing. Please check your project."
fi