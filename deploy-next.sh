#!/usr/bin/env bash
set -euo pipefail

# Quick deployment for the next critical branches
# Deploys only the UI restoration branches

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }
log_highlight() { echo -e "${CYAN}$1${NC}"; }

# Set token
VERCEL_TOKEN="${VERCEL_TOKEN:-mg1So6oDaOdPLFf04vhpdzz2}"
export VERCEL_TOKEN

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   🚀 Quick Deploy: Next Critical Branches"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check what's already deployed
log_info "Checking current deployments..."
DEPLOYED_URLS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?limit=10" 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
deployed = {}
for d in data.get('deployments', []):
    branch = d.get('meta', {}).get('githubCommitRef', '')
    if branch and d.get('state') == 'READY':
        if branch not in deployed:
            deployed[branch] = 'https://' + d.get('url', '')
for b, u in deployed.items():
    print(f'{b}|{u}')
" 2>/dev/null || echo "")

echo "Already deployed:"
echo "$DEPLOYED_URLS" | while IFS='|' read -r branch url; do
  if [[ -n "$branch" ]]; then
    echo "  ✅ $branch"
  fi
done

echo ""

# Define next branches to deploy
NEXT_BRANCHES=(
  "fix/recover-guestypro-home"
  "fix/recover-booking-contact-from-GuestyPro"
)

echo "Will deploy:"
for branch in "${NEXT_BRANCHES[@]}"; do
  echo "  🔸 $branch"
done
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi

# Deploy each branch
for branch in "${NEXT_BRANCHES[@]}"; do
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  log_info "Deploying: $branch"
  echo "═══════════════════════════════════════════════════════════════"
  
  # Use the existing deploy-branch script
  if [[ -f "./deploy-branch.sh" ]]; then
    ./deploy-branch.sh "$branch"
  else
    # Fallback to direct deployment
    git fetch origin "$branch" >/dev/null 2>&1
    git checkout "$branch" >/dev/null 2>&1
    git pull origin "$branch" >/dev/null 2>&1
    
    log_info "Building..."
    if npm run build >/dev/null 2>&1; then
      log_success "Build passed"
    else
      echo "⚠️  Build has issues but continuing..."
    fi
    
    log_info "Pushing to trigger deployment..."
    git push origin "$branch" >/dev/null 2>&1
    
    echo "⏳ Deployment triggered. Check status in ~2 minutes"
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   ✅ Deployments Triggered"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Check deployment status:"
log_highlight "  https://vercel.com/dashboard"
echo ""
echo "Or run this to see URLs:"
echo "  curl -s -H \"Authorization: Bearer \$VERCEL_TOKEN\" \\"
echo "    \"https://api.vercel.com/v6/deployments?limit=5\" | jq '.deployments[] | {branch: .meta.githubCommitRef, url: .url, state: .state}'"
echo ""
log_success "Done! 🎉"