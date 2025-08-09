#!/usr/bin/env bash
set -euo pipefail

# Unified Vercel Staging Deployment Script
# Usage: ./deploy-branch.sh [branch-name]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }
log_highlight() { echo -e "${CYAN}$1${NC}"; }
log_branch() { echo -e "${MAGENTA}🌿 $1${NC}"; }

# Configuration
BRANCH="${1:-}"
VERCEL_TOKEN="${VERCEL_TOKEN:-mg1So6oDaOdPLFf04vhpdzz2}"
REPO="RajAbey68/ko-lake-villa-website"

# Recommended deployment order
DEPLOYMENT_ORDER=(
  "fix/typescript-config-and-ui-shims"
  "fix/landing-hero-restore"
  "fix/recover-guestypro-home"
  "fix/recover-booking-contact-from-GuestyPro"
  "chore/add-guestypro-parity-tests"
  "feat/visual-regression-ci"
  "feat/validation-scripts"
)

# Show header
echo ""
echo "═══════════════════════════════════════════════════════"
echo "   🚀 Unified Vercel Staging Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if branch provided
if [[ -z "$BRANCH" ]]; then
  echo "Recommended deployment order:"
  echo ""
  for i in "${!DEPLOYMENT_ORDER[@]}"; do
    num=$((i + 1))
    branch="${DEPLOYMENT_ORDER[$i]}"
    # Check if branch exists locally
    if git show-ref --verify --quiet "refs/remotes/origin/$branch" 2>/dev/null; then
      status="✅ Available"
    else
      status="❌ Not found"
    fi
    echo "  $num. $branch $status"
  done
  echo ""
  read -p "Enter branch number (1-7) or branch name: " choice
  
  if [[ "$choice" =~ ^[1-7]$ ]]; then
    BRANCH="${DEPLOYMENT_ORDER[$((choice - 1))]}"
  else
    BRANCH="$choice"
  fi
fi

log_branch "Deploying branch: $BRANCH"
echo ""

# Step 1: Fetch and checkout branch
log_info "Fetching latest from GitHub..."
git fetch origin >/dev/null 2>&1

log_info "Checking out $BRANCH..."
if ! git checkout "$BRANCH" 2>/dev/null; then
  log_error "Branch '$BRANCH' not found!"
  echo "Available branches:"
  git branch -r | grep -E "fix/|feat/|chore/" | sed 's/origin\///' | sort -u
  exit 1
fi

# Step 2: Pull latest changes
log_info "Pulling latest changes..."
git pull origin "$BRANCH" >/dev/null 2>&1 || true

# Step 3: Quick local validation
log_info "Running quick build check..."
if npm run build >/dev/null 2>&1; then
  log_success "Build passes locally"
else
  log_warning "Build has issues - continuing anyway"
fi

# Step 4: Push to trigger Vercel
log_info "Pushing to GitHub to trigger Vercel deployment..."
git push origin "$BRANCH" >/dev/null 2>&1
log_success "Pushed successfully"

# Step 5: Wait and fetch deployment URL
log_info "Waiting for Vercel to start deployment..."
sleep 10

echo ""
log_info "Fetching deployment status from Vercel API..."
echo ""

MAX_ATTEMPTS=20
DEPLOYMENT_URL=""

for i in $(seq 1 $MAX_ATTEMPTS); do
  # Get latest deployments
  RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v6/deployments?limit=5" 2>/dev/null || echo "{}")
  
  # Find deployment for our branch
  DEPLOYMENT_INFO=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for d in data.get('deployments', []):
        if d.get('meta', {}).get('githubCommitRef') == '$BRANCH':
            print(f\"{d.get('url', '')}|{d.get('state', '')}|{d.get('uid', '')}\")
            break
except:
    pass
" 2>/dev/null || echo "")
  
  if [[ -n "$DEPLOYMENT_INFO" ]]; then
    IFS='|' read -r url state id <<< "$DEPLOYMENT_INFO"
    
    if [[ -n "$url" ]]; then
      DEPLOYMENT_URL="https://$url"
      
      echo "  📦 Deployment found!"
      log_highlight "  URL: $DEPLOYMENT_URL"
      log_highlight "  State: $state"
      log_highlight "  ID: $id"
      
      if [[ "$state" == "READY" ]]; then
        echo ""
        log_success "Deployment ready!"
        break
      elif [[ "$state" == "ERROR" ]]; then
        echo ""
        log_error "Deployment failed!"
        echo "Check Vercel dashboard for details: https://vercel.com/dashboard"
        exit 1
      else
        echo ""
        log_info "Deployment still building... waiting..."
        sleep 15
      fi
    fi
  else
    echo -n "."
    sleep 5
  fi
  
  if [[ $i -eq $MAX_ATTEMPTS ]]; then
    echo ""
    log_warning "Timeout waiting for deployment"
    echo "Check manually at: https://vercel.com/dashboard"
    exit 1
  fi
done

# Step 6: Final summary
echo ""
echo "═══════════════════════════════════════════════════════"
echo "   ✅ STAGING DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════════"
echo ""
log_success "Branch deployed: $BRANCH"
echo ""
echo "🌐 Staging URL:"
log_highlight "   $DEPLOYMENT_URL"
echo ""
echo "📋 Next steps:"
echo "   1. Open the URL and verify visually"
echo "   2. Check for console errors (F12)"
echo "   3. Test key functionality"
echo ""

# Show what's next in sequence
current_index=-1
for i in "${!DEPLOYMENT_ORDER[@]}"; do
  if [[ "${DEPLOYMENT_ORDER[$i]}" == "$BRANCH" ]]; then
    current_index=$i
    break
  fi
done

if [[ $current_index -ge 0 && $current_index -lt $((${#DEPLOYMENT_ORDER[@]} - 1)) ]]; then
  next_branch="${DEPLOYMENT_ORDER[$((current_index + 1))]}"
  echo "📍 Next branch in sequence:"
  log_branch "   $next_branch"
  echo ""
  echo "   Deploy it with:"
  log_highlight "   ./deploy-branch.sh $next_branch"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Open URL in browser if available
if command -v open >/dev/null 2>&1; then
  read -p "Open in browser? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$DEPLOYMENT_URL"
  fi
elif command -v xdg-open >/dev/null 2>&1; then
  read -p "Open in browser? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    xdg-open "$DEPLOYMENT_URL"
  fi
fi

log_success "Done! 🎉"