## NOW

Finalize and commit the updated plan in `.voder/plan.md`.

## NEXT

- Run `npm run lint` and fix any remaining ESLint warnings or errors in the `src/` directory.  
- Run `npm run build` and verify that the production build completes without errors.  
- Run `npm run test:ci` to confirm all end-to-end tests pass on Chromium, Firefox, and WebKit.

## LATER

- Introduce Prettier: add a Prettier configuration file, install and configure `eslint-plugin-prettier` and `eslint-config-prettier`.  
- Add a `format` script to `package.json` and enforce formatting in CI (and optionally via a pre-commit hook).  
- Finalize ADR-0007 (ESLint & Prettier adoption) and revisit ADR-0006 (manual chunk splitting) for further bundle-size optimizations.