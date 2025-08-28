## NOW

Move the first file reported by tsc into src/ (one git mv), then re-run the TypeScript compiler:

- git mv packages/dev-config/scripts/copy-assets.ts packages/dev-config/src/scripts/copy-assets.ts
- npx tsc -p tsconfig.build.json

(The last tsc run reported TS6059 for scripts/copy-assets.ts first, so move that single file and re-run. Use one file-move per iteration and stop on the first new error.)

## NEXT

After the NOW single-file move and re-check, follow this ordered, non-interactive sequence and stop on the first failure:

1. Inspect the first tsc error:
   - If tsc reports no errors, skip to step 3.
   - If the first error is TS6059 or TS2209 referencing a top-level file (file listed in tsconfig.build.json include but outside src), move exactly that single file into src/ (preserve directory structure) with git mv and re-run tsc.
     - Use one file move per iteration. Examples (pick the single file the compiler references):
       - git mv scripts/generate-markdownlint-config.ts src/scripts/generate-markdownlint-config.ts
       - git mv scripts/copy-assets.ts src/scripts/copy-assets.ts
       - git mv prettier.config.ts src/prettier.config.ts
       - git mv vitest.config.ts src/vitest.config.ts
   - Re-run: npx tsc -p tsconfig.build.json
   - Repeat this step (one move → re-run tsc) until tsc reports zero errors or until the first non-TS6059/TS2209 error appears.
   - If you encounter a non-TS6059/TS2209 error, stop and fix that error before making any further file-move changes.

2. When tsc compiles cleanly (zero errors), run the package build and confirm asset copy completed:
   - npm run build
   - Inspect stderr output for the copy-assets completion message (scripts/copy-assets writes progress to stderr; look for "🎉 copy-assets completed successfully" or similar).

3. Quick artifact verification (if any file missing treat as packaging failure):
   - Verify these runtime artifacts exist under dist/:
     - dist/prettier.config.js
     - dist/src/index.js (matches package.json "main")
     - dist/eslint/index.js
     - dist/typescript/\*.json
   - If an artifact is missing:
     - If tsc omitted a source file, move that single source into src/ (one move) or adjust include for a single file only after careful review, then rebuild.
     - If copy-assets failed to copy, fix the copy step or asset path and rebuild.

4. Run focused packaging tests that depend on dist:
   - npx vitest run src/tests/package-exports.test.ts src/tests/dist-files.test.ts src/tests/package-structure.test.ts
   - If tests fail:
     - For missing compiled files → move the single missing source into src (one file), rebuild, and re-run tests.
     - For runtime import/export path issues → correct the single export or path and re-run packaging build and tests.

5. Run dependency-alignment verification:
   - npx vitest run src/dependency-alignment.test.ts
   - If it fails due to node_modules vs lockfile mismatch:
     - Run npm ci to align node_modules and re-run the test.
     - If lockfile must be intentionally updated, prepare an ADR and bundle the package.json + package-lock.json + ADR as a single commit (see LATER).

6. When all focused tests pass, run full verification:
   - npm run verify
   - Address any failures in priority order: type/build → tests → lint/format.

7. Commit minimal, focused changes only after npm run verify is fully green:
   - Stage only the moved file(s) (one or several small moves that were required) and any tiny, well-justified tsconfig.build.json edits (if absolutely necessary).
     - Example:
       - git add src/prettier.config.ts src/scripts/generate-markdownlint-config.ts src/scripts/copy-assets.ts
       - git commit -m "chore(build): move top-level build-time config/scripts into src to satisfy tsc rootDir"
       - git push origin main
   - Do NOT commit any compiled artifacts (.js/.d.ts/.map) or generated files.

Guardrails during NEXT:

- Make exactly one file-move (one git mv) between tsc runs. Re-run tsc after each single-file change and stop on the first new error.
- Never widen rootDir broadly or add blanket includes. Do not add wide globs to tsconfig.build.json.
- Do not modify prompts/, prompt-assets/, or .voder/.
- Do not commit build outputs or generated artifacts. Commit only source moves and minimal config edits required to pass tsc.
- All commands are non-interactive.

## LATER

Once build/test pipeline is stable and commits are prepared, perform follow-ups in separate, small commits:

1. Cleanup & repository hygiene
   - Remove untracked/stale compiled duplicates from the working tree (audit then git clean -fd).
   - Ensure .gitignore covers build outputs and temporary files (dist/, _.d.ts, _.map, .eslintcache, coverage/).
   - If any moved config files should remain at project root for UX, plan a follow-up refactor and document via an ADR before changing layout again.

2. Documentation & ADRs
   - If a top-level config/script was moved, add a short note in CONTRIBUTING.md or README explaining the build-time placement (one-file-move policy) and why files live under src.
   - If package-lock.json or package.json were intentionally updated to align dependencies, author an ADR documenting the dependency change and include it with the package.json + package-lock.json commit.

3. CI & automation
   - Add/verify CI job that enforces: tsc → npm run build → focused packaging tests → full verify to prevent regressions.
   - Add a CI/pre-push safeguard that rejects commits containing compiled artifacts.

4. Post-merge hygiene
   - After pushing, run a fresh clone + npm ci + npm run verify in a clean environment to confirm reproducible build/test results.
   - Re-run dependency SCA (npm audit) and address any newly surfaced issues.

5. Future refactor work
   - Evaluate consolidating build-time scripts into src/scripts permanently and simplifying package.json "files"/"exports" if necessary.
   - If consumer-friendly config should remain at repo root, design a documented approach (e.g., tiny root-layer re-exports excluded from tsc or a documented packaging step) and capture the decision in an ADR.

IMPORTANT: Distinguish between these two scenarios:

1. ACTION EXECUTED SUCCESSFULLY (even if outcome wasn't desired):
   - The action was attempted and completed, but the result might not be what we wanted
   - Examples: Tests ran but failed, file was updated but with wrong content, command executed but returned error
   - UPDATE THE PLAN: Remove completed items from NOW, potentially add new items based on the results

2. ACTION FAILED TO EXECUTE:
   - The action couldn't even be attempted due to missing prerequisites, invalid parameters, etc.
   - Examples: File doesn't exist so can't update it, command not found, invalid syntax prevented execution
   - DON'T UPDATE THE PLAN: Return the original plan unchanged
