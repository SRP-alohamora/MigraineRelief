---
name: daily-github-pages-sync
description: >-
  Syncs, verifies, and pushes new changes to GitHub every 24 hours to ensure the MigraineRelief website is updated on GitHub Pages. Use when the user asks to schedule, run, or automate the 24-hour sync of changes to GitHub Pages.
---

# Daily GitHub Pages Sync & Deployment

This skill automates and verifies the 24-hour continuous deployment lifecycle for MigraineRelief, guaranteeing that new changes, clinical data models, and UI features are validated and pushed to GitHub Pages.

## Live Deployment Details
- **Website URL**: https://srp-alohamora.github.io/MigraineRelief/
- **GitHub Workflow**: `.github/workflows/deploy-pages.yml`
- **Target Branch**: `main`

---

## Execution Modes

### Mode 1: Antigravity Scheduled Background Job
The agent or user can schedule this procedure to trigger recurringly every 24 hours using the Antigravity `schedule` tool or `/schedule` slash command:
- **Cron Expression**: `0 0 * * *` (Every 24 hours at 00:00 UTC)
- **Prompt**: `"Execute daily-github-pages-sync: check for new changes, verify build, and push to GitHub Pages"`

### Mode 2: Automated Script
Execute the standalone bash synchronization script:
```bash
bash .agents/skills/daily-github-pages-sync/scripts/sync_pages.sh
```

---

## Step-by-Step Procedure

### Step 1: Detect Local or Unpushed Changes
1. Inspect git status for untracked or modified files:
   ```bash
   git status --porcelain
   ```
2. Inspect ahead/behind status relative to remote:
   ```bash
   git fetch origin main
   git rev-list --count origin/main..HEAD
   ```
3. If both the working tree is clean and `origin/main..HEAD` count is `0`, report that no sync is needed and exit.

### Step 2: Quality & Validation Gate
Before pushing any code, verify that:
1. The frontend compiles with zero errors:
   ```bash
   cd frontend && npm run build
   ```
2. The core test suite passes:
   ```bash
   .venv/bin/pytest tests/test_medication_intelligence.py
   ```
*(Do not proceed with push if either step fails).*

### Step 3: Commit and Push
1. Stage all pending changes:
   ```bash
   git add .
   ```
2. Commit with a timestamped message:
   ```bash
   git commit -m "chore(pages): automated 24-hour sync for GitHub Pages [$(date +'%Y-%m-%d')]"
   ```
3. Push to `origin main`:
   ```bash
   git push origin main
   ```

### Step 4: Verify GitHub Pages Health
1. Check the GitHub Actions workflow run:
   ```bash
   gh run list --workflow="deploy-pages.yml" -L 1
   ```
2. Validate the live site responds with HTTP 200:
   ```bash
   curl -I -s https://srp-alohamora.github.io/MigraineRelief/
   ```
