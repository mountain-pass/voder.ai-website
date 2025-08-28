## NOW

Commit the outstanding documentation change to keep the working tree clean:
- Run: git commit -am "docs: commit vitest usage update (align wording with ADR-0009)"  

(One non-interactive command that records the local docs change so subsequent work proceeds from a clean working tree.)

---

## NEXT

Perform the small, focused ADR-0013 consolidation workflow (non-interactive, idempotent steps). Run these sequentially and stop on the first failure; capture logs under /tmp (each command redirects output to /tmp/<step>.log):

1. Create a dedicated working branch for the consolidation work
   - git checkout -b cleanup/adr-0013-consolidation 2>&1 | tee /tmp/git-branch-create.log

2. Produce an up-to-date duplicate report (report-only)
   - scripts/duplicate-detect.sh 2>&1 | tee /tmp/duplicate-detect.log

3. Review and classify duplicates (automated-first, then manual review)
   - Save the duplicate report to ADR staging notes:
     - cp /tmp/duplicate-detect.log /tmp/adr-0013-duplicate-report.log
   - Open the existing ADR file for append (non-interactive step: prepare an appended note file)
     - echo "$(date -u) — Duplicate detection run. See /tmp/duplicate-detect.log" >> /tmp/adr-0013-note.txt
   - Append the note into docs/decisions/0013-cleanup-duplicate-docs.md (programmatic, non-destructive)
     - cat /tmp/adr-0013-note.txt >> docs/decisions/0013-cleanup-duplicate-docs.md
     - git add docs/decisions/0013-cleanup-duplicate-docs.md
     - git commit -m "docs(ADR-0013): record duplicate-detection run and classification note" 2>&1 | tee /tmp/git-commit-adr.log

   Notes:
   - Do NOT modify files under prompts/, prompt-assets/, or .voder/.
   - Only user-facing docs (README.md, docs/**/*.md, root-level md) and code files under src/, eslint/, scripts/, linters/ are in-scope for consolidation.

4. For each user-facing duplicate group identified in /tmp/duplicate-detect.log, perform the conservative consolidation pattern (one group per commit):
   - Identify canonical file (prefer docs/ or README.md). Example guideline:
     - If duplicates are under docs/ choose the docs/ path as canonical.
     - If duplicates are root README vs docs copy, prefer README.md as canonical and merge content into docs/ or vice versa per ADR guidance.
   - Merge and deduplicate content into the canonical file (manual merges are safest; if automating, script a safe append and de-duplicate routine).
   - After merging, remove the now-redundant tracked file(s) only if they are tracked by git and are truly duplicates:
     - git rm --cached <redundant-file> && rm <redundant-file> (only for tracked duplicates and after verification)
   - Run the project's doc quality fixes and checks:
     - npm run lint:md:fix 2>&1 | tee /tmp/lint-md-fix-<n>.log
     - npm run lint:md 2>&1 | tee /tmp/lint-md-check-<n>.log || (echo "markdownlint failed for group <n>; inspect /tmp/lint-md-check-<n>.log" >&2; exit 3)
     - npm run format 2>&1 | tee /tmp/format-<n>.log || (echo "prettier format failed; inspect /tmp/format-<n>.log" >&2; exit 4)
   - Run targeted tests (or full verify if quick enough):
     - npm run build 2>&1 | tee /tmp/build-<n>.log || (echo "build failed; inspect /tmp/build-<n>.log" >&2; exit 5)
     - npm run test:ci 2>&1 | tee /tmp/test-ci-<n>.log || (echo "tests failed; inspect /tmp/test-ci-<n>.log" >&2; exit 6)
   - Commit the consolidation as a single focused change with ADR reference:
     - git add <canonical-file> && git rm <redundant-file> (only if removed)
     - git commit -m "docs(ADR-0013): consolidate duplicate docs for <short-desc>; verify logs: /tmp/lint-md-check-<n>.log /tmp/test-ci-<n>.log" 2>&1 | tee /tmp/git-commit-consolidate-<n>.log

   Repeat the above step for each user-facing duplicate group. Stop and fix immediately on any failure; do not proceed to the next group until the current group passes verification.

