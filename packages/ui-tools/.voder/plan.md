## PLAN

### NOW
Run a single non-interactive command to persist any tracked .voder metadata changes (if present) and push local commits to origin/main so the repo is synchronized.

POSIX command:
git add .voder && git commit -m "chore(ui-tools): persist .voder metadata" || true && git push origin main

### NEXT
After the NOW command completes (verify push succeeded), implement and validate the minimal safe vertical slice — apply each step, validate (type-check + tests), then commit & push before moving to the next step.

1) Add minimal TypeScript config
- File: tsconfig.json
- POSIX command:
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["src", "tests", "prettier.config.ts"]
}
EOF

- Validate:
  - npm run type-check (will be available after adding scripts & deps below)
  - If type-check fails, fix minimal typing issues and re-run.

2) Add smallest unit test for the PostCSS factory
- File: tests/build/postcss.test.ts
- POSIX command:
mkdir -p tests/build && cat > tests/build/postcss.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { createPostCSSConfig } from '../../src/build/postcss.js';

describe('PostCSS factory', () => {
  it('returns a config with plugins and includes autoprefixer', () => {
    const cfg = createPostCSSConfig();
    expect(cfg).toBeDefined();
    expect(Array.isArray(cfg.plugins)).toBe(true);
    expect(cfg.plugins.length).toBeGreaterThan(0);
  });
});
EOF

- Validate:
  - Run the test suite (after adding devDeps and scripts below).
  - If the test reports failures, fix code/tests and re-run.

3) Update package.json scripts (add minimal scripts)
- Changes to make:
  - Add these scripts to package.json:
    - "type-check": "tsc --noEmit"
    - "test": "vitest run"
    - "test:watch": "vitest"
    - "build": "tsc -p tsconfig.json"
- Non-interactive update command:
node -e "const p=require('./package.json'); p.scripts = Object.assign(p.scripts||{}, { 'type-check':'tsc --noEmit','test':'vitest run','test:watch':'vitest','build':'tsc -p tsconfig.json' }); require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2));"

- Validate:
  - Inspect package.json to confirm scripts added.

4) Create ADR documenting the new dev tooling (must be committed with package.json changes)
- File: docs/decisions/0002-add-dev-deps-for-ui-tools.md
- POSIX command:
mkdir -p docs/decisions && cat > docs/decisions/0002-add-dev-deps-for-ui-tools.md << 'EOF'
---
status: 'accepted'
date: 2025-08-21
deciders: [voder-dev-team]
packages: '@voder/ui-tools'
---
# Add development tooling for @voder/ui-tools

Decision: Add TypeScript and test tooling as devDependencies (typescript, vitest, @types/node, postcss, autoprefixer, @testing-library/dom, jest-axe) to enable local development, type-checking and unit tests.

Rationale: Required to author and validate the package implementation and tests locally and in CI. These will be added as devDependencies and documented here.
EOF

- Validate:
  - Confirm file exists and content matches.

5) Install minimal devDependencies (run only after ADR file is created)
- Non-interactive install command:
npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe

- Validate:
  - Confirm node_modules/ populated (not inspected by LLM but must complete successfully).
  - Ensure package-lock.json updated.

6) Run local validations (type-check & tests)
- Commands to run (console-first):
npm run type-check
npm test

- Validation goals:
  - Type-check must complete without errors.
  - Tests must run and pass (the PostCSS unit test should pass).
  - If either step fails, fix the smallest issue (type or test), re-run, and iterate until green.

7) Commit the vertical slice and push
- Files to stage (adjust if package-lock.json changed name/exists):
git add src/index.ts tsconfig.json tests package.json package-lock.json docs/decisions/0002-add-dev-deps-for-ui-tools.md || true
git commit -m "feat(ui-tools): add tsconfig, PostCSS unit test, scripts; ADR for dev deps" || true
git push origin main

- Validate:
  - Confirm commit succeeded and push completed.
  - If commit fails because nothing changed, double-check staged files and re-run the add/commit commands as needed.

Notes for NEXT steps:
- If additional direct dependencies are required during validation, create an ADR documenting them (docs/decisions) and include the ADR with the package.json/package-lock changes before committing.
- Keep each change minimal and verifiable. Do not proceed to the next numbered step until the current step's validation is green and committed.
- Do not modify files under .voder/ other than committing existing tracked changes (NOW step takes care of persisting them).
- All commands must be non-interactive and POSIX-compatible. Preserve console output for .voder/history.md.

### LATER
After the minimal vertical slice is green, committed and pushed, continue incremental implementation (each change: implement → validate → commit → push):

1) Implement Vite library config factory
- File: src/build/vite-library.ts
- Test: tests/build/vite-library.test.ts
- Validate: unit tests + tsc; commit and push.

2) Implement testing utilities and environment setup
- Files: src/testing/vitest-jsdom.ts, src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts
- Tests: tests for each utility (helpers, accessibility wrappers, setup); run coverage via test:ci; commit and push.

3) Implement linting config factories and markdown-lint generation
- Files: src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts
- Add lint:md and lint:md:fix scripts and declare markdownlint-cli2 as peer dependency per inherited ADR; add tests that generate .markdownlint.json programmatically and validate its structure.

4) Add a consumer-facing README.md and CHANGELOG.md (self-contained; do not reference prompts/)
- Include install, quick-start examples (vite + vitest), security posture, and ADR links (docs/decisions).

5) Add package.json exports and build pipeline, produce dist/ via tsc
- Update package.json exports to point to ./dist/
- Run build, add package-structure and export-equivalence tests that validate exports point to ./dist/ files; commit & push.

6) Add verify/clean scripts and handle coverage provider alignment per ADR-0005
- If adding @vitest/coverage-v8, create the ADR documenting exact version alignment and add devDependency versions accordingly; add tests that assert version alignment.

7) Supply-chain hardening & lifecycle script audit
- Add "engines" to package.json if Node >=22.6.0 is required.
- Run npm audit, address findings, and integrate SCA/registry-mirror steps per ADR-0007.
- Audit the prepare lifecycle script (../../setup-package-docs.js) and document/harden behavior in an ADR if needed.

8) Expand test coverage to meet policy thresholds (≥90% overall, 100% public API)
- Add more unit/integration tests (exports, package-installation tests using npm pack in temp dirs), iterate until coverage thresholds met; commit & push each increment.

Constraints & reminders
- Only the single NOW compound command should be executed immediately.
- Follow the validate → commit → push cycle for each NEXT action.
- Do not modify files in `.voder/` except to commit existing tracked changes.
- All commands must be non-interactive, POSIX-compatible, and keep console output for .voder/history.md.
- For any new direct dependency, create and commit an ADR alongside package.json/package-lock changes.