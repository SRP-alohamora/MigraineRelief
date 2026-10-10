# MigraineRelief Project Rules & 24-Hour Deployment Policy

## Live Site
- Production GitHub Pages URL: **https://srp-alohamora.github.io/MigraineRelief/**
- Remote Repository: `git@github.com:SRP-alohamora/MigraineRelief.git`

## 24-Hour Synchronization & Deployment Policy
1. **Periodic Check**: Every 24 hours (or at the end of feature workflows), inspect the repository for uncommitted or unpushed changes.
2. **Quality Gate**: Run `cd frontend && npm run build` and `.venv/bin/pytest tests/test_medication_intelligence.py` before pushing.
3. **Automated Publishing**: Push validated changes to `origin main`. This automatically triggers the `.github/workflows/deploy-pages.yml` GitHub Actions pipeline and updates the live site.
4. **Health Check**: Ensure the deployment workflow succeeds and the live URL returns `HTTP 200`.
