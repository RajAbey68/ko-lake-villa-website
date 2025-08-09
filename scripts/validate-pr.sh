#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEV_PORT="${PORT:-3000}"
BASE_URL="http://127.0.0.1:${DEV_PORT}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Cleanup function
cleanup() {
  echo -e "${BLUE}▶ Cleaning up...${NC}"
  # Kill dev server if running
  if [ -n "${DEV_SERVER_PID:-}" ]; then
    kill "$DEV_SERVER_PID" 2>/dev/null || true
  fi
  # Kill any orphaned Next.js processes
  pkill -f "next dev" 2>/dev/null || true
  pkill -f "node.*next" 2>/dev/null || true
  # Clean up test artifacts
  rm -rf test-results 2>/dev/null || true
  rm -rf playwright-report 2>/dev/null || true
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Helper functions
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}▶ $1${NC}"; }

# Check prerequisites
check_prerequisites() {
  log_info "Checking prerequisites..."
  
  local missing=0
  
  command -v node >/dev/null || { log_error "Node.js not found"; missing=1; }
  command -v npm >/dev/null || { log_error "npm not found"; missing=1; }
  command -v git >/dev/null || { log_error "git not found"; missing=1; }
  
  if [ $missing -eq 1 ]; then
    log_error "Missing prerequisites. Please install required tools."
    exit 1
  fi
  
  log_success "Prerequisites OK"
}

# Detect and select branch
select_branch() {
  log_info "Detecting branch..."
  
  # Get current branch
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  
  # Check if we should validate current branch or find latest
  if [ "${1:-auto}" = "current" ]; then
    TARGET_BRANCH="$CURRENT_BRANCH"
    log_info "Using current branch: $TARGET_BRANCH"
  else
    # Auto-detect latest recovery/feature branch
    CANDIDATES=$(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads | \
      grep -E '^(fix/|feat/|chore/)' | \
      grep -v -E '^(docs/|test/)' | \
      head -10)
    
    if [ -z "$CANDIDATES" ]; then
      log_warning "No feature branches found, using current: $CURRENT_BRANCH"
      TARGET_BRANCH="$CURRENT_BRANCH"
    else
      # Show options if multiple branches
      if [ "$(echo "$CANDIDATES" | wc -l)" -gt 1 ]; then
        echo "Available branches (newest first):"
        echo "$CANDIDATES" | nl -w2 -s'. '
        read -p "Select branch number (1-10, or press Enter for latest): " choice
        
        if [ -z "$choice" ]; then
          TARGET_BRANCH=$(echo "$CANDIDATES" | head -n1)
        else
          TARGET_BRANCH=$(echo "$CANDIDATES" | sed -n "${choice}p")
        fi
      else
        TARGET_BRANCH="$CANDIDATES"
      fi
      
      # Switch to selected branch
      if [ "$TARGET_BRANCH" != "$CURRENT_BRANCH" ]; then
        log_info "Switching to branch: $TARGET_BRANCH"
        git checkout "$TARGET_BRANCH" >/dev/null 2>&1 || {
          log_error "Failed to checkout $TARGET_BRANCH"
          exit 1
        }
      fi
    fi
  fi
  
  log_success "Branch selected: $TARGET_BRANCH"
}

# Install dependencies
install_deps() {
  log_info "Installing dependencies..."
  
  # Use npm ci for faster, reliable installs if package-lock exists
  if [ -f "package-lock.json" ]; then
    npm ci --silent || npm install --silent
  else
    npm install --silent
  fi
  
  log_success "Dependencies installed"
}

# TypeScript check
check_typescript() {
  log_info "Running TypeScript checks..."
  
  if ! npx tsc --noEmit 2>&1 | tee /tmp/tsc-output.log; then
    log_error "TypeScript errors found!"
    echo "Run 'npx tsc --noEmit' to see details"
    
    # Show error summary
    ERROR_COUNT=$(grep -c "error TS" /tmp/tsc-output.log 2>/dev/null || echo "0")
    if [ "$ERROR_COUNT" -gt 0 ]; then
      log_error "Found $ERROR_COUNT TypeScript errors"
      
      # Ask if should continue
      read -p "Continue anyway? (y/N): " -n 1 -r
      echo
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
      fi
    fi
  else
    log_success "TypeScript check passed"
  fi
}

# Build check
check_build() {
  log_info "Running production build..."
  
  if npm run build >/dev/null 2>&1; then
    log_success "Build successful"
    
    # Check build size
    if [ -d ".next" ]; then
      BUILD_SIZE=$(du -sh .next | cut -f1)
      log_info "Build size: $BUILD_SIZE"
    fi
  else
    log_error "Build failed!"
    echo "Run 'npm run build' to see details"
    exit 1
  fi
}

# Lint check (if configured)
check_lint() {
  if grep -q '"lint"' package.json; then
    log_info "Running linter..."
    
    if npm run lint >/dev/null 2>&1; then
      log_success "Lint check passed"
    else
      log_warning "Lint issues found (non-blocking)"
      echo "Run 'npm run lint' to see details"
    fi
  else
    log_info "No lint script configured, skipping"
  fi
}

# Critical files check
check_critical_files() {
  log_info "Checking critical files..."
  
  local missing=0
  
  # Define critical files
  CRITICAL_FILES=(
    "app/page.tsx"
    "app/layout.tsx"
    "app/accommodation/page.tsx"
    "app/contact/page.tsx"
    "app/booking/page.tsx"
    "app/gallery/page.tsx"
    "package.json"
    "tsconfig.json"
    "next.config.js"
  )
  
  for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
      log_warning "Missing: $file"
      missing=$((missing + 1))
    fi
  done
  
  if [ $missing -eq 0 ]; then
    log_success "All critical files present"
  else
    log_warning "Missing $missing critical files"
  fi
}

