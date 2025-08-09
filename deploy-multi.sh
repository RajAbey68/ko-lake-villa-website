#!/usr/bin/env bash
set -euo pipefail

# Multi-Branch Vercel Deployment with Validation
# Deploys multiple branches in sequence and validates each

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

# Check for Vercel token
VERCEL_TOKEN="${VERCEL_TOKEN:-mg1So6oDaOdPLFf04vhpdzz2}"
if [ -z "$VERCEL_TOKEN" ]; then
  log_error "Please set VERCEL_TOKEN first:"
  echo "export VERCEL_TOKEN='your-token-here'"
  exit 1
fi

# Define branches in deployment order
BRANCHES=(
  "fix/typescript-config-and-ui-shims"       # 1. Fix build errors (CRITICAL)
  "fix/landing-hero-restore"                 # 2. Restore hero section
  "fix/recover-guestypro-home"              # 3. Full homepage + accommodation
  "fix/recover-booking-contact-from-GuestyPro" # 4. Booking/contact functionality
  "chore/add-guestypro-parity-tests"        # 5. Lock features with tests
  "feat/visual-regression-ci"               # 6. Prevent UI regressions
  "feat/validation-scripts"                  # 7. CI/CD tooling
)

# Track deployment results
declare -A DEPLOYMENT_RESULTS
declare -A DEPLOYMENT_URLS
FAILED_BRANCHES=()

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   🚀 Multi-Branch Vercel Deployment with Validation"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Branches to deploy (${#BRANCHES[@]} total):"
for i in "${!BRANCHES[@]}"; do
  echo "  $((i+1)). ${BRANCHES[$i]}"
done
echo ""

# Ask for confirmation
read -p "Deploy all branches? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  log_warning "Deployment cancelled"
  exit 0
fi

echo ""
START_TIME=$(date +%s)

# Function to validate deployment
validate_deployment() {
  local url=$1
  local branch=$2
  
  log_info "Running validation for $branch..."
  
  # Basic HTTP check
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  
  if [[ "$HTTP_STATUS" == "200" ]]; then
    log_success "HTTP check passed (200 OK)"
    
    # Check for critical content
    if curl -s "$url" | grep -q "Ko Lake Villa"; then
      log_success "Content check passed"
      return 0
    else
      log_warning "Content check failed - page might be incomplete"
      return 1
    fi
  else
    log_error "HTTP check failed (status: $HTTP_STATUS)"
    return 1
  fi
}

# Function to deploy a single branch
deploy_branch() {
  local branch=$1
  local index=$2
  local total=$3
  
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "   [$index/$total] Deploying: $branch"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  
  # Fetch and checkout
  log_info "Fetching branch..."
  if ! git fetch origin "$branch" >/dev/null 2>&1; then
    log_error "Failed to fetch branch $branch"
    DEPLOYMENT_RESULTS["$branch"]="FAILED"
    FAILED_BRANCHES+=("$branch")
    return 1
  fi
  
  log_info "Checking out branch..."
  if ! git checkout "$branch" >/dev/null 2>&1; then
    log_error "Failed to checkout branch $branch"
    DEPLOYMENT_RESULTS["$branch"]="FAILED"
    FAILED_BRANCHES+=("$branch")
    return 1
  fi
  
  # Pull latest changes
  git pull origin "$branch" >/dev/null 2>&1 || true
  
  # Install dependencies
  log_info "Installing dependencies..."
  if ! npm ci >/dev/null 2>&1 && ! npm install >/dev/null 2>&1; then
    log_warning "Dependency installation had issues"
  fi
  
  # Build locally
  log_info "Building locally..."
  if npm run build >/dev/null 2>&1; then
    log_success "Build successful"
  else
    log_error "Build failed for $branch"
    DEPLOYMENT_RESULTS["$branch"]="BUILD_FAILED"
    FAILED_BRANCHES+=("$branch")
    return 1
  fi
  
  # Push to trigger Vercel
  log_info "Pushing to GitHub..."
  git push origin "$branch" >/dev/null 2>&1
  
  # Wait for Vercel deployment
  log_info "Waiting for Vercel deployment..."
  sleep 15
  
  # Get deployment URL from Vercel API
  local deployment_url=""
  local max_attempts=15
  
  for attempt in $(seq 1 $max_attempts); do
    RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
      "https://api.vercel.com/v6/deployments?limit=5" 2>/dev/null || echo "{}")
    
    deployment_url=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for d in data.get('deployments', []):
        if d.get('meta', {}).get('githubCommitRef') == '$branch':
            state = d.get('state', '')
            if state == 'READY':
                print('https://' + d.get('url', ''))
                break
            elif state == 'ERROR':
                print('ERROR')
                break
except:
    pass
