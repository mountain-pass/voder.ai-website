## PLAN (focused on NEXT PRIORITY: clean working tree → unblock verification)

## NOW
Run a single non-interactive commit to record the modified .voder metadata and produce a clean working tree:

git commit -a -m "chore: record .voder metadata changes"

(Explanation: git commit -a will commit all modified tracked files — including the modified .voder/* files shown in git status — without staging separately. This leaves the working tree clean so we can re-run the verification pipeline.)

## NEXT
1. Re-run the full verification pipeline and capture console output:
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

2. Inspect the verification output (console / .voder/history.md). Then follow the single-path decision:

   - If verification SUCCEEDS (build + tests pass):
     a. Add a focused unit test for the PostCSS factory to increase test coverage:
        - Create tests/build/postcss.test.ts with assertions that:
          - createPostCSSConfig() returns an object with a plugins array
          - autoprefixer is included and configured with the default browsers list
     b. Commit the test and push:
        - git add tests/build/postcss.test.ts && git commit -m "test: add unit test for createPostCSSConfig" && git push origin main
     c. Re-run verification:
        - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

     (Then continue incremental implementation of missing features one small change + verify at a time.)

   - If verification FAILS:
     Enter the single-change remediation loop. For EACH iteration:
     a. Read the latest console output (captured to .voder/history.md).
     b. Choose exactly ONE corrective action from the targeted list below, apply it, commit, push, then re-run verification.
     c. Repeat until verification succeeds.

     Targeted corrective actions (choose exactly one per iteration):

     i) TS5055 / tsc trying to write into dist/:
        - Ensure tsconfig.json excludes dist:
          node -e "const fs=require('fs');const p='tsconfig.json';const cfg=JSON.parse(fs.readFileSync(p));cfg.exclude=Array.from(new Set([...(cfg.exclude||[]),'dist']));fs.writeFileSync(p,JSON.stringify(cfg,null,2)+'\n');console.log('updated tsconfig.json');" 2>&1 | tee /dev/stderr
        - git add tsconfig.json && git commit -m "fix: exclude dist from tsconfig to avoid overwrite errors" && git push origin main

     ii) Missing devDependency required by build/tests (install exactly one package):
        - npm install --no-audit --no-fund --save-dev <package-name> 2>&1 | tee /dev/stderr
        - git add package.json package-lock.json && git commit -m "chore: add devDependency <package-name> required for tests" && git push origin main

     iii) package.json exports point to non-existent dist paths (package-structure test failure):
        - node -e "const fs=require('fs');const p='package.json';const pkg=JSON.parse(fs.readFileSync(p));pkg.exports={'.':pkg.exports['.']};fs.writeFileSync(p,JSON.stringify(pkg,null,2)+'\n');console.log('patched package.json exports');" 2>&1 | tee /dev/stderr
        - git add package.json && git commit -m "fix: align package.json exports to compiled dist paths" && git push origin main

     - After performing the chosen single corrective action, re-run:
       - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

Notes for NEXT:
- Preserve console-first output for every command (pipe to tee) so results are captured in .voder/history.md.
- Only one corrective change per verification iteration while in the failure loop.
- Do not modify files under prompts/ or .voder/ (committing .voder changes is allowed but do not edit their contents).
- All git commands must be non-interactive and scoped to the repo working directory.

## LATER
After the working tree is clean and verification reliably passes, continue incremental work (one small vertical slice per commit + verify):

1. Add missing unit/integration tests incrementally (one test file per commit + verify):
   - tests/build/vite-library.test.ts: validate createViteLibraryConfig produces ESM-only formats and includes PostCSS config
   - tests/testing/vitest-jsdom.test.ts
   - tests/testing/helpers.test.ts (renderComponent, simulateClick, waitForAnimation/next frame)
   - tests/testing/accessibility.test.ts (expectAccessible/getAccessibilityViolations)
   - tests/testing/setup.test.ts (jsdom mocks & cleanup)
   - tests/export-equivalence.test.ts and tests/package-installation.test.ts (npm pack → temporary install)
   - After each test file: git add, commit, push, run verification.

2. Implement missing source features incrementally (one file + its tests per iteration):
   - src/build/vite-library.ts + tests
   - src/testing/vitest-jsdom.ts, src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts + tests
   - src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts + tests
   - scripts/generate-markdownlint-config.ts and package scripts for lint:md / lint:md:fix

3. Add code quality & packaging scaffolding in small steps:
   - Add eslint.config.js (import layers from @voder/dev-config) → commit → verify
   - Add prettier.config.js (import from @voder/dev-config) → commit → verify
   - Expand package.json scripts (lint, lint:fix, format, format:check, verify) → commit → verify

4. Adopt dual-export pattern and run integration tests:
   - Expand package.json exports (./testing, ./prettier, ./eslint) pointing to ./dist/
   - Add tests verifying dedicated exports and main index export equivalence → commit → verify

5. Documentation & packaging:
   - Add README.md (template-based, UNLICENSED license notice, security posture, quickstart)
   - Add CHANGELOG.md initial entry
   - Generate .markdownlint.json via scripts/generate-markdownlint-config.ts and add lint:md scripts
   - Commit docs and re-run verification

6. Ongoing maintenance & governance:
   - Keep vitest / @vitest/coverage-v8 and other aligned dependencies updated per ADR and verify after any changes
   - Run npm audit periodically and update lockfile as needed
   - Continue one-change-per-iteration discipline: implement → test → commit → push → verify

---

If you want, I can now (a) produce the exact test file contents for tests/build/postcss.test.ts (ready to write), or (b) prepare the tsconfig.json patch command if verification shows TS5055 still occurs after the NOW commit. Which follow-up should I prepare for you next?