## NOW

git commit -am "chore(ui-tools): persist local .voder metadata changes"

## NEXT

1. Push commits to remote (console-first):
   - git push origin main || true

2. Capture dependency health and freshness to console:
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true

3. Inspect jest-axe alignment and print the result to console:
   - node -e "const p=require('./package.json'); console.log('peer jest-axe:', p.peerDependencies?.['jest-axe']||'none'); console.log('dev jest-axe:', p.devDependencies?.['jest-axe']||'none');"

4. If the inspection shows a major-version mismatch and you decide to align jest-axe to the peer-compatible range, perform this narrow remediation (ONLY if you explicitly decide to do so):
   - npm install --no-audit --no-fund --save-dev jest-axe@^9.0.0
   - git add -- package.json package-lock.json
   - git commit -m "chore(ui-tools): align jest-axe to peer-compatible range"
   - git push origin main

5. Run the verification sequence (fail-fast; all output to console/stderr):
   - npm run type-check && npm run build && npm test

6. If verification fails, perform focused small fixes (only edit files under src/ or tests/ or tsconfig.json if absolutely required) and iterate:
   - For each focused fix:
     - Edit files under src/ or tests/ (or tsconfig.json only if necessary)
     - git add -- <modified-files>
     - git commit -m "fix(ui-tools): <short description>"
     - git push origin main
     - Re-run: npm run type-check && npm run build && npm test
   - Repeat until verification succeeds.

7. After verification is green, re-run supply-chain checks and commit lockfile if changed:
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true
   - If package-lock.json or package.json changed:
     - git add -- package-lock.json package.json
     - git commit -m "chore(ui-tools): address audit / update lockfile"
     - git push origin main

Notes for NEXT:
- All command output must go to stdout/stderr so it is captured in .voder/history.md.
- Do NOT modify any files under .voder/ or any files in prompts/.
- All commands are POSIX-safe and non-interactive.
- Avoid automatic major dependency upgrades without an explicit decision and ADR.

## LATER

Once the working tree is clean, lockfile reconciled, and verification is green, proceed incrementally (small vertical slices, test-driven):

1. Implement Vite library factory + tests
   - Add src/build/vite-library.ts implementing createViteLibraryConfig per the implementation guide.
   - Add tests/build/vite-library.test.ts validating ESM-only formats and css.postcss presence.
   - Commit & run verification.

2. Implement jsdom testing utilities & accessibility helpers
   - Add src/testing/{vitest-jsdom.ts, helpers.ts, accessibility.ts, setup.ts}.
   - Add jsdom + jest-axe unit/integration tests for helpers and accessibility utilities.
   - Add test verifying vitest + @vitest/coverage-v8 alignment per ADR.
   - Commit & run verification.

3. Add linting factories & markdown lint integration
   - Add src/linting/{html.ts, css.ts, accessibility.ts}.
   - Add generation helper for .markdownlint.json (using @voder/dev-config) and add lint:md / lint:md:fix scripts to package.json.
   - Commit & run verification.

4. Implement packaging/exports & package-structure tests
   - Add copy:assets, prebuild/postbuild scripts; update package.json exports to point at ./dist/.
   - Add tests: tests/package-structure.test.ts, tests/export-equivalence.test.ts, tests/package-installation.test.ts.
   - Ensure tsc produces declarations in dist/ and tests validate exports.
   - Commit & run verification.

5. Add public-facing docs & housekeeping
   - Create README.md (self-contained with UNLICENSED notice, quick-start, security posture).
   - Add CHANGELOG.md (Keep a Changelog).
   - Add local eslint.config.js / prettier config and lint/format scripts per Universal Guide.
   - Commit & run verification.

6. Supply-chain hardening & automation
   - Remediate remaining audit findings; commit lockfile.
   - Add automated tests enforcing version-alignment constraints (e.g., vitest/provider).
   - Create ADRs for any major dependency changes and bundle ADRs with package.json/lockfile updates.

7. Expand tests & coverage toward policy targets
   - Incrementally add unit & integration tests to reach ≥90% coverage and 100% public API coverage.
   - Add smoke tests, export-equivalence tests, and package-installation integration tests.
   - Enforce coverage thresholds in the Vitest config and run verify.

LATER notes:
- Keep each change the smallest vertical slice that yields verifiable value and tests.
- Never touch .voder/ or prompts/ files.
- Preserve console-first outputs and POSIX-safe command usage.