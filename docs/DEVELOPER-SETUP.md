Developer Setup & Verification Guide

## Purpose

This document describes the minimal, non-interactive steps a contributor or CI job should run to install dependencies, verify the repository health, and produce a reproducible verification result locally.

## Prerequisites

- Node.js >= 22.17.0 (the project enforces this via package.json `engines`). Using a version manager (nvm, asdf, Volta) is recommended.
- npm (comes with Node.js)

## Install dependencies (non-interactive)

Use the lockfile via npm ci to get reproducible installs.

    npm ci --no-audit --no-fund

If you intentionally do not commit a lockfile in this repository, ensure CI uses a pinned set of dependencies and document the rationale.

## Quick verification sequence (local)

Run the following sequence. Each step is designed to be non-interactive. Stop and fix the first failing step before proceeding to the next.

1. Type-check

   npm run type-check

2. Lint autofix

   npm run lint:fix

3. Lint strict check

   npm run lint:check

4. Format files (Prettier)

   npm run format

5. Format verify

   npm run format:check

6. Build for production

   npm run build

7. Tests + coverage (CI style)

   npm run test:coverage

## Notes on failures

- If `npm run type-check` fails
  - Read the TypeScript diagnostics, fix reported type errors in src/.
  - If tsc cannot be found when running via a script, ensure npm ci completed successfully and that node_modules/.bin is available to npm scripts. Running `npx tsc -p tsconfig.build.json` can help isolate PATH issues.

- If `npm run lint:check` fails
  - Run `npm run lint:fix` to apply autofixes, then re-run `npm run lint:check`.
  - If rules are intentionally permissive or the repo imports built artifacts, consider adjusting config or adding a short comment explaining the rationale in the config file.

- If `npm run format:check` fails
  - Run `npm run format` to apply formatting, then commit and re-run the check.

- If `npm run test:coverage` fails due to coverage thresholds
  - Open the generated coverage HTML (coverage/index.html) and inspect which files are under-covered.
  - Add focused unit tests for uncovered code. Tests should use os.tmpdir(), fs.mkdtempSync for filesystem fixtures and vi.mock for mocking native modules, and must clean up after themselves.
  - If you cannot add tests immediately, relax thresholds temporarily in config/testing/vitest-jsdom.ts (document the change and add a TODO to restore thresholds). Prefer raising coverage in small PRs rather than long-term threshold relaxations.

## Reproducing the npm audit parser locally

We provide a small parser script used by CI to summarize npm audit findings. To reproduce the CI behavior locally:

1. Generate an npm audit JSON file (non-interactive):

   npm audit --json > audit.json

2. Run the parser against the generated file:

   node .github/scripts/parse-audit.js audit.json

The repository also exposes a convenience npm script that chains both steps:

   npm run security:local

If the parser detects high or critical vulnerabilities it will exit with a non-zero status and print a concise summary. Commit the resulting audit.json and a short audit summary (audit-summary.md) if you intend to open a remediation PR so reviewers can triage the findings quickly.


## Developer utilities

- Health check

  npm run health-check

  Runs a sequence of local checks (node engine, environment assumptions, tooling availability). Useful when preparing a release or debugging CI failures.

- Prepare libraries

  npm run prepare

  Creates any local symlinks or preparation steps required for the monorepo-like development environment.

## CI recommendations

- CI should run the same verification steps above in order, failing on the first error. The repository includes a `verify` script that runs an opinionated sequence. Example (CI job):

  npm ci --no-audit --no-fund
  npm run verify

- Keep package-lock.json committed for reproducible installs. If the project intentionally omits the lockfile, document why and pin versions in package.json.

## Commit hygiene

- Keep commits small and descriptive. Example: `docs: add Developer Setup & Verification guide`.
- Use `npm run lint:fix` and `npm run format` before committing changes to avoid style churn in PRs.

## Contact

For repository-level questions, open an issue or PR on GitHub.
