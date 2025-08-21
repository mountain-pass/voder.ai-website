## NOW

Commit and push the modified .voder metadata files to origin/main (create a single focused commit that records the current .voder/* changes and push it).

## NEXT

1) Re-run the full verification pipeline and capture console-first output so results go to .voder/history.md:
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

2) Inspect the verification output (consult .voder/history.md). Follow the single-path decision below:

   A) If verification SUCCEEDS (build and tests pass)
   - Align jest-axe peer metadata and record an ADR (single-change commit). Execute the non-interactive steps below (pipe all output to tee to preserve console-first history):
     - npm pkg set peerDependencies.jest-axe="^10.0.0" 2>&1 | tee /dev/stderr
     - Create the ADR file docs/decisions/0003-align-jest-axe-version.md (use a single here-doc write; include status/date/deciders/context/rationale/decision/consequences).
     - git add package.json package-lock.json docs/decisions/0003-align-jest-axe-version.md
     - git commit -m "docs(adr): align jest-axe peer dependency to dev version" 2>&1 | tee /dev/stderr
     - git push origin main 2>&1 | tee /dev/stderr
     - Re-run verification to confirm everything remains green:
       - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

   B) If verification FAILS
   - Enter the single-change loop. For each iteration:
     1. Read the most recent console output (from the command in step 1) and pick exactly one corrective action from the targeted list below. Apply only that one change, commit it, push it, then re-run the verification command. Repeat iterations until verification succeeds.
     2. Targeted corrective actions (choose exactly one per iteration):

        i) tsconfig.json exclusion of dist is missing / build overwrite error:
           - node -e "const fs=require('fs');const p='tsconfig.json';const cfg=JSON.parse(fs.readFileSync(p));cfg.exclude=Array.from(new Set([...(cfg.exclude||[]),'dist']));fs.writeFileSync(p,JSON.stringify(cfg,null,2)+'\n');console.log('updated tsconfig.json');" 2>&1 | tee /dev/stderr
           - git add tsconfig.json && git commit -m "fix: exclude dist from tsconfig to avoid overwrite errors" 2>&1 | tee /dev/stderr
           - git push origin main 2>&1 | tee /dev/stderr

        ii) Missing devDependency required by build/tests (install the single missing package):
           - npm install --no-audit --no-fund --save-dev <package-name> 2>&1 | tee /dev/stderr
           - git add package.json package-lock.json && git commit -m "chore: add devDependency <package-name> required for tests" 2>&1 | tee /dev/stderr
           - git push origin main 2>&1 | tee /dev/stderr

        iii) package.json exports point to non-existent dist paths (package-structure test failure):
           - node -e "const fs=require('fs');const p='package.json';const pkg=JSON.parse(fs.readFileSync(p));pkg.exports={'.':pkg.exports['.']};fs.writeFileSync(p,JSON.stringify(pkg,null,2)+'\n');console.log('patched package.json exports');" 2>&1 | tee /dev/stderr
           - git add package.json && git commit -m "fix: align package.json exports to compiled dist paths" 2>&1 | tee /dev/stderr
           - git push origin main 2>&1 | tee /dev/stderr

     3. After performing the chosen single corrective action, re-run:
        - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

   Notes for NEXT:
   - Preserve console-first output for every command (pipe to tee) so all results are captured in .voder/history.md.
   - Make only one corrective change per verification iteration; each change must be committed and pushed before re-running verification.
   - Do NOT modify files under prompts/ or .voder/.
   - If you repeatedly hit the same failure after a focused change, stop and re-evaluate the single corrective choice (do not apply multiple changes in one iteration).

## LATER

Once verification is reliably passing and the repository working tree is clean and pushed, proceed with incremental feature work — one vertical slice per commit, each followed by the verification loop (re-run the pipeline after every commit):

1. Add a focused unit test for createPostCSSConfig and implement any minimal test helpers required:
   - tests/build/postcss.test.ts; run verification and commit.

2. Implement the Vite library configuration factory and its tests:
   - src/build/vite-library.ts and tests/build/vite-library.test.ts; commit and verify.

3. Implement jsdom testing utilities and tests (small pieces, one file at a time):
   - src/testing/vitest-jsdom.ts → tests/testing/vitest-jsdom.test.ts
   - src/testing/helpers.ts → tests/testing/helpers.test.ts
   - src/testing/accessibility.ts → tests/testing/accessibility.test.ts
   - src/testing/setup.ts (test environment) — commit and verify after each addition.

4. Add markdown-lint config generator and package scripts:
   - scripts/generate-markdownlint-config.ts; add lint:md and lint:md:fix scripts in package.json; commit and verify.

5. Add lint/format configs and standardized scripts:
   - eslint.config.js (import from @voder/dev-config), prettier.config.js export; add lint, lint:fix, format, format:check, verify scripts; commit and verify.

6. Adopt dual-export pattern and add integration tests:
   - Expand package.json exports to include dedicated paths (./testing, ./prettier, ./eslint → ./dist/...), add export-equivalence and package-installation integration tests; commit and verify.

7. Add README.md and CHANGELOG.md (consumer-facing, self-contained):
   - Populate README with usage, security posture, UNLICENSED notice, and verify instructions; add CHANGELOG.md using template; commit and verify.

8. Expand tests to meet coverage & quality targets:
   - Incrementally add unit/integration tests until coverage thresholds are met; run npm run test:ci and iterate.

Constraints & reminders (apply to all steps)
- Only one corrective change per verification iteration while in the failure loop.
- Do not modify files under prompts/ or .voder/.
- Use POSIX-compatible, non-interactive commands; ensure all output is console-first and captured via tee.
- Scope all git commands to the current working directory and always push commits (git push origin main) after committing.