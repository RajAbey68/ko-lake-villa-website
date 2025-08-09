#!/usr/bin/env bash
# Usage:
#   export GH_TOKEN=... (a PAT with repo:admin)
#   ./scripts/apply-branch-protection.sh owner repo main
set -euo pipefail
OWNER="${1:?owner}"
REPO="${2:?repo}"
BRANCH="${3:?branch}"
curl -s -X PUT \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$OWNER/$REPO/branches/$BRANCH/protection \
  -d '{
    "required_status_checks": {"strict": true, "contexts": ["Protect Architecture","Protect Lockfile / Dep Upgrades","Block Deletions (Critical Paths)"]},
    "enforce_admins": true,
    "required_pull_request_reviews": {"required_approving_review_count": 1},
    "restrictions": null
  }'
echo
echo "Applied branch protection to $OWNER/$REPO:$BRANCH"