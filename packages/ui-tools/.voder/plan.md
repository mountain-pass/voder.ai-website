## NOW
Run a single non-interactive commit to persist the modified .voder metadata so the working tree is clean:
git commit -am "chore(ui-tools): persist .voder metadata updates"

## NEXT
After the NOW commit completes, perform these steps in order (each is a separate action you will run sequentially):

1. Remove tracked build outputs from git index (so dist/ becomes ignored) and commit that change:
   - git rm --cached -r dist/ && git commit -m "chore(ui-tools): untrack dist/ build artifacts"

2. Push commits to the remote to synchronize branch state:
   - git push origin main

3. Run the full verification pipeline as a single chained command and capture the complete stdout/stderr:
   - npm run type-check && npm run build && npm test
   - Paste the full console output (stdout + stderr) exactly as produced.

4. If the verification pipeline fails at any step, report the full captured output here. We will plan exactly one focused remediation commit to address the single blocking error, apply it, and then re-run the exact same verification pipeline (same chained command) and paste results.

Notes for NEXT:
- Do not modify any files under .voder/ or anything in prompts/ while doing these steps.
- Preserve console-first output: all results must be pasted here to form the next iteration's history.

## LATER
Once the verification pipeline completes successfully (or completes successfully after one remediation cycle), continue incrementally (one purposeful commit + verification run per slice). Follow this ordered list of vertical slices (run the full verification pipeline after each commit and paste outputs):

1. Build-factory slice
   - Implement src/build/vite-library.ts exporting createViteLibraryConfig.
   - Add tests: tests/build/vite-library.test.ts.
   - Export the new API from src/index.ts.
   - Commit, push, run verification.

2. Testing & accessibility slice
   - Implement src/testing/{vitest-jsdom.ts, helpers.ts, accessibility.ts, setup.ts}.
   - Add unit tests for testing helpers and accessibility utilities.
   - Add a vitest version-alignment test (vitest vs @vitest/coverage-v8).
   - Commit, push, run verification.

3. Packaging & export-tests slice
   - Add "main", "types", and "exports" to package.json pointing at dist/.
   - Ensure build copies/produces expected files in dist/.
   - Add tests: package-structure.test.ts, package-exports.test.ts, export-equivalence.test.ts, package-installation.test.ts.
   - Commit, push, run verification.

4. Linting & markdown slice
   - Implement src/linting/{html.ts, css.ts, accessibility.ts} and export barrel.
   - Ensure prepare script writes .markdownlint.json from @voder/dev-config; add package.json scripts lint:md and lint:md:fix.
   - Add tests validating markdown config generation.
   - Commit, push, run verification.

5. Scripts & docs slice
   - Add standardized scripts (verify, lint, lint:fix, format, format:check) to package.json.
   - Add README.md (self-contained, UNLICENSED, include security posture) and CHANGELOG.md.
   - Commit, push, run verification.

6. ADRs & supply-chain hardening
   - For any new direct dependency or exact-version pinning, add ADRs under docs/decisions/ bundled with package.json/package-lock changes.
   - Add automated tests/checks verifying dependency alignment and run npm audit as part of verify workflow.
   - Commit, push, run verification.

Important global constraints for all steps (NOW, NEXT, LATER)
- Make only single-purpose commits.
- Do not modify files in .voder/ or prompts/.
- Do not create repository output files (logs, temp files) — if temporary files are necessary use OS temp directory and clean up.
- Always run the full verification pipeline after each commit and paste the complete console output here.