" 2>/dev/null || echo "")
    
    if [[ -n "$deployment_url" ]]; then
      if [[ "$deployment_url" == "ERROR" ]]; then
        log_error "Deployment failed on Vercel"
        DEPLOYMENT_RESULTS["$branch"]="DEPLOY_FAILED"
        FAILED_BRANCHES+=("$branch")
        return 1
      else
        break
      fi
    fi
    
    echo -n "."
    sleep 10
  done
  
  if [[ -z "$deployment_url" ]]; then
    log_warning "Timeout waiting for deployment"
    DEPLOYMENT_RESULTS["$branch"]="TIMEOUT"
    FAILED_BRANCHES+=("$branch")
    return 1
  fi
  
  echo ""
  log_success "Deployed successfully!"
  log_highlight "URL: $deployment_url"
  
  DEPLOYMENT_URLS["$branch"]="$deployment_url"
  
  # Validate deployment
  echo ""
  if validate_deployment "$deployment_url" "$branch"; then
    log_success "Validation passed!"
    DEPLOYMENT_RESULTS["$branch"]="SUCCESS"
  else
    log_warning "Validation had issues"
    DEPLOYMENT_RESULTS["$branch"]="VALIDATION_WARNING"
  fi
  
  return 0
}

# Main deployment loop
for i in "${!BRANCHES[@]}"; do
  branch="${BRANCHES[$i]}"
  deploy_branch "$branch" "$((i+1))" "${#BRANCHES[@]}"
done

# Calculate elapsed time
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

# Final summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   📊 DEPLOYMENT SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Time elapsed: ${MINUTES}m ${SECONDS}s"
echo ""

# Show results
echo "Results:"
echo "--------"
for branch in "${BRANCHES[@]}"; do
  result="${DEPLOYMENT_RESULTS[$branch]:-SKIPPED}"
  url="${DEPLOYMENT_URLS[$branch]:-N/A}"
  
  case "$result" in
    SUCCESS)
      echo -e "${GREEN}✅${NC} $branch"
      echo "   URL: $url"
      ;;
    VALIDATION_WARNING)
      echo -e "${YELLOW}⚠️${NC}  $branch (validation warning)"
      echo "   URL: $url"
      ;;
    BUILD_FAILED)
      echo -e "${RED}❌${NC} $branch (build failed)"
      ;;
    DEPLOY_FAILED)
      echo -e "${RED}❌${NC} $branch (deploy failed)"
      ;;
    TIMEOUT)
      echo -e "${YELLOW}⏱️${NC}  $branch (timeout)"
      ;;
    FAILED)
      echo -e "${RED}❌${NC} $branch (failed)"
      ;;
    *)
      echo -e "⏭️  $branch (skipped)"
      ;;
  esac
done

echo ""

# Show successful deployments
SUCCESSFUL_COUNT=0
for branch in "${BRANCHES[@]}"; do
  if [[ "${DEPLOYMENT_RESULTS[$branch]}" == "SUCCESS" ]] || [[ "${DEPLOYMENT_RESULTS[$branch]}" == "VALIDATION_WARNING" ]]; then
    ((SUCCESSFUL_COUNT++))
  fi
done

if [[ $SUCCESSFUL_COUNT -gt 0 ]]; then
  echo "═══════════════════════════════════════════════════════════════"
  echo "   ✅ Successfully Deployed: $SUCCESSFUL_COUNT/${#BRANCHES[@]} branches"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "Staging URLs:"
  echo "-------------"
  for branch in "${BRANCHES[@]}"; do
    if [[ -n "${DEPLOYMENT_URLS[$branch]:-}" ]]; then
      echo "$branch:"
      log_highlight "  ${DEPLOYMENT_URLS[$branch]}"
    fi
  done
fi

# Show failures
if [[ ${#FAILED_BRANCHES[@]} -gt 0 ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo "   ⚠️  Failed Deployments: ${#FAILED_BRANCHES[@]}"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "Failed branches:"
  for branch in "${FAILED_BRANCHES[@]}"; do
    echo "  - $branch"
  done
  echo ""
  echo "To retry failed branches, run:"
  echo "  ./deploy-branch.sh <branch-name>"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [[ $SUCCESSFUL_COUNT -eq ${#BRANCHES[@]} ]]; then
  log_success "🎉 All branches deployed successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Review each staging URL"
  echo "2. Run comprehensive validation:"
  echo "   for url in ${DEPLOYMENT_URLS[@]}; do"
  echo "     VERCEL_PREVIEW_URL=\$url ./scripts/validate-pr.sh"
  echo "   done"
  echo "3. If all pass, deploy to production"
else
  log_warning "Some deployments need attention"
  echo ""
  echo "Review the failed branches and fix any issues before proceeding."
fi

echo ""
log_success "Deployment sequence complete! 🚀"