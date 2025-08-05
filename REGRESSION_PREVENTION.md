# 🔒 Ko Lake Villa - Regression Prevention System

## Overview
This system prevents repeated overwrites of working functionality by implementing branch discipline, code protection, and automated testing.

## 🚨 The Problem We're Solving
Repeated regressions where AI code generation overwrites working functionality:
- Contact page losing perfect phone number configuration
- Gallery hover/thumbnails being broken repeatedly  
- Booking buttons being redirected away from contact page
- Firebase listings architecture being modified unexpectedly

## 🛡️ Protection Strategy

### 1. Branch Discipline (`prevent-regressions.sh`)
**Always specify the target branch explicitly:**
```bash
# Before making any changes
./prevent-regressions.sh

# Set active branch for Cursor AI
# "Set active branch to GuestyPro. Ensure all code generation and commits are targeted to this branch only."
```

### 2. Stable Code Protection (`.cursorignore`)
**Protected files that should NOT be overwritten:**
- `app/contact/page.tsx` - Perfect contact information with 3 phone numbers
- `app/gallery/page.tsx` - Working gallery without loading issues
- `components/admin/gallery-management.tsx` - Working AI integration
- `components/navigation/global-header.tsx` - Correct booking button routing
- `lib/firebase-listings.ts` - Core listings architecture
- `app/api/gallery/ai-tag/route.ts` - Working OpenAI integration

### 3. Automated Regression Tests (`tests/regression-prevention.test.js`)
**Critical functionality verification:**
```bash
npm test regression-prevention.test.js
```

Tests verify:
- ✅ Contact page has all 3 phone numbers with WhatsApp
- ✅ Reception hours: "7am to 10:30pm"
- ✅ All booking buttons route to `/contact`
- ✅ Firebase fallback handling works
- ✅ Gallery images are deployed (91+ files)
- ✅ OpenAI integration is real (not mock data)

### 4. Pre-Deployment Checklist
Run before every deployment:
```bash
./prevent-regressions.sh
npm test regression-prevention.test.js
vercel --prod
```

## 🎯 Critical Requirements That Must Never Regress

### Contact Page - EXACT Requirements
**Phone Numbers (ALL must be present):**
- General Manager: `+94 71 776 5780`
- Villa Team Lead: `+94 77 315 0602` (Sinhala speaker)
- Owner: `+94 711730345`

**WhatsApp Integration:**
- Each phone number must have WhatsApp button
- URLs: `wa.me/94717765780`, `wa.me/94773150602`, `wa.me/94711730345`

**Reception Hours:**
- Text: "The Reception is open from 7am to 10:30pm"
- NO time slots

### Booking Flow
**ALL booking buttons MUST route to `/contact`:**
- Header "Book Now" button
- Homepage booking CTAs
- Accommodation page booking buttons
- Experiences page booking buttons  
- All other booking-related buttons

### Firebase Listings
**Core architecture for preventing hardcoded URL regressions:**
- Default listings: `eklv`, `klv6`, `klv2or3`
- Fallback handling when Firebase unavailable
- Admin panel for managing listings

### Gallery System
**Images and functionality:**
- 91+ images deployed as static assets
- No infinite loading states
- Working API endpoints
- Real OpenAI integration for AI tagging

## 🚀 Deployment Workflow

### Before Any Code Changes:
1. **Branch Check:** Run `./prevent-regressions.sh`
2. **Sync Latest:** Pull from remote branch
3. **Verify Protection:** Check `.cursorignore` exists

### Before Deployment:
1. **Run Tests:** `npm test regression-prevention.test.js`
2. **Manual Verification:** Check critical functionality
3. **Deploy:** `vercel --prod`
4. **Live Testing:** Verify on production site

### Cursor AI Prompts:
**Always use these directives:**
```
"Set active branch to GuestyPro. Ensure all code generation and commits are targeted to this branch only."

"Ignore changes to files/folders listed in .cursorignore. Do not regenerate or overwrite these files unless explicitly instructed."

"Pull and merge the latest commits from the remote GuestyPro branch before starting any new code generation."

"Show a code diff for all changes. Wait for manual approval before merging any changes to protected files."
```

## 🔧 Emergency Recovery

If a regression occurs:

1. **Immediate Rollback:**
```bash
git log --oneline -10  # Find last good commit
git revert <bad-commit-hash>
```

2. **Restore from Known Good State:**
```bash
# Contact page restoration
git show <good-commit>:app/contact/page.tsx > app/contact/page.tsx
```

3. **Run Full Test Suite:**
```bash
./prevent-regressions.sh
npm test regression-prevention.test.js
```

## 🎯 Success Metrics

**Zero regressions achieved when:**
- ✅ All tests pass before deployment
- ✅ Protected files remain unchanged unless explicitly modified
- ✅ Manual verification confirms critical functionality
- ✅ Live site testing shows expected behavior

**This system prevents the recurring overwrites that destroy working functionality!** 