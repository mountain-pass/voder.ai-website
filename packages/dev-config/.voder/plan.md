## NOW

Run a single non-interactive commit that records the autofix changes already applied to tracked files:
- git commit -am "fix: apply eslint --fix to targeted files (copy-assets, generate-markdownlint-config, safe-spawn) — refs ADR-0013" 2>&1 | tee /tmp/git-commit-autofix.log || true

## NEXT

After the commit above completes, perform these non-interactive verification and remediation steps in order. Inspect each /tmp/*.log produced before moving to the next step.

1) Run a strict lint check and capture remaining problems:
- npm run lint:check 2>&1 | tee /tmp/lint-check-after-autofix.log || true

2) Produce a concise list of files reported by ESLint and get full ESLint output for them:
- grep -oE '([./A-Za-z0-9_@/.-]+\.ts|[./A-Za-z0-9_@/.-]+\.js)' /tmp/lint-check-after-autofix.log | sed 's/^[[:space:]]*//;s/[,:;]$//' | sort -u > /tmp/lint-remaining-files.txt || true
- npx eslint -f unix $(cat /tmp/lint-remaining-files.txt 2>/dev/null || true) 2>&1 | tee /tmp/lint-remaining-details.log || true

3) Apply minimal non-interactive fixes and commit them file-by-file (rules: prefix unused params/vars with `_`, rename unused catch variables to `_err` or similar, remove obviously-unused imports/vars, avoid structural changes). For each file listed in /tmp/lint-remaining-files.txt run:
- while IFS= read -r f; do \
    [ -z "$f" ] && continue; \
    # Attempt auto-fix first (non-interactive)
    npx eslint --fix "$f" 2>&1 | tee "/tmp/eslint-fix-post-manual-$(basename "$f").log" || true; \
    # If still lint problems related to unused params/vars, apply minimal sed edits to prefix unused identifiers with `_` (non-destructive pattern-based attempt)
    # (This sed is conservative: add leading underscore to function args named exactly 'err' or 'signal' or 'unlinkErr' when present)
    if grep -qE '(^|[,([:space:]])(err|signal|unlinkErr)([[:space:]),])' "$f" 2>/dev/null; then \
      sed -E -i.bak -e 's/(^|[,([:space:]])err([[:space:]),])/\\1_err\\2/g' -e 's/(^|[,([:space:]])signal([[:space:]),])/\\1_signal\\2/g' -e 's/(^|[,([:space:]])unlinkErr([[:space:]),])/\\1_unlinkErr\\2/g' "$f" 2>&1 || true; \
    fi; \
    # Run eslint --fix again after sed edits
    npx eslint --fix "$f" 2>&1 | tee -a "/tmp/eslint-fix-post-manual-$(basename "$f").log" || true; \
    # If file changed, commit it (one commit per file)
    if ! git diff --quiet -- "$f"; then \
      git add "$f"; \
      git commit -m "fix(${f}): minimal lint edits (unused params/console adjustments) — refs ADR-0013" 2>&1 | tee "/tmp/git-commit-manual-$(basename "$f").log" || true; \
    else \
      echo "No manual changes required for $f" > "/tmp/git-commit-manual-$(basename "$f").log"; \
    fi; \
  done < /tmp/lint-remaining-files.txt

4) Re-run the strict lint check and capture final results:
- npm run lint:check 2>&1 | tee /tmp/lint-check-final.log || true

5) If lint is now clean (inspect /tmp/lint-check-final.log), run markdown autofix and Prettier and commit formatting changes:
- npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix.log || true
- npm run format 2>&1 | tee /tmp/format-after-fix.log || true
- git add . && git commit -m "chore(format/docs): markdown & prettier autofix after lint fixes — refs ADR-0013" 2>&1 | tee /tmp/git-commit-format-docs.log || true

6) Run the full verification pipeline and capture output:
- npm run verify 2>&1 | tee /tmp/verify-after-fix.log || true

7) If `npm run verify` fails, gather targeted logs for the failing stage and iterate (do not run interactively):
- If build fails:
  - npm run build 2>&1 | tee /tmp/build-fail.log || true
- If tests fail:
  - npx vitest run --reporter=verbose 2>&1 | tee /tmp/test-fail.log || true
- Examine the relevant logs (/tmp/build-fail.log, /tmp/test-fail.log, /tmp/verify-after-fix.log) and apply focused minimal fixes (one-file commits), then repeat step 6 until verify succeeds.

Notes for NEXT:
- All edits must be minimal and non-structural; prefer prefixing unused identifiers with `_` over removing function parameters.
- Preserve CLI-only guards and istanbul ignore comments.
- Inspect the produced /tmp/*.log files after each step to maintain console-first history and decide whether further manual edits are needed.

## LATER

Once lint is clean and `npm run verify` succeeds locally, perform the stabilization and risk-reduction tasks in small, focused commits:

1) Run duplicate detection and record confirmation in ADR-0013:
- sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.post-verify.log || true
- printf "\n\n## Confirmation\nCanonicalization and lint/format applied on $(date -u +%Y-%m-%dT%H:%M:%SZ). See /tmp/verify-after-fix.log and /tmp/duplicate-detect.post-verify.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- git add docs/decisions/0013-cleanup-duplicate-docs.md && git commit -m "docs(adr): confirm canonicalization & verify results — refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-confirm.log || true

2) Incrementally replace execSync usages with safeSpawn (one refactor per commit):
- grep -RIn --line-number "execSync(" src scripts tests | tee /tmp/execsync-locations.log
- For each reported location: create a small refactor commit that replaces execSync with safeSpawn (preserve behavior), add/update unit tests, run `npm run verify`, and commit: "refactor(<file>): use safeSpawn instead of execSync — refs ADR-0013"

3) Enable lightweight pre-commit checks and CI duplicate-detect:
- Add/enable Husky pre-commit hook + lint-staged configuration to run `npx eslint --fix` and `npm run format` on staged files; commit these files as a single chore commit.
- Propose a CI job to run `sh ./scripts/duplicate-detect.sh` and fail if tracked duplicates are found; create an ops doc or PR describing the CI addition.

4) Docs & troubleshooting improvements:
- Add a short Troubleshooting section to docs/CONSUMER-QUICKSTART.md (non-interactive file edit) documenting jiti, NODE_OPTIONS, and lockfile guidance; run markdownlint and prettier; commit as "docs: add quick troubleshooting notes — refs ADR-0013".
- Consolidate any remaining ADR duplicates into single canonical ADR files per ADR-0013 (small commits), run markdownlint autofix and format, then commit.

5) Schedule periodic maintenance:
- Propose and document a cadence (weekly or biweekly) for dependency audits and verify runs in SECURITY.md or an ops doc, and automate alerts for new high-severity vulnerabilities.

---

If you want, I can now run (simulate) the single NOW command for you (the non-interactive git commit) or output the exact shell command lines to paste into your terminal.