5. For small duplicated code fragments discovered during classification (code in src/, eslint/, scripts/, linters/), extract minimal tested utilities:
   - For each candidate code duplication:
     - Create a small utility under src/utils/<name>.ts that encapsulates the common logic.
     - Update callers to import from the new utility.
     - Add or update unit tests exercising the extracted logic (follow dual-testing pattern for scripts: unit + integration where applicable).
     - Run unit tests for the changed files:
       - npm run test -- <path-to-updated-tests> 2>&1 | tee /tmp/test-unit-<id>.log || (echo "unit tests failed; inspect /tmp/test-unit-<id>.log" >&2; exit 7)
     - Commit the refactor in a focused commit referencing ADR-0013:
       - git add <files> && git commit -m "refactor(utils): extract <name> to consolidate duplicated logic (ADR-0013)" 2>&1 | tee /tmp/git-commit-refactor-<id>.log

   - Run verify steps (lint/format/build/test) after each refactor commit:
     - npm run lint:fix && npm run lint:check (log to /tmp)
     - npm run build
     - npm run test:ci

6. After all consolidations and refactors are complete and each change has passed the verify pipeline, update ADR-0013 with a summary of actions and results:
   - Append a timestamped summary and list of commits to docs/decisions/0013-cleanup-duplicate-docs.md
   - git add docs/decisions/0013-cleanup-duplicate-docs.md
   - git commit -m "docs(ADR-0013): consolidation summary and verification results" 2>&1 | tee /tmp/git-commit-adr-summary.log

7. Push the working branch for retention and remote CI runs:
   - git push --set-upstream origin cleanup/adr-0013-consolidation 2>&1 | tee /tmp/git-push-cleanup.log || true

8. Preserve artifacts for triage:
   - Ensure /tmp contains: duplicate-detect.log, all lint/format/build/test logs, and git commit/push logs for review.

Important notes for NEXT:
- Always run the project's verify sequence after each user-facing doc consolidation or code refactor; do not batch multiple groups into a single commit unless they are trivial and verified.
- Never modify or remove prompts/, prompt-assets/, or .voder/ files.
- Use conservative manual merges for documentation to avoid losing headings or context; prefer additive merges then prune duplicates.
- If any consolidation causes unexpected build/test failures, revert that single commit and iterate (small commits make reversion simple).

---

## LATER

After the consolidation branch is green and merged, institutionalize resilience and automation to prevent future duplicates and to harden the workflow:

1. CI & Automation
   - Add a scheduled CI job that runs scripts/duplicate-detect.sh and uploads its output as a build artifact; optionally fail on tracked duplicates per a repository policy.
   - Add a CI job that runs a fast subset of the verify pipeline (lint:md, format:check, lint:check) on PRs, with a full verify job on merges to main.

2. Pre-commit and developer ergonomics
   - Add lightweight pre-commit hooks (e.g., using simple npm scripts or husky) to run the minimal checks (prettier --check and markdownlint quick check) to avoid trivial doc regressions before commits.
   - Document the consolidation pattern in CONTRIBUTING.md and ADR-0013: include the one-group-per-commit rule and verify requirement.

3. Duplicate prevention and monitoring
   - Enable Dependabot/Renovate for dependency updates (non-breaking first), and require the project's verify pipeline to pass before merging PRs.
   - Add a periodic housekeeping task (weekly/nightly) that runs duplicate detection and a short verify to catch regressions early.

4. Policy & process improvements
   - Update ADR-0013 to include the canonical selection rules and a short checklist for doc consolidation (where to prefer canonical copies).
   - Define an explicit release/process for when tracked duplicates are intentionally kept (document rationale in ADR and file header).

5. Hardening tests & subprocess usage
   - Replace npx invocations in tests with direct local binary paths or programmatic APIs to avoid network fetches and reduce flakiness.
   - Sanitize environment variables passed to child processes in tests and scripts (whitelist keys).
   - Convert brittle tests to deterministic mocks or mark them as manual where they add limited value.

6. Security & dependency hygiene
   - Replace ad-hoc `npm audit fix --force` in developer guidance with the controlled remediation workflow: run audit, generate report, create dependency-update PRs, and run verify on the PRs.
   - Schedule a quarterly SCA review and upgrade window; document in a small maintenance ADR.

---

If you want, I can now:
- produce the exact shell commands to run for the NEXT steps (each non-interactive and redirecting output to /tmp), or
- generate the small commit message templates and ADR snippet text to append to docs/decisions/0013-cleanup-duplicate-docs.md.

Which of those would you prefer I prepare next?