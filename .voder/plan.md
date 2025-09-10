## NOW

Create a focused branch named fix/ci-capture-logs-and-coverage and commit CI workflow updates that capture and upload verification logs and coverage artifacts: add (in the new branch) non-interactive steps to the existing GitHub workflows so tsc, eslint, prettier, test:ci outputs and the coverage HTML/JSON are written to log files and uploaded as artifacts (use tee/redirecting in each command and actions/upload-artifact with if: always()).

## NEXT

1. Implement the CI changes on the branch
   - Edit .github/workflows/ci.yml (and .github/workflows/security-audit.yml if needed) so the verification steps write logs and are uploaded:
     - Replace plain runs with non-interactive captures, e.g.
       - npm run type-check 2>&1 | tee tsc.log
       - npm run lint:check 2>&1 | tee eslint-check.log
       - npm run format:check 2>&1 | tee format-check.log
       - npm run test:ci 2>&1 | tee test-ci.log
     - Ensure coverage output is generated to coverage/ (npm run test:coverage / test:ci should already produce coverage) and upload coverage/\*\* as artifact.
     - Add actions/upload-artifact steps with if: always() so artifacts are uploaded on success or failure.
     - Keep jobs non-interactive and do not change existing long-running server behavior.
   - Commit the workflow changes on fix/ci-capture-logs-and-coverage and push the branch; open a PR for CI to run and produce logs.
2. Gather CI artifacts and triage failures
   - Once the PR triggers CI, download the uploaded artifacts (tsc.log, eslint-check.log, format-check.log, test-ci.log, coverage/\*.zip/html).
   - Inspect logs to identify failing gates: type-check, lint, format, build, or Playwright E2E failures.
   - For each failing gate, reproduce locally with non-interactive commands and capture logs:
     - npm run type-check 2>&1 | tee tsc.log
     - npm run lint:check 2>&1 | tee eslint-check.log
     - npm run format:check 2>&1 | tee format-check.log
     - npm run build 2>&1 | tee build.log
     - npm run test:ci 2>&1 | tee test-ci.log
   - Create focused fixes that do not touch prompts/ prompt-assets/ or .voder/:
     - For lint/format: run npm run lint:fix / npm run format and commit minimal deterministic formatting/lint fixes.
     - For type-check: make the smallest code or config fix to resolve the TypeScript error (or narrow tsconfig include/exclude only if justified).
     - For build: fix missing asset paths or adjust Vite config only as required to make the build non-interactive and reproducible.
3. Stabilize Playwright/E2E (if logs show E2E failures)
   - Use the uploaded test logs to identify flaky assertions, missing Playwright config, or missing browser binaries.
   - If Playwright tests are intended to run in CI:
     - Add or update playwright.config.\* in the repo if missing (minimal config with projects and webServer overrides).
     - Ensure the CI job installs Playwright browsers (or use start_server patterns that CI already supports); add cache steps if needed and keep the audit/workflow non-interactive.
   - If Playwright tests are not ready for mandatory CI enforcement, temporarily gate them behind a separate workflow or mark them optional in the primary verify job until fixed (document the change in the PR).
4. Iterate locally and in CI until the failing gate(s) pass
   - Re-run only the failing gate locally after each focused change; capture logs and commit small fixes.
   - Push incremental commits to the branch and let CI run; use the uploaded artifacts to validate progress.
   - When all verify gates pass on CI and artifacts show coverage and logs, update the PR with a summary of fixes and attach key logs for reviewers.

## LATER

1. Merge branch and codify CI artifact policy
   - Merge fix/ci-capture-logs-and-coverage once CI passes.
   - Add a short docs/CI-ARTIFACTS.md describing artifacts produced by CI, where to find them, and how to interpret tsc.log / eslint-check.log / format-check.log / test-ci.log and coverage reports.
2. Harden testing pipeline and coverage
   - Add targeted flake mitigation for Playwright tests (retry logic, deterministic selectors, stabilized animations) and re-run cross-browser E2E until stable.
   - Add a lightweight preview-smoke test job that starts the preview server non-interactively and performs an HTTP 200 check on / (use a background server or dedicated job with a small HTTP probe).
   - If coverage thresholds still fail, add a short coverage roadmap and a temporary, documented threshold policy (ADR) with a restoration timeline.
3. Improve developer ergonomics and traceability
   - Add a CONTRIBUTING or docs/DEVELOPER-SETUP.md section detailing how to reproduce verify steps locally and how to collect logs (exact commands above).
   - Add a CI step to upload verify.log on full verify runs, and ensure CI stores coverage HTML artifacts for quick inspection.
   - Add tests that co-locate coverage increases for uncovered, higher-impact modules as part of a staged plan to reach the target coverage.
4. Automate monitoring and dependency hygiene
   - Enable Dependabot or Renovate (if not enabled) and require the full verify pipeline on dependency PRs.
   - Add a periodic CI audit job that runs npm audit and uploads audit.json plus parse output artifacts for security traceability.

Notes / constraints respected:

- No prompts/, prompt-assets/, or .voder/ changes are proposed.
- All steps are non-interactive (use tee, CI artifact upload with if: always()).
- No servers are started interactively; CI server preview/smoke tests must be non-interactive and used as separate CI job(s).
- Git operations are scoped to a single branch (fix/ci-capture-logs-and-coverage) and do not modify tracked protected directories.
