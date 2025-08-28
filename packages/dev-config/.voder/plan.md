## NOW

Run a single non-interactive commit to record the markdown autofix changes already applied to tracked files (this stages and commits all tracked modifications in one step so the working tree is clean for the subsequent verify steps):

git commit -am "chore(docs): apply markdown autofix; refs ADR-0013" 2>&1 | tee /tmp/git-commit-docs-autofix.log

## NEXT

After the NOW commit completes successfully, perform the ordered non-interactive sequence below (run each step only after the previous succeeds; capture outputs to /tmp). Keep commits small and reference ADR-0013 where relevant. Do NOT modify prompts/, prompt-assets/, or .voder/.

1) Apply formatting auto-fixes, stage and commit:
- npm run format 2>&1 | tee /tmp/format-after-docs.log || true
- git add -A
- git commit -m "chore(docs): apply formatting auto-fixes after markdown fixes; refs ADR-0013" 2>&1 | tee /tmp/git-commit-docs-format.log || true

2) Run full verify and iterate on failures until green:
- npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log
- If npm run verify fails:
  - Inspect logs: /tmp/verify-after-canonicalize.log, /tmp/format-after-docs.log, /tmp/git-commit-docs-autofix.log, /tmp/lint-md-fix.log
  - Make a single focused fix per commit (one logical change). For each fix:
    - Re-run the failing step (e.g., npm run lint:check, npm run test:ci, or the specific vitest command) to confirm it is resolved
    - git add <files>
    - git commit -m "fix(<area>): <short description> - address verify failure; refs ADR-0013" 2>&1 | tee /tmp/git-commit-fix-<short>.log
    - Re-run: npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log
  - Repeat the small-fix → commit → verify loop until npm run verify succeeds

3) When verify is green, push the branch and capture output:
- git push --set-upstream origin HEAD 2>&1 | tee /tmp/git-push-after-verify.log

4) Confirm duplicate status after changes:
- sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.post-verify.log

5) Record confirmation in ADR-0013 and commit:
- Append a one-paragraph confirmation with date to docs/decisions/0013-cleanup-duplicate-docs.md non-interactively:
  - printf "\n\n## Confirmation\n\nCanonicalization and initial markdown/format auto-fixes applied and verified on $(date -u +%Y-%m-%dT%H:%M:%SZ). verify completed and duplicate-detect run; see /tmp/verify-after-canonicalize.log and /tmp/duplicate-detect.post-verify.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- git add docs/decisions/0013-cleanup-duplicate-docs.md
- git commit -m "docs(adr): confirm canonicalization recorded and verify completed; refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-confirm.log || true

Notes for NEXT
- Always tee outputs to /tmp as shown so console-first logs are preserved.
- If npm audit fix --force (run by verify) changes lockfile and causes failures, treat as a verify failure per step 2 and fix minimally (commit each small fix with ADR-0013 reference).
- Keep all commits small, focused, and documented (include "refs ADR-0013" in messages where related).
- Do not modify prompts/, prompt-assets/, or .voder/ at any point.

## LATER

After NOW and NEXT complete and the branch is pushed with a green verify, proceed with conservative consolidation and safe refactors in small, auditable commits (each commit referencing ADR-0013 and running verify after):

1) Consolidate user-facing duplicate documentation (one duplicate-group → one commit)
- For each duplicate group recorded in ADR-0013:
  - Merge and dedupe content into the chosen canonical docs/<file>.md
  - npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix-consolidation-<n>.log || true
  - npm run format 2>&1 | tee /tmp/format-consolidation-<n>.log || true
  - git add docs/<canonical-file>.md
  - git commit -m "docs: consolidate <removed-file> -> <canonical-file>; refs ADR-0013" 2>&1 | tee /tmp/git-commit-consolidate-<n>.log
  - npm run verify 2>&1 | tee /tmp/verify-after-consolidation-<n>.log

2) Finalize ADR-0013 summary and final duplicate-detect:
- sh ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.final.log
- Update docs/decisions/0013-cleanup-duplicate-docs.md with final summary and timestamp:
  - printf "\n\n## Finalization\n\nConsolidation completed on $(date -u +%Y-%m-%dT%H:%M:%SZ). Final duplicate-detect log: /tmp/duplicate-detect.final.log. refs ADR-0013\n" >> docs/decisions/0013-cleanup-duplicate-docs.md
- git add docs/decisions/0013-cleanup-duplicate-docs.md
- git commit -m "docs(adr): finalize ADR-0013 consolidation summary; refs ADR-0013" 2>&1 | tee /tmp/git-commit-adr-0013-final.log

3) Low-risk code refactors (extract duplicated utilities)
- Identify small duplicated code fragments (e.g., in scripts/ and src/) and extract to src/utils/<name>.ts
- Add unit tests under src/tests/utils/<name>.test.ts
- For each extraction:
  - git add src/utils/<util>.ts src/tests/utils/<util>.test.ts
  - git commit -m "refactor(utils): extract <utility>; add tests; refs ADR-0013" 2>&1 | tee /tmp/git-commit-refactor-<util>.log
  - npm run verify 2>&1 | tee /tmp/verify-after-refactor-<util>.log

4) Plan and stage replacing execSync with safeSpawn (ADR-0014)
- Draft ADR-0014 documenting the replacement approach and commit:
  - git add docs/decisions/0014-replace-execSync-with-safeSpawn.md
  - git commit -m "docs(adr): propose replacing execSync with safeSpawn; refs ADR-0014" 2>&1 | tee /tmp/git-commit-adr-0014.log
- Replace execSync usages incrementally, one file at a time; add/adjust tests and run verify after each replacement:
  - git add <changed-files> src/tests/<affected>.test.ts
  - git commit -m "refactor(scripts): replace execSync in <file> with safeSpawn; add tests; refs ADR-0014" 2>&1 | tee /tmp/git-commit-exec-replace-<file>.log
  - npm run verify 2>&1 | tee /tmp/verify-after-exec-replace-<file>.log

5) Operationalize periodic duplicate-detect
- Document recommended cadence and place in ADR-0013 follow-up notes (example: weekly duplicate-detect runs and a CI job that reports findings); do not add CI workflows in repo (per policy), just document the ops step in ADR.

General Later notes
- ALWAYS run npm run verify after each consolidation or refactor commit.
- Keep changes small, tested, and clearly referenced to ADRs.
- NEVER modify prompts/, prompt-assets/, or .voder/ as part of these steps.

If you want, I will now run the single command in the NOW section and capture its output to /tmp/git-commit-docs-autofix.log. Do you want me to proceed?