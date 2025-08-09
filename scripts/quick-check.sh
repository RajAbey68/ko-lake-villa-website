#!/usr/bin/env bash
set -euo pipefail

# Quick validation script - faster alternative to full validate-pr.sh
# Usage: ./quick-check.sh

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Quick Validation Check"
echo "========================"

FAILED=0

# 1. TypeScript check
echo -n "TypeScript: "
if npx tsc --noEmit >/dev/null 2>&1; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${RED}❌${NC}"
  FAILED=1
fi

# 2. Build check
echo -n "Build:      "
if npm run build >/dev/null 2>&1; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${RED}❌${NC}"
  FAILED=1
fi

# 3. Critical files
echo -n "Files:      "
MISSING=0
for f in app/page.tsx app/accommodation/page.tsx app/contact/page.tsx; do
  [ -f "$f" ] || MISSING=1
done
if [ $MISSING -eq 0 ]; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${YELLOW}⚠️${NC}"
fi

# 4. Content check
echo -n "Content:    "
CONTENT_OK=1
grep -q "Ko Lake Villa" app/page.tsx 2>/dev/null || CONTENT_OK=0
if [ $CONTENT_OK -eq 1 ]; then
  echo -e "${GREEN}✅${NC}"
else
  echo -e "${YELLOW}⚠️${NC}"
fi

echo "========================"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}Ready for PR!${NC}"
  exit 0
else
  echo -e "${RED}Fix issues before PR${NC}"
  exit 1
fi