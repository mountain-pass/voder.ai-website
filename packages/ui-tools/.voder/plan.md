## NOW

Stage and commit the unstaged .voder metadata changes:
- Command (POSIX, non-interactive):  
  git add .voder/history.md .voder/last-action.md .voder/plan.md && git commit -m "chore(ui-tools): record voder metadata changes"

## NEXT

After the .voder metadata changes are committed, push local commits and implement the minimal, safe vertical slice in small validated steps (implement → validate → commit → push):

1. Push local commits
   - Command: git push origin main

2. Add public export barrel
   - File: src/index.ts
   - Content: re-export createPostCSSConfig and type PostCSSConfigOptions from './build/postcss.js'
   - Validate: Quick syntax check (node import or tsc when available)

3. Add minimal TypeScript config
   - File: tsconfig.json
   - Settings: { "compilerOptions": { "strict": true, "declaration": true, "module": "ESNext", "target": "ES2022" }, "include": ["src", "tests", "prettier.config.ts"] }
   - Validate: tsc --noEmit (after deps installed)

4. Add unit test for PostCSS factory
   - File: tests/build/postcss.test.ts
   - Test: import createPostCSSConfig; assert returned object has plugins array and autoprefixer is present (e.g., plugins.length > 0)

5. Update package.json scripts
   - Add:
     - "type-check": "tsc --noEmit"
     - "test": "vitest run"
     - "test:watch": "vitest"
     - "build": "tsc -p tsconfig.json"

6. Install minimal devDependencies (single non-interactive command)
   - Command:  
     npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe

7. Run validation (console-first)
   - Commands (repeat after fixes):
     - npm run type-check
     - npm test
   - Iterate: fix the smallest failing issue, re-run until both succeed

8. Commit and push the vertical slice
   - Files to stage/commit: src/index.ts, tsconfig.json, tests/, package.json (scripts), package-lock.json
   - Commit message: "feat(ui-tools): add PostCSS export, tsconfig, tests and test scripts"
   - Push: git push origin main

Notes:
- Keep changes minimal and verifiable. Do not modify files under .voder/ other than committing the already-modified metadata files noted in NOW.
- Output all command results to the console (captured in .voder/history.md).
- If additional direct dependencies are required, create an ADR and include it with package.json/package-lock changes before committing.

## LATER

After the vertical slice is green and pushed, continue incremental implementation in prioritized steps (each change: implement → validate → commit → push):

1. Implement createViteLibraryConfig (src/build/vite-library.ts) and tests (tests/build/vite-library.test.ts)
2. Implement core testing utilities (src/testing/*) and corresponding tests
3. Implement linting config factories (src/linting/*) and tests
4. Gradually add standardized scripts and dev tooling (clean, lint, format, lint:md, verify, test:ci), creating ADRs for new dependencies
5. Add README.md and CHANGELOG.md (self-contained, no internal links)
6. Add packaging & export tests (package-structure, export-equivalence, package-installation)
7. Supply-chain hardening: add "engines" when appropriate, run npm audit, integrate SCA checks
8. Audit prepare lifecycle script and document decision as ADR
9. Expand test coverage toward repository thresholds and CI-style checks
10. For every new direct dependency, author and commit an ADR alongside package.json/package-lock changes

Constraints reminder:
- Do not modify files in .voder/ except to commit the existing changes listed in NOW.
- Do not modify prompts/.
- Use POSIX-compatible, non-interactive commands.
- Always output diagnostics and command results to the console.