#!/usr/bin/env bash
set -euo pipefail

# MigraineRelief: 24-Hour Automated GitHub Pages Sync Script
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$REPO_ROOT"

echo "=== [$(date +'%Y-%m-%d %H:%M:%S')] Starting MigraineRelief GitHub Pages Sync ==="

# 1. Fetch remote status
git fetch origin main

# 2. Check for working tree modifications or unpushed commits
CHANGED_FILES=$(git status --porcelain)
UNPUSHED_COMMITS=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")

if [ -z "$CHANGED_FILES" ] && [ "$UNPUSHED_COMMITS" -eq 0 ]; then
  echo ">>> No new changes detected. GitHub Pages is already up to date with origin/main."
  exit 0
fi

echo ">>> Changes detected:"
if [ -n "$CHANGED_FILES" ]; then
  echo "Uncommitted files:"
  echo "$CHANGED_FILES"
fi
if [ "$UNPUSHED_COMMITS" -gt 0 ]; then
  echo "Unpushed commits: $UNPUSHED_COMMITS"
fi

# 3. Quality & Validation Gate
echo ">>> Running frontend build check..."
(cd frontend && npm run build)

echo ">>> Running Python test verification..."
if [ -f ".venv/bin/pytest" ]; then
  .venv/bin/pytest tests/test_medication_intelligence.py
elif command -v pytest >/dev/null 2>&1; then
  pytest tests/test_medication_intelligence.py
else
  echo "Warning: pytest not found in .venv, skipping python test step"
fi

# 4. Commit if working tree is dirty
if [ -n "$CHANGED_FILES" ]; then
  echo ">>> Staging and committing changes..."
  git add .
  SYNC_DATE=$(date +'%Y-%m-%d')
  git commit -m "chore(pages): automated 24-hour sync for GitHub Pages [${SYNC_DATE}]"
fi

# 5. Push to GitHub
echo ">>> Pushing to origin main..."
git push origin main

echo ">>> Push completed successfully. GitHub Actions will deploy to:"
echo "    https://srp-alohamora.github.io/MigraineRelief/"
echo "=== Sync Finished [$(date +'%Y-%m-%d %H:%M:%S')] ==="
