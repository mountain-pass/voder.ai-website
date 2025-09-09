## NOW
Create a minimal co-located Vitest DOM test: add tests/main.test.ts that ensures a #app container is present (or creates it), imports './src/main.ts' to run initialization, and asserts the rendered document contains the text "Voder". Commit with message:
chore(test): add minimal Vitest DOM test for app initialization

## NEXT
After committing the NOW change, perform these focused commits in order. Run npm run test locally after the NOW step and iterate on any failures before proceeding.

1) Add non-interactive health-check script
   - Create scripts/health-check.js (Node built-ins only: fs, path, child_process, os, process).
   - Behavior (non-interactive, console-first diagnostics):
     - Print required Node version from package.json.engines and the running Node version; exit code 2 if requirement unmet.
     - Verify presence of package-lock.json and node_modules/; print remediation instructions and exit 2 if missing.
     - Run, streaming output, these checks in sequence:
       - npm run type-check
       - npm run lint:check
       - npm run format:check
     - Summarize pass/fail and exit non-zero on any failure. Provide clear remediation hints (commands to run).
   - Commit message: chore: add health-check script

2) Add package.json script for health-check
   - Add script: "health-check": "node scripts/health-check.js"
   - Commit message: chore: add health-check script and package.json entry

3) Enforce deterministic verification pipeline order
   - Add "audit:fix": "npm audit fix --package-lock-only"
   - Replace the verify script with the ordered, non-interactive pipeline:
     "verify": "npm run audit:fix && npm run lint:fix && npm run lint:check && npm run format:check && npm run build && npm run test:ci"
   - Commit message: chore: enforce verification pipeline order in package.json

4) Wire health-check into CI
   - Update .github/workflows/ci.yml to run health-check after dependencies are installed (and run npm run prepare if appropriate).
   - Ensure the step is non-interactive and that the workflow fails on any non-zero exit code.
   - Commit message: ci: run health-check during CI install step

5) Add concise README with quickstart & health-check instructions
   - Create README.md covering:
     - Node requirement and recommended version-manager commands.
     - Quickstart: npm ci, npm run prepare, npm run dev, npm run health-check, npm run verify.
     - How to interpret health-check output and remediation commands.
     - Note that docs/libraries/ is generated and gitignored.
   - Commit message: docs: add README with quickstart and health-check instructions

6) Local validation and iteration
   - Locally run: npm ci → npm run prepare → npm run health-check → npm run test
   - Fix problems surfaced by tests/health-check in focused commits (examples: fix(test): adjust import/DOM setup; fix(health-check): handle missing package-lock.json; fix(lint): remove unused imports).
   - Only push when health-check and tests pass locally.

## LATER
After NOW and NEXT are green and CI passes, follow up with these improvements (each as its own focused commit):

1) Expand tests for scripts and health-check
   - Add tests/prepare-libraries.test.ts using os.tmpdir() + fs.mkdtempSync to create a fake node_modules fixture; ensure cleanup.
   - Add tests/health-check.test.ts mocking child_process to validate behavior and exit codes.
   - Commit message: test(scripts): add unit tests for prepare-libraries and health-check

2) CI lockfile drift detection
   - Add a CI job step to detect package-lock.json drift (npm ci --package-lock-only; fail if git status changes).
   - Commit message: ci: add lockfile drift detection

3) Reinstate check-only pre-commit hooks
   - Configure Husky or simple-git-hooks to run check-only tasks on staged files (eslint --max-warnings 0, prettier --check, stylelint --check).
   - Ensure hooks never auto-modify code and document bypass via --no-verify.
   - Commit message: chore: add pre-commit hooks (check-only) and documentation

4) Defensive JS wrappers for TypeScript config files (if necessary)
   - Add small CJS wrappers (postcss.config.cjs, htmlhint.config.cjs) that attempt to load TS configs via jiti and emit clear diagnostics if loading fails.
   - Commit message: chore: add defensive JS wrappers for TS configs

5) Increase automated coverage and enforce thresholds
   - Expand Vitest tests across app and scripts, tune vitest.config.ts thresholds, and integrate test:coverage into CI.
   - Commit message: test: increase coverage and enforce thresholds

Constraints and reminders
- NOW is a single concrete action addressing the NEXT PRIORITY from the assessment (add the minimal Vitest test).
- All scripts must be non-interactive and use only Node built-ins.
- Keep commits small, focused, and use the specified commit messages.
- Do not modify prompts/, prompt-assets/, or .voder/ directories.