# Voder Pre-launch Website

A small static pre-launch site showcasing the Voder project. This repository contains the source for the site, developer tooling (ESLint, Prettier, Vitest), and scripts used during development and CI.

## Quick start

Prerequisites

- Node.js >= 22.17.0 (the project enforces this via package.json `engines`). We recommend using a Node version manager such as nvm, asdf, or Volta.

Install dependencies (non-interactive)

- npm ci

Run locally

- npm run dev
  Starts the Vite dev server (default: <http://localhost:5173>). Open that URL in the browser.

Build for production

- npm run build
  Produces a production build in the `dist/` directory.

Preview production build

- npm run preview
  Serves the `dist/` build locally for a quick smoke test.

Type checking

- npm run type-check
  Runs TypeScript checking (no emit).

Tests

- npm test
  Runs the test suite (Vitest, jsdom).
- npm run test:coverage
  Runs tests and generates a coverage report (text + html). The HTML report is written to `coverage/index.html`.
- npm run screenshots
  Runs Playwright E2E tests locally to generate visual regression screenshots.
- npm run e2e:ci:prod
  Runs production verification tests against <https://voder.ai> to ensure the deployed site is working correctly and not showing hosting provider holding pages.

Lint and format

- npm run lint
- npm run lint:fix
- npm run format
- npm run format:check

Health and maintenance scripts

- npm run prepare
  Runs `scripts/prepare-libraries.js` (used by the development environment).
- npm run health-check
  Runs `scripts/health-check.js` to validate local environment assumptions.

Git hooks

- The repository uses `simple-git-hooks` to enforce quality standards on every commit
- Pre-commit hooks automatically run: lint:check, format:check, type-check, test:ci
- Hooks are installed automatically during `npm install` via the postinstall script
- All quality checks must pass before commits are allowed
- To bypass hooks temporarily (not recommended): `git commit --no-verify`

Verification (CI-local)

- The repository provides a `verify` script which runs an opinionated sequence of checks intended for CI and developer verification:

  npm run verify

  The sequence includes an audit fix, lint autofix, lint checks, format checks, a production build and the test suite with coverage. Run this locally when preparing a release or when a PR touches build/config files.

Notes for contributors

- Tests are designed to avoid writing files into the repository. If you need file fixtures in tests, use `os.tmpdir()` and ensure artifacts are cleaned up.
- The test configuration focuses coverage on application source under `src/`. If you add source used by runtime, ensure tests exercise it so coverage remains accurate.

Troubleshooting

- If `npm ci` fails due to node engine mismatch, switch your Node version to a compatible one (>=22.17.0).
- If lint or format fails, run `npm run lint:fix` or `npm run format` and re-run verification.
- If tests fail locally but pass in CI, ensure you have installed dependencies with `npm ci` (CI uses a lockfile to install reproducible versions).

Contact

- For repository-level questions, open an issue or PR on GitHub.
