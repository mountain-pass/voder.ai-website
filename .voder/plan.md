## NOW
Run the full CI test suite to verify everything still passes:
```
npm run test:ci
```

## NEXT
If any tests fail, update the impacted component or test until all tests pass.

## LATER
- Swap out placeholder assets in `public/assets/` (e.g. `cube.glb`, `voder-logo.svg`) with final production files and document updates in `docs/placeholders.md`.
- Deploy to a staging environment, run live Lighthouse & Axe audits, and gather feedback.
- After stakeholder review and audit sign-off, promote the site to production.