## NOW

Stage and commit the modified .voder metadata files to produce a clean working tree:
- Action (single non-interactive command):
  git add .voder && git commit -m "chore(ui-tools): record voder metadata changes"

## NEXT

After the .voder files are committed, complete a minimal, safe vertical slice (small atomic edits → validate → commit) focused on making the PostCSS factory importable and testable:

1. Add public export barrel
   - File: src/index.ts
   - Export createPostCSSConfig and type PostCSSConfigOptions from './build/postcss.js'
   - Validate: Ensure the file is syntactically correct

2. Add unit test for PostCSS factory
   - File: tests/build/postcss.test.ts
   - Test: createPostCSSConfig() returns an object with a plugins array and that autoprefixer is present (assert plugin presence/behavior)
   - Validate: Tests will run after installing devDependencies

3. Add minimal TypeScript project config
   - File: tsconfig.json
   - Settings: "strict": true, "declaration": true, "module": "ESNext", "target": "ES2022", include ["src", "tests", "prettier.config.ts" if present]
   - Validate: tsc --noEmit should run after devDependencies are installed

4. Update package.json scripts (non-interactive)
   - Add:
     - "type-check": "tsc --noEmit"
     - "test": "vitest run"
     - "test:watch": "vitest"
     - "build": "tsc -p tsconfig.json"
   - Do not modify files under .voder/ or prompts/

5. Install minimal devDependencies (single non-interactive command)
   - Command:
     npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe
   - Governance: If additional direct dependencies are required beyond this minimal set, create an ADR and include it with the package.json/package-lock changes

6. Run validation (console-first)
   - Commands to run and inspect:
     - npm run type-check
     - npm test
   - Iterate: fix the smallest failing issue, re-run the two commands, repeat until both succeed

7. Commit and push the minimal vertical slice
   - Files to stage/commit: src/, tests/, tsconfig.json, package.json (scripts), package-lock.json (result of install)
   - Commit message: "feat(ui-tools): add PostCSS export, tsconfig, tests and test scripts"
   - Push: git push origin main

## LATER

Once the vertical slice is green and pushed, continue incremental implementation in prioritized steps (each change: implement → validate → commit → push):

1. Implement createViteLibraryConfig
   - File: src/build/vite-library.ts
   - Tests: tests/build/vite-library.test.ts (assert lib.formats === ['es'] and css.postcss exists)

2. Implement core testing utilities (jsdom)
   - Files: src/testing/vitest-jsdom.ts, src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts
   - Add corresponding unit tests

3. Implement linting configuration factories and tests
   - Files: src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts
   - Unit tests validating returned config shapes

4. Add standardized package scripts & dev tooling incrementally
   - Scripts to add over time: clean, lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify, dev, test:ci
   - Install ESLint, Prettier, markdownlint-cli2 and other tooling as devDependencies; for each new direct dependency create an ADR bundled with the package.json/package-lock changes

5. Add README.md and CHANGELOG.md
   - Create a self-contained package README (no internal paths) following the project template; include security posture and usage examples

6. Add packaging & export tests
   - Implement tests for package structure, export-equivalence, and package-installation integration
   - Add build step producing dist/ (gitignored) as needed for export tests

7. Supply-chain hardening & engines
   - Add "engines": { "node": ">=22.6.0" } when appropriate
   - Run npm audit, triage findings, and integrate SCA checks into the verify pipeline

8. Safely audit/enable prepare script
   - Inspect ../../setup-package-docs.js; if safe, enable prepare lifecycle behavior, otherwise implement a safe no-op alternative and document via ADR

9. Expand test coverage and CI-style checks
   - Add package-installation integration tests and iteratively increase coverage toward project thresholds

10. Governance: ADRs for dependency changes
    - For every new direct dependency or toolchain change, author and commit an ADR in docs/decisions/ alongside package.json/package-lock changes

Constraints reminder:
- Do not modify .voder/ or prompts/
- Use POSIX-compatible, non-interactive commands
- Keep edits minimal and validated before committing
- Preserve console-first outputs for history/context