---
## NOW

Commit all outstanding unstaged modifications—including updates to `package.json`, `package-lock.json`, `src/lib/components/HeroSection.svelte`, and the internal `.voder/` metadata files—with a descriptive message such as “Finalize dependency and HeroSection updates.”

## NEXT

- Push your local commits to `origin/main`.  
- Run the full CI pipeline locally via `npm run test:ci` and verify that the build, preview, and end-to-end tests all pass.

## LATER

- Draft an ADR documenting the integration of Axe accessibility checks.  
- Enhance the GitHub Actions workflow to report accessibility violations in CI.  
- Define and schedule recurring automated accessibility audits as part of the development process.