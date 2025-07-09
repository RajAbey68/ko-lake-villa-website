# Ko Lake Villa - Testing Documentation

This directory contains the comprehensive testing suite for Ko Lake Villa to ensure quality deployments and prevent regression issues.

## 🚀 Quick Start

### Pre-Deployment Testing (Recommended)
```bash
# Run quick pre-deployment tests
npm run test:quick

# Run comprehensive test suite
npm run test:full

# Or use the unified test runner directly
node scripts/test-runner.js quick
node scripts/test-runner.js full
```

## 📋 Test Categories

### 1. Pre-Deployment Tests
**Purpose:** Critical tests that must pass before deployment
**Command:** `npm run test:predeployment`
**File:** `scripts/pre-deployment-tests.js`

**Coverage:**
- ✅ Build validation
- ✅ TypeScript compilation
- ✅ Component integrity
- ✅ Asset verification
- ✅ Configuration validation
- ✅ Brand compliance
- ✅ Performance checks
- ✅ Regression prevention
- ✅ Deployment readiness

### 2. Visual Regression Tests
**Purpose:** UI consistency and visual change detection
**Command:** `npm run test:visual`
**File:** `scripts/visual-regression-tests.js`

**Coverage:**
- 📱 Responsive design validation
- ♿ Accessibility checks
- 🎨 Brand consistency
- 📸 Visual screenshot generation

### 3. Integration Tests
**Purpose:** End-to-end functionality testing
**Command:** `npm run test:integration`
**File:** `tests/integration-tests.spec.js`

**Coverage:**
- 🖼️ Gallery functionality (critical regression test)
- 📱 WhatsApp integration
- 🧭 Navigation flow
- 📱 Responsive behavior
- ⚡ Performance validation
- 🔄 Regression prevention

### 4. Manual Testing
**Purpose:** Human verification checklist
**Command:** `npm run test:manual`
**File:** `tests/manual-test-checklist.md`

**Coverage:**
- Detailed step-by-step testing
- Cross-browser compatibility
- User experience validation
- Brand compliance verification

## 🛠️ Setup Instructions

### Basic Setup (No additional dependencies)
```bash
# Pre-deployment and visual tests work out of the box
npm run test:quick
```

### Full Setup (With Playwright for integration tests)
```bash
# Install Playwright for integration testing
npm install -D @playwright/test

# Install browser binaries
npx playwright install

# Run full test suite
npm run test:full
```

## 📊 Test Results

### Test Reports
- **Pre-deployment:** `pre-deployment-report.json`
- **Integration:** `test-results/` directory
- **Visual:** `tests/visual-regression.spec.js` (generated)

### Exit Codes
- `0` - All tests passed or warnings only
- `1` - Critical test failures (deployment not recommended)

## 🔄 Regression Prevention

### Known Issues Tested
1. **Gallery Loading Issue** *(Fixed)*
   - Tests for infinite loading spinners
   - Validates static data usage (no API dependencies)
   - Ensures page loads within 5 seconds

2. **Package Manager Conflicts** *(Fixed)*
   - Checks for pnpm-lock.yaml (should not exist)
   - Validates npm package-lock.json presence
   - Tests clean build process

3. **Icon Import Errors** *(Fixed)*
   - Validates Lucide icon imports
   - Tests for missing component errors
   - Checks console for import failures

## 📱 Responsive Testing

### Viewports Tested
- **Mobile:** 375x667 (iPhone SE)
- **Tablet:** 768x1024 (iPad)
- **Desktop:** 1920x1080 (HD)

### Browser Coverage
- Chromium/Chrome
- Firefox
- WebKit/Safari
- Mobile Chrome
- Mobile Safari

## 🎨 Brand Compliance

### Color Validation
- ✅ **Allowed:** amber-, orange-, gray-, white, black
- ❌ **Prohibited:** blue-, green-, purple-, red-
- 🎯 **Required:** amber-600, amber-700, amber-800

### Brand Elements
- Ko Lake Villa name
- "Relax, Revive, Connect" tagline
- WhatsApp number: +94711730345
- WhatsApp link format: wa.me/94711730345

## 🚨 Critical Tests

### Must Pass Before Deployment
1. **Build Tests** - Clean build without errors
2. **TypeScript Compilation** - No type errors
3. **Component Tests** - All critical components exist
4. **Gallery Regression** - No infinite loading
5. **Brand Compliance** - Correct colors and branding

### Warning Tests (Non-blocking)
1. **ESLint** - Code quality issues
2. **Performance** - Page size optimization
3. **Placeholder Usage** - Image replacements needed
4. **Environment Variables** - Security checks

## 🎯 Usage Examples

### Before Every Deployment
```bash
# Quick validation (2-3 minutes)
npm run test:quick
```

### Weekly Quality Assurance
```bash
# Comprehensive testing (5-10 minutes)
npm run test:full
```

### After Major Changes
```bash
# Individual test categories
npm run test:predeployment
npm run test:visual
npm run test:integration

# Plus manual checklist
npm run test:manual
```

### Emergency Hotfix Validation
```bash
# Minimal critical tests
npm run build
npm run test:predeployment
```

## 🔧 Customization

### Adding New Tests
1. **Pre-deployment:** Edit `scripts/pre-deployment-tests.js`
2. **Integration:** Add to `tests/integration-tests.spec.js`
3. **Manual:** Update `tests/manual-test-checklist.md`

### Test Configuration
- **Playwright:** `playwright.config.js`
- **Test Runner:** `scripts/test-runner.js`

## 📞 Support

### Test Issues
1. Check the detailed test reports
2. Review the manual checklist
3. Run individual test categories to isolate issues
4. Verify all dependencies are installed

### Common Fixes
```bash
# Clean build issues
rm -rf .next node_modules package-lock.json
npm install
npm run build

# Playwright issues
npx playwright install
npx playwright test --debug

# TypeScript issues
npx tsc --noEmit
```

## 🎉 Success Criteria

### Ready for Deployment
- ✅ All critical tests passing
- ✅ No build errors
- ✅ Gallery loads correctly
- ✅ Brand compliance validated
- ✅ Manual checklist completed

### 📈 Continuous Improvement
- Add tests for new features
- Update regression tests for fixed issues
- Expand browser coverage as needed
- Enhance performance benchmarks

---

**Remember:** Testing prevents the headaches of broken deployments. Better to catch issues locally than in production! 🛡️ 