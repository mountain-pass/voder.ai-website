## PLAN

### NOW
Commit the outstanding .voder metadata changes to stabilize the working tree.

- Single action (non-interactive):
  git add .voder && git commit -m "chore(ui-tools): commit pending voder metadata updates"

### NEXT
After the .voder changes are committed, implement the minimal, safe vertical slice (implement → validate → commit → push). Do the following steps in order; each step should be applied, validated, and committed before moving to the next.

1) Add public export barrel
- File: src/index.ts
- POSIX command:
  mkdir -p src && cat > src/index.ts << 'EOF'
  // Minimal public export barrel for @voder/ui-tools
  export { createPostCSSConfig, type PostCSSConfigOptions } from './build/postcss.js';
  EOF

2) Add minimal TypeScript config
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

3) Add smallest unit test for the PostCSS factory
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

4) Update package.json scripts (add minimal scripts)
- Add these scripts to package.json:
  - "type-check": "tsc --noEmit"
  - "test": "vitest run"
  - "test:watch": "vitest"
  - "build": "tsc -p tsconfig.json"
- Non-interactive update example:
  node -e "const p=require('./package.json'); p.scripts = Object.assign(p.scripts||{}, { 'type-check':'tsc --noEmit','test':'vitest run','test:watch':'vitest','build':'tsc -p tsconfig.json' }); require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2));"

5) Create ADR documenting the new dev tooling (must be committed with package.json changes)
- File: docs/decisions/0002-add-dev-deps-for-ui-tools.md
- POSIX command (exact content):
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

6) Install minimal devDependencies (run only after ADR file is created)
- Single non-interactive command:
  npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe

7) Validate locally (console-first)
- Run these commands (fix the smallest failure and re-run until green):
  npm run type-check
  npm test
- Keep all output to the console so it is captured in .voder/history.md.

8) Commit the vertical slice and push
- Stage & commit (non-interactive):
  git add src/index.ts tsconfig.json tests package.json package-lock.json docs/decisions/0002-add-dev-deps-for-ui-tools.md
  git commit -m "feat(ui-tools): add PostCSS export, tsconfig, tests and test scripts; add ADR for dev deps"
- Push:
  git push origin main

Notes for NEXT:
- If any additional direct dependency is needed beyond step 6, create an ADR (docs/decisions) documenting the dependency and include it with the package.json/package-lock changes before committing.
- Keep each change minimal and verifiable. Validate (type-check/tests) after each implement step and do not proceed until green.
- Do not modify files under .voder/ (only commit the already-existing .voder changes in NOW).
- All commands must be non-interactive and POSIX-compatible. Print outputs to console for .voder/history.md.

### LATER
After the minimal vertical slice is green, committed and pushed, continue incremental implementation (each change: implement → validate → commit → push):

1) Implement Vite library config factory
- File: src/build/vite-library.ts
- Test: tests/build/vite-library.test.ts
- Validate: unit tests + tsc

2) Implement testing utilities and environment setup
- Files: src/testing/vitest-jsdom.ts, src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts
- Tests: tests for each utility; add test:ci coverage scripts

3) Implement linting config factories and markdown-lint generation
- Files: src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts
- Add lint:md and lint:md:fix scripts and declare markdownlint-cli2 as peer dependency per inherited ADR

4) Add consumer-facing README.md and CHANGELOG.md (self-contained; do not reference prompts/)
- Include installation, quick-start, API summary, security posture, and ADR links (docs/decisions)

5) Add package.json exports, build pipeline, produce dist/ via tsc, then add package-structure and export-equivalence tests that validate exports point to ./dist/

6) Add verify/clean scripts and test:ci coverage provider alignment (if adding @vitest/coverage-v8 follow ADR-0005 and create the ADR documenting exact version alignment)

7) Supply-chain hardening & lifecycle script audit
- Add "engines" to package.json if Node >=22.6.0 is required
- Run npm audit, address findings, and integrate SCA/registry-mirror steps per ADR-0007
- Audit the prepare lifecycle script (../../setup-package-docs.js) and, if necessary, document and harden its behavior in an ADR

8) Expand test coverage to meet policy thresholds (≥90% overall, 100% public API) and add CI-style test runs (test:ci). Add automated checks to ensure no secrets are printed to console/history.

Constraints & reminders (repeated for clarity)
- Only the single NOW action may be performed immediately.
- Do not modify files in .voder/ other than committing the pending changes.
- All commands must be non-interactive, POSIX-compatible, and print output to console.
- For any new direct dependency, create and commit an ADR alongside package.json/package-lock changes.