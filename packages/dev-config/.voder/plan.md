The previous plan was incorrect because the duplicate-detect JS files were already removed. I updated the plan so NOW records the canonicalization in git (single non-interactive command), and NEXT/LATER continue the canonicalization, doc regen, verify and push steps.

## NOW
Run a single non-interactive command that stages the ADR note and all changes and records the canonicalization in one focused commit:
- git add docs/decisions/0013-cleanup-duplicate-docs.md && git add -A && git commit -m "chore(dup-detect): record canonical duplicate-detect choice (POSIX script); removed untracked JS variants; refs ADR-0013"

## NEXT
After the NOW command succeeds, perform the ordered, non-interactive sequence below. Run each step only after the previous succeeds and capture console-first logs to /tmp.

1) Regenerate markdown config, apply markdown auto-fixes, format repository, and commit auto-fixes (capture logs)
- npm run generate:md-config 2>&1 | tee /tmp/generate-md-config.log || true
- npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix.log || true
- npm run format 2>&1 | tee /tmp/format-after-docs.log || true
- git add -A
- git commit -m "chore(docs): apply markdown & format auto-fixes; refs ADR-0013" || true

2) Run the full verify pipeline and iterate on failures until green (capture logs)
- npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log
- If verify fails:
  - Inspect logs: /tmp/verify-after-canonicalize.log, /tmp/format-after-docs.log, /tmp/lint-md-fix.log, /tmp/generate-md-config.log
  - Make only small, focused fixes (one logical fix per commit). For each fix:
    - Run the failing step locally (e.g., a specific test or lint command)
    - git add <files>
    - git commit -m "fix(<area>): <short description> - address verify failure; refs ADR-0013"
    - Re-run: npm run verify 2>&1 | tee /tmp/verify-after-canonicalize.log
  - Repeat until `npm run verify` completes successfully.

3) When verify is green, push the branch upstream and capture output
- git push --set-upstream origin HEAD 2>&1 | tee /tmp/git-push-after-verify.log

Notes for NEXT
- Preserve console-first policy: all outputs written to console and saved under /tmp.
- Keep commits small and focused; every change related to consolidation must reference ADR-0013.
- Do NOT modify contents under prompts/, prompt-assets/, or .voder/.
- Use only non-interactive commands.

## LATER
Once NOW and NEXT are complete and the branch is pushed with a green verify, perform these follow-up tasks in focused, auditable commits:

1) Consolidate user-facing duplicate documentation (one duplicate-group → one commit)
- For each duplicate-group from ADR-0013:
  - Merge content into canonical docs/<file>.md
  - npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix-consolidation-<n>.log || true
  - npm run format 2>&1 | tee /tmp/format-consolidation-<n>.log || true
  - git add docs/<canonical-file>.md
  - git commit -m "docs: consolidate <removed-file> -> <canonical-file>; refs ADR-0013"
  - Run `npm run verify` and save log to `/tmp/verify-after-consolidation-<n>.log`

2) Finalize duplicate-detect cleanup & ADR update
- ./scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect-final.log
- Update ADR-0013 with a short canonicalization note and date; commit:
  - git add docs/decisions/0013-cleanup-duplicate-docs.md
  - git commit -m "docs(adr): confirm canonical duplicate-detect script and date; refs ADR-0013"

3) Tidy remaining housekeeping
- If any transient artifacts should be ignored, add .gitignore entries and commit:
  - git add .gitignore
  - git commit -m "chore(git): ignore transient duplicate-detect artifacts; refs ADR-0013"

4) Small, safe refactors for duplication in code
- Extract minimal shared utilities into src/utils/ (one utility per commit), add unit tests, run verify, and commit:
  - git commit -m "refactor(utils): extract <utility>; add tests; refs ADR-0013"

5) Plan and stage safeSpawn rollout (ADR-0014) and replace execSync usage incrementally
- Draft ADR-0014 describing the plan
- Replace execSync usages one file at a time using safeSpawn, add tests, and run verify after each change
- Commit each replacement as "refactor(scripts): replace execSync in <file> with safeSpawn; add tests; refs ADR-0014"

6) Add monitoring automation (external)
- Arrange an external scheduled job to run ./scripts/duplicate-detect.sh periodically and publish results to maintainers; document approach in ADR-0013 follow-up.

General Later notes
- Always run `npm run verify` before committing changes that affect docs, scripts, or utilities.
- Keep each change small, documented (mention ADR references), and tested.
- Do not modify prompts/, prompt-assets/, or .voder/.