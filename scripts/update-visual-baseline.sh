#!/usr/bin/env bash
set -euo pipefail

echo "📸 Updating visual regression baseline screenshots..."
echo "This will capture the current UI as the new baseline."
echo ""

# Clean existing screenshots
rm -rf tests/visual/screenshots

# Run tests to generate new baselines
npx playwright test --config=playwright.visual.config.ts --update-snapshots

echo ""
echo "✅ Baseline screenshots updated!"
echo "Review changes with: git diff tests/visual/screenshots"
echo "Commit when satisfied: git add tests/visual/screenshots && git commit -m 'chore: update visual baselines'"