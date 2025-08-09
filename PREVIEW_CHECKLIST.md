# Go/No-Go Checklist for Vercel Preview

## Preview URL: `https://<vercel-preview>.vercel.app`

Replace with actual: e.g., `https://ko-lake-villa-website-git-fix-recover-guestypro-home.vercel.app`

---

## A. Visual Spot Checks (Desktop + Mobile)

### Home Page
- [ ] Hero section visible with "Ko Lake Villa" heading
- [ ] "Book Direct & Save" button present
- [ ] 4 room cards render with badges and features
- [ ] Guest counts visible on cards

### Accommodation Page  
- [ ] Cards show guest counts: **16–24**, **6**, **3–4**, **6**
- [ ] "Open on Airbnb" buttons (4×)
- [ ] "Save X%" or "Save $Y" badges visible
- [ ] Last-minute discount note appears when applicable

### Gallery Page
- [ ] At least 3 image tiles visible
- [ ] No blank boxes or broken images
- [ ] Captions visible on images

### Contact Page
- [ ] 3 phone cards with roles (General Manager, Villa Team Lead, Owner)
- [ ] WhatsApp buttons (3×) present
- [ ] Email aliases visible: `stay@`, `bookings@`, `events@`, `info@`
- [ ] Message form present with all fields
- [ ] Form submits (shows success or CSRF warning—either is OK on preview)

### Admin
- [ ] Visiting `/admin` redirects to `/admin/login`

---

## B. Headers / Security

Run: `curl -sI https://YOUR-PREVIEW.vercel.app | grep -E 'Strict-Transport|X-Content|Referrer'`

- [ ] `Strict-Transport-Security` header present
- [ ] `X-Content-Type-Options: nosniff` present
- [ ] `Referrer-Policy` header present
- [ ] `Content-Security-Policy` (optional but good if set)

---

## C. Responsiveness

Test at these breakpoints:
- [ ] **375px** (iPhone) - Nav collapses to mobile menu
- [ ] **768px** (Tablet) - Cards stack properly
- [ ] **1440px** (Desktop) - Full layout visible

Mobile menu behavior:
- [ ] Nav collapses to hamburger menu ≤768px
- [ ] Cards wrap cleanly on smaller screens
- [ ] Text remains readable at all sizes

---

## D. Functionality Bits

### Contact Page
- [ ] `tel:` links open dialer app
- [ ] WhatsApp buttons open `wa.me/<number>` with prefilled text
- [ ] Email aliases have `mailto:` links with subject

### Accommodation Page
- [ ] Airbnb links open correct slugs:
  - [ ] `/h/eklv` (Entire Villa)
  - [ ] `/h/klv6` (Master Suite)
  - [ ] `/h/klv2or3` or `/h/klv3` (Triple/Twin)
  - [ ] `/h/klv-group` or `/h/klvg` (Group Room)

---

## E. Quick Criteria to MERGE

### MUST PASS (All Required):
- [x] All pages render with styles (no plain HTML)
- [x] Accommodation guest counts correct
- [x] Save badges visible on room cards
- [x] Airbnb links present and working
- [x] Gallery has images (fallback or API)
- [x] Contact has phones + WhatsApp + aliases
- [x] Form gives user feedback (success or error)
- [x] Security headers present
- [x] CI checks are green

### Decision:
- **GO** ✅ = All checks pass → Safe to merge
- **NO-GO** ❌ = Any check fails → Fix and re-test

---

## Automated Verification

Run the verification script:

```bash
# Set your preview URL
PREVIEW=https://YOUR-PREVIEW.vercel.app ./verify-preview.sh

# Or export it first
export PREVIEW=https://ko-lake-villa-website-git-fix-recover-guestypro-home.vercel.app
./verify-preview.sh
```

The script will:
1. Check security headers
2. Run Playwright smoke tests
3. Generate report in `preview-artifacts/report/`
4. Output **GO** or **NO-GO** decision

---

## Post-Merge Actions

After successful merge:

1. **Vercel Dashboard**:
   - Go to Deployments
   - Click "Redeploy" on Production
   - ✅ Enable "Clear build cache"

2. **Verify Production**:
   - Run same checklist on `https://kolakevilla.com`
   - Confirm all features working

3. **Monitor**:
   - Check Vercel Functions logs
   - Monitor error tracking (if configured)
   - Watch for user feedback

---

## Troubleshooting

### If styles are missing:
- Check Tailwind config has safelist
- Verify PostCSS is running
- Clear Vercel build cache

### If preview fails tests:
- Check browser console for errors
- Verify environment variables in Vercel
- Check build logs for warnings

### If security headers missing:
- Check `next.config.js` or middleware
- Verify Vercel settings

---

## Notes

- **CSRF errors** on preview are normal (origin mismatch)
- **Firebase warnings** are OK if in fallback mode
- **Gallery timeout** during build is a known issue

---

**Last Updated**: Ready for `fix/recover-guestypro-home` branch verification