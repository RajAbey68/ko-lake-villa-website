#!/usr/bin/env bash
set -euo pipefail
echo "Replit start: installing locked deps (npm ci) and running dev server…"
npm ci || npm install
npm run dev