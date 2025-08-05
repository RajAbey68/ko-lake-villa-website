#!/bin/bash
# REGRESSION PREVENTION WORKFLOW
# Implements the user's guidance for preventing repeated overwrites

set -e

echo "🔒 Ko Lake Villa - Regression Prevention Workflow"
echo "==============================================="

# 1. BRANCH DISCIPLINE 
echo "📋 Step 1: Branch Discipline Check"
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "⚠️  WARNING: You are on the main branch!"
    echo "✅ RECOMMENDATION: Create a feature branch for any changes"
    echo "   Example: git checkout -b fix/contact-updates"
    read -p "Continue anyway? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "❌ Exiting. Create a feature branch first."
        exit 1
    fi
fi

# 2. SYNC BEFORE MODIFYING
echo ""
echo "🔄 Step 2: Sync Latest Changes"
echo "Pulling latest changes from remote..."
git fetch origin
git pull origin $CURRENT_BRANCH || {
    echo "⚠️  Pull failed. You may need to resolve conflicts first."
    echo "   Run: git status"
    exit 1
}

# 3. STABLE CODE PROTECTION CHECK
echo ""
echo "🛡️  Step 3: Stable Code Protection Check"
echo "Checking .cursorignore for protected files..."
if [ -f ".cursorignore" ]; then
    echo "✅ .cursorignore found with protected files:"
    cat .cursorignore | grep -E "^app/|^components/" | head -10
else
    echo "⚠️  .cursorignore not found. Creating..."
    cat > .cursorignore << EOF
# STABLE COMPONENTS - DO NOT OVERWRITE
app/contact/page.tsx
app/gallery/page.tsx  
components/admin/gallery-management.tsx
components/navigation/global-header.tsx
lib/firebase-listings.ts
components/listings-provider.tsx
app/api/gallery/ai-tag/route.ts
EOF
fi

# 4. VERIFY CRITICAL FUNCTIONALITY
echo ""
echo "🧪 Step 4: Critical Functionality Verification"
echo "Checking that critical features are still working..."

# Check contact page has all 3 phone numbers
if grep -q "71 776 5780" app/contact/page.tsx && \
   grep -q "77 315 0602" app/contact/page.tsx && \
   grep -q "711730345" app/contact/page.tsx; then
    echo "✅ Contact page: All 3 phone numbers present"
else
    echo "❌ Contact page: Missing phone numbers!"
    echo "   Expected: +94 71 776 5780, +94 77 315 0602, +94 711730345"
    exit 1
fi

# Check WhatsApp buttons
if grep -q "wa.me" app/contact/page.tsx; then
    echo "✅ Contact page: WhatsApp integration present"
else
    echo "❌ Contact page: WhatsApp buttons missing!"
    exit 1
fi

# Check reception hours
if grep -q "7am to 10:30pm" app/contact/page.tsx; then
    echo "✅ Contact page: Correct reception hours"
else
    echo "❌ Contact page: Incorrect reception hours!"
    exit 1
fi

# Check booking buttons route to contact
if grep -q 'href="/contact"' components/navigation/global-header.tsx; then
    echo "✅ Navigation: Book Now routes to contact page"
else
    echo "⚠️  Navigation: Check Book Now routing"
fi

# Check Firebase fallback is working
if grep -q "hasValidFirebaseConfig" lib/firebase-listings.ts; then
    echo "✅ Firebase: Fallback handling present"
else
    echo "⚠️  Firebase: Check fallback configuration"
fi

echo ""
echo "🎯 Step 5: Deployment Safety Checklist"
echo "Before deploying, verify:"
echo "   ✅ All critical features tested"
echo "   ✅ No .cursorignore files were modified without permission"
echo "   ✅ Gallery images are accessible (91 files in public/uploads/gallery)"
echo "   ✅ Contact page shows all 3 phone numbers with WhatsApp"
echo "   ✅ All booking buttons route to /contact"
echo ""

echo "🚀 READY FOR DEPLOYMENT"
echo "========================"
echo "If all checks passed, you can now:"
echo "1. vercel --prod"
echo "2. Test on live site"
echo "3. Merge to main branch if everything works"
echo ""
echo "🔒 REMEMBER: Never modify files listed in .cursorignore without explicit review!" 