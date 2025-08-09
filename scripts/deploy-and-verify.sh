#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROD_BRANCH="main"
DEPLOY_BRANCH="${1:-}"
VERCEL_PROJECT="${VERCEL_PROJECT:-ko-lake-villa-website}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
SKIP_MERGE="${SKIP_MERGE:-false}"
DRY_RUN="${DRY_RUN:-false}"

# Helper functions
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }

# Show usage
usage() {
  cat << EOF
Usage: $0 [branch-name] [options]

Deploy and verify a branch to production via Vercel

Arguments:
  branch-name    Branch to deploy (optional, will show menu if not provided)

Options:
  --skip-merge   Skip the merge step (useful if already merged)
  --dry-run      Show what would be done without executing
  --help         Show this help message

Environment Variables:
  VERCEL_TOKEN   Your Vercel API token (required)
  VERCEL_PROJECT Project name on Vercel (default: ko-lake-villa-website)

Example:
  export VERCEL_TOKEN="your-token"
  $0 fix/landing-hero-restore
  $0 --skip-merge  # Just deploy and verify current main
EOF
  exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-merge)
      SKIP_MERGE=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help|-h)
      usage
      ;;
    *)
      if [[ -z "$DEPLOY_BRANCH" ]]; then
        DEPLOY_BRANCH="$1"
      fi
      shift
      ;;
  esac
done

# Check prerequisites
check_prerequisites() {
  log_info "Checking prerequisites..."
  
  local missing=0
  
  # Check required tools
  command -v git >/dev/null || { log_error "git not found"; missing=1; }
  command -v curl >/dev/null || { log_error "curl not found"; missing=1; }
  command -v jq >/dev/null || { log_error "jq not found (install with: apt-get install jq)"; missing=1; }
  
  # Check Vercel token
  if [[ -z "$VERCEL_TOKEN" ]]; then
    log_error "VERCEL_TOKEN not set. Please export VERCEL_TOKEN='your-token'"
    echo "Get your token from: https://vercel.com/account/tokens"
    missing=1
  fi
  
  # Check validation scripts exist
  if [[ ! -f "./scripts/quick-check.sh" ]]; then
    log_error "Validation scripts not found. Are you in the project root?"
    missing=1
  fi
  
  if [[ $missing -eq 1 ]]; then
    exit 1
  fi
  
  log_success "Prerequisites OK"
}

# Select branch to deploy
select_branch() {
  if [[ -n "$DEPLOY_BRANCH" ]]; then
    log_info "Using specified branch: $DEPLOY_BRANCH"
    return
  fi
  
  log_info "Fetching available branches..."
  git fetch origin --prune >/dev/null 2>&1
  
  # Recommended merge order
  RECOMMENDED_BRANCHES=(
    "fix/typescript-config-and-ui-shims"
    "fix/landing-hero-restore"
    "chore/add-guestypro-parity-tests"
    "feat/visual-regression-ci"
    "feat/validation-scripts"
  )
  
  echo ""
  echo "Recommended merge sequence:"
  echo "──────────────────────────────"
  
  local i=1
  for branch in "${RECOMMENDED_BRANCHES[@]}"; do
    # Check if branch exists
    if git show-ref --verify --quiet "refs/remotes/origin/$branch"; then
      echo "$i. $branch ✅"
    else
      echo "$i. $branch ❌ (not found or already merged)"
    fi
    ((i++))
  done
  
  echo ""
  read -p "Select branch number (1-5) or press Enter to skip merge: " choice
  
  if [[ -z "$choice" ]]; then
    SKIP_MERGE=true
    DEPLOY_BRANCH="$PROD_BRANCH"
  else
    if [[ $choice -ge 1 && $choice -le 5 ]]; then
      DEPLOY_BRANCH="${RECOMMENDED_BRANCHES[$((choice-1))]}"
    else
      log_error "Invalid selection"
      exit 1
    fi
  fi
  
  log_info "Selected: $DEPLOY_BRANCH"
}

# Merge branch into production
merge_branch() {
  if [[ "$SKIP_MERGE" == "true" ]]; then
    log_info "Skipping merge step"
    return
  fi
  
  log_info "Preparing to merge $DEPLOY_BRANCH into $PROD_BRANCH..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_warning "DRY RUN: Would merge $DEPLOY_BRANCH into $PROD_BRANCH"
    return
  fi
  
  # Ensure we have latest changes
  git fetch origin
  
  # Check out and update deploy branch
  log_info "Checking out $DEPLOY_BRANCH..."
  git checkout "$DEPLOY_BRANCH"
  git pull origin "$DEPLOY_BRANCH"
  
  # Run quick validation on branch
  log_info "Running quick validation on $DEPLOY_BRANCH..."
  if ! ./scripts/quick-check.sh; then
    log_error "Branch validation failed! Fix issues before deploying."
    exit 1
  fi
  
  # Switch to production branch
  log_info "Switching to $PROD_BRANCH..."
  git checkout "$PROD_BRANCH"
  git pull origin "$PROD_BRANCH"
  
  # Perform merge
  log_info "Merging $DEPLOY_BRANCH..."
  git merge --no-ff "$DEPLOY_BRANCH" -m "Deploy: Merge $DEPLOY_BRANCH into $PROD_BRANCH

- Automated deployment via deploy-and-verify.sh
- Branch validated before merge
- Will trigger Vercel production deployment"
  
  # Push to GitHub
  log_info "Pushing to GitHub..."
  git push origin "$PROD_BRANCH"
  
  log_success "Merge complete"
}

