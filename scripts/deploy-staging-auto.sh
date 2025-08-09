#!/usr/bin/env bash
set -euo pipefail

# ==== CONFIG ====
BRANCH_NAME="${1:-fix/landing-hero-restore}"
REPO="RajAbey68/ko-lake-villa-website"
VERCEL_TOKEN="${VERCEL_TOKEN:-}" # Export before running: export VERCEL_TOKEN=xxxx
VERCEL_TEAM_ID="${VERCEL_TEAM_ID:-}" # Optional if in a team
PROJECT_NAME="ko-lake-villa-website"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }
log_highlight() { echo -e "${CYAN}$1${NC}"; }

# Header
echo ""
echo "═══════════════════════════════════════════════════════"
echo "   🚀 Ko Lake Villa - Automated Staging Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check for Vercel token
if [[ -z "$VERCEL_TOKEN" ]]; then
  log_error "Missing VERCEL_TOKEN"
  echo ""
  echo "Get your token from: https://vercel.com/account/tokens"
  echo ""
  echo "Then run:"
  log_highlight "export VERCEL_TOKEN=your_token_here"
  log_highlight "$0 $BRANCH_NAME"
  echo ""
  exit 1
fi

log_info "Branch: $BRANCH_NAME"
log_info "Project: $PROJECT_NAME"
echo ""

# 1. Ensure branch is current
log_info "Updating branch from origin..."
git fetch origin >/dev/null 2>&1
git checkout "$BRANCH_NAME" >/dev/null 2>&1 || {
  log_error "Branch '$BRANCH_NAME' not found"
  echo "Available branches:"
  git branch -a | grep -E "fix/|feat/|chore/" | sed 's/^/  /'
  exit 1
}
git pull origin "$BRANCH_NAME" >/dev/null 2>&1 || true
log_success "Branch updated"

# 2. Run quick local validation
log_info "Running quick local validation..."
if ./scripts/quick-check.sh >/dev/null 2>&1; then
  log_success "Local validation passed"
else
  log_warning "Some local checks failed (continuing anyway)"
fi

# 3. Push branch to trigger Vercel preview
log_info "Pushing to GitHub to trigger Vercel build..."
git push origin "$BRANCH_NAME" >/dev/null 2>&1
log_success "Pushed to GitHub"

# 4. Get deployment URL from Vercel API
log_info "Fetching deployment URL from Vercel API..."
echo ""

DEPLOYMENT_URL=""
DEPLOYMENT_ID=""
MAX_ATTEMPTS=30
SLEEP_TIME=5

for i in $(seq 1 $MAX_ATTEMPTS); do
  # Build API URL
  API_URL="https://api.vercel.com/v6/deployments"
  
  # Try to get deployments for this project
  RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "$API_URL" 2>/dev/null || echo "{}")
  
  # Look for deployment matching our branch
  DEPLOYMENT_DATA=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    deployments = data.get('deployments', [])
    for d in deployments:
        meta = d.get('meta', {})
        git_branch = meta.get('githubCommitRef', '')
        if git_branch == '$BRANCH_NAME':
            print(json.dumps({
                'url': d.get('url', ''),
                'id': d.get('uid', ''),
                'state': d.get('state', '')
            }))
            break
except:
    pass
" 2>/dev/null || echo "")
  
  if [[ -n "$DEPLOYMENT_DATA" ]]; then
    DEPLOYMENT_URL=$(echo "$DEPLOYMENT_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('url', ''))" 2>/dev/null || echo "")
    DEPLOYMENT_ID=$(echo "$DEPLOYMENT_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null || echo "")
    DEPLOYMENT_STATE=$(echo "$DEPLOYMENT_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('state', ''))" 2>/dev/null || echo "")
    
    if [[ -n "$DEPLOYMENT_URL" ]]; then
      # Add https:// if not present
      if [[ ! "$DEPLOYMENT_URL" =~ ^https?:// ]]; then
        DEPLOYMENT_URL="https://$DEPLOYMENT_URL"
      fi
      
      echo ""
      log_success "Found deployment!"
      log_highlight "  URL: $DEPLOYMENT_URL"
      log_highlight "  ID: $DEPLOYMENT_ID"
      log_highlight "  State: $DEPLOYMENT_STATE"
      
      # Wait for deployment to be ready
      if [[ "$DEPLOYMENT_STATE" != "READY" && "$DEPLOYMENT_STATE" != "ERROR" ]]; then
        log_info "Waiting for deployment to be ready..."
        sleep 10
      fi
      break
    fi
  fi
  
  # Show progress
  if [[ $((i % 3)) -eq 0 ]]; then
    echo -n "."
  fi
  
  if [[ $i -eq $MAX_ATTEMPTS ]]; then
    echo ""
    log_error "Timeout: Could not fetch Vercel preview URL after $((MAX_ATTEMPTS * SLEEP_TIME)) seconds"
    echo ""
    echo "Try checking manually:"
    log_highlight "  1. GitHub: https://github.com/$REPO/pulls"
    log_highlight "  2. Vercel: https://vercel.com/dashboard"
    echo ""
    exit 1
  fi
  
  sleep $SLEEP_TIME
done

echo ""

# 5. Wait a bit more for deployment to be fully ready
log_info "Ensuring deployment is fully ready..."
sleep 10

# 6. Run validation suite against staging
echo ""
echo "═══════════════════════════════════════════════════════"
echo "   🔍 Running Validation Suite"
echo "═══════════════════════════════════════════════════════"
echo ""

log_info "Target: $DEPLOYMENT_URL"
echo ""

# Export for validation script
export VERCEL_PREVIEW_URL="$DEPLOYMENT_URL"

# Run validation
if ./scripts/validate-pr.sh "$BRANCH_NAME"; then
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "   🎉 STAGING DEPLOYMENT VALIDATED SUCCESSFULLY!"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  log_success "All tests passed!"
  echo ""
  echo "Staging URL: $DEPLOYMENT_URL"
  echo ""
  echo "Next steps:"
  echo "  1. Review the staging site visually"
  echo "  2. If everything looks good, deploy to production:"
  echo ""
  log_highlight "     ./scripts/deploy-and-verify.sh $BRANCH_NAME"
  echo ""
else
  echo ""
  log_warning "Some validation checks failed"
  echo ""
  echo "Staging URL: $DEPLOYMENT_URL"
  echo ""
  echo "Review the issues above and:"
  echo "  1. Fix any problems locally"
  echo "  2. Push fixes and re-run this script"
  echo "  3. Or visit the staging site to debug"
  echo ""
fi

echo "═══════════════════════════════════════════════════════"
echo "   Deployment Complete"
echo "═══════════════════════════════════════════════════════"