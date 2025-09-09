## NOW
git commit -am "chore(verify): commit focused fixes for CI verification"

## NEXT
1. Push the committed change to trigger CI:
   - git push origin main

2. Monitor CI and fetch logs/artifacts
   - Watch the GitHub Actions verify job for the pushed commit.
   - Download failure artifacts and logs produced by the verify job (eslint, prettier, tsc, vite build, vitest coverage, audit.json).

3. Identify the first failing gate (console-first)
   - From CI logs, locate the earliest failing gate in this order: format check → lint check → type-check → build → tests/coverage → audit.

4. Reproduce the failing gate locally and fix only that gate
   - Format: npm run format:check → if failing npm run format && npm run format:check
   - ESLint: npm run lint:check → if failing npm run lint:fix && npm run lint:check
   - CSS/HTML/MD linters: npm run lint:css (or lint:css:fix), npm run lint:html, npm run lint:md (or lint:md:fix)
   - TypeScript: npm run type-check → fix diagnostics and re-run
   - Build: npm run build → fix tsc/vite errors and re-run
   - Tests/Coverage: npm run test:ci → inspect coverage summary/coverage/coverage-final.json and add focused co-located tests to raise coverage; re-run until gate satisfied

5. Commit and push minimal, focused fixes for the gate
   - git add -A
   - git commit -m "chore(verify): fix <format|lint|type|build|test> — <short reason>"
   - git push origin main

6. Repeat Steps 2–5
   - Iterate until the CI verify job completes successfully. Always fix the earliest failing gate first using console-first diagnostics.

7. When CI verify passes: enable/confirm pre-commit check-only hook
   - Ensure .husky/pre-commit contains only check-only commands (format:check, lint:check), is executable (chmod +x .husky/pre-commit), then:
     - git add .husky/pre-commit
     - git commit -m "chore(hooks): enable check-only pre-commit quality checks"
     - git push origin main

## LATER
1. CI reliability & diagnostics
   - Ensure CI uploads failure artifacts automatically (coverage JSON/html, ESLint report, audit.json).
   - Add a scheduled nightly job to run `npm ci --no-audit --no-fund` + `npm run verify`.

2. Coverage & tests
   - Add targeted co-located unit tests for under-covered files identified in coverage reports.
   - If coverage thresholds need short-term relaxation, document the change in an ADR and restore incremental increases plan.

3. Dependency & install hygiene
   - Confirm package-lock.json remains committed and CI uses `npm ci --no-audit --no-fund`.
   - Enable Dependabot/Renovate and wire PR checks to run the verify pipeline.

4. Developer ergonomics
   - Add lint-staged (auto-format staged files) while keeping pre-commit hooks check-only.
   - Document canonical non-interactive setup in README/DEVELOPER-SETUP.md.

5. Documentation & ADRs
   - Record any config changes required to stabilize CI (tsconfig/vitest/eslint) as short ADRs in docs/decisions/.
   - Add CI troubleshooting notes showing where artifacts are stored and how to reproduce failing gates locally.