# Trigger Vercel deployment
trigger_vercel_deploy() {
  log_info "Triggering Vercel deployment..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    log_warning "DRY RUN: Would trigger Vercel deployment"
    return
  fi
  
  # Get latest deployment info
  local LATEST_DEPLOY=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v9/projects/$VERCEL_PROJECT/deployments?limit=1" | \
    jq -r '.deployments[0].url // empty')
  
  if [[ -n "$LATEST_DEPLOY" ]]; then
    log_info "Latest deployment: https://$LATEST_DEPLOY"
  fi
  
  # Trigger new deployment with cache clear
  log_info "Creating new deployment with cache clear..."
  
  local RESPONSE=$(curl -s -X POST "https://api.vercel.com/v13/deployments" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$VERCEL_PROJECT\",
      \"target\": \"production\",
      \"gitSource\": {
        \"type\": \"github\",
        \"ref\": \"$PROD_BRANCH\"
      },
      \"forceNew\": true
    }")
  
  DEPLOY_ID=$(echo "$RESPONSE" | jq -r '.id // empty')
  DEPLOY_URL=$(echo "$RESPONSE" | jq -r '.url // empty')
  
  if [[ -z "$DEPLOY_ID" || "$DEPLOY_ID" == "null" ]]; then
    log_error "Failed to trigger deployment"
    echo "Response: $RESPONSE"
    exit 1
  fi
  
  log_success "Deployment triggered: $DEPLOY_ID"
  echo "URL will be: https://$DEPLOY_URL"
}

# Wait for deployment to complete
wait_for_deployment() {
  if [[ "$DRY_RUN" == "true" || -z "${DEPLOY_ID:-}" ]]; then
    return
  fi
  
  log_info "Waiting for deployment to complete..."
  
  local MAX_WAIT=600  # 10 minutes
  local ELAPSED=0
  local INTERVAL=10
  
  while [[ $ELAPSED -lt $MAX_WAIT ]]; do
    local STATUS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
      "https://api.vercel.com/v13/deployments/$DEPLOY_ID" | \
      jq -r '.readyState // empty')
    
    case "$STATUS" in
      "READY")
        log_success "Deployment complete!"
        echo "Production URL: https://$DEPLOY_URL"
        break
        ;;
      "ERROR"|"CANCELED")
        log_error "Deployment failed with status: $STATUS"
        exit 1
        ;;
      *)
        echo -n "."
        sleep $INTERVAL
        ELAPSED=$((ELAPSED + INTERVAL))
        ;;
    esac
  done
  
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    log_error "Deployment timed out after ${MAX_WAIT} seconds"
    exit 1
  fi
}

# Run validation against production
validate_production() {
  if [[ "$DRY_RUN" == "true" ]]; then
    log_warning "DRY RUN: Would validate production deployment"
    return
  fi
  
  log_info "Running validation against production..."
  
  # Quick check first
  log_info "Running quick check..."
  if ! ./scripts/quick-check.sh; then
    log_warning "Quick check failed - review issues"
  fi
  
  # Full validation against production URL
  if [[ -n "${DEPLOY_URL:-}" ]]; then
    log_info "Running full validation against https://$DEPLOY_URL..."
    
    export VERCEL_PREVIEW_URL="https://$DEPLOY_URL"
    
    if ./scripts/validate-pr.sh current; then
      log_success "Production validation passed!"
    else
      log_warning "Some validation checks failed - review above"
    fi
  fi
}

# Generate deployment summary
generate_summary() {
  echo ""
  echo "═══════════════════════════════════════════"
  echo "         DEPLOYMENT SUMMARY"
  echo "═══════════════════════════════════════════"
  echo ""
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Mode:          DRY RUN (no changes made)"
  else
    echo "Mode:          PRODUCTION DEPLOYMENT"
  fi
  
  echo "Branch:        $DEPLOY_BRANCH"
  echo "Merged:        $([ "$SKIP_MERGE" == "true" ] && echo "No (skipped)" || echo "Yes")"
  
  if [[ -n "${DEPLOY_URL:-}" ]]; then
    echo "Production:    https://$DEPLOY_URL"
    echo "Status:        ✅ Deployed"
  fi
  
  echo ""
  echo "═══════════════════════════════════════════"
  
  if [[ "$DRY_RUN" != "true" && -n "${DEPLOY_URL:-}" ]]; then
    echo ""
    log_success "Deployment complete! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Visit https://$DEPLOY_URL to verify visually"
    echo "2. Run remaining branches through this script"
    echo "3. After all merges, update visual baselines:"
    echo "   npm run test:visual:update"
  fi
}

# Main execution
main() {
  echo "═══════════════════════════════════════════"
  echo "     Ko Lake Villa - Deploy & Verify"
  echo "═══════════════════════════════════════════"
  echo ""
  
  # Run checks
  check_prerequisites
  select_branch
  
  # Execute deployment steps
  merge_branch
  trigger_vercel_deploy
  wait_for_deployment
  validate_production
  
  # Show summary
  generate_summary
}

# Run main function
main