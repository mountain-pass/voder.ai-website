## PLAN (focused on the NEXT PRIORITY: create a small, safe vertical slice, commit it, and validate)

## NOW
Run a single commit to record the current scaffold and documentation so we have a clean VCS baseline:
- Command to run now (single, non-interactive):
  git add . && git commit -m "chore(ui-tools): initial docs and package scaffold"

Reason: version control must be clean before we add code and run installs; this unblocks reproducible work and preserves current ADRs/docs.

## NEXT
After the commit above, implement a minimal vertical slice that makes the package runnable and testable (PostCSS factory + test). Perform these steps in order (all non-interactive POSIX commands):

1. Ensure prepare script won't execute arbitrary external code during npm install:
   - Check for the referenced prepare script and, if missing, safely replace it with a no-op (non-interactive):
     node -e "const fs=require('fs'); if(!fs.existsSync('../../setup-package-docs.js')){const p=JSON.parse(fs.readFileSync('package.json','utf8')); p.scripts = p.scripts||{}; p.scripts.prepare = 'echo \"prepare skipped\"'; fs.writeFileSync('package.json', JSON.stringify(p,null,2)); console.error('prepare replaced with no-op');} else console.error('prepare exists, leaving unchanged');"

2. Create source files for the vertical slice:
   - mkdir -p src/build tests/build
   - Create src/build/postcss.ts (implement createPostCSSConfig as described in the guide).
   - Create src/index.ts that exports createPostCSSConfig.
   - Create tests/build/postcss.test.ts — Vitest test that imports createPostCSSConfig and asserts it returns an object containing autoprefixer in plugins or an expected structure.

   (Use your preferred non-interactive file creation method, e.g., cat > src/build/postcss.ts <<'EOF' ... EOF)

3. Add a minimal tsconfig.json covering src/ and tests/:
   - Create tsconfig.json with strict mode, module ESNext, target ES2022 and include src and tests and prettier.config.ts if present.

4. Update package.json scripts to support type-check and tests:
   - Add/update scripts:
     - "type-check": "tsc --noEmit"
     - "test": "vitest run"
     - "test:watch": "vitest"
     - "build": "tsc -p tsconfig.json"
   - (Modify package.json in-place via a small node script or editor; non-interactive example: node -e "...read/modify/write package.json...")

5. Install minimal devDependencies required for this vertical slice (non-interactive):
   - npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe
   - (Keep package-lock.json committed for reproducibility after install.)

6. Run local validation (console-first):
   - npm run type-check
   - npm test

7. Commit the vertical-slice implementation and lockfile:
   - git add src/ tests/ tsconfig.json package.json package-lock.json
   - git commit -m "feat(ui-tools): add minimal PostCSS factory + tests; add tsconfig and test scripts"

8. Iterate to fix any failing tests or type errors until the vitest run and type-check succeed. Capture all output to console (history file will record automatically).

Rationale: this is the smallest, useful feature that validates the build/test pipeline, demonstrates working code + tests, and forms a pattern for incremental additions.

## LATER
Once the vertical slice is committed and tests pass, continue expanding the package in small increments (each increment: implement + test + commit):

- Implement createViteLibraryConfig (src/build/vite-library.ts) with tests (tests/build/vite-library.test.ts).
- Implement testing utilities (src/testing/*): createVitestJsdomConfig, helpers, accessibility, setup; add corresponding tests and DOM environment tests.
- Implement linting config factories (src/linting/*) and tests validating structure.
- Add package-structure and export-equivalence tests (tests/package-structure.test.ts, tests/export-equivalence.test.ts) and, if needed, a small dist build to verify exports per the Universal Guide.
- Restore or adopt a safe prepare script if required (and document its behavior); re-enable the original prepare only after reviewing its code.
- Add standardized scripts per the Universal Guide: clean, lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify, dev, test:ci; and install corresponding devDependencies (eslint, prettier, markdownlint-cli2, etc.) accompanied by ADRs for any new dependencies.
- Add README.md (consumer-facing) using the provided README template; run markdown linting and include it in CI/verify.
- Run npm audit and address high/critical findings; add automated SCA to verify pipeline and add the engines field ("node": ">=22.6.0") if TypeScript-config-as-code patterns are used.
- Add ADRs for any new direct dependencies (per governance), and add automated tests for version alignment (e.g., vitest vs @vitest/coverage-v8) if/when those dependencies are added.

Ordering principle: always make one small, testable change, run the test/type-check/build cycle, commit the change, then proceed.

---

If you want, I can now generate the exact minimal file contents (src/build/postcss.ts, src/index.ts, tests/build/postcss.test.ts, tsconfig.json) and the node snippets to patch package.json scripts so you can apply the NEXT steps non-interactively. Which would you like me to prepare next?