## NOW

Run a single non‑interactive commit to persist the modified tracked .voder metadata:
- git commit -a -m "chore(ui-tools): persist .voder metadata updates"

## NEXT

After the .voder metadata is committed, run the verification + triage pipeline and remediate iteratively:

1. Run the verification pipeline (capture all console output):
   - npm run type-check && npm run build && npm test

2. Immediately run supply‑chain snapshots:
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true

3. Inspect jest-axe peer vs dev ranges (print to console):
   - node -e "const p=require('./package.json'); console.log('peer jest-axe:', p.peerDependencies?.['jest-axe']||'none'); console.log('dev jest-axe:', p.devDependencies?.['jest-axe']||'none');"

4. If you observe a deliberate jest-axe mismatch and choose to align dev → peer-compatible range, perform this single non‑interactive change and record it:
   - npm install --no-audit --no-fund --save-dev jest-axe@^9.0.0
   - git add -- package.json package-lock.json
   - git commit -m "chore(ui-tools): align jest-axe to peer-compatible range"
   - git push origin main
   - Re-run steps 1 and 2

5. Iterative verification triage loop — repeat until verification is green:
   - For each failure from step 1:
     a. Make the smallest possible code or config change limited to src/, tests/, or tsconfig.json (one fix per commit).
     b. If adding new tracked files: git add -- <new-files>; otherwise use git commit -a -m "fix(ui-tools): <short description>"
     c. git push origin main
     d. Re-run: npm run type-check && npm run build && npm test
     e. Re-run supply‑chain snapshots as needed (step 2)
   - Guidance for common failure types:
     - Type errors → smallest type or tsconfig tweak.
     - Module/import resolution → fix ESM import paths (.js extensions) or adjust tsconfig.
     - Failing tests → prefer implementation fixes to match spec-encoded tests.
     - Missing dev tooling → add devDependency only when absolutely required and create an ADR documenting the dependency change (bundle ADR with package.json/package-lock.json changes).

6. When verification is consistently green locally and any lockfile changes exist:
   - git add -- package.json package-lock.json || true
   - git commit -m "chore(ui-tools): update lockfile after remediation" || true
   - git push origin main

Notes for NEXT:
- Capture all stdout/stderr (console-first policy) — console output will be preserved in .voder/history.md.
- Keep each change minimal and re-run the full verification after each commit.
- Do NOT modify files under .voder/ or prompts/.
- All commands must be non‑interactive and scoped to the current working directory.

## LATER

After the repository is clean and verification runs consistently green, implement the planned feature slices incrementally (implement → test → verify → commit → push):

1. Build factory slice
   - Implement src/build/vite-library.ts per spec.
   - Add tests: tests/build/vite-library.test.ts.
   - Run verification and commit.

2. Testing & accessibility slice
   - Implement src/testing/{vitest-jsdom.ts, helpers.ts, accessibility.ts, setup.ts}.
   - Add jsdom + jest-axe unit tests (tests/testing/*.test.ts) and a test asserting @vitest/coverage-v8 loads with vitest.
   - Run verification and commit.

3. Linting & markdown slice
   - Implement src/linting/{html.ts, css.ts, accessibility.ts} and markdown-lint generator helper.
   - Add lint:md and lint:md:fix scripts (markdownlint-cli2 per ADR).
   - Run verification and commit.

4. Packaging & export tests slice
   - Implement dual-export packaging strategy (exports → ./dist/).
   - Ensure build emits dist/ and types.
   - Add tests: tests/package-structure.test.ts, tests/export-equivalence.test.ts, tests/package-installation.test.ts.
   - Run verification and commit.

5. Scripts & consumer docs slice
   - Add standardized scripts (verify, lint, lint:fix, format, format:check, lint:md, lint:md:fix).
   - Add a self-contained README.md (UNLICENSED) with quick-start, API examples, security posture.
   - Run verification and commit.

6. ADRs & supply‑chain hardening
   - For any direct dependency changes, add ADR(s) under docs/decisions/ documenting rationale and bundle them with package.json/package-lock.json changes.
   - Add automated tests that assert version alignment constraints required by ADRs (e.g., vitest and @vitest/coverage-v8).

7. Coverage expansion
   - Gradually add tests to meet coverage policy (begin with public API exports).
   - Enforce thresholds in Vitest config and run test:ci regularly.

Constraints reminder
- Do not modify files under .voder/ or prompts/.
- All git and shell commands must be non‑interactive and scoped to the current working directory.
- Capture and review all console output before making dependency decisions.