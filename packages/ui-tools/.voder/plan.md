## NOW
Run the non-interactive commit that records the ESLint autofix changes:
git add -A && git commit -m "fix(lint): apply eslint fixes to src and tests" || true

## NEXT
1. Install dev tooling reproducibly so lint/type/test commands are available:
   - npm ci --silent --no-audit --no-fund

2. Remove redundant local .eslintignore if present (non-interactive) and commit the removal:
   - if [ -f .eslintignore ]; then git rm .eslintignore && git commit -m "chore(lint): consolidate ignores into eslint.config.js" || true; fi

3. Run the full verification pipeline and capture console output for diagnosis:
   - npm run verify
   - If verify succeeds → continue to step 5.
   - If verify fails due to ESLint parsing / project-scope errors (ESLint attempting type-check on files outside src/tests), update tsconfig.eslint.json to restrict ESLint scope:
     - Edit tsconfig.eslint.json "include" to ["src","tests"] and "exclude" to ["dist","build","coverage","node_modules"]
     - Then run the type-aware ESLint autofix using the restricted config and commit fixes:
       - npx eslint "src/**" "tests/**" --ext .ts,.js --parser-options "project=./tsconfig.eslint.json" --fix || true
       - git add -A && git commit -m "fix(lint): apply eslint fixes using tsconfig.eslint.json" || true
     - Re-run: npm run verify

4. If verify still fails, inspect the failing category:
   - Lint errors: re-run ESLint with the above command, address remaining errors (types, parserOptions) and commit.
   - Type-check errors: run npm run type-check, fix TypeScript errors in source/tests, commit fixes.
   - Build/test failures: run npm run build and npm test separately to capture logs and fix root causes; commit fixes.

5. Once `npm run verify` completes green locally, push the validated changes:
   - git push origin main

## LATER
1. Add a unit test verifying the jsdom setup guard (tests/testing/setup-vitest-guard.test.ts) so the test-only patches run only under Vitest; run tests and commit.
2. Implement a markdown-lint generator script:
   - Create scripts/generate-markdownlint.ts (uses @voder/dev-config/linters/markdown.getConfig()) and a package.json script "generate:markdownlint": "node ./scripts/generate-markdownlint.js"
   - Optionally integrate into prepare and ensure .markdownlint.json is generated consistently.
3. Add CONTRIBUTING.md with Node version, quick-start, and `npm run verify` instructions; commit.
4. Add an optional package-installation integration test (tests/installation/*) that packs the package and installs it into a temp consumer; make it opt-in or gated so it doesn't cause flakiness.
5. After local validation, coordinate periodic dependency audits and record any required ADRs for pinned/critical devDependency changes (document in docs/decisions/).