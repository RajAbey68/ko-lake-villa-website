# 🚀 Deployment Checklist - Ko Lake Villa Website

## 📋 Pre-Deployment Requirements

### ✅ Prerequisites
- [ ] Vercel account with project configured
- [ ] GitHub repository access
- [ ] All 8 branches pushed to GitHub
- [ ] Vercel API token obtained from https://vercel.com/account/tokens
- [ ] `jq` installed (`sudo apt-get install jq` or `brew install jq`)

### 🔑 Setup
```bash
# Set your Vercel token
export VERCEL_TOKEN="your-vercel-token-here"

# Make scripts executable
chmod +x scripts/*.sh
```

---

## 🎯 Safe Merge Sequence

### Phase 1: Critical Fixes (Do First)

#### 1️⃣ **TypeScript Configuration Fix**
```bash
./scripts/deploy-and-verify.sh fix/typescript-config-and-ui-shims
```
**Why first**: Fixes build errors that block other branches

#### 2️⃣ **Hero Landing Page**
```bash
./scripts/deploy-and-verify.sh fix/landing-hero-restore
```
**Why second**: Restores main UI that users see first

#### 3️⃣ **Test Suite**
```bash
./scripts/deploy-and-verify.sh chore/add-guestypro-parity-tests
```
**Why third**: Locks in requirements before adding more features

### Phase 2: Enhancement Features

#### 4️⃣ **Visual Regression**
```bash
./scripts/deploy-and-verify.sh feat/visual-regression-ci
```
**After merge**: Run `npm run test:visual:update` to capture baselines

#### 5️⃣ **Validation Scripts**
```bash
./scripts/deploy-and-verify.sh feat/validation-scripts
```
**Benefit**: Future deployments will be validated automatically

### Phase 3: Optional Recovery Branches

#### 6️⃣ **Other Recovery Branches** (if needed)
```bash
# Review and merge as needed
./scripts/deploy-and-verify.sh fix/recover-booking-contact-from-GuestyPro
./scripts/deploy-and-verify.sh fix/recover-guestypro-home
```

---

## 📝 Manual Deployment Process (Alternative)

If you prefer manual control over each step:

### For Each Branch:

1. **Create PR on GitHub**
   ```bash
   # Example for first branch
   https://github.com/RajAbey68/ko-lake-villa-website/pull/new/fix/typescript-config-and-ui-shims
   ```

2. **Wait for Vercel Preview**
   - Vercel bot will comment with preview URL
   - Usually takes 2-3 minutes

3. **Validate Preview**
   ```bash
   VERCEL_PREVIEW_URL=https://preview-url.vercel.app ./scripts/validate-pr.sh
   ```

4. **Merge PR**
   - Click "Merge pull request" on GitHub
   - Use "Create a merge commit" (not squash)

5. **Verify Production**
   ```bash
   ./scripts/quick-check.sh
   ```

---

## 🔄 Post-Deployment Tasks

### After All Merges Complete:

1. **Update Visual Baselines**
   ```bash
   npm run test:visual:update
   git add tests/visual/screenshots
   git commit -m "chore: update visual regression baselines"
   git push origin main
   ```

2. **Replace Media Files**
   - Upload `public/videos/pool.mp4` (actual villa video)
   - Upload `public/images/yoga-sala.gif` (actual GIF)

3. **Clear Vercel Cache**
   - Go to Vercel Dashboard
   - Project Settings → Functions
   - Click "Purge Cache"

4. **Final Production Check**
   ```bash
   # Full validation against production
   VERCEL_PREVIEW_URL=https://ko-lake-villa-website.vercel.app ./scripts/validate-pr.sh
   ```

5. **Enable Branch Protection**
   - GitHub → Settings → Branches
   - Add rule for `main`
   - Require PR reviews
   - Require status checks

---

## 🛠️ Deployment Script Options

### Basic Usage
```bash
# Deploy specific branch
./scripts/deploy-and-verify.sh fix/landing-hero-restore

# Interactive mode (shows menu)
./scripts/deploy-and-verify.sh

# Skip merge (just deploy current main)
./scripts/deploy-and-verify.sh --skip-merge

# Dry run (preview without executing)
./scripts/deploy-and-verify.sh --dry-run fix/landing-hero-restore
```

### Environment Variables
```bash
# Required
export VERCEL_TOKEN="your-token"

# Optional
export VERCEL_PROJECT="ko-lake-villa-website"  # Default
export DRY_RUN=true                            # Test mode
export SKIP_MERGE=true                         # Skip git merge
```

---

## ⚠️ Troubleshooting

### Common Issues:

#### Vercel Token Invalid
```bash
# Get new token from
https://vercel.com/account/tokens

# Set it
export VERCEL_TOKEN="new-token"
```

#### Build Failures
```bash
# Check TypeScript
npx tsc --noEmit

# Check build locally
npm run build
```

#### Merge Conflicts
```bash
# Resolve locally
git checkout main
git pull origin main
git merge --no-ff branch-name

# Fix conflicts, then
git add .
git commit
git push origin main
```

#### Deployment Stuck
```bash
# Check Vercel dashboard
https://vercel.com/dashboard

# Cancel and retry
./scripts/deploy-and-verify.sh --skip-merge
```

---

## 📊 Validation Matrix

Each deployment runs these checks:

| Check | Local | Preview | Production |
|-------|-------|---------|------------|
| TypeScript | ✅ | ✅ | ✅ |
| Build | ✅ | ✅ | ✅ |
| Critical Files | ✅ | ✅ | ✅ |
| Content | ✅ | ✅ | ✅ |
| E2E Tests | ✅ | ✅ | ✅ |
| Visual Tests | ❌ | ✅ | ✅ |

---

## ✅ Success Criteria

Deployment is successful when:

- [ ] All branches merged to main
- [ ] Production site loads without errors
- [ ] Quick check passes (`./scripts/quick-check.sh`)
- [ ] Visual regression baselines updated
- [ ] Media files replaced with actual content
- [ ] All tests passing in CI

---

## 🎉 Final Verification

After everything is deployed:

```bash
# Run comprehensive check
./scripts/validate-pr.sh current

# Check production manually
open https://ko-lake-villa-website.vercel.app
```

### Visual Checklist:
- [ ] Hero section with video/GIF visible
- [ ] Room cards showing correct prices
- [ ] Contact page has all phone numbers
- [ ] Booking form functional
- [ ] Gallery images loading
- [ ] Mobile responsive layout works

---

## 📞 Support

If you encounter issues:

1. Check the [Vercel Dashboard](https://vercel.com/dashboard) for deployment logs
2. Review [GitHub Actions](https://github.com/RajAbey68/ko-lake-villa-website/actions) for CI status
3. Run `./scripts/quick-check.sh` to identify local issues
4. Check branch protection rules if pushes are blocked

---

**Ready to deploy? Start with step 1 of the safe merge sequence!** 🚀