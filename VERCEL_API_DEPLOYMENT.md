# 🚀 **Automated Vercel Staging with API Integration**

## ✨ **NEW: Complete Automation with Vercel API**

No more waiting for GitHub PR comments! This script:
- ✅ Pushes your branch to GitHub
- ✅ Automatically fetches the Vercel preview URL via API
- ✅ Runs full validation suite against staging
- ✅ Reports results immediately

---

## 🎯 **Quick Start**

### **Step 1: Get Your Vercel Token**

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "Ko Lake Villa Deployment"
4. Copy the token (starts with `vc_`)

### **Step 2: Set Token & Deploy**

```bash
# Set your token (one time)
export VERCEL_TOKEN="vc_your_token_here"

# Deploy any branch to staging
./scripts/deploy-staging-auto.sh fix/landing-hero-restore
```

That's it! The script handles everything else automatically.

---

## 📊 **What the Script Does**

```
1. Updates branch from GitHub
   ↓
2. Runs quick local validation
   ↓
3. Pushes to trigger Vercel build
   ↓
4. Polls Vercel API for deployment URL
   ↓
5. Waits for deployment to be ready
   ↓
6. Runs full validation suite
   ↓
7. Reports pass/fail status
```

---

## 🎨 **Deploy All Priority Branches**

Test each branch in staging before production:

```bash
# 1. TypeScript Fix (REQUIRED FIRST)
./scripts/deploy-staging-auto.sh fix/typescript-config-and-ui-shims

# 2. Hero Landing Page
./scripts/deploy-staging-auto.sh fix/landing-hero-restore

# 3. Test Suite
./scripts/deploy-staging-auto.sh chore/add-guestypro-parity-tests

# 4. Visual Regression
./scripts/deploy-staging-auto.sh feat/visual-regression-ci

# 5. Validation Scripts
./scripts/deploy-staging-auto.sh feat/validation-scripts
```

---

## 🔍 **Understanding the Output**

### **Success Output**
```
✅ Found deployment!
  URL: https://ko-lake-villa-abc123.vercel.app
  ID: dpl_FxK9...
  State: READY

🔍 Running Validation Suite
  ✅ TypeScript: PASS
  ✅ Build: PASS
  ✅ E2E Tests: PASS
  
🎉 STAGING DEPLOYMENT VALIDATED SUCCESSFULLY!
```

### **If Validation Fails**
```
⚠️ Some validation checks failed

Review the issues above and:
  1. Fix any problems locally
  2. Push fixes and re-run this script
  3. Or visit the staging site to debug
```

---

## 🛠️ **Advanced Usage**

### **Deploy Current Branch**
```bash
# Deploys whatever branch you're on
./scripts/deploy-staging-auto.sh $(git branch --show-current)
```

### **Deploy with Team ID** (if using Vercel Teams)
```bash
export VERCEL_TEAM_ID="team_xxxx"
./scripts/deploy-staging-auto.sh fix/landing-hero-restore
```

### **Skip Validation** (just get URL)
```bash
# Get URL only, skip tests
./scripts/deploy-staging-auto.sh fix/landing-hero-restore 2>/dev/null | grep "URL:"
```

---

## 📈 **Validation Tests Run**

The script automatically runs:

1. **TypeScript Check** - No compile errors
2. **Build Test** - Next.js builds successfully
3. **Critical Files** - All required files present
4. **Content Check** - Key content exists
5. **E2E Tests** - Playwright tests pass
6. **Visual Tests** - UI matches expectations

---

## 🚦 **Success Criteria**

Before promoting to production, ensure:

✅ **All tests pass** in validation suite
✅ **Visual inspection** looks correct
✅ **No console errors** in browser
✅ **Mobile responsive** works
✅ **Performance** acceptable (<3s load)

---

## 🔄 **Workflow: Staging → Production**

```bash
# 1. Test in staging
./scripts/deploy-staging-auto.sh fix/landing-hero-restore

# 2. If all tests pass and visual check good
./scripts/deploy-and-verify.sh fix/landing-hero-restore

# 3. Repeat for each branch in order
```

---

## ⚡ **Quick Reference**

### **Set Token** (one time)
```bash
export VERCEL_TOKEN="vc_xxxxxxxxxxxx"
```

### **Deploy Branch**
```bash
./scripts/deploy-staging-auto.sh [branch-name]
```

### **View Available Branches**
```bash
git branch -a | grep -E "fix/|feat/|chore/"
```

### **Check Deployment Status**
```bash
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?limit=1" | jq .
```

---

## 🐛 **Troubleshooting**

### **"Missing VERCEL_TOKEN"**
```bash
# Get token from Vercel dashboard
export VERCEL_TOKEN="vc_your_token_here"
```

### **"Branch not found"**
```bash
# Check available branches
git branch -a | grep -E "fix/|feat/|chore/"

# Fetch latest
git fetch origin
```

### **Timeout fetching URL**
- Check Vercel dashboard manually
- Ensure GitHub integration is connected
- Try pushing a small change to trigger build

### **Validation fails**
```bash
# Run locally first
./scripts/quick-check.sh

# Fix issues, then retry
./scripts/deploy-staging-auto.sh [branch]
```

---

## 🎉 **Benefits of API Approach**

| Old Way | New Way (API) |
|---------|--------------|
| Create GitHub PR | ✅ Automatic |
| Wait for bot comment | ✅ Instant URL fetch |
| Copy URL manually | ✅ Automatic |
| Run tests separately | ✅ Integrated |
| Check results manually | ✅ Pass/fail reported |

---

## 📝 **Complete Example**

```bash
# One-time setup
export VERCEL_TOKEN="vc_ABcd1234..."

# Deploy and validate TypeScript fix
./scripts/deploy-staging-auto.sh fix/typescript-config-and-ui-shims

# Output:
# ✅ Found deployment!
#   URL: https://ko-lake-villa-git-fix-typescript-rajabey68.vercel.app
# 🔍 Running Validation Suite...
# ✅ All tests passed!
# 
# Next: Deploy to production:
#   ./scripts/deploy-and-verify.sh fix/typescript-config-and-ui-shims
```

---

## ✅ **Summary**

**You now have FULL AUTOMATION for staging deployments!**

Just set your Vercel token once, then use the script to:
- Deploy any branch to staging
- Get the URL automatically
- Run all tests
- See immediate pass/fail

**No manual steps, no waiting for bots, no copying URLs!** 🎊

---

**Ready? Get your token and start deploying!** 🚀

```bash
export VERCEL_TOKEN="your_token"
./scripts/deploy-staging-auto.sh fix/landing-hero-restore
```