# GitHub Pages Automated Deployment & 24-Hour Synchronization Rule

## Purpose & Scope
This rule governs synchronization between the local `MigraineRelief` repository and the remote GitHub Pages production site at:
**`https://srp-alohamora.github.io/MigraineRelief/`**

## Guidelines & Requirements

1. **Continuous Deployment Cadence (24-Hour Cycle)**:
   - Every 24 hours, check the repository for new changes, commits, or clinical data model updates.
   - If changes exist in the working directory or local branches, they must be validated and pushed to `origin main` to update GitHub Pages.

2. **Pre-Push Validation Gate**:
   - Before pushing any changes, always verify:
     1. Frontend compiles cleanly: `cd frontend && npm run build` (0 TypeScript / Vite errors).
     2. Core clinical test suite passes: `.venv/bin/pytest tests/test_medication_intelligence.py` (or full suite `.venv/bin/pytest`).
   - Never push code that breaks the Vite build, as it prevents GitHub Actions from publishing to GitHub Pages.

3. **Subpath & Asset Integrity**:
   - All assets (images, stylesheets, scripts) must be relative or prefixed with the configured base path (`/MigraineRelief/`).
   - Single Page App (SPA) routing fallbacks in `frontend/public/404.html` must remain in place to prevent 404 errors on page reloads or deep links.

4. **Post-Deployment Health Verification**:
   - Verify that the GitHub Actions `Deploy to GitHub Pages` workflow completes with status `success`.
   - Confirm HTTP 200 OK response from `https://srp-alohamora.github.io/MigraineRelief/`.
