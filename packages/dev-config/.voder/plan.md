## NOW

Run a single non‑interactive commit that records the current formatting/markdown autofix changes (tracked modifications only) and capture the git output:

git commit -am "chore(docs): apply formatting auto-fixes after markdown fixes; refs ADR-0013" 2>&1 | tee /tmp/git-commit-docs-format.log || true

## NEXT

After the NOW commit completes, perform these ordered non‑interactive steps (run each only after the previous succeeds; capture outputs to /tmp). These steps directly implement the "Consolidate and commit documentation/formatting fixes (refs ADR-0013), run npm run verify until green, then push the branch" NEXT PRIORITY from the assessment.

1) Run the full verify pipeline and capture logs:

npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log

2) If verify fails, iterate small focused fixes until green (repeat the loop per failure):

- Inspect logs:
  - Review /tmp/verify-after-canonicalize.log and /tmp/git-commit-docs-format.log to identify the failing stage.
- Fix one issue per commit (make the smallest possible change that addresses the specific failure), then verify the individual failing step before the full verify:
  - If the failure is linting:
    - npm run lint:fix 2>&1 | tee /tmp/lint-fix.log || true
    - npm run lint:check 2>&1 | tee /tmp/lint-check.log
  - If the failure is markdown linting:
    - npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix.log || true
    - npm run lint:md 2>&1 | tee /tmp/lint-md-check.log
  - If the failure is formatting:
    - npm run format 2>&1 | tee /tmp/format-after-fix.log || true
  - If the failure is build:
    - npm run build 2>&1 | tee /tmp/build-after-fix.log
  - If the failure is tests:
    - npm run test:ci 2>&1 | tee /tmp/test-ci-after-fix.log
    - For faster iteration, run the targeted vitest invocation that fails (see test output).
- For each focused fix (after verifying the failing step succeeds), commit the change with a small focused message referencing ADR-0013 and capture output:
  - git add <file(s)> && git commit -m "fix(<area>): <short description> - address verify failure; refs ADR-0013" 2>&1 | tee /tmp/git-commit-fix-<short>.log
- Re-run the full verify after each fix:
  - npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log
- Repeat until `npm run verify` completes successfully.

3) When `npm run verify` is green (no errors):

- Push the branch and capture output:
  - git push --set-upstream origin HEAD 2>&1 | tee /tmp/git-push-after-verify.log

4) Confirm duplicates status and capture output:

- sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.post-verify.log

5) Record confirmation in ADR-0013 (append a short, non-interactive note) and commit it:

- printf "\n\n## Confirmation\n\nCanonicalization and initial markdown/format auto‑fixes applied and verified on $(date -u +%Y-%m-%dT%H:%M:%SZ). verify completed and duplicate-detect run; see /tmp/verify-after-canonicalize.log and /tmp/duplicate-detect.post-verify.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- git add docs/decisions/0013-cleanup-duplicate-docs.md
- git commit -m "docs(adr): confirm canonicalization recorded and verify completed; refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-confirm.log || true

Notes for NEXT
- Always tee outputs to /tmp so console-first logs are preserved and discoverable by the agent.
- If `npm audit fix --force` (run by verify) updates dependencies and causes failures, treat that as a regular verify failure and resolve with the small-fix loop above; commit each small fix and re-run verify.
- Keep commits minimal and focused; include "refs ADR-0013" in commit messages for documentation-related changes.
- Do not modify prompts/, prompt-assets/, or .voder/ — those are off-limits.

## LATER

After the branch is pushed with a green verify and ADR confirmation recorded, proceed with conservative consolidation and safe refactors in small, auditable commits (each referencing ADR-0013 and running verify after the commit). Suggested ordered tasks:

1) Consolidate user‑facing duplicate documentation (one duplicate group → one commit)
- For each duplicate group recorded in ADR-0013:
  - Merge & dedupe content into canonical docs/<canonical-file>.md
  - npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix-consolidation-<n>.log || true
  - npm run format 2>&1 | tee /tmp/format-consolidation-<n>.log || true
  - git add docs/<canonical-file>.md
  - git commit -m "docs: consolidate <removed-file> -> <canonical-file>; refs ADR-0013" 2>&1 | tee /tmp/git-commit-consolidate-<n>.log
  - npm run verify 2>&1 | tee /tmp/verify-after-consolidation-<n>.log

2) Finalize ADR-0013 summary and final duplicate check
- sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.final.log
- printf "\n\n## Finalization\n\nConsolidation completed on $(date -u +%Y-%m-%dT%H:%M:%SZ). Final duplicate-detect log: /tmp/duplicate-detect.final.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- git add docs/decisions/0013-cleanup-duplicate-docs.md
- git commit -m "docs(adr): finalize ADR-0013 consolidation summary; refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-final.log
- npm run verify 2>&1 | tee /tmp/verify-after-finalization.log

3) Low‑risk code refactors (extract duplicated utilities)
- Identify small duplicated fragments in scripts/ and src/, extract them to src/utils/<name>.ts, add unit tests
- For each extraction:
  - git add src/utils/<util>.ts src/tests/utils/<util>.test.ts
  - git commit -m "refactor(utils): extract <utility>; add tests; refs ADR-0013" 2>&1 | tee /tmp/git-commit-refactor-<util>.log
  - npm run verify 2>&1 | tee /tmp/verify-after-refactor-<util>.log

4) Plan and stage replacing execSync with safeSpawn (author ADR-0014 + incremental replacements)
- Create ADR-0014 documenting approach, then incrementally replace execSync usages one file at a time with safeSpawn, adding/adjusting tests per change and running verify after each commit.

5) Operationalize periodic duplicate detection (document-only)
- Add guidance to ADR-0013 recommending cadence (e.g., weekly) and location for running duplicate-detect (run outside repo in operator context). Do NOT add CI workflow files to the repo.

Important constraints recap
- Do not modify prompts/, prompt-assets/, or .voder/.
- All commands must be non‑interactive and POSIX-compatible.
- Tee outputs to /tmp for console-first traceability.
- Keep each change small, focused, and verified by `npm run verify` before pushing.