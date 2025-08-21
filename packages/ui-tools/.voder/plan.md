## NOW

Stage all legitimate changes while keeping package-internal .voder metadata unstaged, commit, and push the result:
- git add -A && git reset -- 'packages/ui-tools/.voder/*' || true && git commit -m "chore: commit source & documentation changes (exclude .voder metadata)" || true && git push origin main || true

## NEXT

After the NOW command completes, run these non-interactive, idempotent verification steps (execute each line as a single shell command). Follow them in order and stop only to make focused source/test fixes if the verification pipeline fails — never modify files under any .voder/ directory.

1) If any dist/ files are tracked, untrack them, commit the removal, and push:
- if git ls-files | grep -q '^dist/'; then git rm --cached -r dist/ && git commit -m "chore: remove tracked build artifacts (dist/)" && git push origin main; fi

2) Ensure package-internal .voder files remain unstaged (safety guard):
- git restore --staged 'packages/ui-tools/.voder/*' || true

3) Confirm the working tree is clean (porcelain output for automation/debugging):
- git status --porcelain

4) Run the canonical verification pipeline (type-check → build → tests):
- npm run type-check && npm run build && npm test

If step 4 fails:
- Make one small focused fix that touches only source or tests (do NOT edit any files under any .voder/ directory), run the NEXT sequence again beginning at step 1, and repeat until the verification pipeline passes.

## LATER

Once the repository is clean and the canonical verification pipeline passes reliably, proceed with small, fully-tested vertical slices. After each slice, run the verification pipeline and push only when green.

1) Add pretest build guard
- Add "pretest": "npm run build" to package.json scripts; run npm run type-check && npm run build && npm test and commit.

2) Implement Vite library factory (first feature slice)
- Add src/build/vite-library.ts exporting createViteLibraryConfig that integrates createPostCSSConfig.
- Add tests/tests/build/vite-library.test.ts asserting formats === ['es'], lib.name set, and css.postcss defined.
- Run verification; commit & push when successful.

3) Add PostCSS unit tests & verify emitted dist
- Add tests/tests/build/postcss.test.ts verifying autoprefixer presence and default browsers.
- Confirm tsc emits dist/src/build/postcss.js and .d.ts during build; run verification; commit & push.

4) Implement jsdom testing utilities incrementally
- Add src/testing/vitest-jsdom.ts + tests.
- Add src/testing/helpers.ts + tests for renderComponent, simulateClick, waitForNextFrame.
- Add src/testing/setup.ts and a test that initializes the jsdom setup.
- Run verification after each small change; commit & push when green.

5) Implement linting factories and markdown lint scripts
- Add src/linting/{html,css,accessibility}.ts with unit tests.
- Add generation of .markdownlint.json from @voder/dev-config and add "lint:md" / "lint:md:fix" scripts plus lint, lint:fix, format, format:check per the Universal Guide.
- Run verification; commit & push.

6) Expand exports and add package-level integration tests
- After building corresponding dist artifacts, add dedicated export paths to package.json (e.g., "./testing": "./dist/testing/index.js") and update types as needed.
- Add tests/export-equivalence.test.ts and tests/package-exports.test.ts verifying dedicated-path vs index imports and package.json export resolution.
- Run the canonical verification pipeline; commit & push.

7) Consumer docs & housekeeping
- Add README.md (self-contained, UNLICENSED, quick-start, Node engine note, security posture) and CHANGELOG.md.
- Reconcile dependency discrepancies (e.g., align jest-axe versions between peer/dev), and add "engines": { "node": ">=22.6.0" } to package.json if appropriate.
- Re-run verification and commit & push.

REMINDERS / CONSTRAINTS
- Never modify, commit, or remove files under any .voder/ directory.
- All git commands must be non-interactive and scoped to the current repository.
- Keep changes small and test-driven; run the verification pipeline after each change and only push when it succeeds.
- If any step fails, fix only source/tests (never .voder), re-run NEXT from step 1, and continue iterating until green.