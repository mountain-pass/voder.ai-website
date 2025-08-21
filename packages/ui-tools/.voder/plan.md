## NOW

Commit the unstaged tracked .voder metadata files so the working tree is clean (do not modify their contents).

## NEXT

After committing the .voder files, perform these non-interactive POSIX steps in order (do not edit or stage files under .voder/ or prompts/; keep fixes minimal and limited to src/, tests/, or tsconfig.json):

1. Install the minimal developer toolchain (pin vitest and coverage provider per ADR-0005):
   - npm install --no-audit --no-fund --save-dev typescript vitest@3.2.4 @vitest/coverage-v8@3.2.4 @types/node postcss autoprefixer @testing-library/dom jest-axe

2. Add the PostCSS unit test file:
   - mkdir -p tests/build
   - cat > tests/build/postcss.test.ts <<'TS'
   import { describe, it, expect } from 'vitest';
   import { createPostCSSConfig } from '../../src/build/postcss.js';
   
   describe('PostCSS config', () => {
     it('should produce a plugins array with autoprefixer included', () => {
       const cfg = createPostCSSConfig();
       expect(Array.isArray(cfg.plugins)).toBe(true);
       expect(cfg.plugins.length).toBeGreaterThan(0);
     });
   });
   TS

3. Run the verification sequence (non-interactive; re-run after small fixes if needed):
   - npm run type-check
   - npm run build
   - npm test

4. If any verification step fails, make only small, local fixes limited to src/, tests/, or tsconfig.json, then re-run the three verification commands until they all succeed. Do NOT modify files under .voder/ or prompts/.

5. Once verification is green, commit only the test file, updated lockfile, and any minimal fixes (explicitly exclude .voder/ and prompts/), then push:
   - git add tests package-lock.json tsconfig.json src || true
   - git commit -m "chore(ui-tools): add PostCSS unit test, install dev deps, fix build/type issues" || true
   - git push origin main || true

Notes:
- All commands must be POSIX-compatible and non-interactive.
- Console output will be captured; do not create repository diagnostic files.
- Keep changes minimal so each verification run is quick and deterministic.

## LATER

After the minimal vertical slice is green and pushed, continue incrementally (implement → test → validate → commit & push):

1. Implement Vite library factory and tests:
   - Add src/build/vite-library.ts
   - Add tests/build/vite-library.test.ts
   - Validate: npm run type-check && npm run build && npm test
   - Commit & push.

2. Implement testing utilities and jsdom environment setup:
   - Add src/testing/{vitest-jsdom.ts,helpers.ts,accessibility.ts,setup.ts}
   - Add corresponding unit + integration tests
   - Ensure vitest and @vitest/coverage-v8 remain version-aligned in devDependencies
   - Validate, commit, push.

3. Implement linting factories and markdown-lint integration:
   - Add src/linting/{html.ts,css.ts,accessibility.ts} and linters/markdown integration per ADR
   - Add package.json scripts "lint:md" and "lint:md:fix" and declare markdownlint-cli2 as required per ADR
   - Add tests that generate/validate .markdownlint.json
   - Validate, commit, push.

4. Add packaging/export validation and integration tests:
   - Implement build helpers (copy:assets), package.json exports to ./dist/, and tests:
     - tests/package-structure.test.ts
     - tests/export-equivalence.test.ts
     - tests/package-installation.test.ts (use safe local install patterns)
   - Validate build & tests, commit, push.

5. Add consumer-facing README, CHANGELOG, and security posture:
   - Create README.md (self-contained, no internal links), CHANGELOG.md, short security section
   - Run markdown linting, fix issues, commit, push.

6. Supply-chain hardening & automation:
   - Run npm audit, remediate critical/high findings, commit updated lockfile
   - Add automated checks for lockfile integrity and registry-mirror enforcement per ADR-0007
   - Add automated test verifying vitest/@vitest/coverage-v8 alignment per ADR-0005

7. Iterate tests and coverage to meet thresholds:
   - Expand unit/integration tests to reach coverage goals (≥90% overall; 100% public API)
   - Commit small increments and validate after each change.