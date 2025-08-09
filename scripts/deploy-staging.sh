#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }

echo "═══════════════════════════════════════════"
echo "     Ko Lake Villa - Staging Deployment"
echo "═══════════════════════════════════════════"
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
log_info "Current branch: $CURRENT_BRANCH"

# Ensure we have latest code
log_info "Pulling latest changes..."
git pull origin "$CURRENT_BRANCH" 2>/dev/null || true

# Run quick validation
log_info "Running quick validation..."
if ./scripts/quick-check.sh; then
    log_success "Quick validation passed"
else
    log_warning "Some quick checks failed - review above"
    read -p "Continue with deployment? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

# Deploy to Vercel
log_info "Deploying to Vercel staging..."
echo ""
echo "This will create a preview deployment on Vercel."
echo "You'll be prompted to log in if needed."
echo ""

# Deploy with vercel CLI
DEPLOYMENT_URL=$(vercel --yes 2>&1 | tee /tmp/vercel-deploy.log | grep -oE "https://[a-zA-Z0-9.-]+\.vercel\.app" | tail -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    log_error "Failed to get deployment URL"
    echo "Check /tmp/vercel-deploy.log for details"
    exit 1
fi

log_success "Deployment successful!"
echo ""
echo "═══════════════════════════════════════════"
echo "     STAGING DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 Staging URL: $DEPLOYMENT_URL"
echo ""
echo "Next steps:"
echo "1. Visit the staging URL to verify visually"
echo "2. Run validation against staging:"
echo "   VERCEL_PREVIEW_URL=$DEPLOYMENT_URL ./scripts/validate-pr.sh"
echo ""
log_success "Staging deployment ready for testing! 🎉"