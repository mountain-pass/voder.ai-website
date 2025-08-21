## NOW

Commit and push the current .voder metadata updates to synchronize the repository with origin/main (persist the tracked .voder files you intentionally modified).

## NEXT

After the repository is synchronized, perform this non‑interactive diagnostic + remediation sequence (run each command from the repository root and capture all stdout/stderr):

1. Supply‑chain snapshots (capture output):
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true

2. Gather diagnostics for the Vitest/Vite startup error (capture output):
   - npm ls vite-plugin-inline-source --json || true
   - node -e "const p=require('./package.json'); console.log('devDependencies:', JSON.stringify(p.devDependencies||{},null,2)); console.log('peerDependencies:', JSON.stringify(p.peerDependencies||{},null,2));"
   - grep -nR --line-number "vite-plugin-inline-source" . || true
   - sed -n '1,240p' vite.config.ts || true
   - node -e "console.log('node', process.version)" || true

3. Re-run verification to reproduce failure (capture output):
   - npm run type-check && npm run build && npm test

4. Remediation (choose one minimal path based on diagnostics; capture output and commit the minimal change):
   - If diagnostics show the plugin is missing and vite.config.ts intentionally imports it:
     - npm install --no-audit --no-fund --save-dev vite-plugin-inline-source
     - git add -- package.json package-lock.json
     - git commit -m "chore(ui-tools): add vite-plugin-inline-source devDependency for vite config"
     - git push origin main
     - Re-run: npm run type-check && npm run build && npm test
   - Otherwise, if the import is unintended or only required in a different environment, make a minimal guarded change in vite.config.ts to avoid requiring the plugin at test startup (lazy import / try/catch around the plugin import), then:
     - git add <changed file(s)> || git add -A
     - git commit -m "fix(ui-tools): guard/remove vite-plugin-inline-source import to avoid runtime error in tests"
     - git push origin main
     - Re-run: npm run type-check && npm run build && npm test

5. If a jest-axe version mismatch is observed and you decide to align dev → peer range:
   - npm install --no-audit --no-fund --save-dev jest-axe@^9.0.0
   - git add -- package.json package-lock.json
   - git commit -m "chore(ui-tools): align jest-axe to peer-compatible range"
   - git push origin main
   - Re-run: npm run type-check && npm run build && npm test

6. If any .voder/* files remain modified in the working tree and they reflect intended state, persist them now (do not edit contents):
   - git add -- .voder/* || true
   - git commit -m "chore(ui-tools): persist .voder metadata updates" || true
   - git push origin main || true

7. Iterative loop:
   - For each failing error from the verification run, make the smallest possible single logical change, commit, push, and re-run:
     - Make fix (one file/small change)
     - git add -- <paths> && git commit -m "fix(ui-tools): <brief description>" && git push origin main
     - npm run type-check && npm run build && npm test
     - Re-run supply snapshots as needed

Notes for NEXT:
- Capture and preserve console output for every command (console-first policy).
- Do not modify files under .voder/ or anything under prompts/.
- All commands above are non-interactive and scoped to the repository root.

## LATER

Once verification is green and the repo is synchronized, proceed incrementally with the prioritized feature slices (implement → test → verify → commit → push):

1. Build factory slice
   - Implement src/build/vite-library.ts per spec (createViteLibraryConfig).
   - Add tests: tests/build/vite-library.test.ts that assert ESM-only formats and PostCSS integration.
   - Export factory from src/index.ts.
   - Commands:
     - npm run type-check && npm run build
     - git add src/build/vite-library.ts src/index.ts tests/build/vite-library.test.ts
     - git commit -m "feat(ui-tools): implement createViteLibraryConfig + tests"
     - git push origin main
     - npm run test

2. Testing & accessibility slice
   - Implement src/testing/{vitest-jsdom.ts,helpers.ts,accessibility.ts,setup.ts}.
   - Add jsdom + jest-axe unit tests under tests/testing/.
   - Add a small test asserting @vitest/coverage-v8 loads with vitest.
   - Commands per incremental commit: type-check/build/test, then git add/commit/push.

3. Linting & markdown slice
   - Implement src/linting/{html.ts,css.ts,accessibility.ts} and markdown lint config generator (per ADR).
   - Add package.json scripts: "lint:md" and "lint:md:fix" using markdownlint-cli2.
   - Add tests validating generated markdownlint config.
   - Commit and verify.

4. Packaging & export-tests slice
   - Implement dual-export packaging (package.json exports pointing to ./dist/), add copy:assets if needed.
   - Add tests: tests/package-structure.test.ts, tests/export-equivalence.test.ts, tests/package-installation.test.ts (use tempdir isolation).
   - Commit and run full verification.

5. Scripts & consumer docs slice
   - Add standardized scripts (verify, lint, lint:fix, format, format:check).
   - Create a consumer-facing README.md (UNLICENSED) with quick-start, API examples, and security posture.
   - Commit and verify.

6. ADRs & supply‑chain hardening
   - For any new direct dependency, author an ADR in docs/decisions/ and bundle it with package.json/package-lock.json changes.
   - Add automated tests that assert version alignment constraints (e.g., vitest ↔ @vitest/coverage-v8).

7. Coverage expansion
   - Increase test coverage to meet thresholds iteratively; add tests for public API and error scenarios; enforce coverage in test:ci.

Constraints recap (follow throughout):
- Do not modify files under .voder/ or prompts/.
- All git and shell commands must be non‑interactive and scoped to repo root.
- Capture console output after every verification attempt before proceeding to dependency changes.