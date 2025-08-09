#!/usr/bin/env bash
# verify-cursor-and-report.sh — one-shot diagnostics + test run + summary report
set -euo pipefail

BRANCH_MAIN="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
TARGETS=("fix/blockers-now" "fix/stabilise-now")

echo "▶ Fetching remotes…"
git fetch --all --prune >/dev/null 2>&1 || true

timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
REPORT="REPORT.md"
pass() { printf "✓ %s\n" "$1"; }
fail() { printf "✗ %s\n" "$1"; }
sep() { printf "\n------------------------------\n\n"; }

# 1) Branch status
echo "▶ Branch status"
for b in "${TARGETS[@]}"; do
  if git show-ref --quiet --heads "$b"; then
    pass "local branch exists: $b"
  else
    fail "local branch missing: $b"
  fi
  if git ls-remote --exit-code --heads origin "$b" >/dev/null 2>&1; then
    pass "remote branch exists on origin: $b"
  else
    fail "remote branch missing on origin: $b"
  fi
done
sep

# 2) File presence (from your hardening script)
echo "▶ Verifying expected files"
FILES=(
  "data/gallery.json"
  "public/images/hero.svg"
  "lib/gallery.ts"
  "lib/validate.ts"
  "lib/rateLimit.ts"
  "app/gallery/page.tsx"
  "app/api/contact/route.ts"
  "tests/unit/validate.test.ts"
  "tests/e2e/contact-api.spec.ts"
  "tests/e2e/gallery-fallback.spec.ts"
)
missing=0
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then pass "$f"; else fail "MISSING: $f"; missing=$((missing+1)); fi
done
sep

# 3) Commit/diff snapshot
echo "▶ Recent commits (top 5)"
git --no-pager log --oneline -n 5 || true
sep
echo "▶ Uncommitted changes"
git status -s || true
sep

# 4) Typecheck + tests
echo "▶ Installing deps (if needed)…"
npm ci >/dev/null 2>&1 || npm install >/dev/null 2>&1 || true

echo "▶ Typecheck (tsc)…"
if npx tsc --noEmit; then
  TYPE_RES="PASS"
else
  TYPE_RES="FAIL"
fi
sep

echo "▶ Unit tests (Jest)…"
UNIT_RES="SKIP"
if npm run -s test:unit >/dev/null 2>&1; then
  npm run -s test:unit || true
  UNIT_RES=$([ $? -eq 0 ] && echo "PASS" || echo "FAIL")
else
  echo "• test:unit script not found — attempting direct jest"
  if npx jest --coverage; then UNIT_RES="PASS"; else UNIT_RES="FAIL"; fi
fi
sep

echo "▶ E2E (Playwright)…"
npx playwright install --with-deps >/dev/null 2>&1 || true
E2E_RES="SKIP"
# Try to reuse dev server if playwright.config.ts exists; otherwise run headless with temp server
if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
  # Start dev server in background and wait
  BASE_URL="http://127.0.0.1:3000"
  (BASE_URL="$BASE_URL" nohup npm run dev >/dev/null 2>&1 & echo $! > .devserver.pid)
  npx wait-on "$BASE_URL" --timeout 120000 || true
  if npm run -s test:e2e >/dev/null 2>&1; then
    npm run -s test:e2e || true
    E2E_RES=$([ $? -eq 0 ] && echo "PASS" || echo "FAIL")
  else
    echo "• test:e2e script not found — attempting direct run"
    if npx playwright test; then E2E_RES="PASS"; else E2E_RES="FAIL"; fi
  fi
  if [ -f .devserver.pid ]; then kill "$(cat .devserver.pid)" >/dev/null 2>&1 || true; rm .devserver.pid; fi
else
  echo "• No Playwright config found; skipping E2E."
  E2E_RES="SKIP"
fi
sep

# 5) Create a concise markdown report
echo "▶ Writing $REPORT"
cat > "$REPORT" <<EOF
# Ko Lake Villa — Verification Report
Generated: $timestamp

## Branches
$(for b in "${TARGETS[@]}"; do
  printf "- %s: local %s, remote %s\n" \
    "$b" \
    "$(git show-ref --quiet --heads "$b" && echo "✓" || echo "✗")" \
    "$(git ls-remote --exit-code --heads origin "$b" >/dev/null 2>&1 && echo "✓" || echo "✗")"
done)

## Expected Files
$(for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then echo "- ✓ $f"; else echo "- ✗ $f (missing)"; fi
done)

## TypeScript
- tsc: **$TYPE_RES**

## Tests
- Unit (Jest): **$UNIT_RES**
- E2E (Playwright): **$E2E_RES**

## Recent Commits
\`\`\`
$(git --no-pager log --oneline -n 5 2>/dev/null || echo "n/a")
\`\`\`

## Uncommitted Changes
\`\`\`
$(git status -s 2>/dev/null || echo "n/a")
\`\`\`

## Next Steps
- If *files are missing*, Cursor likely didn't execute the hardening script. Re-run it using:
  \`\`\`
  bash ./<the-script-name>.sh
  \`\`\`
- If **tsc = FAIL**, run \`npx tsc --noEmit\` and fix the listed errors.
- If **E2E = FAIL**, open \`playwright-report/index.html\` for traces:
  \`\`\`
  npx playwright show-report
  \`\`\`
- Push branch \`fix/blockers-now\` and open a PR; Vercel will attach a preview URL.
EOF

pass "Report written to $REPORT"

# 6) Friendly summary to stdout
echo
echo "SUMMARY:"
echo " - Typecheck: $TYPE_RES"
echo " - Unit tests: $UNIT_RES"
echo " - E2E tests: $E2E_RES"
echo " - Report file: $REPORT"
echo
echo "If branches/files are missing, Cursor didn't apply the changes. Re-run your hardening script, or paste it into a file and execute with: bash script.sh"