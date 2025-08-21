## NOW

Run a single commit of all currently modified tracked files:
git commit -a -m "chore(ui-tools): persist dependency and .voder metadata changes"

## NEXT

1. Push the committed changes to the remote:
   - git push origin main

2. Re-run the full verification pipeline and capture complete stdout+stderr:
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

3. Save the full console output from step 2 (stdout+stderr) and inspect it to identify the single first blocking error that prevents the verification pipeline from completing.

(Do NOT modify files under .voder/ and do not run interactive commands.)

## LATER

After the verification output is captured and the first blocking error is identified:

1. Make one focused remediation commit that targets only the first blocking error (one small change per commit). Examples based on likely blockers:
   - If Vitest fails due to a missing optional plugin referenced by a generated Vite config: ensure the runtime vite.config.ts used by tests is the guarded file already committed or remove/guard the reference that pulls the optional plugin.
   - If a test imports a missing source file/export: add the minimal missing export or fix the import path.
   - If package.json exports are missing or invalid: add a minimal "main"/"types"/"exports" map pointing to dist/ and run a build.

2. Push the remediation commit:
   - git push origin main

3. Re-run the verification pipeline (same command as NEXT.2) and capture output; repeat focused remediation commits until the verification pipeline progresses past the initial blocker.

4. Once the verification pipeline (type-check, build, and tests) completes reliably:
   - Implement the prioritized vertical slices, in small focused commits with verification after each:
     a. Build-factory slice: add src/build/vite-library.ts and tests (tests/build/vite-library.test.ts); export from src/index.ts.
     b. Testing & accessibility slice: add src/testing/vitest-jsdom.ts, helpers.ts, accessibility.ts, refine setup.ts, and corresponding unit tests + vitest/@vitest/coverage-v8 alignment test.
     c. Packaging & export-tests slice: add "main", "types", and "exports" map to package.json, ensure build emits expected files, add tests for package-structure and package-exports.
     d. Linting & markdown slice: implement src/linting/* factories, add script to generate .markdownlint.json via @voder/dev-config, and add lint:md / lint:md:fix scripts and tests for generation.
     e. Scripts & docs slice: add standardized scripts (verify, lint, format, format:check), add README.md (UNLICENSED + security posture) and CHANGELOG.md template.
     f. ADRs & supply-chain hardening: add ADRs for any new direct deps or exact-version pins; integrate npm audit into verify and add tests for dependency/version alignment.

5. After each small commit above, run:
   - npm run type-check && npm run build && npm test
   and capture console output to ensure the change is safe and documented in history.

Notes/constraints reminder:
- Do not modify or commit files under .voder/.
- Do not run interactive commands.
- Keep each change minimal and verify immediately with the pipeline.