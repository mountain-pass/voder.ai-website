## NOW

Add a conservative ignore for generated transient artifacts and commit it:

- Action: Append a single line `tmp/` to `.eslintignore` and commit that change with message:
  "chore(eslint): ignore generated tmp/ artifacts to avoid linting transient files — refs ADR-0013"

(Do this as one atomic edit/commit so ESLint no longer processes transient tmp/\* artifacts that are responsible for most current errors.)

---

## NEXT

After the NOW commit completes and you have inspected the commit log, run the following non‑interactive sequence (inspect each produced /tmp/\*.log before moving to the next step):

1. Produce focused per-file ESLint diagnostics for the remaining files referenced by the latest lint run

- Command:
  npx eslint -f unix $(cat /tmp/lint-remaining-files.txt 2>/dev/null || true) 2>&1 | tee /tmp/lint-remaining-details.log || true
- Inspect: /tmp/lint-remaining-details.log

2. Apply conservative automated fixes and minimal renames, committing each file separately

- For each file listed in /tmp/lint-remaining-files.txt run:
  - npx eslint --fix "<file>" 2>&1 | tee "/tmp/eslint-fix-$(basename "<file>").log" || true
  - If warnings remain that are simple unused-param / unused-catch-name issues, perform minimal edits (rename unused catches/vars to `_name` or `_err` as appropriate) and run eslint --fix again.
  - If the file changed, git add "<file>" && git commit -m "fix(<file>): minimal lint edits (unused params / catch renames) — refs ADR-0013" 2>&1 | tee "/tmp/git-commit-$(basename "<file>").log" || true
- Inspect: /tmp/eslint-fix-_.log and /tmp/git-commit-_.log
- Safety: If any commit introduced a build/test regression, revert that single commit (git revert <commit>) and address the file manually.

3. Re-run strict lint check and capture results

- Command:
  npm run lint:check 2>&1 | tee /tmp/lint-check-final.log || true
- Inspect: /tmp/lint-check-final.log
- If errors remain, return to step 2 for the remaining files.

4. When lint is clean (no errors in /tmp/lint-check-final.log), run markdown + Prettier autofix and commit

- Commands:
  npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix.log || true
  npm run format 2>&1 | tee /tmp/format-after-fix.log || true
  git add . && git commit -m "chore(format/docs): markdown & prettier autofix after lint fixes — refs ADR-0013" 2>&1 | tee /tmp/git-commit-format-docs.log || true
- Inspect: /tmp/lint-md-fix.log, /tmp/format-after-fix.log, /tmp/git-commit-format-docs.log

5. Run the full verification pipeline and capture output

- Command:
  npm run verify 2>&1 | tee /tmp/verify-after-fix.log || true
- Inspect: /tmp/verify-after-fix.log

6. If `npm run verify` fails, collect targeted logs and iterate with focused fixes:

- If build fails:
  npm run build 2>&1 | tee /tmp/build-fail.log || true
- If tests fail:
  npx vitest run --reporter=verbose 2>&1 | tee /tmp/test-fail.log || true
- Inspect: /tmp/build-fail.log, /tmp/test-fail.log, /tmp/verify-after-fix.log and fix the smallest possible set of files per failure (one file per commit) then re-run step 5.
- Always revert the last commit if a single automated commit causes regression and then apply a narrowly scoped manual fix.

Notes for NEXT:

- Inspect the logs after each step — do not proceed without reading the corresponding /tmp/\*.log.
- Keep commits minimal and focused; prefer single-file commits for easier reverts.
- Use the exact commit message patterns above to keep ADR traceability.

---

## LATER

After lint is clean and `npm run verify` completes successfully, continue with the planned hardening and polish tasks:

1. Replace execSync usages incrementally with safeSpawn (one file per commit)

- Find locations:
  grep -RIn --line-number "execSync(" src scripts tests | tee /tmp/execsync-locations.log
- For each location:
  - Refactor to use safeSpawn from src/utils/safe-spawn.js
  - Add/update unit tests for the refactor
  - Run `npm run verify`
  - Commit: git add <file(s)> && git commit -m "refactor(<file>): use safeSpawn instead of execSync — refs ADR-0013" 2>&1 | tee /tmp/git-commit-refactor-<name>.log || true

2. Finalize ADR-0013 canonicalization and duplicate-detection confirmation

- Run duplicate-detect and capture:
  sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.post-verify.log || true
- Append confirmation note to ADR:
  printf "\n\n## Confirmation\nCanonicalization and lint/format applied on $(date -u +%Y-%m-%dT%H:%M:%SZ). See /tmp/verify-after-fix.log and /tmp/duplicate-detect.post-verify.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- Commit:
  git add docs/decisions/0013-cleanup-duplicate-docs.md && git commit -m "docs(adr): confirm canonicalization & duplicate-detect results — refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-confirm.log || true

3. Enable and commit repository hooks (husky + lint-staged)

- Add or update husky + lint-staged config; run:
  npx husky install
  git add .husky package.json && git commit -m "chore(hooks): enable husky + lint-staged pre-commit hooks — refs ADR-0013" 2>&1 | tee /tmp/git-commit-husky.log || true

4. Audit and schedule dependency maintenance

- Commands:
  npm outdated 2>&1 | tee /tmp/npm-outdated.log || true
- Create ADRs for major upgrades (esbuild, nyc, etc.) as needed and schedule non-breaking upgrades tested via `npm run verify`.

5. Post-stabilization housekeeping

- Remove any temporary/overly-broad .eslintignore entries if they masked real problems; prefer targeted ignores only for true generated folders.
- Add CI checks that run the same verify pipeline to prevent regressions.

---

Notes & Constraints (must be followed)

- NEVER touch or modify prompts/, prompt-assets/, or .voder/ (do not mention or change those directories).
- All commands must be non-interactive and run from repository root.
- Inspect produced /tmp/\*.log files after each step and do not proceed until you confirm their contents.
- If any automated commit causes regressions, revert it immediately and apply a narrowly scoped manual fix.
- Keep commits minimal and focused with the exact commit message patterns given so ADR traceability is preserved.

This plan makes the NOW step the primary remediation recommended in the assessment (prevent linting of transient tmp/ artifacts), and then continues with the previously validated, conservative stepwise remediation and verification workflow.