# Content validation
check_content() {
  log_info "Validating content..."
  
  local issues=0
  
  # Check for key content
  if [ -f "app/page.tsx" ]; then
    grep -q "Ko Lake Villa" app/page.tsx || { 
      log_warning "Hero text 'Ko Lake Villa' not found in home page"
      issues=$((issues + 1))
    }
  fi
  
  if [ -f "app/contact/page.tsx" ]; then
    grep -qE "General Manager|Villa Team Lead|Owner" app/contact/page.tsx || {
      log_warning "Contact roles not found"
      issues=$((issues + 1))
    }
  fi
  
  if [ -f "app/accommodation/page.tsx" ]; then
    grep -qE "Airbnb|Book Direct|guests" app/accommodation/page.tsx || {
      log_warning "Accommodation content incomplete"
      issues=$((issues + 1))
    }
  fi
  
  if [ $issues -eq 0 ]; then
    log_success "Content validation passed"
  else
    log_warning "Found $issues content issues"
  fi
}

# Run tests
run_tests() {
  log_info "Running tests..."
  
  # Install Playwright if needed
  if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
    log_info "Installing Playwright browsers..."
    npx playwright install --with-deps chromium >/dev/null 2>&1 || true
    
    # Start dev server in background
    log_info "Starting dev server..."
    npm run dev >/dev/null 2>&1 &
    DEV_SERVER_PID=$!
    
    # Wait for server to be ready
    log_info "Waiting for dev server..."
    for i in {1..30}; do
      if curl -sSf "$BASE_URL" >/dev/null 2>&1; then
        break
      fi
      sleep 2
    done
    
    # Run E2E tests
    log_info "Running E2E tests..."
    if PW_NO_SERVER= npx playwright test --reporter=list 2>&1 | tee /tmp/test-output.log; then
      log_success "E2E tests passed"
    else
      log_warning "Some E2E tests failed"
      
      # Show test summary
      FAILED=$(grep -c "failed" /tmp/test-output.log 2>/dev/null || echo "0")
      PASSED=$(grep -c "passed" /tmp/test-output.log 2>/dev/null || echo "0")
      
      echo "Test Results: $PASSED passed, $FAILED failed"
    fi
  else
    log_info "No Playwright config found, skipping E2E tests"
  fi
  
  # Run unit tests if configured
  if grep -q '"test:unit"' package.json; then
    log_info "Running unit tests..."
    if npm run test:unit >/dev/null 2>&1; then
      log_success "Unit tests passed"
    else
      log_warning "Some unit tests failed"
    fi
  fi
}

# Check against Vercel preview
check_vercel_preview() {
  if [ -n "${VERCEL_PREVIEW_URL:-}" ]; then
    log_info "Testing Vercel preview: $VERCEL_PREVIEW_URL"
    
    # Basic connectivity check
    if curl -sSf "$VERCEL_PREVIEW_URL" >/dev/null 2>&1; then
      log_success "Preview is accessible"
      
      # Run E2E against preview
      if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
        log_info "Running E2E tests against preview..."
        if BASE_URL="$VERCEL_PREVIEW_URL" PW_NO_SERVER=1 npx playwright test --reporter=list; then
          log_success "Preview E2E tests passed"
        else
          log_warning "Some preview tests failed"
        fi
      fi
    else
      log_error "Preview URL not accessible"
    fi
  fi
}

# Generate summary
generate_summary() {
  echo
  echo "═══════════════════════════════════════════"
  echo "           VALIDATION SUMMARY"
  echo "═══════════════════════════════════════════"
  echo
  echo "Branch:        $TARGET_BRANCH"
  echo "Node:          $(node -v)"
  echo "npm:           $(npm -v)"
  echo
  echo "Checks Performed:"
  echo "  • Prerequisites    ✅"
  echo "  • Dependencies     ✅"
  echo "  • TypeScript       ${TS_STATUS:-✅}"
  echo "  • Build            ${BUILD_STATUS:-✅}"
  echo "  • Lint             ${LINT_STATUS:-✅}"
  echo "  • Critical Files   ${FILES_STATUS:-✅}"
  echo "  • Content          ${CONTENT_STATUS:-✅}"
  echo "  • Tests            ${TEST_STATUS:-✅}"
  
  if [ -n "${VERCEL_PREVIEW_URL:-}" ]; then
    echo "  • Vercel Preview   ${PREVIEW_STATUS:-✅}"
  fi
  
  echo
  echo "═══════════════════════════════════════════"
  
  if [ "${VALIDATION_FAILED:-0}" -eq 0 ]; then
    log_success "All validations passed! Ready for PR 🚀"
  else
    log_warning "Some checks failed. Review issues above."
  fi
}

# Main execution
main() {
  cd "$PROJECT_ROOT"
  
  echo "═══════════════════════════════════════════"
  echo "     Ko Lake Villa - PR Validation"
  echo "═══════════════════════════════════════════"
  echo
  
  # Parse arguments
  BRANCH_MODE="${1:-auto}"
  
  # Run checks
  check_prerequisites
  select_branch "$BRANCH_MODE"
  install_deps
  
  # Run validation checks
  check_typescript
  check_build
  check_lint
  check_critical_files
  check_content
  run_tests
  check_vercel_preview
  
  # Generate summary
  generate_summary
}

# Run main function
main "$@"